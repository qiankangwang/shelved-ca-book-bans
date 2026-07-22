# Shelved — Book Bans in U.S. Public Schools (2021–2023)

A static, no-build digital-humanities project examining book bans in U.S. public
schools between 2021 and 2023 — their distribution by state, the themes most often
targeted, and the authors most affected — read through **Critical Race Theory**,
**Data Feminism**, and **Science & Technology Studies**.

**Data:** cleaned from PEN America's *Index of School Book Bans* — **15,960 ban
records across 43 states, 2021–2023**, with an AI-assigned theme per title.
The project was scoped to 2021–2025; complete, usable records were available
only through 2023, so every figure is bounded to 2021–2023 (see *Methods*).

## Live site

**https://wangkant.github.io/shelved-ca-book-bans/**

## What's here

A single scrollytelling page (`index.html`) with five interactive visualizations:

| # | Figure | Built with | Data in `js/data.js` |
|---|--------|-----------|----------------------|
| 1 | Most banned themes | Chart.js (doughnut) | `themes` |
| 2 | Book Bans between 2021 and 2023 | Chart.js (line) | `timeline` |
| 3 | Most-challenged authors | Chart.js (bar) | `authors` |
| 4 | Top states vs. national average | Chart.js (bar) | `comparison` |
| 5 | U.S. states map | D3 (choropleth) | `geography.byState` |

All figures show **real aggregated counts** computed from the cleaned dataset.

A closing **Documentation** section adds four photographs (in `img/`) — children
reading, a stack of banned titles, the most-banned books of fall 2022, and a
school-library shelf — credited to Bookshop.org and PEN America / EdWeek.

## Data files

- **`data/final_books_info_cleaned.csv`** — the cleaned, book-level source dataset
  (15,960 rows, one per reported ban), downloadable in full from the site.
- **`js/data.js`** — the aggregated figures that drive the charts (the single source
  of truth for every visualization), computed from the CSV above.

## Updating the data

To refresh the figures, re-aggregate `data/final_books_info_cleaned.csv` and replace
the values in `js/data.js` — e.g. `themes` (counts per theme), `geography.byState`
(counts keyed by full state name), or `authors` (top authors by count). No build
step, bundler, or server is required.

## Local preview

Just open `index.html` in a browser (the map geometry is inlined, so it works from
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

- **Download the data** from the *Methods* section: the **full dataset**
  (`data/final_books_info_cleaned.csv`) plus CSV/JSON of the aggregated chart counts
  (generated live from `js/data.js`), alongside a **data dictionary**.
- **Code** is licensed **MIT**; **content** (prose & visuals) is **CC BY 4.0** — see
  [`LICENSE`](LICENSE).
- **Citation:** a machine-readable [`CITATION.cff`](CITATION.cff) is included; see the
  *Accessibility · Citation · Reuse* section for a suggested citation.
- **Privacy:** no cookies, no analytics, no trackers.
- **Source data:** PEN America, *Index of School Book Bans* (https://pen.org/book-bans/).

## Credits

- Charts: [Chart.js](https://www.chartjs.org/) · Map: [D3](https://d3js.org/)
- State geometry: U.S. Census Bureau via [us-atlas](https://github.com/topojson/us-atlas)
- Fonts: Fraunces, Newsreader, Inter (Google Fonts)
