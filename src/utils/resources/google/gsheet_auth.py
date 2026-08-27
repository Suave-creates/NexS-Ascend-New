"""Reusable, server-safe authentication helpers for Google Sheets.

The default path is deliberately non-interactive so importing code can use it
inside web/API requests without unexpectedly opening a browser.  For local
one-time setup, call ``get_sheets_service(interactive=True)``.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Any


RESOURCE_DIR = Path(__file__).resolve().parent
TOKEN_PATH = RESOURCE_DIR / "gsheet_token.json"
CLIENT_SECRETS_PATH = RESOURCE_DIR / "gcreds.json"
DEFAULT_NETWORK_TIMEOUT_SECONDS = 20

SCOPES = (
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
)


class GoogleSheetsError(RuntimeError):
    """Base exception for this module's safe, user-facing errors."""


class GoogleSheetsAuthError(GoogleSheetsError):
    """Raised when Google credentials cannot be obtained safely."""


class GoogleSheetsReadError(GoogleSheetsError):
    """Raised when a requested Sheets range cannot be read."""


def _persist_token_atomically(credentials: Any) -> bool:
    """Best-effort atomic token write; never expose serialized credentials."""
    temporary_path: Path | None = None
    try:
        TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            prefix=f".{TOKEN_PATH.name}.",
            suffix=".tmp",
            dir=TOKEN_PATH.parent,
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            temporary_file.write(credentials.to_json())
            temporary_file.flush()
            os.fsync(temporary_file.fileno())

        # mkstemp/NamedTemporaryFile is private by default on POSIX.  Retain
        # that intent explicitly where chmod is supported.
        try:
            temporary_path.chmod(0o600)
        except OSError:
            pass

        os.replace(temporary_path, TOKEN_PATH)
        return True
    except Exception:
        if temporary_path is not None:
            try:
                temporary_path.unlink(missing_ok=True)
            except OSError:
                pass
        return False


def _load_credentials(*, interactive: bool) -> Any:
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
    except ImportError:
        raise GoogleSheetsAuthError(
            "Google authentication dependencies are unavailable. Install "
            "google-auth and google-api-python-client."
        ) from None

    credentials = None
    if TOKEN_PATH.is_file():
        try:
            # Do not pass SCOPES here.  Reading the scopes stored in the token
            # lets us detect a token that was granted less access previously.
            credentials = Credentials.from_authorized_user_file(str(TOKEN_PATH))
        except Exception:
            if not interactive:
                raise GoogleSheetsAuthError(
                    "The cached Google OAuth token is unreadable or malformed. "
                    "Run local setup with get_sheets_service(interactive=True) "
                    "to replace it."
                ) from None

    if credentials is not None and not credentials.has_scopes(SCOPES):
        if not interactive:
            raise GoogleSheetsAuthError(
                "The cached Google OAuth token lacks the required Sheets and "
                "Drive permissions. Run local setup with "
                "get_sheets_service(interactive=True) to reauthorize it."
            )
        credentials = None

    if credentials is not None and credentials.valid:
        return credentials

    if credentials is not None and credentials.refresh_token:
        try:
            credentials.refresh(Request())
        except Exception:
            if not interactive:
                raise GoogleSheetsAuthError(
                    "The cached Google OAuth token could not be refreshed. Run "
                    "local setup with get_sheets_service(interactive=True) to "
                    "reauthorize it."
                ) from None
            credentials = None
        else:
            if credentials.valid and credentials.has_scopes(SCOPES):
                # A persistence failure must not break a request that already
                # has valid refreshed credentials.  The next call may retry.
                _persist_token_atomically(credentials)
                return credentials
            credentials = None

    if not interactive:
        raise GoogleSheetsAuthError(
            "Google sign-in is required. Run local setup once with "
            "get_sheets_service(interactive=True) to create "
            "gsheet_token.json."
        )

    if not CLIENT_SECRETS_PATH.is_file():
        raise GoogleSheetsAuthError(
            "Google OAuth client credentials are missing. Place gcreds.json "
            "next to gsheet_auth.py before running interactive setup."
        )

    try:
        from google_auth_oauthlib.flow import InstalledAppFlow

        flow = InstalledAppFlow.from_client_secrets_file(
            str(CLIENT_SECRETS_PATH), SCOPES
        )
        credentials = flow.run_local_server(port=0, prompt="consent")
    except ImportError:
        raise GoogleSheetsAuthError(
            "Interactive Google setup requires google-auth-oauthlib. Install "
            "it and retry locally."
        ) from None
    except Exception:
        raise GoogleSheetsAuthError(
            "Interactive Google authorization did not complete. Verify the "
            "OAuth client configuration and try again locally."
        ) from None

    if not credentials.valid or not credentials.has_scopes(SCOPES):
        raise GoogleSheetsAuthError(
            "Google authorization completed without the required Sheets and "
            "Drive permissions."
        )

    if not _persist_token_atomically(credentials):
        raise GoogleSheetsAuthError(
            "Google authorization succeeded, but gsheet_token.json could not "
            "be saved. Check directory permissions and retry local setup."
        )

    return credentials


