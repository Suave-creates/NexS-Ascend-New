# NexS Flash Watcher

A configurable watcher for `https://app.nexs.lenskart.com`. It silently mirrors
every JSON response the page receives, evaluates them against **rules** you
define in the **NexS Ascend → Extensions → Flash Rules** builder, and paints a
full-screen flash when a rule matches.

Nothing about the fields or messages is hardcoded — change the rules in the web
app and every installed extension picks them up automatically.

## How it works

```
NexS page ──fetch/XHR──► interceptor.js (MAIN world)
                              │ postMessage(body)
                              ▼
                         content.js + engine.js (ISOLATED world)
                              │ evaluate against cached rules
                              ▼
                         full-screen flash overlay

background.js ──every N min──► GET <Rules URL> ──► chrome.storage.local (flashRules)
```

## Install

**Chrome:** `chrome://extensions` → enable Developer mode → **Load unpacked** →
select this folder.

**Firefox:** use the `.xpi` build (`about:addons` → Install Add-on From File).

## Configure

Open the extension popup and set:

- **Rules URL** — your NexS Ascend app's `/api/flash-rules` endpoint
  (e.g. `https://<your-ascend-host>/api/flash-rules`).
- **Sync every (minutes)** — how often to refresh the rules.

Click **Save**, then **Sync now**. Use **Test flash** (on a NexS tab) to preview.

## Rules

A rule is `{ conditions, match, flash }`:

- **conditions** — each reads a field from the response by **key** (matched
  anywhere in the tree, e.g. `FACILITY_CODE`) or by **path** (dotted, e.g.
  `data.orderAndEntityTypeResponse.orderDetailsResponse.source`), with an
  operator: `equals`, `notEquals`, `contains`, `notContains`, `in`, `notIn`,
  `regex`, `exists`, `notExists`, `empty`, `gt`, `lt`.
- **match** — `any` (OR) or `all` (AND) across conditions.
- **flash** — title, message, theme, auto-close duration, siren sound.

### Examples (all built in the Flash Rules UI)

| Need | Condition(s) |
|------|--------------|
| Watched store | key `FACILITY_CODE` **in** list  **OR**  key `source` **in** list |
| Non-India order | key `country` **notEquals** `IN` |
| 1.56 lens anywhere | key `lensName` **contains** `1.56` |

Keep `engine.js` in sync with `src/lib/flashRules.ts` (same matching semantics).
