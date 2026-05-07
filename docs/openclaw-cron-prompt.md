[cron:c11ae7c5-7c1a-4e05-9eda-dc6730f199a1 Norman World Daily] Create a Norman World daily entry for the previous calendar day.

DATE RULE:
- This cron runs at 02:00 America/Los_Angeles.
- The entry date is always the previous Los Angeles calendar day, not the cron execution day.
- First run `bun run content:cron-date --pretty` from `/Users/norm/Developer/norman-world` and use its `entryDate` and `entryMonth` values everywhere.

READ FIRST:
1. `/Users/norm/Developer/norman-world/AGENTS.md`
2. `/Users/norm/Developer/norman-world/docs/openclaw-cron-contract.md`
3. `/Users/norm/Developer/norman-world/docs/runbooks/daily-entry.md`
4. `/Users/norm/.openclaw/workspace/memory/norman-world-anchor.md`
5. `/Users/norm/Developer/norman-world/DESIGN.md`

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
   e. Generate `images/YYYY-MM-DD-norm.png` using Nano Banana / Gemini with the exact prompt saved in `prompts/YYYY-MM-DD-prompt.txt`.
      - In OpenClaw, use the `image_generate` tool in edit/reference mode when it is available.
      - Use `/Users/norm/.openclaw/workspace/avatars/norm.png` as the reference image if repo-root `norm.png` is not allowed by the tool sandbox.
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

CONSTRAINTS:
- Prefer deterministic Bun content tools over manual HTML/feed/index edits.
- Keep the homepage hero and social images as `assets/norman_world.png`; month landscapes belong only on archive pages.
- Never hand-write daily HTML structure; use `bun run content:entry`.
- Never manually edit `feed.xml`; use `bun run content:feed`.
- Do not use `ddgr` or broad web search for extra inspiration; Hacker News stories are enough.
- If one creative step fails, continue to deterministic validation and report the failure clearly.
- Return a short summary: entry date, sentiment, stories used with HN links, commit SHA, portrait status, validation status, deployment status.
