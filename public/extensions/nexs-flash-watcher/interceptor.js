// interceptor.js — MAIN world, document_start.
// Mirrors every fetch/XHR JSON-ish response to the isolated content script via
// postMessage. Never blocks, alters, or delays a request.

(function () {
  "use strict";

  var MARKER = "__NEXS_FLASH_WATCHER__";
  var MAX_BODY = 3 * 1024 * 1024; // skip bodies larger than 3 MB

  function looksJson(txt) {
    if (!txt) return false;
    var s = txt.slice(0, 64).replace(/^﻿/, "").trimStart();
    return s.charAt(0) === "{" || s.charAt(0) === "[";
  }

  function forward(url, bodyText) {
    if (!bodyText || bodyText.length > MAX_BODY) return;
    if (!looksJson(bodyText)) return;
    try {
      window.postMessage({ source: MARKER, url: String(url), body: bodyText }, window.location.origin);
    } catch (e) {}
  }

  // ---- fetch ----------------------------------------------------------------
  if (typeof window.fetch === "function") {
    var origFetch = window.fetch;
    window.fetch = function () {
      var args = arguments;
      var reqUrl;
      try {
        var input = args[0];
        reqUrl = typeof input === "string" ? input : input && input.url ? input.url : "";
      } catch (e) { reqUrl = ""; }

      var p = origFetch.apply(this, args);
      try {
        p.then(function (res) {
          try {
            res.clone().text().then(function (txt) { forward(reqUrl, txt); }).catch(function () {});
          } catch (e) {}
        }).catch(function () {});
      } catch (e) {}
      return p;
    };
  }

  // ---- XMLHttpRequest -------------------------------------------------------
  if (window.XMLHttpRequest) {
    var XHR = window.XMLHttpRequest;
    var origOpen = XHR.prototype.open;
    var origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      try { this.__nfw_url = url; } catch (e) {}
      return origOpen.apply(this, arguments);
    };

    XHR.prototype.send = function () {
      try {
        var self = this;
        self.addEventListener("load", function () {
          try {
            var txt =
              self.responseType === "" || self.responseType === "text"
                ? self.responseText
                : self.responseType === "json"
                ? JSON.stringify(self.response)
                : "";
            forward(self.__nfw_url, txt);
          } catch (e) {}
        });
      } catch (e) {}
      return origSend.apply(this, arguments);
    };
  }
})();
