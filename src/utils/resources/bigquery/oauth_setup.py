"""
One-time OAuth setup. Run this ONCE, then publish.py works unattended.

Prerequisites:
  - credentials.json (OAuth client ID, Desktop app type, downloaded from GCP)
  - OAuth consent screen PUBLISHED (not in Testing mode), so the refresh
    token doesn't expire in 7 days.

Run:
  python oauth_setup.py
"""
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

ROOT = Path(__file__).resolve().parent
CREDS_FILE = ROOT / "credentials.json"
TOKEN_FILE = ROOT / "token.json"

# Narrow scope: only files this app creates or opens. No general Drive access.
SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/bigquery",
]


def main():
    if not CREDS_FILE.exists():
        raise SystemExit(
            f"Missing {CREDS_FILE}.\n"
            "  GCP Console -> APIs & Services -> Credentials\n"
            "  -> + Create Credentials -> OAuth client ID -> Desktop app\n"
            "  -> Download JSON -> save next to this script as credentials.json"
        )

    print("Starting OAuth flow.")
    print("A browser window will open. Log in with your LENSKART Google account.")
    print("If you see 'Google hasn't verified this app' -> Advanced -> Go to Auto-Sanity.")
    print()

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
    # prompt='consent' forces a fresh refresh_token even if we authed before
    creds = flow.run_local_server(port=0, prompt="consent")

    TOKEN_FILE.write_text(creds.to_json())
    print(f"\nToken saved -> {TOKEN_FILE}")
    print("You can now run: python publish.py")


if __name__ == "__main__":
    main()
