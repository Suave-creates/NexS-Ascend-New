var urlEl = document.getElementById("url");
var intervalEl = document.getElementById("interval");
var statusEl = document.getElementById("status");

var DEFAULTS = { rulesUrl: "http://192.168.27.132:3069/api/flash-rules", intervalMin: 5 };

function render() {
  chrome.storage.local.get(["flashConfig", "flashRules", "flashSync"], function (res) {
    var cfg = Object.assign({}, DEFAULTS, (res && res.flashConfig) || {});
    urlEl.value = cfg.rulesUrl;
    intervalEl.value = cfg.intervalMin;

    var rules = (res && res.flashRules) || [];
    var sync = (res && res.flashSync) || null;
    var enabled = rules.filter(function (r) { return r.enabled; }).length;

    var html = "<div><b>" + rules.length + "</b> rule(s) cached · <b>" + enabled + "</b> enabled</div>";
    if (sync) {
      var when = new Date(sync.at).toLocaleTimeString();
      if (sync.ok) {
        html += '<div class="ok">Last sync ' + when + " ✓ (v" + (sync.version == null ? "?" : sync.version) + ")</div>";
      } else {
        html += '<div class="err">Last sync ' + when + " ✕ " + (sync.error || "") + "</div>";
      }
    } else {
      html += '<div class="hint">Not synced yet — click “Sync now”.</div>';
    }
    statusEl.innerHTML = html;
  });
}

function flash(msg, cls) {
  statusEl.innerHTML = '<div class="' + (cls || "") + '">' + msg + "</div>";
  setTimeout(render, 1800);
}

document.getElementById("save").addEventListener("click", function () {
  var cfg = {
    rulesUrl: urlEl.value.trim(),
    intervalMin: Math.max(1, Number(intervalEl.value) || 5),
  };
  chrome.storage.local.set({ flashConfig: cfg }, function () {
    chrome.runtime.sendMessage({ action: "reschedule" }, function () {});
    chrome.runtime.sendMessage({ action: "syncNow" }, function () { render(); });
    flash("Saved ✓ — syncing…", "ok");
  });
});

document.getElementById("sync").addEventListener("click", function () {
  flash("Syncing…");
  chrome.runtime.sendMessage({ action: "syncNow" }, function () { render(); });
});

document.getElementById("test").addEventListener("click", function () {
  chrome.storage.local.get(["flashRules"], function (res) {
    var rules = (res && res.flashRules) || [];
    var rule =
      rules.find(function (r) { return r.enabled; }) ||
      {
        flash: { title: "TEST FLASH", message: "This is a preview.", theme: "siren", durationMs: 6000, sound: true, showMatches: true },
      };
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      if (!tab || !/^https:\/\/app\.nexs\.lenskart\.com\//.test(tab.url || "")) {
        flash("Open a NexS tab to test", "err");
        return;
      }
      chrome.tabs.sendMessage(tab.id, { action: "testFlash", rule: rule }, function () {
        if (chrome.runtime.lastError) flash("Reload the NexS tab, then retry", "err");
        else flash("Flash triggered on the tab ✓", "ok");
      });
    });
  });
});

render();
