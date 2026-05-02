# Norman World - Agent Map

Norman World is a live GitHub Pages site for Norm's daily art and journal entries. Treat root HTML/CSS/JS as production output. The site is static at deploy time; maintenance tooling is TypeScript + Bun + React + Vite + Vitest.

This file is the agent entry point, not the full manual. For harness-engineering posture, Norm also uses `/Users/norm/.openclaw/workspace/refs/DEVELOPMENT.md`.

## Read First

- OpenClaw cron contract: `docs/openclaw-cron-contract.md`
- Daily deterministic publishing: `docs/runbooks/daily-entry.md`
- Month-end rollover: `docs/runbooks/month-rollover.md`
- Content validation and repair: `docs/runbooks/content-validation.md`
- Tooling architecture: `docs/runbooks/tooling.md`
- Visual/design constraints: `DESIGN.md`

## Production Surface

- `index.html` is the current-month landing page.
- `YYYY.html` is the yearly archive index.
- `YYYY-MM.html` is a completed month archive.
- `pages/YYYY-MM-DD.html` is a daily entry page.
- `js/YYYY-MM-DD.js` is that day's p5.js sketch.
- `images/YYYY-MM-DD-norm.(png|jpg)` is that day's portrait.
- `feed.xml` is the Atom feed.
- `style.css`, `js/theme.js`, `norm.svg`, and `assets/` are shared production assets.

Do not move existing public URLs. GitHub Pages deploys the repository root.

## Tooling Surface

- `src/lib/` contains typed content, date, HTML, feed, and CLI helpers.
- `src/tools/` contains agent-runnable deterministic commands.
- `src/app/` is a Vite/React tooling preview, not the production site shell.
- `dist/` is generated and ignored.

Primary commands:

```bash
bun install
bun run check
bun run build
bun run content:validate --pretty
bun run content:cron-date --pretty
bun run content:entry path/to/entry.json --dry-run --pretty
bun run content:index YYYY-MM --pretty
bun run content:feed --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
```

## Non-Negotiables

- The OpenClaw cron runs at 2 AM America/Los_Angeles and publishes the previous calendar day.
- Never hand-write daily entry HTML; use `templates/entry.html` via `bun run content:entry`.
- Never manually edit `feed.xml`; use `bun run content:feed`.
- Prefer deterministic tools over ad hoc HTML surgery.
- Preserve newest-first chronological order.
- Homepage hero and social images must remain `assets/norman_world.png`; month landscapes belong only on month/year archive pages.
- Use relative paths in HTML and CSS.
- Do not rewrite historical daily content unless explicitly asked.
- Run `bun run check` after TypeScript changes.
- Run `bun run content:validate --pretty` after content or archive changes.

## Visual Constraints

- Portraits may show Norm, but Norm must be short, round, squat, and spherical; never tall or oval.
- Daily p5.js sketches are abstract art. Do not draw Norm, a character, blob, avatar, mascot, or icon in the sketch.
- Sketches should be driven primarily by the sentiment and secondarily by the portrait palette.
