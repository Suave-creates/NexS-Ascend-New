// content.js — ISOLATED world, document_start. Shares scope with engine.js.
// Receives forwarded response bodies, evaluates the configured rules, and
// paints a full-screen flash for any rule that matches.

(function () {
  "use strict";

  var MARKER = "__NEXS_FLASH_WATCHER__";
  var RULES_KEY = "flashRules";

  var rules = [];

  chrome.storage.local.get([RULES_KEY], function (res) {
    rules = (res && res[RULES_KEY]) || [];
  });
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "local" && changes[RULES_KEY]) {
      rules = changes[RULES_KEY].newValue || [];
    }
  });

  // ---- handle a forwarded response ------------------------------------------
  window.addEventListener("message", function (event) {
    if (event.source !== window) return;
    var data = event.data;
    if (!data || data.source !== MARKER || !data.body) return;
    if (!rules.length) return;

    var parsed;
    try { parsed = JSON.parse(data.body); } catch (e) { return; }

    var matches;
    try { matches = FlashEngine.evaluateAll(parsed, rules, data.url); } catch (e) { return; }
    if (matches && matches.length) flash(matches[0]); // show the first matching rule
  });

  // ---- test trigger from the popup ------------------------------------------
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg && msg.action === "testFlash" && msg.rule) {
      flash({
        rule: msg.rule,
        matchedValues: [{ field: "TEST", value: "sample-value" }],
      });
    }
  });

  // ---- overlay --------------------------------------------------------------
  var OVERLAY_ID = "nfw-overlay";
  var audioCtx = null, sirenTimer = null, closeTimer = null;

  function startSound() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "sawtooth";
      gain.gain.value = 0.05;
      osc.connect(gain); gain.connect(audioCtx.destination);
      var hi = 880, lo = 520, up = true;
      osc.frequency.setValueAtTime(lo, audioCtx.currentTime);
      osc.start();
      sirenTimer = setInterval(function () {
        if (!audioCtx) return;
        var t = audioCtx.currentTime;
        osc.frequency.linearRampToValueAtTime(up ? hi : lo, t + 0.5);
        up = !up;
      }, 500);
      audioCtx.__osc = osc; audioCtx.__gain = gain;
    } catch (e) {}
  }

  function stopSound() {
    try {
      if (sirenTimer) { clearInterval(sirenTimer); sirenTimer = null; }
      if (audioCtx && audioCtx.__osc) {
        audioCtx.__osc.stop(); audioCtx.__osc.disconnect(); audioCtx.__gain.disconnect();
        audioCtx.__osc = null; audioCtx.__gain = null;
      }
    } catch (e) {}
  }

  function closeFlash() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
    stopSound();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) { if (e.key === "Escape") closeFlash(); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function chipHtml(matchedValues) {
    return (matchedValues || [])
      .map(function (m) {
        return (
          '<span class="nfw-chip"><span class="nfw-chip-tag">' +
          escapeHtml(m.field) +
          '</span><span class="nfw-chip-val">' +
          escapeHtml(m.value) +
          "</span></span>"
        );
      })
      .join("");
  }

  function flash(match) {
    var rule = match.rule || {};
    var f = rule.flash || {};
    var theme = f.theme || "siren";

    var existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

    if (!document.body) {
      setTimeout(function () { flash(match); }, 80);
      return;
    }

    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.className = "nfw-overlay nfw-theme-" + theme;
    overlay.innerHTML =
      '<div class="nfw-card">' +
      '<div class="nfw-accent"></div>' +
      '<div class="nfw-beacons"><span class="nfw-beacon nfw-beacon-a"></span><span class="nfw-beacon nfw-beacon-b"></span></div>' +
      '<div class="nfw-title">' + escapeHtml(f.title || "Alert") + "</div>" +
      (f.message ? '<div class="nfw-sub">' + escapeHtml(f.message) + "</div>" : "") +
      (f.showMatches !== false ? '<div class="nfw-chips">' + chipHtml(match.matchedValues) + "</div>" : "") +
      '<button class="nfw-close" type="button">Dismiss · Esc</button>' +
      '<div class="nfw-brand">NexS Flash Watcher</div>' +
      "</div>";

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("nfw-close")) closeFlash();
    });

    document.body.appendChild(overlay);
    document.addEventListener("keydown", onKey);
    if (f.sound !== false) startSound();

    var dur = typeof f.durationMs === "number" ? f.durationMs : 6000;
    if (dur > 0) closeTimer = setTimeout(closeFlash, dur);
  }
})();
