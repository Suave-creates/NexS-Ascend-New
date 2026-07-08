var STORAGE_KEY = "sensitivePids";
var STORAGE_KEY_LENS = "sensitiveLensPackages";

var pidsEl = document.getElementById("pids");
var lensEl = document.getElementById("lens");
var statusEl = document.getElementById("status");
var countEl = document.getElementById("count");

function parseList(text) {
  return text
    .split(/[\s,]+/)
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

function dedupe(list) {
  var seen = {};
  return list.filter(function (p) {
    if (seen[p]) return false;
    seen[p] = true;
    return true;
  });
}

var flashTimer = null;
function flash(msg, ok) {
  statusEl.textContent = msg;
  statusEl.style.color = ok === false ? "#e0a3a3" : "#f6e7b4";
  statusEl.classList.add("show");
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(function () {
    statusEl.classList.remove("show");
  }, 2500);
}

function updateCount(pids, lens) {
  var parts = [];
  if (pids.length) parts.push(pids.length + " PID(s)");
  if (lens.length) parts.push(lens.length + " lens package(s)");
  countEl.textContent = parts.length
    ? parts.join(" · ") + " watched"
    : "Nothing watched yet";
}

// load existing
chrome.storage.local.get([STORAGE_KEY, STORAGE_KEY_LENS], function (res) {
  var pids = (res && res[STORAGE_KEY]) || [];
  var lens = (res && res[STORAGE_KEY_LENS]) || [];
  pidsEl.value = pids.join("\n");
  lensEl.value = lens.join("\n");
  updateCount(pids, lens);
});

document.getElementById("save").addEventListener("click", function () {
  var pids = dedupe(parseList(pidsEl.value));
  // lens packages are matched case-insensitively — store uppercased
  var lens = dedupe(
    parseList(lensEl.value).map(function (s) {
      return s.toUpperCase();
    })
  );
  chrome.storage.local.set(
    { [STORAGE_KEY]: pids, [STORAGE_KEY_LENS]: lens },
    function () {
      pidsEl.value = pids.join("\n");
      lensEl.value = lens.join("\n");
      updateCount(pids, lens);
      flash("Saved ✓");
    }
  );
});

document.getElementById("test").addEventListener("click", function () {
  var pids = parseList(pidsEl.value);
  var lens = parseList(lensEl.value);
  var matches = pids
    .slice(0, 3)
    .map(function (p) {
      return { kind: "PID", value: p };
    })
    .concat(
      lens.slice(0, 3).map(function (l) {
        return { kind: "LENS", value: l.toUpperCase() };
      })
    );
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    if (!tab || !/^https:\/\/app\.nexs\.lenskart\.com\//.test(tab.url || "")) {
      flash("Open a NEXS tab to test", false);
      return;
    }
    chrome.tabs.sendMessage(
      tab.id,
      { action: "test", matches: matches },
      function () {
        if (chrome.runtime.lastError) {
          flash("Reload the NEXS tab, then retry", false);
        } else {
          flash("Siren triggered on the tab ✓");
        }
      }
    );
  });
});
