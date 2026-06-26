/* ============================================================================
 *  SHELVED — Book Bans in U.S. Public Schools (2021–2025... data: 2021–2023)
 *  data.js  —  SINGLE SOURCE OF TRUTH for every visualization.
 * ----------------------------------------------------------------------------
 *  Figures are REAL, aggregated from the project's cleaned PEN America dataset
 *  (final_books_info_cleaned.csv): 15,960 ban records across 43 states,
 *  2021–2023, with an AI-assigned theme per title.
 *  To update, re-run the aggregation and replace the values below.
 * ==========================================================================*/

window.SHELVED_DATA = {

  meta: {
    totalBans: 15960,
    states: 43,
    yearsLabel: "2021–2023",
    natlAvgPerState: 371
  },

  /* ---- 1. OVERALL TRENDS — bans per year -------------------------------- */
  timeline: {
    placeholder: false,
    title: "Reported book bans per year, U.S. public schools",
    labels: ["2021", "2022", "2023"],
    values: [2532, 3362, 10066]
  },

  /* ---- 2. GEOGRAPHIC DISTRIBUTION — bans by state ----------------------- */
  //  Rendered as a U.S. states choropleth; keyed by full state name.
  geography: {
    placeholder: false,
    title: "Reported bans by state, 2021–2023",
    byState: {
      "Florida": 6535, "Iowa": 3703, "Texas": 1964, "Pennsylvania": 664,
      "Wisconsin": 480, "Missouri": 417, "Tennessee": 394, "Utah": 325,
      "Virginia": 215, "South Carolina": 192, "North Carolina": 135,
      "Georgia": 110, "Kentucky": 103, "Maine": 97, "Michigan": 80,
      "Maryland": 65, "Idaho": 63, "Oregon": 57, "Alaska": 57, "Wyoming": 57,
      "Oklahoma": 45, "Kansas": 37, "North Dakota": 27, "New York": 25,
      "Mississippi": 22, "Indiana": 22, "Colorado": 8, "South Dakota": 7,
      "Illinois": 7, "New Jersey": 7, "Ohio": 7, "Nebraska": 6,
      "Washington": 5, "Arkansas": 5, "Minnesota": 3, "California": 3,
      "Montana": 3, "Massachusetts": 2, "West Virginia": 2,
      "Rhode Island": 1, "Vermont": 1, "New Hampshire": 1, "Louisiana": 1
    }
  },

  /* ---- 3. THEMES — bans by AI-assigned theme ---------------------------- */
  themes: {
    placeholder: false,
    title: "Banned titles by theme",
    note: "Themes assigned by an AI classifier; “Other / Unclear” is its residual bucket.",
    labels: [
      "Sexuality / Sex Education", "Violence / Trauma", "Race / Racism",
      "LGBTQ+ / Gender", "Mental Health", "Political / Social Issues",
      "Religion", "Other / Unclear"
    ],
    values: [3600, 2346, 1831, 1701, 684, 445, 245, 5108],
    chartExcludeOther: true   // omit "Other / Unclear" from the doughnut; keep it in the data table
  },

  /* ---- 4. AFFECTED AUTHORS — most-challenged authors -------------------- */
  authors: {
    placeholder: false,
    title: "Most-challenged authors",
    labels: [
      "Ellen Hopkins", "Sarah J. Maas", "Jodi Picoult", "John Green",
      "Toni Morrison", "Margaret Atwood", "Stephen King", "Lauren Myracle",
      "Colleen Hoover", "Elana K. Arnold"
    ],
    values: [791, 657, 213, 203, 197, 192, 186, 179, 176, 154]
  },

  /* ---- 5. SELECTED STATES vs. NATIONAL AVERAGE -------------------------- */
  comparison: {
    placeholder: false,
    title: "Top states vs. the national average",
    note: "Total bans, 2021–2023. The national average is per reporting state.",
    labels: ["Florida", "Iowa", "Texas", "Pennsylvania", "Wisconsin", "National avg / state"],
    values: [6535, 3703, 1964, 664, 480, 371],
    refIndex: 5   // index of the national-average bar (highlighted differently)
  }
};
