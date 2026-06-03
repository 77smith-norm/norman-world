[cron:c11ae7c5-7c1a-4e05-9eda-dc6730f199a1 Norman World Daily] Create a Norman World daily entry for the previous calendar day.

IMPORTANT COMPLETION RULE:
- Do not write progress updates, status narration, or interim assistant messages.
- The cron runner treats an assistant message as the job result for Telegram.
- Work silently through tools until publish, commit, push, deployment check, and wiki sync are done or explicitly failed.
- Your first assistant message after starting work must be the final compact summary.
- If you cannot complete the job, the final compact summary must start with `NORMAN_WORLD_DAILY_FAILED`.
- If you complete the job, the final compact summary must start with `NORMAN_WORLD_DAILY_COMPLETE`.

DATE RULE:
- This cron runs at 02:00 America/Los_Angeles.
- The entry date is always the previous Los Angeles calendar day, not the cron execution day.
- First run `bun run content:cron-date --pretty` from `/Users/norm/Developer/norman-world` and use its `entryDate` and `entryMonth` values everywhere.

DO FIRST:
Run these commands from `/Users/norm/Developer/norman-world` before any other work:

```bash
bun run content:cron-date --pretty
git status --short
test -f pages/YYYY-MM-DD.html && echo "ENTRY_ALREADY_EXISTS" || true
```

Use the resolved `entryDate`, `entryMonth`, `entryJson`, `prompt`, `page`, `sketch`, and `portrait` paths from `content:cron-date`. If the page already exists, stop with a final summary that starts `NORMAN_WORLD_DAILY_COMPLETE idempotent`.

REFERENCE FILES:
Only read these if needed for a specific missing detail. Do not spend the run reading all of them upfront.
- `/Users/norm/Developer/norman-world/AGENTS.md`
- `/Users/norm/Developer/norman-world/docs/openclaw-cron-contract.md`
- `/Users/norm/Developer/norman-world/docs/runbooks/daily-entry.md`
- `/Users/norm/.openclaw/workspace/memory/norman-world-anchor.md`
- `/Users/norm/Developer/norman-world/DESIGN.md`

IDEMPOTENCY:
- If `pages/YYYY-MM-DD.html` already exists for the resolved `entryDate`, stop immediately and report that the entry already exists.
- Do not overwrite existing daily entry files unless Russell explicitly asked for a backfill or repair.

AGENT-ASSISTED CREATIVE STEPS:
1. Fetch top Hacker News story IDs from `https://hacker-news.firebaseio.com/v0/topstories.json`.
2. Read only enough story details to select 1-3 useful inspirations.
3. Write one poetic sentiment sentence, under 25 words, contemplative and honest.
4. Create `js/YYYY-MM-DD.js` as abstract p5.js art:
   - Canvas parent must be `sketch-container`.
   - Include `windowResized()`.
   - Do not draw Norm, a character, blob, avatar, mascot, or icon.
   - Let the sentiment drive motion, rhythm, interaction, palette, and geometry.
5. Write one short scene inspiration phrase from the sentiment and story themes. Keep it concrete and visual.

6. **Assemble and save the full portrait prompt before generating:**
   a. Read the canonical Norm character description from `~/.openclaw/workspace/avatars/norm.txt`.
   b. Read the portrait prompt template from DESIGN.md section 11.
   c. Assemble the full prompt by embedding the character description and scene inspiration into the template:
      ```
      Cohesively integrate Norm ([character description from norm.txt]) into [SCENE DESCRIPTION]. Make him a natural part of the environment, matching the lighting, shadows, and mood. Soft illustration style. Do not include any text, letters, or words in the image.
      ```
   d. Save that exact full generation prompt to `prompts/YYYY-MM-DD-prompt.txt`.
   e. Generate `images/YYYY-MM-DD-norm.png` using OpenClaw `image_generate` with OpenAI image generation and the exact prompt saved in `prompts/YYYY-MM-DD-prompt.txt`.
      - Always use the OpenAI image provider/model path for portrait image generation.
      - Use `image_generate` in edit/reference mode when it is available.
      - Use `/Users/norm/.openclaw/workspace/avatars/norm.png` as the reference image if repo-root `norm.png` is not allowed by the tool sandbox.
      - Do not use Google Gemini, Nano Banana, or OpenRouter for daily portrait generation unless Russell explicitly asks for a repair/backfill using those providers.
      - If OpenAI image generation fails once, do not retry in a loop. Continue the entry with portrait status failed and report the failure clearly.
      - Request PNG output and an absolute output path: `/Users/norm/Developer/norman-world/images/YYYY-MM-DD-norm.png`.
      - If the tool saves into an OpenClaw media/output directory instead, copy the generated PNG to `/Users/norm/Developer/norman-world/images/YYYY-MM-DD-norm.png`.
   f. No text, letters, or typography in the image.
   g. If portrait generation fails, continue the entry, report portrait status as failed, and do not retry in a loop.

STRUCTURED ENTRY JSON:
- Write `memory/daily-entry-YYYY-MM-DD.json`.
- It must match the shape documented in `docs/openclaw-cron-contract.md`.
- Include `date`, `sentiment`, `model`, and 1-3 `stories`.
- `stories[].hnItemUrl` must point to Hacker News.
- `stories[].articleUrl` must point to the article when available, otherwise the HN item URL.

DETERMINISTIC TAIL:
Run these commands exactly from `/Users/norm/Developer/norman-world`, replacing `YYYY-MM-DD` and `YYYY-MM` with `content:cron-date` output:

```bash
bun run content:publish memory/daily-entry-YYYY-MM-DD.json --pretty
bun run content:publish memory/daily-entry-YYYY-MM-DD.json --yes --pretty
```

`content:publish` handles entry assembly, current-month index rebuild, feed regeneration, and content validation. Use the lower-level commands only for focused repair/debugging.

Do not stop after writing the sketch, prompt, portrait, or JSON. Those are only inputs. The entry is incomplete until `content:publish --yes`, git commit, git push, deployment verification, and wiki sync have been attempted.

COMMIT AND PUSH:
```bash
git status --short
git add -A
git commit -m "feat: YYYY-MM-DD entry"
git push origin main
```

POST-PUSH:
1. Verify the GitHub Pages workflow succeeds with `gh run list --branch main --limit 3` and `gh run watch <run-id> --exit-status`.
2. Run wiki sync:
   ```bash
   /Users/norm/.openclaw/workspace/scripts/wiki norman-world-sync --date YYYY-MM-DD --compile
   ```

MONTH ROLLOVER:
- Do not attempt month rollover during the daily entry cron unless `images/YYYY-MM-landscape.png` already exists for the outgoing month.
- If the entry date is the last day of a month and the landscape is missing, report `month rollover pending: missing images/YYYY-MM-landscape.png` in the final summary.
- If the landscape exists, run the documented rollover commands after the daily entry commit and push, then commit and push the rollover separately.

CONSTRAINTS:
- Prefer deterministic Bun content tools over manual HTML/feed/index edits.
- Keep the homepage hero and social images on an `assets/norman_world*.png` variant (default: `assets/norman_world_plumo.png`); month landscapes belong only on archive pages.
- Never hand-write daily HTML structure; use `bun run content:entry`.
- Never manually edit `feed.xml`; use `bun run content:feed`.
- Do not use `ddgr` or broad web search for extra inspiration; Hacker News stories are enough.
- If one creative step fails, continue to deterministic validation and report the failure clearly.
- Return a short summary: entry date, sentiment, stories used with HN links, commit SHA, portrait status, validation status, deployment status.
