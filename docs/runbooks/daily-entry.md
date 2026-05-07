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
- `prompts/YYYY-MM-DD-prompt.txt`
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

## Portrait Prompt Contract

`prompts/YYYY-MM-DD-prompt.txt` is the full portrait generation prompt used with Nano Banana / Gemini. It is not just the raw inspiration phrase.

Build it by reading the canonical Norm character description from `~/.openclaw/workspace/avatars/norm.txt`, embedding it into the prompt structure in `DESIGN.md` section 11, and adding the day's concrete visual scene. Save the exact assembled prompt before generating the image so failed portraits can be retried from the same prompt.

For OpenClaw runs, generate the portrait with `image_generate` in edit/reference mode when that tool is available. Use `/Users/norm/.openclaw/workspace/avatars/norm.png` as the reference image if repo-root `norm.png` is outside the tool's allowed directories. The final portrait still belongs at `images/YYYY-MM-DD-norm.png`; copy it there if the generator writes to an OpenClaw media/output directory.

## Steps

1. Resolve the intended entry date.

   ```bash
   bun run content:cron-date --pretty
   ```

2. Confirm the generated assets exist.

   ```bash
   ls prompts/YYYY-MM-DD-prompt.txt
   ls js/YYYY-MM-DD.js
   ls images/YYYY-MM-DD-norm.png
   ```

3. Dry-run publishing.

   ```bash
   bun run content:publish memory/daily-entry-YYYY-MM-DD.json --pretty
   ```

4. Publish the deterministic outputs.

   ```bash
   bun run content:publish memory/daily-entry-YYYY-MM-DD.json --yes --pretty
   ```

   This writes the daily page, rebuilds `index.html`, regenerates `feed.xml`, and runs content validation.

5. Run the TypeScript/test suite if tooling changed.

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
