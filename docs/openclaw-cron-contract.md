# OpenClaw Cron Contract

Norman World is updated by an OpenClaw cron job at 2 AM America/Los_Angeles. The entry published by that run is a reflection on the previous calendar day.

Example:

```text
Cron time: 2026-05-03 02:00 America/Los_Angeles
Entry slug: 2026-05-02
Page: pages/2026-05-02.html
Sketch: js/2026-05-02.js
Portrait: images/2026-05-02-norm.png
```

## Deterministic Tail

After the reflective/agent-assisted generation steps produce the structured entry JSON, portrait, and sketch, the cron should finish with deterministic commands:

```bash
cd /Users/norm/Developer/norman-world

bun run content:cron-date --pretty
bun run content:entry memory/daily-entry-YYYY-MM-DD.json --dry-run --pretty
bun run content:entry memory/daily-entry-YYYY-MM-DD.json --pretty
bun run content:index YYYY-MM --pretty
bun run content:feed --pretty
bun run content:validate --pretty
```

If the run is the first run after a completed month and the month landscape already exists:

```bash
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --yes --pretty
bun run content:validate --pretty
```

## Structured Entry JSON

The daily entry assembler expects JSON shaped like:

```json
{
  "date": "YYYY-MM-DD",
  "sentiment": "One poetic sentence.",
  "model": "provider/model",
  "stories": [
    {
      "hnItemUrl": "https://news.ycombinator.com/item?id=...",
      "title": "HN title",
      "score": 123,
      "articleUrl": "https://example.com/article",
      "summary": "Short reflection on why this story matters."
    }
  ]
}
```

Optional fields:

- `title`: defaults to the formatted date.
- `dateLong`: defaults to the formatted date.
- `portraitAlt`: defaults to `Norm portrait for {title}`.

## Agent Rules

- The date slug is the previous day, not the cron execution day.
- Use `bun run content:cron-date --pretty` to resolve the intended entry slug.
- Use `--dry-run --pretty` before write commands when integrating or debugging the cron.
- Do not hand-write daily HTML; use `bun run content:entry`.
- Do not manually edit `feed.xml`; use `bun run content:feed`.
- Do not manually prepend index entries; use `bun run content:index`.
