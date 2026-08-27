"""Power BI authentication with unattended token renewal.

Usage:
    from pbi_auth import get_token
    token = get_token()

For delegated auth, the first interactive call opens a browser. Later calls
renew access tokens silently from ``pbi_token_cache.json``. For a fully
unattended deployment, set ``POWER_BI_CLIENT_ID`` and
``POWER_BI_CLIENT_SECRET`` to use a service principal instead.

Treat the cache file and client secret like passwords: never share or commit
them.

pip install msal
"""
from __future__ import annotations

import argparse
import contextlib
import os
import tempfile
from pathlib import Path
from typing import Any, Iterator

import msal


DEFAULT_PUBLIC_CLIENT_ID = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"  # Azure CLI
DEFAULT_TENANT_ID = "8824ff7a-5893-46d2-931e-5bf425c1c3c5"

TENANT_ID = os.environ.get("POWER_BI_TENANT_ID", DEFAULT_TENANT_ID)
CONFIGURED_CLIENT_ID = os.environ.get("POWER_BI_CLIENT_ID")
CLIENT_ID = CONFIGURED_CLIENT_ID or DEFAULT_PUBLIC_CLIENT_ID
CLIENT_SECRET = os.environ.get("POWER_BI_CLIENT_SECRET") or None
AUTHORITY = os.environ.get(
    "POWER_BI_AUTHORITY",
    f"https://login.microsoftonline.com/{TENANT_ID}",
)
SCOPES = ["https://analysis.windows.net/powerbi/api/.default"]

DEFAULT_CACHE_PATH = Path(__file__).resolve().with_name("pbi_token_cache.json")
CACHE_PATH = Path(
    os.environ.get("POWER_BI_TOKEN_CACHE_PATH", str(DEFAULT_CACHE_PATH))
).expanduser().resolve()
# Kept as a string for backwards compatibility with scripts importing it.
CACHE_FILE = str(CACHE_PATH)


class PowerBiAuthError(RuntimeError):
    """Power BI credentials could not produce an access token."""


@contextlib.contextmanager
def _cache_lock() -> Iterator[None]:
    """Serialize cache refreshes made by Python workers on this machine."""
    lock_path = CACHE_PATH.with_name(f".{CACHE_PATH.name}.lock")
    try:
        lock_path.parent.mkdir(parents=True, exist_ok=True)
        lock_file = open(lock_path, "a+b")
    except OSError as exc:
        raise PowerBiAuthError(
            f"Power BI token-cache directory is not writable: {CACHE_PATH.parent} ({exc})."
        ) from None

    locked = False
    try:
        if os.name == "nt":
            import msvcrt

            lock_file.seek(0, os.SEEK_END)
            if lock_file.tell() == 0:
                lock_file.write(b"\0")
                lock_file.flush()
            lock_file.seek(0)
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl

            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        locked = True
        yield
    finally:
        try:
            if locked:
                lock_file.seek(0)
                if os.name == "nt":
                    import msvcrt

                    msvcrt.locking(lock_file.fileno(), msvcrt.LK_UNLCK, 1)
                else:
                    import fcntl

                    fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)
        finally:
            lock_file.close()


def _load_cache() -> msal.SerializableTokenCache:
    cache = msal.SerializableTokenCache()
    if not CACHE_PATH.exists():
        return cache
    if not CACHE_PATH.is_file():
        raise PowerBiAuthError(
            f"Power BI token-cache path is not a file: {CACHE_PATH}."
        )
    try:
        serialized = CACHE_PATH.read_text(encoding="utf-8")
        if serialized.strip():
            cache.deserialize(serialized)
    except (OSError, ValueError):
        raise PowerBiAuthError(
            f"Power BI token cache is unreadable or malformed: {CACHE_PATH}."
        ) from None
    return cache


def _persist_cache(cache: msal.SerializableTokenCache) -> None:
    """Persist through an atomic rename inside the mounted cache directory."""
    if not cache.has_state_changed:
        return
    temporary_path: Path | None = None
    try:
        CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="\n",
            prefix=f".{CACHE_PATH.name}.",
            suffix=".tmp",
            dir=CACHE_PATH.parent,
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            temporary_file.write(cache.serialize())
            temporary_file.flush()
            os.fsync(temporary_file.fileno())
        try:
            temporary_path.chmod(0o600)
        except OSError:
            pass
        os.replace(temporary_path, CACHE_PATH)
        temporary_path = None

        # Persist the directory entry as well where directory fsync is
        # available. This is best-effort on Windows.
        directory_fd: int | None = None
        try:
            directory_fd = os.open(CACHE_PATH.parent, os.O_RDONLY)
            os.fsync(directory_fd)
        except OSError:
            pass
        finally:
            if directory_fd is not None:
                os.close(directory_fd)
    except OSError as exc:
        if temporary_path is not None:
            try:
                temporary_path.unlink(missing_ok=True)
            except OSError:
                pass
        raise PowerBiAuthError(
            f"Power BI token was renewed but its cache could not be saved at "
            f"{CACHE_PATH}: {exc}. Mount its parent directory read-write."
        ) from None


