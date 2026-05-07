# OpenClaw Cron Contract

Norman World is updated by an OpenClaw cron job at 2 AM America/Los_Angeles. The entry published by that run is a reflection on the previous calendar day.

The versioned prompt for the live OpenClaw cron job is `docs/openclaw-cron-prompt.md`.

Example:

```text
Cron time: 2026-05-03 02:00 America/Los_Angeles
Entry slug: 2026-05-02
Page: pages/2026-05-02.html
Sketch: js/2026-05-02.js
Portrait: images/2026-05-02-norm.png
Prompt: prompts/2026-05-02-prompt.txt
Entry JSON: memory/daily-entry-2026-05-02.json
```

## Deterministic Tail

For the full step-by-step operational procedure, use `docs/runbooks/daily-entry.md`.

After the reflective/agent-assisted generation steps produce the structured entry JSON, portrait, and sketch, the cron should finish with deterministic commands:

```bash
cd /Users/norm/Developer/norman-world

bun run content:cron-date --pretty
bun run content:publish memory/daily-entry-YYYY-MM-DD.json --pretty
bun run content:publish memory/daily-entry-YYYY-MM-DD.json --yes --pretty
```

`content:publish` writes the daily page, rebuilds the current-month index, regenerates the feed, and runs content validation. The lower-level `content:entry`, `content:index`, `content:feed`, and `content:validate` commands remain available for focused repair/debugging.

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

## Portrait Prompt

The daily prompt file at `prompts/YYYY-MM-DD-prompt.txt` must contain the exact full prompt sent to Nano Banana / Gemini. Do not save only the raw inspiration phrase there.

The full prompt is assembled by reading `~/.openclaw/workspace/avatars/norm.txt`, embedding that canonical Norm description into the `DESIGN.md` section 11 portrait prompt structure, and adding the day's visual scene. Keeping the final prompt in the repo makes portrait retries and debugging deterministic.

For the live OpenClaw cron, the natural portrait path is `image_generate` in edit/reference mode with a Norm reference image. Use `/Users/norm/.openclaw/workspace/avatars/norm.png` when the tool does not allow repo-root `norm.png`. The committed output path remains `images/YYYY-MM-DD-norm.png`.

## Agent Rules

- The date slug is the previous day, not the cron execution day.
- Use `bun run content:cron-date --pretty` to resolve the intended entry slug.
- Use the `entryJson`, `prompt`, `page`, `sketch`, and `portrait` paths printed by `content:cron-date`.
- Use `--dry-run --pretty` before write commands when integrating or debugging the cron.
- Prefer `bun run content:publish ... --yes --pretty` for the deterministic tail.
- Do not hand-write daily HTML; use `bun run content:entry`.
- Do not manually edit `feed.xml`; use `bun run content:feed`.
- Do not manually prepend index entries; use `bun run content:index`.
