/* ============================================================================
 *  SHELVED — Book Bans in California Elementary Schools
 *  data.js  —  SINGLE SOURCE OF TRUTH for every visualization on the site.
 * ----------------------------------------------------------------------------
 *  HOW TO USE
 *  ----------
 *  Every dataset below ships with SAMPLE PLACEHOLDER VALUES so the charts and
 *  map render with their real structure (axes, categories, legends, the
 *  California county map). The numbers are NOT real PEN America figures — they
 *  are scaffolding for you to replace.
 *
 *  To publish real findings:
 *    1. Replace the `values` (and county `incidents`) with your figures from
 *       the PEN America Index of School Book Bans (California, elementary,
 *       2021–2025).
 *    2. Set the dataset's `placeholder` flag to false.
 *    3. (Optional) Replace the [X] markers in index.html prose with the same
 *       numbers.
 *
 *  When `placeholder` is true, the visualization shows a striped style and an
 *  "Illustrative placeholder" badge so no one mistakes the scaffold for data.
 * ==========================================================================*/

window.SHELVED_DATA = {

  /* ---- 1. OVERALL TRENDS — book challenges per year ---------------------- */
  timeline: {
    placeholder: true,
    title: "Reported book challenges in California elementary schools, 2021–2025",
    labels: ["2021", "2022", "2023", "2024", "2025"],
    // SAMPLE PLACEHOLDER VALUES — replace with real per-year counts.
    values: [38, 52, 61, 29, 17],
    // Year AB 1078 took effect — annotated on the chart.
    annotation: { year: "2023", label: "AB 1078 enacted" }
  },

  /* ---- 2. GEOGRAPHIC DISTRIBUTION — incidents by county ------------------ */
  //  Map renders all 58 CA counties. `incidents` is keyed by 5-digit county
  //  FIPS code. Any county not listed is treated as 0 reported incidents.
  geography: {
    placeholder: true,
    title: "Reported challenge incidents by county, 2021–2025",
    // SAMPLE PLACEHOLDER VALUES — replace with real per-county counts.
    incidents: {
      "06059": 14, // Orange
      "06071": 11, // San Bernardino  (Inland Empire)
      "06065": 9,  // Riverside       (Inland Empire)
      "06029": 6,  // Kern
      "06073": 4,  // San Diego
      "06067": 3,  // Sacramento
      "06019": 3,  // Fresno
      "06037": 2,  // Los Angeles
      "06085": 1,  // Santa Clara
      "06001": 1   // Alameda
    }
  },

  /* ---- 3. THEMES UNDER ATTACK — share of challenges by theme ------------- */
  themes: {
    placeholder: true,
    title: "Challenged titles by theme",
    note: "Titles may address more than one theme; shares are illustrative.",
    labels: ["LGBTQ+ identity", "Race / ethnicity", "Gender", "Sexuality", "History"],
    // SAMPLE PLACEHOLDER VALUES (percentages) — replace with real shares.
    values: [41, 27, 14, 11, 7]
  },

  /* ---- 4. AFFECTED AUTHORS — by identity --------------------------------- */
  authors: {
    placeholder: true,
    title: "Challenged authors by identity",
    labels: [
      "Authors of color",
      "LGBTQ+ authors",
      "Both (POC & LGBTQ+)",
      "Neither / not reported"
    ],
    // SAMPLE PLACEHOLDER VALUES (percentages) — replace with real shares.
    values: [34, 22, 18, 26]
  },

  /* ---- 5. CRITICAL CONCLUSION — California vs. national average ---------- */
  comparison: {
    placeholder: true,
    title: "California vs. national average, challenges per year",
    labels: ["2021", "2022", "2023", "2024", "2025"],
    series: [
      // SAMPLE PLACEHOLDER VALUES — replace with real figures.
      { name: "California",       values: [38, 52, 61, 29, 17] },
      { name: "National average", values: [61, 95, 140, 118, 102] }
    ]
  }
};
