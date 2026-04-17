# og-check Integration Plan for Norman World

**Created:** 2026-04-16
**Status:** Planning
**Priority:** Medium — solves a real, recurring pain point

## Problem

Norman World entries include OpenGraph meta tags (og:title, og:description, og:image, og:url) that are essential for social sharing. Currently, the only way to verify these tags work correctly is to:

1. Deploy to GitHub Pages
2. Test via Facebook Sharing Debugger / Twitter Card Validator / opengraph.xyz
3. Discover issues
4. Fix locally
5. Deploy again
6. Fight Facebook's aggressive cache

This loop has bitten us multiple times — the portrait/og:image not rendering, wrong description, missing tags. We can't preview OG cards against localhost because all validators require a public URL.

## Solution: og-check

Simon Hartcher's [og-check](https://github.com/deevus/neutils) (part of `neutils`) renders OpenGraph previews directly in the terminal against localhost. It:

- Fetches any URL (including `http://localhost:PORT`)
- Parses all meta tags (og:*, twitter:*, article:*, etc.)
- Renders a styled card preview with inline images (Kitty graphics protocol)
- Outputs JSON for CI integration (`-o json`)
- Exits non-zero if required fields are missing

## Integration Plan

### Phase 1: Local Verification Script

Create a Norman World script (e.g., `scripts/check-og.sh` or eventually a Bun script) that:

1. Starts a local dev server (if not running)
2. Runs `og-check http://localhost:<port>/pages/YYYY-MM-DD.html`
3. Shows the rendered OG preview in the terminal
4. Exits non-zero if required fields (og:title, og:type, og:image, og:url) are missing

This gives us a "preview before push" step in the Norman World workflow.

### Phase 2: Pre-Commit Hook

Add a git pre-commit hook that:
1. Detects which entry HTML files changed
2. Runs og-check in JSON mode against each
3. Warns (or errors) if required OG fields are missing
4. Catches missing og:image before the commit lands

### Phase 3: Bun-ified Norman World Scripts (Broader Initiative)

Russell wants to "beef up" Norman World with better scripting infrastructure:

- **Bun runtime** for Norman World scripts instead of raw shell
- **Unified build/test/validate pipeline** — single command to run OG checks, lint HTML, regenerate feed, etc.
- **Type-safe entry generation** — templates that guarantee OG fields are present
- **OG validation as part of the cron job** — the 2 AM cron subagent runs og-check after generating the entry and fixes issues before committing

### Phase 4: OG Preview in Norman World UI

Long-term: add an `npm run preview` / `bun run preview` command that:
1. Serves the site locally
2. Opens a browser with OG preview cards for the latest entry
3. Maybe renders them in the terminal (og-check) AND opens opengraph.xyz

## Technical Notes

- og-check requires Kitty graphics protocol (Ghostty, iTerm2, Warp, etc.) for image rendering
- Without it: text-only fallback still shows all meta tag values
- Install via `mise use -g og-check` or pre-built binaries
- `og-check -o json <url> | jq '.og.image'` for CI-friendly validation
- ~600 lines of Zig, actively maintained

## Dependencies

- [og-check](https://github.com/deevus/neutils) — need to install
- [mise](https://mise.jdx.dev) — optional, for easier install
- Bun — for future Norman World scripting overhaul (Phase 3)

## Related

- Norman World OG meta tags are in each entry's `<head>` section
- The portrait/og:image workflow is documented in `docs/portrait-backfill-runbook.md`
- Feed generation: `scripts/generate-feed.js`

## Decision Log

- **2026-04-16:** Plan created. Russell shared Simon Hartcher's article. Wants to integrate og-check into Norman World workflow. Broader Bun/scripts initiative discussed but deferred — keep abstract for now.
