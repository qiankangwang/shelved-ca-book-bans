/* =============================================================================
   map.js — D3 choropleth of California's 58 counties, sized by incident count.
   Requires: d3 v7 (CDN) and window.CA_COUNTIES_GEOJSON, window.SHELVED_DATA.
   Vector SVG with a fixed viewBox; CSS scales it responsively (no resize math).
   ========================================================================== */
(function () {
  "use strict";

  window.SHELVED_MAP = function init() {
    var host = document.getElementById("ca-map");
    if (!host || !window.d3 || !window.CA_COUNTIES_GEOJSON) {
      if (host) host.textContent = "Map unavailable.";
      return;
    }

    var geo = window.CA_COUNTIES_GEOJSON;
    var G = window.SHELVED_DATA.geography;
    var incidents = G.incidents || {};
    var W = 600, H = 690;

    var max = Math.max.apply(null, Object.keys(incidents).map(function (k) { return incidents[k]; }).concat([1]));
    var color = d3.scaleLinear().domain([0, max]).range(["#efe7d6", "#9e2b25"]).clamp(true);

    var projection = d3.geoMercator().fitSize([W, H], geo);
    var path = d3.geoPath().projection(projection);

    var svg = d3.select(host).append("svg")
      .attr("viewBox", "0 0 " + W + " " + H)
      .attr("role", "img")
      .attr("aria-label", "Choropleth map of California counties shaded by number of reported book-challenge incidents");

    var tip = d3.select("body").append("div").attr("class", "map-tip").attr("aria-hidden", "true");

    function fips(f) { return (f.id || (f.properties && f.properties.fips) || "").toString(); }
    function name(f) { return (f.properties && f.properties.name) || "County"; }
    function count(f) { return incidents[fips(f)] || 0; }

    svg.selectAll("path")
      .data(geo.features)
      .enter().append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", function (d) { var c = count(d); return c > 0 ? color(c) : "#f3eddf"; })
      .on("mousemove", function (event, d) {
        tip.html("<b>" + name(d) + " County</b>" + count(d) + " reported incident" + (count(d) === 1 ? "" : "s"))
          .style("left", (event.clientX + 14) + "px")
          .style("top", (event.clientY + 14) + "px")
          .classed("show", true);
      })
      .on("mouseleave", function () { tip.classed("show", false); });

    /* scale ramp labels */
    var maxLabel = document.getElementById("map-max");
    if (maxLabel) maxLabel.textContent = max + (G.placeholder ? "*" : "");

    /* top-counties ranked list */
    var list = document.getElementById("map-top");
    if (list) {
      var byCount = geo.features
        .map(function (f) { return { name: name(f), c: count(f) }; })
        .filter(function (o) { return o.c > 0; })
        .sort(function (a, b) { return b.c - a.c; })
        .slice(0, 8);
      list.innerHTML = "";
      byCount.forEach(function (o) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="nm">' + o.name + " County</span><span class=\"ct\">" + o.c + "</span>";
        list.appendChild(li);
      });
      if (!byCount.length) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="nm">No counties populated yet</span><span class="ct">—</span>';
        list.appendChild(li);
      }
    }
  };
})();
