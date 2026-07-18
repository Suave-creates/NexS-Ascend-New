"""Power BI auth: one-time browser sign-in, then silent token refresh from a local cache.

Usage:
    from pbi_auth import get_token
    token = get_token()

First call opens a browser window — sign in with the account that has Build
access on the dataset. After that, tokens are minted silently from
pbi_token_cache.json (~90-day sliding refresh token). Treat the cache file
like a password: do not share or commit it.

pip install msal
"""
import os

import msal

CLIENT_ID  = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"   # Microsoft Azure CLI (public client)
AUTHORITY  = "https://login.microsoftonline.com/8824ff7a-5893-46d2-931e-5bf425c1c3c5"  # Lenskart tenant
SCOPES     = ["https://analysis.windows.net/powerbi/api/.default"]
CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pbi_token_cache.json")


def get_token() -> str:
    cache = msal.SerializableTokenCache()
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            cache.deserialize(f.read())

    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY, token_cache=cache)

    accounts = app.get_accounts()
    result = app.acquire_token_silent(SCOPES, account=accounts[0]) if accounts else None
    if not result:
        result = app.acquire_token_interactive(SCOPES)

    if "access_token" not in result:
        raise RuntimeError(f"Auth failed: {result.get('error')}: {result.get('error_description')}")

    if cache.has_state_changed:
        with open(CACHE_FILE, "w") as f:
            f.write(cache.serialize())

    user = result.get("id_token_claims", {}).get("preferred_username") or (
        accounts[0]["username"] if accounts else "?"
    )
    print(f"Signed in as: {user} (token valid ~{result.get('expires_in', 3600) // 60} min)")
    return result["access_token"]


if __name__ == "__main__":
    get_token()
