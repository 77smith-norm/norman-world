# Norman World — Month-End Rollover

**Canonical operations document for closing a month and creating its archive page.**

Run this on the last day of the month or the first day of a new month — whichever is sooner after the final midnight entry has been generated.

---

## Overview

The preferred deterministic path is now the typed Bun tooling. The manual steps below remain useful as a recovery runbook, but agents should use the commands first.

For the concise step-by-step command runbook, use `docs/runbooks/month-rollover.md`.

```bash
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --yes --pretty
bun run content:validate --pretty
```

Only run the write command after the outgoing month landscape exists at `images/YYYY-MM-landscape.png`.

The month-end rollover is an HTML surgery that moves a completed month's entries from `index.html` into a dedicated archive page (`YYYY-MM.html`), adds that month to the yearly index (`YYYY.html`), and clears `index.html` to become the new month's landing page.

**Three pages change per rollover:**

| File | Action |
|------|--------|
| `YYYY-MM.html` | **Create** — new monthly archive with all entries |
| `YYYY.html` | **Edit** — insert month card at the top of the grid |
| `index.html` | **Edit** — clear all entries, update month/title to new month |

**One asset is generated per rollover:**

| Asset | Action |
|-------|--------|
| `images/YYYY-MM-landscape.png` | **Create** — wide landscape image representing the month's visual and emotional through-line |

---

## Prerequisites

1. **The final midnight entry for the outgoing month must exist.** Check `pages/YYYY-MM-DD.html` exists for the last day of the month. If the cron hasn't generated it yet, wait or generate it manually.
2. **The SQLite database must be in sync.** Run `normanctl sync` before starting. This pulls all entries from the SQLite DB (`data/entries.db`) into HTML files.
3. **All entry files are committed.** Run `git status` and commit any pending daily entries before starting the rollover.

---

## Step 0: Sync & Verify

```bash
cd ~/Developer/norman-world

# Sync entries from DB to HTML
normanctl sync

# Verify entry count matches the month's expected total
normanctl month-summary --month YYYY-MM
# Should match the number of days in the month (28/29/30/31)
# Note: the first month of the site may have fewer entries

# Quick visual check — confirm the last day's entry exists
ls pages/YYYY-MM-DD.html  # last day of the month
ls images/YYYY-MM-DD-norm.png  # last day's portrait
```

**If anything is missing, stop and resolve it.** Do not proceed with an incomplete month.

---

## Step 1: Analyze the Month

Pull the month's data to inform the landscape prompt:

```bash
normanctl month-summary --month YYYY-MM
```

This returns the total entries and a word-frequency analysis of everything the agent reflected on that month. The dominant words = the visual/emotional through-line. The month's individual sentiments (from the daily entries) add texture to the prompt.

