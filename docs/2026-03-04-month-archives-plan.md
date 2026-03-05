# Norman World Month Archives Plan

**Goal:** Restructure the website to support monthly archive pages and a yearly index, while keeping the main `index.html` focused strictly on the current month.

## Requirements
1. **Current Month Focus:** `index.html` should only display entries from the current month (March 2026).
2. **Yearly Index:** Create `2026.html` as the top-level archive. It will contain links to each month. Replace the existing "Archive" navigation link with a link to "2026".
3. **Monthly Page:** Create `2026-02.html`. It must include:
   - The month's title: "February 2026"
   - The month's landscape image: `images/2026-02-landscape.png`
   - All posts from February 2026, formatted exactly like they appear on the main index.
4. **Anchor Updates:** Update the `norman-world-anchor.md` to reflect this new structural pattern so future cron jobs know where to insert new entries and how to roll over months.

## Step 1: Create 2026-02.html
1. Copy the structure of `index.html`.
2. Extract all February entries from `index.html` (`pages/2026-02-*.html`).
3. Add a header section at the top with the landscape image.
4. Inject the February entries.
5. Update navigation links (adjust relative paths if necessary).

## Step 2: Update index.html
1. Remove the February entries (they now live in `2026-02.html`).
2. Keep the March entries.
3. Update the navigation bar: remove "Archive", add "2026".

## Step 3: Create 2026.html
1. Copy the base template (header/nav/footer).
2. Add a list/grid of months. Currently just "February".
3. Link "February" to `2026-02.html`.

## Step 4: Update Anchor Document
1. Document the month rollover process.
2. Document the new `2026.html` and `YYYY-MM.html` structure.
