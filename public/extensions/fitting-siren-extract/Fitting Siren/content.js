// Runs in the isolated world. Receives getFittingDetail bodies from the
// MAIN-world interceptor, compares product_id values against the saved
// sensitive list, and triggers the full-screen siren overlay on a match.

(function () {
  "use strict";

  var MARKER = "__NEXS_PID_WATCHER__";
  var STORAGE_KEY = "sensitivePids";
  var STORAGE_KEY_LENS = "sensitiveLensPackages";

  var sensitiveSet = new Set();
  var sensitiveLensSet = new Set();

  // ---- load + keep the sensitive sets fresh ---------------------------------
  // PIDs match verbatim; lens packages match case-insensitively.
  function buildSet(list, upper) {
    return new Set(
      (list || [])
        .map(function (v) {
          var s = String(v).trim();
          return upper ? s.toUpperCase() : s;
        })
        .filter(Boolean)
    );
  }

  chrome.storage.local.get([STORAGE_KEY, STORAGE_KEY_LENS], function (res) {
    sensitiveSet = buildSet(res && res[STORAGE_KEY], false);
    sensitiveLensSet = buildSet(res && res[STORAGE_KEY_LENS], true);
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "local") return;
    if (changes[STORAGE_KEY]) {
      sensitiveSet = buildSet(changes[STORAGE_KEY].newValue, false);
    }
    if (changes[STORAGE_KEY_LENS]) {
      sensitiveLensSet = buildSet(changes[STORAGE_KEY_LENS].newValue, true);
    }
  });

  // ---- pull watched values out of the response ------------------------------
  // Walks the whole tree once, collecting any *product_id value into `pids`
  // and any lens_package value into `lens`.
  function collectValues(node, pids, lens) {
    if (node === null || node === undefined) return;
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) collectValues(node[i], pids, lens);
      return;
    }
    if (typeof node === "object") {
      for (var key in node) {
        if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
        var norm = key.toLowerCase().replace(/_/g, "");
        var val = node[key];
        var scalar = typeof val === "string" || typeof val === "number";
        if (scalar) {
          var s = String(val).trim();
          if (s && s.toLowerCase() !== "null") {
            if (norm.endsWith("productid")) pids.add(s);
            else if (norm === "lenspackage") lens.add(s);
          }
        }
        collectValues(val, pids, lens);
      }
    }
  }

  // ---- handle a forwarded response ------------------------------------------
  window.addEventListener("message", function (event) {
    if (event.source !== window) return;
    var data = event.data;
    if (!data || data.source !== MARKER || !data.body) return;

    var parsed;
    try {
      parsed = JSON.parse(data.body);
    } catch (e) {
      return; // not JSON — ignore
    }

    var foundPids = new Set();
    var foundLens = new Set();
    collectValues(parsed, foundPids, foundLens);

    // Either/or: fire if ANY line item matches a watched PID or lens package.
    var matches = [];
    foundPids.forEach(function (pid) {
      if (sensitiveSet.has(pid)) matches.push({ kind: "PID", value: pid });
    });
    foundLens.forEach(function (lp) {
      var lpUpper = lp.toUpperCase();
      var lensMatch = false;
      sensitiveLensSet.forEach(function (entry) {
        if (lpUpper.includes(entry)) lensMatch = true;
      });
      if (lensMatch) matches.push({ kind: "LENS", value: lp });
    });

    if (matches.length) showSiren(matches);
  });

  // ---- manual test trigger from the popup -----------------------------------
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg && msg.action === "test") {
      var m;
      if (msg.matches && msg.matches.length) {
        m = msg.matches;
      } else if (msg.pids && msg.pids.length) {
        m = msg.pids.map(function (p) {
          return { kind: "PID", value: p };
        });
      } else {
        m = [{ kind: "PID", value: "TEST-PID" }];
      }
      showSiren(m);
    }
  });

  // ---- the overlay ----------------------------------------------------------
  var OVERLAY_ID = "nspw-overlay";
  var audioCtx = null;
  var sirenTimer = null;

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
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      var hi = 880;
      var lo = 520;
      var up = true;
      osc.frequency.setValueAtTime(lo, audioCtx.currentTime);
      osc.start();

      sirenTimer = setInterval(function () {
        if (!audioCtx) return;
        var t = audioCtx.currentTime;
        osc.frequency.linearRampToValueAtTime(up ? hi : lo, t + 0.5);
        up = !up;
      }, 500);

      // park refs so stopSound can tear it down
      audioCtx.__osc = osc;
      audioCtx.__gain = gain;
    } catch (e) {}
  }

  function stopSound() {
    try {
      if (sirenTimer) {
        clearInterval(sirenTimer);
        sirenTimer = null;
      }
      if (audioCtx && audioCtx.__osc) {
        audioCtx.__osc.stop();
        audioCtx.__osc.disconnect();
        audioCtx.__gain.disconnect();
        audioCtx.__osc = null;
        audioCtx.__gain = null;
      }
    } catch (e) {}
  }

  function closeSiren() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
    stopSound();
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") closeSiren();
  }

  function chipHtml(matches) {
    return matches
      .map(function (m) {
        var kind = m && m.kind ? m.kind : "PID";
        var value = m && m.value !== undefined ? m.value : m;
        var isLens = kind === "LENS";
        var cls = isLens ? "nspw-chip nspw-chip-lens" : "nspw-chip nspw-chip-pid";
        var tag = isLens ? "Lens" : "Frame";
        return (
          '<span class="' +
          cls +
          '"><span class="nspw-chip-tag">' +
          escapeHtml(tag) +
          '</span><span class="nspw-chip-val">' +
          escapeHtml(value) +
          "</span></span>"
        );
      })
      .join("");
  }

  // ---- scope: was it the frame, the lens, or both? --------------------------
  // PID matches come from *product_id keys (the frame); LENS matches come from
  // lens_package (the lens).
  function deriveScope(matches) {
    var scope = { frame: false, lens: false };
    matches.forEach(function (m) {
      var kind = m && m.kind ? m.kind : "PID";
      if (kind === "LENS") scope.lens = true;
      else scope.frame = true;
    });
    return scope;
  }

  function headerFor(scope) {
    if (scope.frame && scope.lens) {
      return {
        mode: "both",
        eyebrow: "Sensitive Frame & Lens",
        title: "Both Sensitive",
        sub: "The frame PID and the lens are both flagged — proceed with care",
      };
    }
    if (scope.lens) {
      return {
        mode: "lens",
        eyebrow: "Sensitive Lens Alert",
        title: "Sensitive Lens",
        sub: "The lens (package) is flagged — proceed with care",
      };
    }
    return {
      mode: "frame",
      eyebrow: "Sensitive Frame Alert",
      title: "Sensitive Frame",
      sub: "The frame PID is flagged — proceed with care",
    };
  }

  // Inline SVG glyphs so the alert visually says frame vs lens.
  var FRAME_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="6.2" cy="14" r="3.4"/><circle cx="17.8" cy="14" r="3.4"/>' +
    '<path d="M9.4 13.1c.9-.9 4.3-.9 5.2 0"/><path d="M2.6 9.6 4.4 11"/><path d="M21.4 9.6 19.6 11"/>' +
    "</svg>";
  var LENS_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3.4"/>' +
    '<path d="M9.6 9.6 8 8"/>' +
    "</svg>";

  function scopeBadges(scope) {
    var out = "";
    if (scope.frame) {
      out +=
        '<span class="nspw-scope-badge nspw-scope-frame">' +
        FRAME_ICON +
        "<span>Frame PID</span></span>";
    }
    if (scope.lens) {
      out +=
        '<span class="nspw-scope-badge nspw-scope-lens">' +
        LENS_ICON +
        "<span>Lens</span></span>";
    }
    return out;
  }

  function applyContent(root, matches) {
    var scope = deriveScope(matches);
    var head = headerFor(scope);

    var card = root.querySelector(".nspw-card");
    if (card) {
      card.classList.remove("nspw-mode-frame", "nspw-mode-lens", "nspw-mode-both");
      card.classList.add("nspw-mode-" + head.mode);
    }

    var eb = root.querySelector(".nspw-eyebrow");
    var ti = root.querySelector(".nspw-title");
    var su = root.querySelector(".nspw-sub");
    var sc = root.querySelector(".nspw-scope");
    var pi = root.querySelector(".nspw-pids");
    if (eb) eb.textContent = head.eyebrow;
    if (ti) ti.textContent = head.title;
    if (su) su.textContent = head.sub;
    if (sc) sc.innerHTML = scopeBadges(scope);
    if (pi) pi.innerHTML = chipHtml(matches);
  }

  function showSiren(matches) {
    var existing = document.getElementById(OVERLAY_ID);
    if (existing) {
      // already up — refresh header, scope badges and chips (a later response
      // may add the other kind, escalating frame-only/lens-only into "both")
      applyContent(existing, matches);
      return;
    }

    if (!document.body) {
      // page not ready yet — retry shortly
      setTimeout(function () {
        showSiren(matches);
      }, 100);
      return;
    }

    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.className = "nspw-overlay";
    overlay.innerHTML =
      '<div class="nspw-card">' +
      '<div class="nspw-accent"></div>' +
      '<div class="nspw-sirens">' +
      '<div class="nspw-siren nspw-siren-left"><span class="nspw-sweep"></span></div>' +
      '<div class="nspw-siren nspw-siren-right"><span class="nspw-sweep"></span></div>' +
      "</div>" +
      '<div class="nspw-eyebrow"></div>' +
      '<div class="nspw-title"></div>' +
      '<div class="nspw-sub"></div>' +
      '<div class="nspw-scope"></div>' +
      '<div class="nspw-pids"></div>' +
      '<button class="nspw-close" type="button">Dismiss · Esc</button>' +
      '<div class="nspw-brand">Crafted with precision by Bhiwadi Ops &amp; Tech Sanghatan</div>' +
      "</div>";

    applyContent(overlay, matches);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("nspw-close")) {
        closeSiren();
      }
    });

    document.body.appendChild(overlay);
    document.addEventListener("keydown", onKey);
    startSound();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
