# NEXS Sensitive PID Watcher

A Chrome extension (Manifest V3) that silently watches `getFittingDetail`
responses on `app.nexs.lenskart.com`. When a `product_id` **or** a
`lens_package` in the response matches one of your saved watch lists, it
flashes a full-screen two-siren police alert. Either kind of match is enough
to sound the alarm (either/or).

## How it works

| File | World | Job |
|------|-------|-----|
| `interceptor.js` | MAIN (page) | Patches `fetch` + `XMLHttpRequest`; mirrors any `getFittingDetail` response body to the content script via `postMessage`. Never blocks or alters requests. |
| `content.js` | ISOLATED | Deep-scans the response for `product_id`-like values and `lens_package` values, compares against your saved lists, and injects the siren overlay on a match. |
| `popup.html` / `popup.js` | — | Two input fields (watched PIDs + watched lens packages) and a "Test siren" button. |
| `overlay.css` | page DOM | The flashing red/blue full-screen siren UI. PIDs and lens packages get distinct chips (lens packages are highlighted in gold). |

Watch lists are stored in `chrome.storage.local`:

- **`sensitivePids`** — matched as trimmed strings, so `233704` (number in
  JSON) matches `233704` (text you type). Matches any JSON key ending in
  `productid` (case/underscore insensitive) — covers `product_id` and
  `rimless_bar_productId`.
- **`sensitiveLensPackages`** — matched case-insensitively (stored
  uppercased), against any `lens_package` key — e.g. `BLUECUT_1.56`.

A siren fires if **any** PID match **or any** lens-package match is found.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Toggle **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder.
4. Pin the extension, click its icon, enter the product IDs and/or lens
   packages (one per line in each box), click **Save**.
5. Open / reload a `app.nexs.lenskart.com` tab so the content scripts load.

## Test it

- Click the icon → **Test siren** (must have a NEXS tab active). This forces
  the overlay using the PIDs and lens packages in the boxes, without waiting
  for a real response.
- Real path: scan a fitting tray whose `product_id` or `lens_package` is in
  your lists → the siren fires automatically.

Dismiss with the **DISMISS** button, clicking the backdrop, or **Esc**.

## Notes

- Requires Chrome 111+ (uses manifest `world: "MAIN"` content scripts).
- The siren sound uses the WebAudio API; browsers may keep it muted until you
  interact with the page. The flashing visuals always work.
- If you ever change which URL to watch, edit `URL_NEEDLE` in `interceptor.js`
  and `content.js`'s matching logic accordingly.

---

_Crafted with precision by Bhiwadi Ops & Tech Sanghatan._