def get_sheets_service(*, interactive: bool = False) -> Any:
    """Return an authenticated Google Sheets API v4 service.

    ``interactive`` defaults to ``False`` so server request paths fail clearly
    when setup is needed.  Pass ``True`` only during an intentional local OAuth
    setup; the browser flow is then used only if cached credentials are absent,
    invalid, or insufficiently scoped.
    """
    try:
        import httplib2
        from google_auth_httplib2 import AuthorizedHttp
        from googleapiclient.discovery import build
    except ImportError:
        raise GoogleSheetsAuthError(
            "The Google Sheets client transport is unavailable. Install "
            "google-api-python-client and google-auth-httplib2."
        ) from None

    credentials = _load_credentials(interactive=interactive)
    try:
        authorized_http = AuthorizedHttp(
            credentials,
            http=httplib2.Http(timeout=DEFAULT_NETWORK_TIMEOUT_SECONDS),
        )
        return build(
            "sheets",
            "v4",
            http=authorized_http,
            cache_discovery=False,
        )
    except Exception:
        raise GoogleSheetsAuthError(
            "The Google Sheets service could not be initialized. Check network "
            "access and the Google API configuration."
        ) from None


def read_nonblank_strings(
    service: Any,
    spreadsheet_id: str,
    range_name: str,
) -> set[str]:
    """Read a column/range as unique, whitespace-normalized nonblank strings.

    Cells are flattened in range order.  Leading/trailing whitespace is
    removed and every run of whitespace is collapsed to one ordinary space.
    Letter case is preserved.
    """
    if not isinstance(spreadsheet_id, str) or not spreadsheet_id.strip():
        raise ValueError("spreadsheet_id must be a nonblank string")
    if not isinstance(range_name, str) or not range_name.strip():
        raise ValueError("range_name must be a nonblank string")

    try:
        response = (
            service.spreadsheets()
            .values()
            .get(
                spreadsheetId=spreadsheet_id.strip(),
                range=range_name.strip(),
                majorDimension="ROWS",
                valueRenderOption="FORMATTED_VALUE",
            )
            .execute()
        )
    except Exception:
        raise GoogleSheetsReadError(
            "The requested Google Sheets range could not be read. Check the "
            "spreadsheet access, spreadsheet ID, and A1 range."
        ) from None

    if not isinstance(response, dict):
        raise GoogleSheetsReadError(
            "Google Sheets returned an unexpected response for the requested range."
        )

    values = response.get("values", [])
    if not isinstance(values, list):
        raise GoogleSheetsReadError(
            "Google Sheets returned malformed values for the requested range."
        )

    normalized_values: set[str] = set()
    for row in values:
        if not isinstance(row, list):
            raise GoogleSheetsReadError(
                "Google Sheets returned malformed rows for the requested range."
            )
        for value in row:
            normalized = " ".join(str(value).split())
            if normalized:
                normalized_values.add(normalized)

    return normalized_values


__all__ = [
    "GoogleSheetsAuthError",
    "GoogleSheetsError",
    "GoogleSheetsReadError",
    "get_sheets_service",
    "read_nonblank_strings",
]
