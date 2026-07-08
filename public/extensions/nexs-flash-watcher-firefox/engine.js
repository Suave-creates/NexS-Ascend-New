// engine.js — runs in the ISOLATED content-script world (shared scope with
// content.js). Plain-JS mirror of src/lib/flashRules.ts. Keep the two in sync.

var FlashEngine = (function () {
  "use strict";

  function normKey(k) {
    return String(k).toLowerCase().replace(/[_\s]/g, "");
  }

  function collectByKey(node, wantKey, out) {
    if (node === null || node === undefined) return;
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) collectByKey(node[i], wantKey, out);
      return;
    }
    if (typeof node === "object") {
      for (var k in node) {
        if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
        if (normKey(k) === wantKey) out.push(node[k]);
        collectByKey(node[k], wantKey, out);
      }
    }
  }

  function splitPath(path) {
    return String(path)
      .replace(/\[\s*\]/g, ".[].")
      .replace(/\[\s*(\d+)\s*\]/g, ".$1.")
      .split(".")
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  function collectByPath(node, segments, out) {
    if (node === null || node === undefined) return;
    if (segments.length === 0) { out.push(node); return; }
    var head = segments[0];
    var rest = segments.slice(1);
    if (head === "*" || head === "[]") {
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) collectByPath(node[i], rest, out);
      }
      return;
    }
    if (Array.isArray(node)) {
      var idx = Number(head);
      if (Number.isInteger(idx) && idx >= 0 && idx < node.length) {
        collectByPath(node[idx], rest, out);
      }
      return;
    }
    if (typeof node === "object") {
      collectByPath(node[head], rest, out);
    }
  }

  function collectValues(root, cond) {
    var out = [];
    if (cond.mode === "path") collectByPath(root, splitPath(cond.field), out);
    else collectByKey(root, normKey(cond.field), out);
    return out;
  }

  function isBlank(v) {
    return (
      v === null ||
      v === undefined ||
      (typeof v === "string" && v.trim() === "") ||
      (typeof v === "string" && v.trim().toLowerCase() === "null")
    );
  }

  function scalarText(v) {
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return null;
  }

  function parseList(text) {
    if (!text) return [];
    return String(text)
      .split(/[\n,]+/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function cmp(a, b, ci) {
    return ci ? a.toLowerCase() === b.toLowerCase() : a === b;
  }

  function evaluateCondition(root, cond) {
    var found = collectValues(root, cond);
    var ci = cond.caseInsensitive !== false;
    var target = cond.value == null ? "" : String(cond.value);
    var list = parseList(target);

    if (cond.op === "exists") {
      var present = found.filter(function (v) { return !isBlank(v); });
      return present.length ? present : [];
    }
    if (cond.op === "notExists") {
      return found.every(isBlank) ? ["(absent)"] : [];
    }
    if (cond.op === "empty") {
      return found.length > 0 && found.every(isBlank) ? found : [];
    }

    var texts = [];
    for (var i = 0; i < found.length; i++) {
      var txt = scalarText(found[i]);
      if (txt !== null) texts.push({ raw: found[i], txt: txt });
    }

    var hits = [];
    for (var j = 0; j < texts.length; j++) {
      var t = texts[j].txt.trim();
      var raw = texts[j].raw;
      switch (cond.op) {
        case "equals":
          if (cmp(t, target.trim(), ci)) hits.push(raw);
          break;
        case "contains":
          if (ci ? t.toLowerCase().indexOf(target.trim().toLowerCase()) !== -1 : t.indexOf(target.trim()) !== -1) hits.push(raw);
          break;
        case "in":
          if (list.some(function (item) { return cmp(t, item, ci); })) hits.push(raw);
          break;
        case "regex":
          try { if (new RegExp(target, ci ? "i" : "").test(t)) hits.push(raw); } catch (e) {}
          break;
        case "gt":
          if (!isNaN(Number(t)) && Number(t) > Number(target)) hits.push(raw);
          break;
        case "lt":
          if (!isNaN(Number(t)) && Number(t) < Number(target)) hits.push(raw);
          break;
      }
    }

    if (cond.op === "notEquals" || cond.op === "notContains" || cond.op === "notIn") {
      if (texts.length === 0) return [];
      var violated = texts.some(function (x) {
        var tt = x.txt.trim();
        if (cond.op === "notEquals") return cmp(tt, target.trim(), ci);
        if (cond.op === "notContains") return ci ? tt.toLowerCase().indexOf(target.trim().toLowerCase()) !== -1 : tt.indexOf(target.trim()) !== -1;
        return list.some(function (item) { return cmp(tt, item, ci); });
      });
      return violated ? [] : texts.map(function (x) { return x.raw; });
    }

    return hits;
  }

  function evaluateRule(root, rule, url) {
    if (!rule || !rule.enabled) return null;
    if (rule.urlContains && url && url.indexOf(rule.urlContains) === -1) return null;
    if (!rule.conditions || !rule.conditions.length) return null;

    var per = rule.conditions.map(function (c) {
      return { cond: c, hits: evaluateCondition(root, c) };
    });
    var matched = per.filter(function (p) { return p.hits.length > 0; }).length;
    var passed = rule.match === "all" ? matched === rule.conditions.length : matched > 0;
    if (!passed) return null;

    var matchedValues = [];
    per.forEach(function (p) {
      p.hits.forEach(function (v) {
        var txt = scalarText(v);
        matchedValues.push({ field: p.cond.field, value: txt === null ? String(v) : txt });
      });
    });
    return { rule: rule, matchedValues: matchedValues };
  }

  function evaluateAll(root, rules, url) {
    var out = [];
    (rules || []).forEach(function (rule) {
      var m = evaluateRule(root, rule, url);
      if (m) out.push(m);
    });
    return out;
  }

  return {
    collectValues: collectValues,
    evaluateCondition: evaluateCondition,
    evaluateRule: evaluateRule,
    evaluateAll: evaluateAll,
  };
})();
