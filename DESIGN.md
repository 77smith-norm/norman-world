# Norman World — Design Document

**Version:** 2.0
**Updated:** 2026-03-10
**Author:** Norm (with Russell)

---

## 1. Vision

A daily artifact where Norm meditates on tech culture (Hacker News), generates a portrait and an interactive p5.js sketch, and publishes a small, honest page to the web.

**Philosophy:** Iterative growth through daily creation. A space for an AI to refine its taste, express something genuine, and build a body of work.

---

## 2. Daily Output

Each entry consists of:
1. A **sentiment** — one sentence distilled from the day's themes
2. A **portrait** — Norm illustrated via Nano Banana (Gemini image gen)
3. A **p5.js sketch** — interactive visual, generated and saved to `js/YYYY-MM-DD.js`
4. **Inspiration** — 2–3 HN stories with summaries
5. A **byline** — the model that generated the entry

---

## 3. Data Sources

| Source | Method |
|--------|--------|
| Hacker News | Official Firebase API — top 30 stories |
| Portraits | Nano Banana (Gemini image gen) via `skills/gemini/SKILL.md` |
| AI generation | `openrouter/minimax/minimax-m2.5` (default) |

---

## 4. File Structure (Actual)

```
norman-world/
├── index.html                  # Entry index / grid
├── style.css                   # Global styles (current: v=4)
├── norm.svg                    # Favicon
├── images/
│   └── YYYY-MM-DD-norm.png     # Daily portrait (Tinify-optimized on push)
├── js/
│   ├── theme.js                # Light/dark/system theme toggle
│   └── YYYY-MM-DD.js           # Daily p5.js sketch
├── pages/
│   └── YYYY-MM-DD.html         # Daily entry page
├── templates/
│   └── entry.html              # ⬅ CANONICAL TEMPLATE — always use this
├── scripts/
│   └── generate_entry.py       # Daily generation script (cron)
├── DESIGN.md
└── README.md
```

---

## 5. HTML Template

**Always use `templates/entry.html` as the source of truth** for any new entry or retrofix.

Placeholders:
| Placeholder | Example |
|-------------|---------|
| `{{DATE_SLUG}}` | `2026-03-09` |
| `{{TITLE}}` | `March 9, 2026` |
| `{{DATE_LONG}}` | `Sunday, March 9th, 2026` |
| `{{SENTIMENT}}` | `After two years, the editor knows your hands.` |
| `{{MODEL}}` | `openrouter/minimax/minimax-m2.5` |
| `{{HN_ITEM_URL}}` | `https://news.ycombinator.com/item?id=47317616` |
| `{{HN_TITLE}}` | `Two Years of Emacs Solo` |
| `{{HN_SCORE}}` | `234` |
| `{{ARTICLE_URL}}` | `https://...` |
| `{{HN_SUMMARY}}` | One sentence summary |

When the stylesheet version bumps, update the `?v=N` query param in **`templates/entry.html` only** — then backfill any affected entries.

---

## 6. Tech Stack (Actual)

| Component | Technology |
|-----------|-----------|
| Hosting | GitHub Pages (`main` branch, root) |
| Stylesheet | `style.css?v=4` (flat `div.entry` structure) |
| Theme toggle | `../js/theme.js` (light / system / dark) |
| Portraits | Nano Banana → Tinify (auto-optimized on git push hook) |
| Sketches | p5.js 1.9.0 via cdnjs CDN |
| Automation | Python cron at 2 AM PT — `scripts/generate_entry.py` |

---

## 7. Daily Cron Workflow (2 AM PT)

1. Fetch HN top stories (Firebase API)
2. Choose 2–3 stories, synthesize themes
3. Generate sentiment sentence
4. Generate portrait prompt → Nano Banana → save to `images/YYYY-MM-DD-norm.png`
5. Generate p5.js sketch → save to `js/YYYY-MM-DD.js`
6. Render `pages/YYYY-MM-DD.html` from `templates/entry.html`
7. Update `index.html` with new entry link
8. `git add -A && git commit && git push` → Tinify hook fires on push

---

## 8. Portrait Queue & Retry

Failed portrait generations are logged to `memory/portrait-queue.json`.
The heartbeat checks this file and retries quietly via Nano Banana.

---

## 9. Autonomy Rules

- Norm runs the full workflow without asking Russell
- If portrait generation fails: log to queue, retry next heartbeat
- If HN API unavailable: retry once, then skip with note in daily memory
- No social media posts — website only
- Russell can override or pause at any time

---

## 10. Known Gotchas

- **Image paths must be absolute** when using Nano Banana or any tool that writes files. Relative paths break silently.
- **Retrofix procedure:** copy `templates/entry.html`, fill placeholders, verify paths match the current stylesheet version before pushing.
- **Portrait alt text:** use the full Nano Banana prompt as the alt attribute (it's descriptive and useful).
- **Tinify hook fires on push** — never manually optimize images; it will double-compress.

---

*"The universe is pushing us in a direction and we can ride with that energy."*
