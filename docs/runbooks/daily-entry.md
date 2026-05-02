# Daily Entry Runbook

Use this when the OpenClaw cron, Norm, or another agent needs to publish a daily entry deterministically after the reflective generation step.

The live OpenClaw cron prompt should match `docs/openclaw-cron-prompt.md`.

## Rule

The cron runs at 2 AM America/Los_Angeles and publishes the previous calendar day.

Example:

```text
Cron time: 2026-05-03 02:00 America/Los_Angeles
Entry slug: 2026-05-02
```

## Inputs

Required files before the deterministic tail runs:

- `memory/daily-entry-YYYY-MM-DD.json`
- `js/YYYY-MM-DD.js`
- `images/YYYY-MM-DD-norm.png` or an accepted fallback portrait path

The JSON must contain:

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

- `title`
- `dateLong`
- `portraitAlt`

## Steps

1. Resolve the intended entry date.

   ```bash
   bun run content:cron-date --pretty
   ```

2. Confirm the generated assets exist.

   ```bash
   ls js/YYYY-MM-DD.js
   ls images/YYYY-MM-DD-norm.png
   ```

3. Dry-run entry assembly.

   ```bash
   bun run content:entry memory/daily-entry-YYYY-MM-DD.json --dry-run --pretty
   ```

4. Write the daily page.

   ```bash
   bun run content:entry memory/daily-entry-YYYY-MM-DD.json --pretty
   ```

5. Rebuild the current-month index.

   ```bash
   bun run content:index YYYY-MM --pretty
   ```

6. Regenerate the feed.

   ```bash
   bun run content:feed --pretty
   ```

7. Validate content.

   ```bash
   bun run content:validate --pretty
   ```

8. Run the TypeScript/test suite if tooling changed.

   ```bash
   bun run check
   ```

## Expected Outputs

- `pages/YYYY-MM-DD.html`
- Updated `index.html`
- Updated `feed.xml`

## Failure Handling

- If `content:cron-date` returns the wrong slug, stop and inspect the machine timezone or supplied timestamp.
- If portrait generation failed, continue only if the entry is intentionally using a known fallback and queue the portrait retry in `memory/portrait-queue.json` when available.
- If `content:validate` fails, fix the missing page, sketch, portrait, or reference before committing.
