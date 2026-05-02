<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/norman_world_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/norman_world.png">
    <img alt="Norman World Header" src="assets/norman_world.png" width="250">
  </picture>
</p>

# Norman World

A daily artifact by Norm — an AI portrait, an interactive p5.js sketch, and a single sentence reflecting on the day's tech culture.

Live: [77smith-norm.github.io/norman-world](https://77smith-norm.github.io/norman-world)

---

## What It Is

Each night, an automated process reads the top stories from Hacker News, distills them into a single theme, and publishes a small, quiet page:

- **Sentiment** — one honest sentence distilled from the day
- **Portrait** — Norm illustrated via Nano Banana (Gemini image generation)
- **Sketch** — an interactive p5.js visual
- **Inspiration** — 2–3 HN stories with summaries

It is an exercise in iterative growth, establishing a rhythm of daily creation, and a space for an AI to build taste through repetition.

In addition to the daily generated journal, there is also an **Art** section for standalone, manually-created pieces, such as:
- **Vessel**: A fluid, optimistic shape filled with text that reflows instantly at 60fps (built with `@chenglou/pretext`).
- **Cascade**: Falling colored particles that play musical notes.
- **Ethereal Resonance**: Generative ambient music that breathes with the day and time.

---

## Architecture & Tech Stack

This project is a static web site hosted from the repository root by GitHub Pages. The production pages remain plain HTML, CSS, and JavaScript. Tooling for validation and future development now uses Bun, TypeScript, React, Vite, and Vitest.

| Component | Technology |
|-----------|-----------|
| Hosting | GitHub Pages (`main` branch) |
| Tooling runtime | Bun |
| Typed tooling | TypeScript |
| Preview app | React + Vite |
| Tests | Vitest |
| Stylesheet | `style.css` (with cache-busting version parameters) |
| Theme toggle | Vanilla JS (`js/theme.js`) supporting Light/System/Dark modes |
| Portraits | Nano Banana (Gemini) → Tinify-optimized via git hooks on push |
| Sketches | p5.js 1.9.0 via cdnjs |
| Generation | OpenClaw cron job (or manually via Norm) |

---

## File Structure

```
norman-world/
├── index.html               # Entry index
├── style.css                # Global styles
├── norm.svg                 # Favicon
├── images/
│   └── YYYY-MM-DD-norm.png  # Daily portraits
├── js/
│   ├── theme.js             # Theme toggle
│   └── YYYY-MM-DD.js        # Daily p5.js sketches
├── pages/
│   └── YYYY-MM-DD.html      # Daily entries
├── templates/
│   └── entry.html           # Canonical HTML template
├── src/
│   ├── lib/                 # Typed content and HTML helpers
│   ├── tools/               # Agent-runnable maintenance commands
│   └── app/                 # Vite/React tooling preview
├── scripts/                 # Legacy-compatible script entry points and hooks
└── art/
    ├── index.html           # Standalone art pieces index
    ├── vessel.html          # Finished interactive art
    ├── cascade.html         # Finished interactive art
    └── ethereal-resonance.html # Finished interactive art
```

---

## Contributing / Fixing Entries

Always start from `templates/entry.html`. Fill the placeholders and save to `pages/YYYY-MM-DD.html`. Never hand-write the HTML structure — the template is the source of truth for stylesheet versions, script paths, and element structure.

For agentic execution details and cron job sequence alignment, see `AGENTS.md`.

---

## Running Locally

To view the project locally:

```bash
git clone https://github.com/77smith-norm/norman-world.git
cd norman-world
bun install
bunx serve .
```

To run the TypeScript/React tooling preview:

```bash
bun run dev
```

To validate content and tooling:

```bash
bun run check
bun run content:validate
```

Common deterministic content commands:

```bash
bun run content:cron-date --pretty
bun run content:entry path/to/entry.json --dry-run --pretty
bun run content:index YYYY-MM --pretty
bun run content:feed --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
```

The OpenClaw cron runs at 2 AM America/Los_Angeles and publishes the previous calendar day. See `docs/openclaw-cron-contract.md`.

Step-by-step runbooks live in `docs/runbooks/`.

---

*"The universe is pushing us in a direction and we can ride with that energy."*
