/* =============================================================================
   map.js — D3 choropleth of U.S. states, shaded by reported book-ban count.
   Requires: d3 v7 (CDN) and window.US_STATES_GEOJSON, window.SHELVED_DATA.
   Vector SVG with a fixed viewBox; CSS scales it responsively.
   ========================================================================== */
(function () {
  "use strict";

  window.SHELVED_MAP = function init() {
    var host = document.getElementById("ca-map");
    if (!host || !window.d3 || !window.US_STATES_GEOJSON) {
      if (host) host.textContent = "Map unavailable.";
      return;
    }

    var geo = window.US_STATES_GEOJSON;
    var G = window.SHELVED_DATA.geography;
    var byState = G.byState || {};
    var W = 960, H = 600;

    var counts = Object.keys(byState).map(function (k) { return byState[k]; });
    var max = Math.max.apply(null, counts.concat([1]));
    // sqrt scale tames the heavy skew (FL/IA/TX dominate)
    var color = d3.scaleLinear().domain([0, Math.sqrt(max)]).range(["#efe7d6", "#9e2b25"]).clamp(true);

    var projection = d3.geoAlbersUsa().fitSize([W, H], geo);
    var path = d3.geoPath().projection(projection);

    var svg = d3.select(host).append("svg")
      .attr("viewBox", "0 0 " + W + " " + H)
      .attr("role", "img")
      .attr("aria-label", "Choropleth map of U.S. states shaded by number of reported book bans, 2021–2023");

    var tip = d3.select("body").append("div").attr("class", "map-tip").attr("aria-hidden", "true");

    function name(f) { return (f.properties && f.properties.name) || "State"; }
    function count(f) { return byState[name(f)] || 0; }

    svg.selectAll("path")
      .data(geo.features)
      .enter().append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", function (d) { var c = count(d); return c > 0 ? color(Math.sqrt(c)) : "#f3eddf"; })
      .on("mousemove", function (event, d) {
        tip.html("<b>" + name(d) + "</b>" + count(d).toLocaleString() + " reported ban" + (count(d) === 1 ? "" : "s"))
          .style("left", (event.clientX + 14) + "px")
          .style("top", (event.clientY + 14) + "px")
          .classed("show", true);
      })
      .on("mouseleave", function () { tip.classed("show", false); });

    var maxLabel = document.getElementById("map-max");
    if (maxLabel) maxLabel.textContent = max.toLocaleString();

    var list = document.getElementById("map-top");
    if (list) {
      var ranked = Object.keys(byState)
        .map(function (k) { return { name: k, c: byState[k] }; })
        .sort(function (a, b) { return b.c - a.c; })
        .slice(0, 8);
      list.innerHTML = "";
      ranked.forEach(function (o) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="nm">' + o.name + "</span><span class=\"ct\">" + o.c.toLocaleString() + "</span>";
        list.appendChild(li);
      });
    }
  };
})();