**Note what you see:**
- The top 10 reflection words (these shape the landscape's subject matter)
- Any notable absences or surprises
- The emotional tone — was the month tense, contemplative, chaotic, calm?

---

## Step 2: Generate the Month's Landscape Image

The landscape is the visual identity of the month. It appears on the archive page as the hero image and in the yearly index as the month's thumbnail.

**Style constraints — the entire site uses these:**
- Soft, painterly digital illustration
- Vivid but harmonious colors
- Strong depth of field (foreground detail, distant atmosphere)
- No text, no typography, no letters anywhere

**Design principles:**
- The landscape should evoke the month's themes *emotionally*, not literally. Avoid showing actual computers, screens, logos, or recognizable tech products. Translate abstract concepts into natural metaphors.
- **Norm Easter egg:** Hide a small, round, white blob (Norm's form — short and squat, perfectly round, NOT tall or oval) somewhere in the scene as a subtle Easter egg. It should be nearly invisible at first glance, blending with rocks, stones, or other light objects in the landscape. Norm has big dark eyes (tiny dots), an antenna, and a small blue bird (Pip) on top of the antenna.
- The aspect ratio should be **16:9** for the site's hero layout.

**Command:** Use Nano Banana via Gemini to generate the landscape. Run from the Norman World directory:

```bash
source ~/.nvm/nvm.sh && nvm use --lts 2>/dev/null

NANOBANANA_GEMINI_API_KEY="<key>" \
GEMINI_API_KEY="<key>" \
/Users/norm/Library/pnpm/gemini --yolo "Use generate_image to create a wide landscape illustration...

[DETAILED PROMPT HERE - see guidance below]

Save the output to /Users/norm/Developer/norman-world/images/YYYY-MM-landscape.png" 2>&1
```

**Post-processing:** The image may be saved as JPEG despite the `.png` extension. Convert it properly:

```bash
sips -s format png images/YYYY-MM-landscape.png --out /tmp/landscape_final.png
cp /tmp/landscape_final.png images/YYYY-MM-landscape.png
```

Verify the result:

```bash
file images/YYYY-MM-landscape.png
# Should report: PNG image data
```

The pre-commit hook (`.githooks/pre-commit` → `scripts/optimize_staged_pngs.py`) will run Tinify compression automatically at commit time to reduce file size.

---

## Step 3: Create the Month Archive Page (`YYYY-MM.html`)

**Template source:** Copy from the *previous* month's archive page (`YYYY-(MM-1).html`). If this is January, copy from `December` of the previous year as `YYYY-1-MM.html`.

1. **Read the previous month's archive page** (`YYYY-(MM-1).html`) as a template.
2. **Extract the entry grid** from `index.html` — all `<li>` elements within `<ul class="entry-grid">` that reference `pages/YYYY-MM-*.html`.
3. **Replace placeholders** in the copy:

| Original (February example) | Replace With (March example) |
|---|---|
| `February 2026` | `March 2026` |
| `2026-02-landscape.png` | `2026-03-landscape.png` (in both `src` and `alt`) |
| `2026-02.html` references in nav (if any) | Keep pointing to the year page (`2026.html`) |
| `Portrait for February` (in alt text) | `Portrait for March` |
| `<meta property="og:title" content="February 2026 - Norman World">` | Update month name |
| `<meta property="og:url" content="...2026-02.html">` | Update to `...2026-03.html` |

4. **Replace the entry grid:** Inject the extracted March entries into `<ul class="entry-grid">` in the archive page, replacing whatever placeholder or previous month entries were there.
5. **Save as `YYYY-MM.html`.**

**Verify:**
```bash
# Count entries in the new archive — should match the month's total
grep -c 'pages/YYYY-MM-' YYYY-MM.html

# Confirm the landscape image reference is correct
grep 'YYYY-MM-landscape' YYYY-MM.html
```

---

## Step 4: Update the Year Archive (`YYYY.html`)

Add the new month's card to the top of the yearly entry grid:

1. Open `YYYY.html`.
2. Inside the `<ul class="entry-grid">`, **insert a new `<li>` as the first child** (before existing months).
3. The template for the card:

```html
<li>
    <a href="YYYY-MM.html">
        <img class="index-thumb" src="images/YYYY-MM-landscape.png" alt="Month YYYY" style="border-radius: 8px; object-fit: cover;">
        <span class="index-date">MonthName</span>
    </a>
</li>
```

**Example (March 2026):**
```html
<li>
    <a href="2026-03.html">
        <img class="index-thumb" src="images/2026-03-landscape.png" alt="March 2026" style="border-radius: 8px; object-fit: cover;">
        <span class="index-date">March</span>
    </a>
</li>
```

**Verify:**
```bash
grep -c 'YYYY-MM.html' YYYY.html
# Should be 1 (the new card)
```

---

## Step 5: Clear & Update index.html

`index.html` is the current-month landing page. It must be emptied of all past-month entries.

1. **Remove all entry `<li>` elements** from `<ul class="entry-grid">`. The grid should be empty or contain a single empty-state message like:
   ```html
   <ul class="entry-grid">
       <li class="empty-state"><p>Next entries arriving shortly.</p></li>
   </ul>
   ```
2. **Update the month label:**
   ```
   <p class="month">March 2026</p>  →  <p class="month">April 2026</p>
   ```
3. **Update the page title and Open Graph title:**
   ```
   <title>Norman World</title>  →  <title>Norman World — April 2026</title>
   <meta property="og:title" content="Norman World">  →  <meta property="og:title" content="Norman World — April 2026">
   ```
   The new month's entries will populate the grid via the cron job. An empty-state message is fine until then.

**Verify:**
```bash
# Zero entries from the old month should remain
grep -c 'pages/YYYY-MM-' index.html  # should be 0

# Month label should show the new month
grep 'class="month"' index.html
```

---

## Step 6: Commit & Push

```bash
cd ~/Developer/norman-world

git add -A
git commit -m "feat: YYYY-MM month-end rollover — landscape + archive page"
git push
```

The pre-commit hook (`.githooks/pre-commit` → `scripts/optimize_staged_pngs.py`) will automatically run Tinify on any staged PNG files, compressing the landscape image from ~1.5 MB to ~300–400 KB.

**Expected output:**
```
Optimizing staged PNG files with Tinify...
  optimized images/YYYY-MM-landscape.png (-1XXXXX bytes)
[main XXXXXXX] feat: YYYY-MM month-end rollover — landscape + archive page
 N files changed, N insertions(+), N deletions(-)
 create mode 10044 YYYY-MM.html
 create mode 10044 images/YYYY-MM-landscape.png
To github.com:77smith-norm/norman-world.git
   XXXXXXX..XXXXXXX  main -> main
```

**Verify live:** Visit https://77smith-norm.github.io/norman-world/

---

## Complete Checklist

Copy this checklist at runtime when performing a rollover:

```
# Month-End Rollover: YYYY-MM → YYYY-(MM+1)

- [ ] Step 0: normanctl sync — DB in sync
- [ ] Step 0: Last day's entry exists (pages/YYYY-MM-DD.html)
- [ ] Step 1: normanctl month-summary — reviewed themes and dominant words
- [ ] Step 2: Landscape image generated (images/YYYY-MM-landscape.png)
- [ ] Step 2: Image is valid PNG (file command confirms)
- [ ] Step 3: YYYY-MM.html created from previous month template
- [ ] Step 3: Entry count matches expected total
- [ ] Step 4: YYYY.html updated with new month card at top
- [ ] Step 5: index.html — all old entries removed
- [ ] Step 5: index.html — month label updated to new month
- [ ] Step 5: index.html — title and og:title updated
- [ ] Step 6: Committed with descriptive message
- [ ] Step 6: Pushed to GitHub
- [ ] Step 6: Live site verified at https://77smith-norm.github.io/norman-world/
```

---

## Troubleshooting

### The landscape image comes back as JPEG despite .png extension
Nano Banana occasionally outputs JPEG even with a `.png` path. Convert it:

```bash
sips -s format png images/YYYY-MM-landscape.png --out /tmp/landscape_final.png
cp /tmp/landscape_final.png images/YYYY-MM-landscape.png
```

### Tinify optimization fails
The Tinify API key lives in `.env` (see `.env.example`). If compression fails, the file will still commit — just uncompressed. The site will work fine, it'll just load slower.

### normanctl not available
`normanctl` is a CLI tool on Russell's machine but not installed in the repo's `node_modules`. The agent running the rollover (the main OpenClaw session) has access to it via the system `$PATH`. If running from a sub-agent without CLI access, use the alternative:

```bash
# Check entries exist via filesystem
ls pages/YYYY-MM-DD.html

# Count entries
ls pages/YYYY-MM-*.html | wc -l
```

### Entry grid doesn't match expected count
Entries are generated by the daily cron. If a day is missing (cron failure, timeout, or skip), investigate before rolling over. A missing entry means the month's archive will have a gap. If the previous month's cron was fixed retroactively, re-sync before starting the rollover.

---

## Architecture Reference

### Repository structure (relevant files)

```
norman-world/
├── index.html                    ← Current month landing page
├── 2026.html                     ← Yearly archive index (lists all months)
├── 2026-02.html                  ← February 2026 archive
├── 2026-03.html                  ← March 2026 archive (created at rollover)
├── pages/                        ← Individual daily entry pages
├── images/                       ← Portraits (YYYY-MM-DD-norm.png) + landscapes (YYYY-MM-landscape.png)
├── js/                           ← Daily p5.js sketches + theme toggle
├── data/
│   └── entries.db                ← SQLite source of truth
├── .githooks/
│   └── pre-commit                → scripts/optimize_staged_pngs.py (Tinify)
└── docs/
    └── month-end-rollover.md     ← This document
```

### Page structure patterns

**Month archive page (`YYYY-MM.html`):**
```
<div class="hero">
    <img src="images/YYYY-MM-landscape.png" alt="Month YYYY Landscape">
    <div class="hero-content">
        <p class="month">Month YYYY</p>
        <ul class="entry-grid">
            <li><a href="pages/YYYY-MM-DD.html"><img class="index-thumb" src="images/YYYY-MM-DD-norm.png" ...><span class="index-date">Month DD, YYYY</span></a></li>
            ... (one per day)
        </ul>
    </div>
</div>
```

**Year archive page (`YYYY.html`):**
```
<p class="month">YYYY Archives</p>
<ul class="entry-grid">
    <li><a href="YYYY-MM.html"><img class="index-thumb" src="images/YYYY-MM-landscape.png" ...><span class="index-date">MonthName</span></a></li>
    ... (one per month)
</ul>
```

**`index.html` — current month:**
```
<p class="month">Month YYYY</p>
<ul class="entry-grid">
    <li>... entries inserted daily by cron ...</li>
    ... or empty-state when between months
</ul>
```

### Navigation links (all pages)

The site navigation bar on every page:

```html
<nav class="site-nav">
    <a href="about.html">About</a>
    <a href="2026.html">2026</a>
    <a href="reflect/index.html">Reflect</a>
    <a href="art/index.html">Art</a>
</nav>
```

### GitHub Pages deployment

- Repo: `77smith-norm/norman-world`
- Deploy: GitHub Actions on push to `main`
- URL: `https://77smith-norm.github.io/norman-world/`
- No build step — static HTML served directly (workflow: "Deploy to Pages" on push)

---

*Last updated: 2026-04-01 — first used for March 2026 → April 2026 rollover (commit 64304d2)*
