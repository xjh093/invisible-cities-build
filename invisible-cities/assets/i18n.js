(function () {
  "use strict";
  var DICT = window.IC_DICT || {};
  var PATTERNS = window.IC_DICT_PATTERNS || [];
  var STORAGE_KEY = "ic-lang";
  var lang = localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";

  function translateText(s) {
    if (DICT.hasOwnProperty(s)) return DICT[s];
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = s.match(PATTERNS[i][0]);
      if (m) return PATTERNS[i][1](m);
    }
    return s;
  }

  function applyNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.__icOrig === undefined) node.__icOrig = node.nodeValue;
      var orig = node.__icOrig;
      if (!orig || !orig.trim()) return;
      var next = lang === "zh" ? translateText(orig) : orig;
      // guard: only write if changed, otherwise this re-triggers the observer forever
      if (node.nodeValue !== next) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    var tag = node.tagName;
    if (tag === "SCRIPT" || tag === "STYLE") return;
    if (node.hasAttribute("title")) {
      if (node.__icOrigTitle === undefined) node.__icOrigTitle = node.getAttribute("title");
      var ot = node.__icOrigTitle;
      var nextTitle = lang === "zh" ? translateText(ot) : ot;
      if (ot && node.getAttribute("title") !== nextTitle) node.setAttribute("title", nextTitle);
    }
    for (var i = 0; i < node.childNodes.length; i++) applyNode(node.childNodes[i]);
  }

  var applying = false;

  function applyAll() {
    applying = true;
    applyNode(document.body);
    applying = false;
  }

  // The city panel splits a city's full text into multiple <p> fragments, so no
  // single DOM text node ever holds the exact dictionary key. Patch the
  // underlying city data objects instead, so the app's own renderer (which
  // reads city.name/motif/text) naturally shows the right language.
  var cityOriginals = {};

  function patchCityData() {
    if (!window.__app || !window.__app.entries) return;
    window.__app.entries.forEach(function (entry) {
      var city = entry.city;
      if (!city) return;
      if (!cityOriginals[city.id]) {
        cityOriginals[city.id] = { motif: city.motif, text: city.text };
      }
      var orig = cityOriginals[city.id];
      city.motif = lang === "zh" ? translateText(orig.motif) : orig.motif;
      city.text = lang === "zh" ? translateText(orig.text) : orig.text;
    });
  }

  function refreshOpenPanel() {
    if (!window.__app || !window.__app.state) return;
    var focus = window.__app.state.focus;
    if (focus == null || focus < 0) return;
    var entry = window.__app.entries[focus];
    if (!entry) return;
    var motifEl = document.getElementById("p-motif");
    var textEl = document.getElementById("p-text");
    if (motifEl) motifEl.textContent = entry.city.motif;
    if (textEl) textEl.textContent = entry.city.text;
  }

  var observer = new MutationObserver(function (mutations) {
    if (applying) return; // ignore mutations caused by our own writes
    applying = true;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "childList") {
        m.addedNodes.forEach(function (n) { applyNode(n); });
      } else if (m.type === "characterData") {
        applyNode(m.target);
      } else if (m.type === "attributes" && m.attributeName === "title") {
        applyNode(m.target);
      }
    }
    applying = false;
  });

  function startObserving() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title"],
    });
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    patchCityData();
    applyAll();
    refreshOpenPanel();
    var btn = document.getElementById("btn-lang");
    if (btn) btn.textContent = lang === "zh" ? "EN" : "中文";
  }

  function addToggleButton() {
    var btn = document.createElement("button");
    btn.id = "btn-lang";
    btn.className = "lang-floating";
    btn.title = "Switch language / 切换语言";
    btn.textContent = lang === "zh" ? "EN" : "中文";
    btn.addEventListener("click", function () {
      setLang(lang === "zh" ? "en" : "zh");
    });
    // Appended directly to <body> (not inside #top, which stays hidden until
    // "Enter the atlas" is clicked) so it's reachable from the intro screen too.
    document.body.appendChild(btn);

    // Once the user enters the atlas, #top's own toolbar becomes visible;
    // move the button in-line there instead of floating over it.
    var enterBtn = document.getElementById("enter");
    if (enterBtn) {
      enterBtn.addEventListener("click", function () {
        var tools = document.querySelector("#top .tools");
        if (tools) {
          btn.classList.remove("lang-floating");
          tools.insertBefore(btn, tools.firstChild);
        }
      });
    }
  }

  function init() {
    addToggleButton();
    applyAll();
    startObserving();
    // window.__app.entries is assigned synchronously at the end of the app's
    // module script, which normally runs before this deferred script — but
    // retry briefly in case ordering ever changes.
    var tries = 0;
    (function tryPatch() {
      if (window.__app && window.__app.entries) {
        patchCityData();
        return;
      }
      if (++tries > 50) return;
      setTimeout(tryPatch, 100);
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