def _safe_failure(result: dict[str, Any] | None, action: str) -> PowerBiAuthError:
    result = result or {}
    code = str(result.get("error") or "token_unavailable")
    description = " ".join(str(result.get("error_description") or "").split())
    correlation_id = str(result.get("correlation_id") or "").strip()
    details = code
    if correlation_id:
        details += f", correlation ID {correlation_id}"
    if description:
        details += f": {description[:600]}"
    return PowerBiAuthError(f"Power BI {action} failed ({details}).")


def _remove_cached_app_tokens(cache: msal.SerializableTokenCache) -> None:
    """Make the next client-credentials request bypass a rejected access token."""
    access_token_type = msal.TokenCache.CredentialType.ACCESS_TOKEN
    for token in list(cache.find(access_token_type)):
        if str(token.get("client_id") or "").casefold() == CLIENT_ID.casefold():
            cache.remove_at(token)


def _token_lifetime_minutes(result: dict[str, Any]) -> int:
    try:
        return max(0, int(result.get("expires_in", 3600)) // 60)
    except (TypeError, ValueError):
        return 60


def get_token(interactive: bool = True, force_refresh: bool = False) -> str:
    """Return a Power BI access token and persist any automatic renewal.

    ``interactive=False`` is intended for web/API request paths: it fails fast
    instead of trying to open a browser on the server. ``force_refresh=True``
    bypasses a cached access token after Power BI rejects it. MSAL still
    performs normal silent renewal automatically when an access token expires.
    """
    if CLIENT_SECRET and not CONFIGURED_CLIENT_ID:
        raise PowerBiAuthError(
            "POWER_BI_CLIENT_ID is required when POWER_BI_CLIENT_SECRET is set."
        )

    with _cache_lock():
        cache = _load_cache()

        if CLIENT_SECRET:
            if force_refresh:
                _remove_cached_app_tokens(cache)
            app = msal.ConfidentialClientApplication(
                CLIENT_ID,
                client_credential=CLIENT_SECRET,
                authority=AUTHORITY,
                token_cache=cache,
            )
            result = app.acquire_token_for_client(scopes=SCOPES)
            if not result or "access_token" not in result:
                raise _safe_failure(result, "service-principal authentication")
            identity = "service principal"
        else:
            app = msal.PublicClientApplication(
                CLIENT_ID,
                authority=AUTHORITY,
                token_cache=cache,
            )
            accounts = app.get_accounts()
            result = (
                app.acquire_token_silent_with_error(
                    SCOPES,
                    account=accounts[0],
                    force_refresh=force_refresh,
                )
                if accounts
                else None
            )
            if (not result or "access_token" not in result) and interactive:
                result = app.acquire_token_interactive(SCOPES)
                accounts = app.get_accounts()

            if not result or "access_token" not in result:
                if result:
                    failure = _safe_failure(result, "silent token refresh")
                    raise PowerBiAuthError(
                        f"{failure} Interactive sign-in is required."
                    ) from None
                cache_state = (
                    f"No signed-in account was found in {CACHE_PATH}."
                    if CACHE_PATH.exists()
                    else f"The token cache was not found at {CACHE_PATH}."
                )
                raise PowerBiAuthError(
                    f"Power BI sign-in is required. {cache_state} Run pbi_auth.py "
                    "once interactively, or configure service-principal credentials."
                )

            claims = result.get("id_token_claims") or {}
            identity = claims.get("preferred_username") or (
                accounts[0].get("username", "delegated account")
                if accounts
                else "delegated account"
            )

        _persist_cache(cache)

    print(
        f"Signed in as: {identity} "
        f"(token valid ~{_token_lifetime_minutes(result)} min)"
    )
    return str(result["access_token"])


def _main() -> int:
    parser = argparse.ArgumentParser(description="Acquire or renew a Power BI token.")
    parser.add_argument(
        "--non-interactive",
        action="store_true",
        help="Fail instead of opening a browser when user interaction is required.",
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Bypass the cached access token and renew it now.",
    )
    args = parser.parse_args()
    get_token(
        interactive=not args.non_interactive,
        force_refresh=args.force_refresh,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(_main())
