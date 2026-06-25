/* =============================================================================
   charts.js — builds every Chart.js visualization from window.SHELVED_DATA
   Requires: Chart.js v4 (loaded via CDN in index.html)
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SHELVED_DATA;
  var PALETTE = ["#9e2b25", "#bf8a2e", "#5b7b8a", "#2e6e6a", "#6e5a7a", "#a8743a", "#7a6a4a", "#c4b9a3"];
  var MUTED = "#c4b9a3";
  var INK = "#211a14", INK_SOFT = "#5a4f45", LINE = "#e2d8c5";

  if (!window.Chart) { console.warn("Chart.js not loaded"); return; }

  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = INK_SOFT;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 16;

  function alpha(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }
  function fmt(n) { return (n == null) ? "—" : n.toLocaleString(); }

  /* ---- 1. Timeline (line) ------------------------------------------------ */
  function timeline() {
    var t = D.timeline, el = document.getElementById("chart-timeline");
    if (!el) return;
    new Chart(el, {
      type: "line",
      data: {
        labels: t.labels,
        datasets: [{
          label: "Reported bans",
          data: t.values,
          borderColor: PALETTE[0],
          backgroundColor: alpha(PALETTE[0], 0.10),
          borderWidth: 2.5,
          pointBackgroundColor: PALETTE[0],
          pointRadius: 4, pointHoverRadius: 6,
          tension: 0.32, fill: true
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle(function (c) { return fmt(c.parsed.y) + " bans"; }) },
        scales: {
          y: { beginAtZero: true, grid: { color: LINE }, ticks: { callback: function (v) { return v.toLocaleString(); } }, title: { display: true, text: "Reported bans", color: INK_SOFT } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* ---- 2. Themes (doughnut) ---------------------------------------------- */
  function themes() {
    var t = D.themes, el = document.getElementById("chart-themes");
    if (!el) return;
    var colors = t.labels.map(function (_, i) {
      if (t.mutedLast && i === t.labels.length - 1) return MUTED;
      return PALETTE[i % PALETTE.length];
    });
    buildLegend("legend-themes", t.labels, colors);
    var total = t.values.reduce(function (a, b) { return a + b; }, 0);
    new Chart(el, {
      type: "doughnut",
      data: { labels: t.labels, datasets: [{ data: t.values, backgroundColor: colors, borderColor: "#fbf8f1", borderWidth: 2, hoverOffset: 6 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "58%",
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle(function (c) { return c.label + ": " + fmt(c.parsed) + " (" + Math.round(c.parsed / total * 100) + "%)"; })
        }
      }
    });
  }

  /* ---- 3. Authors (horizontal bar) --------------------------------------- */
  function authors() {
    var t = D.authors, el = document.getElementById("chart-authors");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: { labels: t.labels, datasets: [{ label: "Bans", data: t.values, backgroundColor: PALETTE[0], borderRadius: 4, maxBarThickness: 26 }] },
      options: {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle(function (c) { return fmt(c.parsed.x) + " bans"; }) },
        scales: {
          x: { beginAtZero: true, grid: { color: LINE }, ticks: { callback: function (v) { return v.toLocaleString(); } } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ---- 4. Comparison (states vs national avg) ---------------------------- */
  function comparison() {
    var t = D.comparison, el = document.getElementById("chart-comparison");
    if (!el) return;
    var colors = t.labels.map(function (_, i) { return i === t.refIndex ? PALETTE[1] : PALETTE[0]; });
    buildLegend("legend-comparison", ["State total, 2021–2023", "National average / state"], [PALETTE[0], PALETTE[1]]);
    new Chart(el, {
      type: "bar",
      data: { labels: t.labels, datasets: [{ label: "Bans", data: t.values, backgroundColor: colors, borderRadius: 4, maxBarThickness: 52 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle(function (c) { return fmt(c.parsed.y) + " bans"; }) },
        scales: {
          y: { beginAtZero: true, grid: { color: LINE }, ticks: { callback: function (v) { return v.toLocaleString(); } } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* ---- helpers ----------------------------------------------------------- */
  function tooltipStyle(labelFn) {
    var o = { backgroundColor: INK, titleColor: "#f6f1e7", bodyColor: "#f6f1e7", padding: 10, cornerRadius: 4, displayColors: true, boxPadding: 4 };
    if (labelFn) o.callbacks = { label: labelFn };
    return o;
  }
  function buildLegend(id, labels, colors) {
    var box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";
    labels.forEach(function (l, i) {
      var key = document.createElement("span"); key.className = "key";
      var sw = document.createElement("span"); sw.className = "swatch"; sw.style.background = colors[i % colors.length];
      key.appendChild(sw); key.appendChild(document.createTextNode(l)); box.appendChild(key);
    });
  }

  window.SHELVED_CHARTS = function init() { timeline(); themes(); authors(); comparison(); };
})();
