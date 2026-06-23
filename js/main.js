/* =============================================================================
   main.js — site behaviors: scroll progress, sticky-nav active state,
   mobile menu, reveal-on-scroll, bibliography accordion, viz init.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- scroll progress bar ---------------------------------------------- */
  var progress = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100).toFixed(2) + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav toggle ------------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- active section in nav (scroll spy) ------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = "#" + en.target.id;
          navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- reveal-on-scroll -------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- bibliography accordion ------------------------------------------- */
  Array.prototype.slice.call(document.querySelectorAll(".cite__bar")).forEach(function (bar) {
    bar.addEventListener("click", function () {
      var cite = bar.closest(".cite");
      var open = cite.classList.toggle("is-open");
      bar.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---- hero redaction-bar motif (decorative, deterministic) ------------- */
  var rd = document.querySelector(".hero__redactions");
  if (rd) {
    var widths = [22, 38, 15, 47, 30, 41, 19, 34, 26, 44];
    var tops = [12, 24, 33, 41, 52, 60, 69, 77, 86, 18];
    var lefts = [55, 62, 58, 66, 60, 70, 57, 64, 72, 50];
    for (var i = 0; i < widths.length; i++) {
      var b = document.createElement("span");
      b.className = "bar";
      b.style.width = widths[i] + "%";
      b.style.top = tops[i] + "%";
      b.style.left = lefts[i] + "%";
      rd.appendChild(b);
    }
  }

  /* ---- init visualizations ---------------------------------------------- */
  function start() {
    try { if (window.SHELVED_CHARTS) window.SHELVED_CHARTS(); } catch (e) { console.error("charts:", e); }
    try { if (window.SHELVED_MAP) window.SHELVED_MAP(); } catch (e) { console.error("map:", e); }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();
