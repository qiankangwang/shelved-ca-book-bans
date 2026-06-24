/* =============================================================================
   a11y.js — accessibility & assistive layer for Shelved
   ----------------------------------------------------------------------------
   - Settings panel: text size, dark mode, high-contrast, readable spacing,
     reduce motion, always-underline links  (persisted in localStorage)
   - Read-aloud (Web Speech API): a "Listen" button per section + global stop
   - Auto-generated accessible data tables under every figure
   - Wires the data-download (JSON/CSV) and copy-citation buttons
   - All controls keyboard-operable with ARIA state; degrades gracefully
   ========================================================================== */
(function () {
  "use strict";

  var LS_KEY = "shelved.a11y";
  var html = document.documentElement;
  var hasTTS = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

  /* ---- preferences ------------------------------------------------------- */
  var PREFS = { fontscale: "", theme: "", contrast: "", readable: "", motion: "", underline: "" };
  try {
    var saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    Object.keys(PREFS).forEach(function (k) { if (saved[k]) PREFS[k] = saved[k]; });
  } catch (e) { /* ignore */ }
  // default motion to OS preference if user never chose
  if (!PREFS.motion && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    PREFS.motion = "off";
  }
  function apply() {
    Object.keys(PREFS).forEach(function (k) {
      var v = PREFS[k];
      if (v) html.setAttribute("data-" + k, v); else html.removeAttribute("data-" + k);
    });
  }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(PREFS)); } catch (e) {} }
  apply();

  /* ---- ARIA live region -------------------------------------------------- */
  var live = document.createElement("div");
  live.className = "a11y-live"; live.setAttribute("aria-live", "polite"); live.setAttribute("role", "status");
  function announce(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); }

  /* ====================================================================== *
   *  TEXT-TO-SPEECH (read aloud)
   * ====================================================================== */
  var speaking = null;        // the currently-playing listen button
  var queue = [], qi = 0, stoppedByUser = false;

  function pickVoice() {
    if (!hasTTS) return null;
    var vs = window.speechSynthesis.getVoices() || [];
    var lang = (html.getAttribute("lang") || "en").toLowerCase();
    return vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lang.slice(0, 2)) === 0; })[0] || vs[0] || null;
  }

  function stopSpeech(silent) {
    if (!hasTTS) return;
    stoppedByUser = true;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    queue = []; qi = 0;
    if (speaking) { setPlaying(speaking, false); speaking = null; }
    if (!silent) announce("Stopped reading.");
  }

  function setPlaying(btn, on) {
    btn.classList.toggle("is-playing", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    var lbl = btn.querySelector(".listen-label");
    if (lbl) lbl.textContent = on ? "Stop" : "Listen";
  }

  function chunkText(text) {
    // split into sentence-ish chunks so long sections speak reliably
    var parts = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*\s*/g) || [text];
    var out = [], buf = "";
    parts.forEach(function (p) {
      if ((buf + p).length > 220) { if (buf) out.push(buf.trim()); buf = p; }
      else { buf += p; }
    });
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  function getReadableText(section) {
    var clone = section.cloneNode(true);
    clone.querySelectorAll(".figure, .listen-btn, .fig-data, .badge-ph, .cite__note, script, .a11y-live")
      .forEach(function (n) { n.parentNode && n.parentNode.removeChild(n); });
    var t = clone.textContent || "";
    t = t.replace(/\[[^\]]*\]/g, " ");        // drop intentional [X] placeholders
    t = t.replace(/\s+/g, " ").trim();
    return t;
  }

  function speakNext(voice) {
    if (qi >= queue.length) { if (speaking) { setPlaying(speaking, false); speaking = null; } return; }
    var u = new SpeechSynthesisUtterance(queue[qi]);
    if (voice) u.voice = voice;
    u.lang = (html.getAttribute("lang") || "en");
    u.rate = 1; u.pitch = 1;
    u.onend = function () { qi++; if (!stoppedByUser) speakNext(voice); };
    u.onerror = function () { qi++; if (!stoppedByUser) speakNext(voice); };
    window.speechSynthesis.speak(u);
  }

  function readSection(section, btn) {
    if (!hasTTS) return;
    if (speaking === btn) { stopSpeech(); return; }   // toggle off
    stopSpeech(true);
    var text = getReadableText(section);
    if (!text) return;
    stoppedByUser = false; queue = chunkText(text); qi = 0; speaking = btn;
    setPlaying(btn, true);
    announce("Reading section aloud.");
    var voice = pickVoice();
    // some engines need a tick after cancel()
    setTimeout(function () { if (!stoppedByUser) speakNext(voice); }, 60);
  }

  function injectListenButtons() {
    if (!hasTTS) return;
    var sections = document.querySelectorAll("main section.section, footer .wrap");
    document.querySelectorAll("main section.section").forEach(function (section) {
      var eyebrow = section.querySelector(".eyebrow");
      if (!eyebrow) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "listen-btn";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Listen to this section read aloud");
      btn.innerHTML = '<svg class="ico" width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z"/></svg><span class="listen-label">Listen</span>';
      btn.addEventListener("click", function () { readSection(section, btn); });
      eyebrow.insertAdjacentElement("afterend", btn);
    });
    // stop speech if the page is hidden/navigated
    document.addEventListener("visibilitychange", function () { if (document.hidden) stopSpeech(true); });
    window.addEventListener("beforeunload", function () { stopSpeech(true); });
    if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = pickVoice; // warm the voice list
    }
  }

  /* ====================================================================== *
   *  ACCESSIBLE DATA TABLES (text alternative for each figure)
   * ====================================================================== */
  function countyNames() {
    var map = {};
    try {
      (window.CA_COUNTIES_GEOJSON.features || []).forEach(function (f) {
        var fips = (f.id || (f.properties && f.properties.fips) || "").toString();
        map[fips] = (f.properties && f.properties.name) || fips;
      });
    } catch (e) {}
    return map;
  }

  function tableEl(caption, headers, rows) {
    var wrap = document.createElement("div"); wrap.className = "tbl-wrap";
    var t = document.createElement("table"); t.className = "datatable";
    var cap = document.createElement("caption"); cap.textContent = caption; t.appendChild(cap);
    var thead = document.createElement("thead"), htr = document.createElement("tr");
    headers.forEach(function (h) { var th = document.createElement("th"); th.scope = "col"; th.textContent = h.label; htr.appendChild(th); });
    thead.appendChild(htr); t.appendChild(thead);
    var tb = document.createElement("tbody");
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      r.forEach(function (cell, i) {
        var td = document.createElement("td");
        if (headers[i] && headers[i].num) td.className = "num";
        td.textContent = cell;
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); return wrap;
  }

  function attachTable(figureEl, caption, content) {
    if (!figureEl || figureEl.querySelector(".fig-data")) return;
    var det = document.createElement("details"); det.className = "fig-data";
    var sum = document.createElement("summary"); sum.textContent = "Show data table"; det.appendChild(sum);
    det.appendChild(content);
    var cap = figureEl.querySelector(".figure__cap");
    if (cap) figureEl.insertBefore(det, cap); else figureEl.appendChild(det);
  }

  function figureOf(elId) {
    var el = document.getElementById(elId);
    return el ? el.closest(".figure") : null;
  }

  function buildTables() {
    var D = window.SHELVED_DATA; if (!D) return;
    var ph = function (p) { return p ? " (illustrative placeholder values)" : ""; };

    // 1 timeline
    if (D.timeline) attachTable(figureOf("chart-timeline"),
      D.timeline.title + ph(D.timeline.placeholder),
      tableEl(D.timeline.title, [{ label: "Year" }, { label: "Reported challenges", num: true }],
        D.timeline.labels.map(function (y, i) { return [y, fmt(D.timeline.values[i])]; })));

    // 2 geography
    if (D.geography) {
      var names = countyNames(), inc = D.geography.incidents || {};
      var rows = Object.keys(inc).map(function (fips) { return [names[fips] || fips, fips, inc[fips]]; })
        .sort(function (a, b) { return b[2] - a[2]; });
      attachTable(document.getElementById("ca-map") ? document.getElementById("ca-map").closest(".figure") : null,
        D.geography.title + ph(D.geography.placeholder),
        tableEl(D.geography.title + " — counties with reported incidents",
          [{ label: "County" }, { label: "FIPS" }, { label: "Incidents", num: true }], rows));
    }
    // 3 themes
    if (D.themes) attachTable(figureOf("chart-themes"),
      D.themes.title + ph(D.themes.placeholder),
      tableEl(D.themes.title, [{ label: "Theme" }, { label: "Share", num: true }],
        D.themes.labels.map(function (l, i) { return [l, fmt(D.themes.values[i]) + "%"]; })));
    // 4 authors
    if (D.authors) attachTable(figureOf("chart-authors"),
      D.authors.title + ph(D.authors.placeholder),
      tableEl(D.authors.title, [{ label: "Author identity" }, { label: "Share", num: true }],
        D.authors.labels.map(function (l, i) { return [l, fmt(D.authors.values[i]) + "%"]; })));
    // 5 comparison
    if (D.comparison) {
      var heads = [{ label: "Year" }].concat(D.comparison.series.map(function (s) { return { label: s.name, num: true }; }));
      var crows = D.comparison.labels.map(function (y, i) {
        return [y].concat(D.comparison.series.map(function (s) { return fmt(s.values[i]); }));
      });
      attachTable(figureOf("chart-comparison"), D.comparison.title + ph(D.comparison.placeholder),
        tableEl(D.comparison.title, heads, crows));
    }
  }
  function fmt(v) { return (v === null || v === undefined) ? "—" : v; }

  /* ====================================================================== *
   *  DATA DOWNLOADS (JSON / CSV) + COPY CITATION
   * ====================================================================== */
  function download(name, text, type) {
    var blob = new Blob([text], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
    announce("Downloading " + name);
  }
  function toCSV(D) {
    var names = countyNames();
    var rows = [["dataset", "category", "code", "year", "value", "unit", "placeholder"]];
    var esc = function (s) { s = String(s == null ? "" : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    if (D.timeline) D.timeline.labels.forEach(function (y, i) { rows.push(["timeline", "reported challenges", "", y, D.timeline.values[i], "count", D.timeline.placeholder]); });
    if (D.geography) Object.keys(D.geography.incidents || {}).forEach(function (f) { rows.push(["geography", names[f] || f, f, "", D.geography.incidents[f], "count", D.geography.placeholder]); });
    if (D.themes) D.themes.labels.forEach(function (l, i) { rows.push(["themes", l, "", "", D.themes.values[i], "percent", D.themes.placeholder]); });
    if (D.authors) D.authors.labels.forEach(function (l, i) { rows.push(["authors", l, "", "", D.authors.values[i], "percent", D.authors.placeholder]); });
    if (D.comparison) D.comparison.series.forEach(function (s) { D.comparison.labels.forEach(function (y, i) { rows.push(["comparison", s.name, "", y, s.values[i], "count", D.comparison.placeholder]); }); });
    return rows.map(function (r) { return r.map(esc).join(","); }).join("\n");
  }
  function wireDownloads() {
    var j = document.getElementById("dl-json"), c = document.getElementById("dl-csv");
    if (j) j.addEventListener("click", function () { download("shelved-dataset.json", JSON.stringify(window.SHELVED_DATA, null, 2), "application/json"); });
    if (c) c.addEventListener("click", function () { download("shelved-challenges.csv", toCSV(window.SHELVED_DATA), "text/csv"); });
  }
  function wireCopy() {
    document.querySelectorAll(".copy-cite").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".assurance-card") || document;
        var block = card.querySelector(".cite-block");
        var text = block ? block.innerText.trim() : "";
        var done = function () { btn.classList.add("copied"); var o = btn.textContent; btn.textContent = "Copied ✓"; announce("Citation copied to clipboard."); setTimeout(function () { btn.classList.remove("copied"); btn.textContent = o; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else { try { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done(); } catch (e) {} }
      });
    });
  }

  /* ====================================================================== *
   *  SETTINGS PANEL
   * ====================================================================== */
  function seg(label, key, opts) {
    var g = document.createElement("div"); g.className = "a11y-group";
    var l = document.createElement("span"); l.className = "lbl"; l.textContent = label; g.appendChild(l);
    var s = document.createElement("div"); s.className = "seg"; s.setAttribute("role", "group"); s.setAttribute("aria-label", label);
    opts.forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = o.label;
      b.setAttribute("aria-pressed", (PREFS[key] || "") === o.value ? "true" : "false");
      b.addEventListener("click", function () {
        PREFS[key] = o.value; apply(); save();
        s.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        announce(label + " set to " + o.label);
      });
      s.appendChild(b);
    });
    g.appendChild(s); return g;
  }
  function toggle(label, key, onVal) {
    var row = document.createElement("div"); row.className = "tgl-row";
    var id = "tgl-" + key;
    var l = document.createElement("label"); l.textContent = label; l.id = id + "-l"; row.appendChild(l);
    var b = document.createElement("button"); b.type = "button"; b.className = "tgl"; b.setAttribute("role", "switch");
    b.setAttribute("aria-labelledby", id + "-l");
    var on = PREFS[key] === onVal; b.setAttribute("aria-pressed", on ? "true" : "false");
    b.addEventListener("click", function () {
      var nowOn = b.getAttribute("aria-pressed") !== "true";
      PREFS[key] = nowOn ? onVal : ""; apply(); save();
      b.setAttribute("aria-pressed", nowOn ? "true" : "false");
      announce(label + (nowOn ? " on" : " off"));
    });
    row.appendChild(b); return row;
  }

  function buildPanel() {
    var fab = document.createElement("button");
    fab.type = "button"; fab.className = "a11y-fab"; fab.id = "a11y-fab";
    fab.setAttribute("aria-label", "Accessibility settings"); fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "a11y-panel"); fab.innerHTML = "♿";

    var panel = document.createElement("div");
    panel.className = "a11y-panel"; panel.id = "a11y-panel"; panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Accessibility settings"); panel.setAttribute("aria-modal", "false");
    panel.innerHTML = '<h2>Accessibility</h2><p class="sub">Preferences are saved on this device.</p>';

    panel.appendChild(seg("Text size", "fontscale", [
      { label: "A", value: "" }, { label: "A+", value: "lg" }, { label: "A++", value: "xl" }
    ]));

    var modes = document.createElement("div"); modes.className = "a11y-group";
    var ml = document.createElement("span"); ml.className = "lbl"; ml.textContent = "Display"; modes.appendChild(ml);
    modes.appendChild(toggle("Dark mode", "theme", "dark"));
    modes.appendChild(toggle("High contrast", "contrast", "high"));
    modes.appendChild(toggle("Readable spacing & font", "readable", "true"));
    modes.appendChild(toggle("Reduce motion", "motion", "off"));
    modes.appendChild(toggle("Always underline links", "underline", "true"));
    panel.appendChild(modes);

    var actions = document.createElement("div"); actions.className = "a11y-actions";
    if (hasTTS) {
      var stop = document.createElement("button"); stop.type = "button"; stop.textContent = "■ Stop reading";
      stop.addEventListener("click", function () { stopSpeech(); }); actions.appendChild(stop);
    }
    var reset = document.createElement("button"); reset.type = "button"; reset.textContent = "Reset";
    reset.addEventListener("click", function () {
      Object.keys(PREFS).forEach(function (k) { PREFS[k] = ""; }); apply(); save(); stopSpeech(true);
      announce("Accessibility settings reset.");
      // refresh control states
      panel.querySelectorAll('[aria-pressed]').forEach(function (b) {
        b.setAttribute("aria-pressed", b.parentElement.classList.contains("seg") && b.textContent === "A" ? "true" : "false");
      });
    });
    actions.appendChild(reset);
    panel.appendChild(actions);

    function openPanel(o) {
      panel.classList.toggle("open", o); fab.setAttribute("aria-expanded", o ? "true" : "false");
      if (o) { var first = panel.querySelector("button"); first && first.focus(); }
    }
    fab.addEventListener("click", function () { openPanel(!panel.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) { openPanel(false); fab.focus(); } });
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) openPanel(false);
    });

    document.body.appendChild(fab); document.body.appendChild(panel); document.body.appendChild(live);
  }

  /* ---- init -------------------------------------------------------------- */
  function start() {
    buildPanel();
    injectListenButtons();
    buildTables();
    wireDownloads();
    wireCopy();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
