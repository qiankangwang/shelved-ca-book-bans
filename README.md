# Shelved — Book Bans in California Elementary Schools (2021–2025)

A static, no-build digital-humanities project examining how book bans in California
public elementary schools evolved between 2021 and 2025 — their geographic
distribution, targeted themes, and affected authors — read through **Critical Race
Theory**, **Data Feminism**, and **Science & Technology Studies**.

**Data source:** PEN America, *Index of School Book Bans*, 2021–2025.

## Live site

Once GitHub Pages is enabled: **https://qiankangwang.github.io/shelved-ca-book-bans/**

## What's here

A single scrollytelling page (`index.html`) with five interactive visualizations:

| # | Figure | Built with | Data in `js/data.js` |
|---|--------|-----------|----------------------|
| 1 | Challenges per year (timeline) | Chart.js | `timeline` |
| 2 | California county map | D3 (choropleth) | `geography.incidents` |
| 3 | Themes under attack | Chart.js (doughnut) | `themes` |
| 4 | Affected authors | Chart.js (bar) | `authors` |
| 5 | California vs. national average | Chart.js (bar) | `comparison` |

## Filling in the data

Every visualization currently ships with **sample placeholder values** and an
"Illustrative placeholder" badge, and the prose keeps literal `[X]` markers — this is
intentional scaffolding. To publish real findings:

1. Open **`js/data.js`** and replace the `values` (and per-county `incidents`, keyed by
   5-digit county FIPS code) with your figures from the PEN America index.
2. Set each dataset's `placeholder` flag to `false`.
3. Replace the `[X]` / `[X%]` markers in `index.html` with the same numbers.

No build step, bundler, or server is required — it's plain HTML/CSS/JS.

## Local preview

Just open `index.html` in a browser (the map data is inlined, so it works from
`file://`; the Chart.js and D3 libraries load from a CDN, so you need an internet
connection).

## Accessibility

The site targets **WCAG 2.1 AA**. A floating ♿ control (bottom-right) offers:

- **Read-aloud** (text-to-speech) for every section, via the Web Speech API
- Adjustable **text size**, **dark mode**, and a **high-contrast** theme
- **Readable spacing/font** and a **reduce-motion** option (also honours the OS setting)
- **Always-underline links**
- Full **keyboard operation** with visible focus, a skip link, and ARIA live status

Every chart and the map also ships a **text data-table alternative** ("Show data
table") and descriptive labels, so the findings are available without sight of the
graphics. Preferences are saved in `localStorage` only — nothing leaves the browser.

## Data, license & citation

- **Download the data** from the *Data & Methods* section (CSV or JSON, generated live
  from `js/data.js`), alongside a **data dictionary**.
- **Code** is licensed **MIT**; **content** (prose & visuals) is **CC BY 4.0** — see
  [`LICENSE`](LICENSE).
- **Citation:** a machine-readable [`CITATION.cff`](CITATION.cff) is included; see the
  *Accessibility · Citation · Reuse* section for a suggested citation.
- **Privacy:** no cookies, no analytics, no trackers.
- **Source data:** PEN America, *Index of School Book Bans* (https://pen.org/book-bans/).

## Credits

- Charts: [Chart.js](https://www.chartjs.org/) · Map: [D3](https://d3js.org/)
- County geometry: U.S. Census Bureau via [us-atlas](https://github.com/topojson/us-atlas)
- Fonts: Fraunces, Newsreader, Inter (Google Fonts)
