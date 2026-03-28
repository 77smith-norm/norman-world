# Norman World - Agent Protocol

This repository contains the source code and content for the Norman World daily art and journal site. 
It is updated nightly via an OpenClaw cron job. 

## Project Architecture

This is a **static web project** hosted on GitHub Pages. There is no build step for the core daily entries (HTML/JS/CSS).

- **`index.html`**: The main entry point. Lists all daily entries.
- **`pages/YYYY-MM-DD.html`**: The daily entry pages.
- **`js/YYYY-MM-DD.js`**: The daily p5.js sketches.
- **`images/YYYY-MM-DD-norm.png`**: The daily Nano Banana generated portraits.
- **`templates/entry.html`**: The canonical template for generating new daily entries.
- **`art/`**: Contains standalone, finished art pieces (like Vessel, Cascade, Ethereal Resonance).

## Daily Cron Execution Steps

The nightly OpenClaw cron job performs the following sequence to generate a new entry. 
If you are asked to backfill or manually generate an entry, follow this exact sequence:

1. **Information Gathering:** Fetch top stories from Hacker News (Firebase API).
2. **Synthesis:** Select 2-3 stories and synthesize a unifying theme.
3. **Sentiment Generation:** Generate a single, poetic sentiment sentence distilling the day's theme.
4. **Portrait Generation:** Generate a portrait prompt based on the sentiment. Execute the Gemini CLI with the Nano Banana extension to generate the image. 
   - *Constraint:* The prompt must describe Norm as short, round, spherical, never tall or oval (refer to `DESIGN.md`).
   - Save the resulting image to `images/YYYY-MM-DD-norm.png`.
5. **Sketch Generation:** Generate an interactive p5.js visual sketch reflecting the theme.
   - Save the code to `js/YYYY-MM-DD.js`.
6. **HTML Assembly:** Read `templates/entry.html`. Replace all placeholders with the generated content (sentiment, image path, sketch path, HN summaries, model byline).
   - Save the assembled HTML to `pages/YYYY-MM-DD.html`.
7. **Index Update:** Prepend a new list item for the generated entry to the `<ul class="entry-list">` in `index.html`.
8. **Feed Update:** Prepend the entry to `feed.xml`.
9. **Commit & Push:** Execute `git add -A && git commit -m "feat: YYYY-MM-DD entry" && git push`.
   - *Note:* A `scripts/optimize_staged_pngs.py` pre-push hook automatically optimizes the PNG via Tinify before pushing.

## Harness Engineering Principles

- **No Build Step:** The core daily loop uses raw HTML, JS, and CSS. Keep it simple so the cron agent can reliably manipulate the DOM using string replacement or basic regex.
- **Idempotency:** The generation process should be repeatable. If a portrait fails (e.g., rate limits), the HTML can still be generated and the portrait backfilled later.
- **Failure Handling:** Portrait generation failures (Nano Banana 429/503 errors) should be caught. The entry generation should proceed, and the portrait should be queued in `memory/portrait-queue.json` for later retry by the heartbeat.

## Agent Guidelines

- Never hand-write the HTML structure for a new entry. Always start from `templates/entry.html`.
- When updating `index.html` or `art/index.html`, ensure chronological ordering (newest first).
- Image paths in CSS or HTML should always be relative (e.g., `../images/...`).
