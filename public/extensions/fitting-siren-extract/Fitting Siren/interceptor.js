// Runs in the page's MAIN world at document_start.
// Silently mirrors getFittingDetail responses to the isolated content script
// via window.postMessage. It never blocks, alters, or delays any request.

(function () {
  "use strict";

  var MARKER = "__NEXS_PID_WATCHER__";
  var URL_NEEDLE = "getFittingDetail";

  function isTarget(url) {
    try {
      return typeof url === "string" && url.indexOf(URL_NEEDLE) !== -1;
    } catch (e) {
      return false;
    }
  }

  function forward(url, bodyText) {
    if (!bodyText) return;
    try {
      window.postMessage(
        { source: MARKER, url: String(url), body: bodyText },
        window.location.origin
      );
    } catch (e) {
      /* swallow — watcher must stay invisible to the page */
    }
  }

  // ---- fetch ----------------------------------------------------------------
  if (typeof window.fetch === "function") {
    var origFetch = window.fetch;
    window.fetch = function () {
      var args = arguments;
      var reqUrl;
      try {
        var input = args[0];
        reqUrl =
          typeof input === "string"
            ? input
            : input && input.url
            ? input.url
            : "";
      } catch (e) {
        reqUrl = "";
      }

      var p = origFetch.apply(this, args);

      if (isTarget(reqUrl)) {
        p.then(function (res) {
          try {
            res
              .clone()
              .text()
              .then(function (txt) {
                forward(reqUrl, txt);
              })
              .catch(function () {});
          } catch (e) {}
        }).catch(function () {});
      }
      return p;
    };
  }

  // ---- XMLHttpRequest -------------------------------------------------------
  if (window.XMLHttpRequest) {
    var XHR = window.XMLHttpRequest;
    var origOpen = XHR.prototype.open;
    var origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      try {
        this.__nspw_url = url;
      } catch (e) {}
      return origOpen.apply(this, arguments);
    };

    XHR.prototype.send = function () {
      try {
        var self = this;
        if (isTarget(self.__nspw_url)) {
          self.addEventListener("load", function () {
            try {
              var txt =
                self.responseType === "" || self.responseType === "text"
                  ? self.responseText
                  : self.responseType === "json"
                  ? JSON.stringify(self.response)
                  : "";
              forward(self.__nspw_url, txt);
            } catch (e) {}
          });
        }
      } catch (e) {}
      return origSend.apply(this, arguments);
    };
  }
})();
