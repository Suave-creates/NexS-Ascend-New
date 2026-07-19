// background.js — service worker (Chrome) / event page (Firefox).
// Periodically fetches the rules document from the configured NexS Ascend
// endpoint and caches it in chrome.storage.local for the content script.

var DEFAULTS = {
  rulesUrl: "http://192.168.27.132:3069/api/flash-rules",
  intervalMin: 5,
};
var ALARM = "flash-sync";

function getConfig() {
  return new Promise(function (resolve) {
    chrome.storage.local.get(["flashConfig"], function (res) {
      resolve(Object.assign({}, DEFAULTS, (res && res.flashConfig) || {}));
    });
  });
}

function setState(state) {
  return new Promise(function (resolve) {
    chrome.storage.local.set(state, resolve);
  });
}

async function sync() {
  var cfg = await getConfig();
  if (!cfg.rulesUrl) {
    await setState({ flashSync: { at: Date.now(), ok: false, error: "No Rules URL set" } });
    return;
  }
  try {
    var res = await fetch(cfg.rulesUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var doc = await res.json();
    var rules = Array.isArray(doc.rules) ? doc.rules : [];
    await setState({
      flashRules: rules,
      flashSync: {
        at: Date.now(),
        ok: true,
        count: rules.length,
        version: typeof doc.version === "number" ? doc.version : null,
        error: null,
      },
    });
  } catch (e) {
    await setState({
      flashSync: { at: Date.now(), ok: false, error: String((e && e.message) || e) },
    });
  }
}

async function scheduleAlarm() {
  var cfg = await getConfig();
  var min = Math.max(1, Number(cfg.intervalMin) || 5);
  chrome.alarms.create(ALARM, { periodInMinutes: min });
}

chrome.runtime.onInstalled.addListener(function () {
  scheduleAlarm();
  sync();
});
if (chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(function () {
    scheduleAlarm();
    sync();
  });
}
chrome.alarms.onAlarm.addListener(function (a) {
  if (a.name === ALARM) sync();
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg && msg.action === "syncNow") {
    sync().then(function () { sendResponse({ ok: true }); });
    return true; // keep channel open for async response
  }
  if (msg && msg.action === "reschedule") {
    scheduleAlarm().then(function () { sendResponse({ ok: true }); });
    return true;
  }
});
