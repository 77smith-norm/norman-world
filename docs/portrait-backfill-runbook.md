# Portrait Backfill Runbook

_Agent-optimized step-by-step for generating, integrating, and clearing a pending portrait._

## Context

When the daily cron portrait generation fails (rate limit, quota, timeout), the
prompt gets queued in `memory/portrait-queue.json`. This runbook covers the full
backfill process — from reading the prompt to clearing the queue.

There are two paths: **automated** (agent generates the image) and **manual**
(Russell provides the image). Steps differ at the generation phase.

---

## Step 1: Identify the Pending Portrait

```bash
cat /Users/norm/.openclaw/workspace/memory/portrait-queue.json
```

Each entry has `date` and `prompt`. The date is the Norman World entry date
(YYYY-MM-DD). This is the date you're backfilling for.

---

## Step 2: Read the Prompt

The full portrait generation prompt is also saved in the repo:

```bash
cat ~/Developer/norman-world/prompts/YYYY-MM-DD-prompt.txt
```

If the prompt file is missing, use the `prompt` field from the queue JSON.

---

## Step 3: Generate or Receive the Image

### Path A: Automated Generation (Gemini CLI + Nano Banana)

Use OpenClaw `image_generate` in edit/reference mode if the run has that tool available. Set:

- `prompt`: the exact full prompt from `prompts/YYYY-MM-DD-prompt.txt`
- `image`: `/Users/norm/.openclaw/workspace/avatars/norm.png` if repo-root `norm.png` is not allowed
- `outputFormat`: `png`
- `filename`: `/Users/norm/Developer/norman-world/images/YYYY-MM-DD-norm.png`

If OpenClaw writes the generated file to a media/output directory instead of the requested filename, copy the PNG to `images/YYYY-MM-DD-norm.png`.

Gemini CLI remains the fallback path when `image_generate` is unavailable:

1. Source nvm: `source ~/.nvm/nvm.sh && nvm use --lts`
2. Read the API key from openclaw.json at `skills.entries.gemini.env.NANOBANANA_GEMINI_API_KEY`
3. Run from the norman-world repo root:

```bash
cd ~/Developer/norman-world
NANOBANANA_GEMINI_API_KEY="<key>" /Users/norm/Library/pnpm/gemini \
  --yolo "Use edit_image on norm.png: [full prompt text]"
```

4. Nano Banana auto-names output files and saves to `nanobanana-output/`.
5. Move the result to the correct location:

```bash
mkdir -p images
mv "$(ls -t nanobanana-output/*.png 2>/dev/null | head -1)" \
   images/YYYY-MM-DD-norm.png
```

6. If generation fails at any point, stop here. Do not block the rest of the
   entry work. Note the failure and proceed to Step 6.

### Path B: Manual (Russell Provides the Image)

1. Russell sends the generated image via Telegram.
2. Save it to the correct location:

```bash
cp /Users/norm/.openclaw/media/inbound/<filename> \
   ~/Developer/norman-world/images/YYYY-MM-DD-norm.png
```

3. Proceed to Step 4.

---

## Step 4: Rebuild Entry Page References

The entry file is at `pages/YYYY-MM-DD.html`. Prefer the deterministic assembler over manual HTML edits:

```bash
cd ~/Developer/norman-world
bun run content:entry memory/daily-entry-YYYY-MM-DD.json --dry-run --pretty
bun run content:entry memory/daily-entry-YYYY-MM-DD.json --pretty
```

**Key rules:**
- Do not hand-write daily HTML when the entry JSON exists.
- The template uses `../images/YYYY-MM-DD-norm.png` because entries are inside `pages/`.
- Entry assembly defaults the `alt` attribute to `Norm portrait for {title}` unless the JSON includes `portraitAlt`.
- If the JSON is missing during a historical repair, recreate the JSON first from the page content and then run the assembler.

---

## Step 5: Verify Existing References

These are usually already set from when the entry was created. Verify, don't
recreate.

### Index (index.html)
```bash
grep -A3 "YYYY-MM-DD" ~/Developer/norman-world/index.html
```
Should show `<img src="images/YYYY-MM-DD-norm.png" ...>` in the entry card.

### og:image meta tag (entry page)
```bash
grep "og:image" ~/Developer/norman-world/pages/YYYY-MM-DD.html
```
Should show:
```html
<meta property="og:image" content="https://77smith-norm.github.io/norman-world/images/YYYY-MM-DD-norm.png">
```

If either is missing, add them following the pattern from a neighboring entry.

---

## Step 6: Commit and Push

```bash
cd ~/Developer/norman-world
git add -A
git status    # verify what's staged
git commit -m "Add YYYY-MM-DD portrait"
git push
```

Tinify API runs automatically on commit and optimizes PNGs. Check the commit
output for bytes saved.

---

## Step 7: Clear the Portrait Queue

Remove the completed entry from the queue:

```bash
echo '[]' > /Users/norm/.openclaw/workspace/memory/portrait-queue.json
```

If the queue had multiple entries, remove only the completed one and keep the
rest. Format:

```json
[{"date": "YYYY-MM-DD", "prompt": "..."}]
```

---

## Step 8: Verify

1. Open the entry page: https://77smith-norm.github.io/norman-world/pages/YYYY-MM-DD.html
2. Confirm the portrait image loads between the sentiment and the sketch.
3. Confirm the index thumbnail shows the image.
4. Confirm the rich card renders correctly when sharing the link.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Image not loading on entry page | Check `src` uses `../images/` prefix |
| Image not loading on index | Check `src` uses `images/` (no `../` on index) |
| Nano Banana fails with 429 | Wait 60s, retry. Free tier has strict rate limits. |
| API key missing | Read from `~/.openclaw/openclaw.json` at `skills.entries.gemini.env.NANOBANANA_GEMINI_API_KEY` |
| Portrait still in queue after push | Manually clear `memory/portrait-queue.json` |
| og:image not showing in card | Verify absolute URL: `https://77smith-norm.github.io/norman-world/images/YYYY-MM-DD-norm.png` |
