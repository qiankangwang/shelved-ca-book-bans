/* =============================================================================
   charts.js — builds every Chart.js visualization from window.SHELVED_DATA
   Requires: Chart.js v4 (loaded via CDN in index.html)
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SHELVED_DATA;
  var PALETTE = ["#9e2b25", "#2e6e6a", "#bf8a2e", "#5b7b8a", "#6e5a7a"];
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

  /* vertical annotation line for the timeline (AB 1078) */
  var verticalMarker = {
    id: "verticalMarker",
    afterDatasetsDraw: function (chart, _a, opts) {
      if (!opts || !opts.label) return;
      var x = chart.scales.x, y = chart.scales.y;
      var idx = chart.data.labels.indexOf(opts.year);
      if (idx < 0) return;
      var px = x.getPixelForValue(idx);
      var ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = "#bf8a2e";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "600 11px 'Inter', sans-serif";
      ctx.fillStyle = "#9a6c1f";
      ctx.textAlign = px > (x.left + x.right) / 2 ? "right" : "left";
      var pad = px > (x.left + x.right) / 2 ? -8 : 8;
      ctx.fillText(opts.label, px + pad, y.top + 14);
      ctx.restore();
    }
  };

  /* ---- 1. Timeline ------------------------------------------------------- */
  function timeline() {
    var t = D.timeline, el = document.getElementById("chart-timeline");
    if (!el) return;
    new Chart(el, {
      type: "line",
      data: {
        labels: t.labels,
        datasets: [{
          label: "Reported challenges",
          data: t.values,
          borderColor: PALETTE[0],
          backgroundColor: alpha(PALETTE[0], 0.10),
          borderWidth: 2.5,
          pointBackgroundColor: PALETTE[0],
          pointRadius: 4, pointHoverRadius: 6,
          tension: 0.32, fill: true,
          borderDash: t.placeholder ? [6, 4] : []
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          verticalMarker: t.annotation || {},
          tooltip: tooltipStyle()
        },
        scales: {
          y: { beginAtZero: true, grid: { color: LINE }, title: { display: true, text: "Challenges", color: INK_SOFT } },
          x: { grid: { display: false } }
        }
      },
      plugins: [verticalMarker]
    });
  }

  /* ---- 2. Themes (doughnut) ---------------------------------------------- */
  function themes() {
    var t = D.themes, el = document.getElementById("chart-themes");
    if (!el) return;
    buildLegend("legend-themes", t.labels, PALETTE);
    new Chart(el, {
      type: "doughnut",
      data: {
        labels: t.labels,
        datasets: [{
          data: t.values,
          backgroundColor: t.labels.map(function (_, i) { return alpha(PALETTE[i % PALETTE.length], t.placeholder ? 0.78 : 1); }),
          borderColor: "#fbf8f1", borderWidth: 2, hoverOffset: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "58%",
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle(function (c) { return c.label + ": " + c.parsed + "%"; })
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
      data: {
        labels: t.labels,
        datasets: [{
          label: "Share of challenged authors",
          data: t.values,
          backgroundColor: t.labels.map(function (_, i) { return alpha(PALETTE[i % PALETTE.length], t.placeholder ? 0.8 : 1); }),
          borderRadius: 4, barThickness: "flex", maxBarThickness: 42
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle(function (c) { return c.parsed.x + "%"; })
        },
        scales: {
          x: { beginAtZero: true, grid: { color: LINE }, ticks: { callback: function (v) { return v + "%"; } } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ---- 4. Comparison (grouped bar) --------------------------------------- */
  function comparison() {
    var t = D.comparison, el = document.getElementById("chart-comparison");
    if (!el) return;
    var colors = [PALETTE[0], PALETTE[3]];
    buildLegend("legend-comparison", t.series.map(function (s) { return s.name; }), colors);
    new Chart(el, {
      type: "bar",
      data: {
        labels: t.labels,
        datasets: t.series.map(function (s, i) {
          return {
            label: s.name,
            data: s.values,
            backgroundColor: alpha(colors[i % colors.length], t.placeholder ? 0.82 : 1),
            borderRadius: 4, maxBarThickness: 40
          };
        })
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle()
        },
        scales: {
          y: { beginAtZero: true, grid: { color: LINE } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* ---- helpers ----------------------------------------------------------- */
  function tooltipStyle(labelFn) {
    var o = {
      backgroundColor: INK, titleColor: "#f6f1e7", bodyColor: "#f6f1e7",
      padding: 10, cornerRadius: 4, displayColors: true, boxPadding: 4
    };
    if (labelFn) o.callbacks = { label: labelFn };
    return o;
  }

  function buildLegend(id, labels, colors) {
    var box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";
    labels.forEach(function (l, i) {
      var key = document.createElement("span");
      key.className = "key";
      var sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = colors[i % colors.length];
      key.appendChild(sw);
      key.appendChild(document.createTextNode(l));
      box.appendChild(key);
    });
  }

  window.SHELVED_CHARTS = function init() { timeline(); themes(); authors(); comparison(); };
})();
