# Norman World Tooling Refactor - 2026-05-02

## Status

Initial guardrail pass implemented.

## Goal

Make Norman World easier for Norm and other agents to maintain without changing the deployed static URL structure. The site remains GitHub Pages root output. Tooling becomes typed, testable, and command-driven.

## Current Shape

- Production pages are stable static HTML.
- Daily content is regular and date-keyed.
- Month archives and feeds were maintained by fragile string edits.
- Legacy scripts mixed hard-coded paths, CommonJS, and loose regex extraction.
- Existing runbooks are useful but too verbose for day-to-day agent execution.

## Implemented

- Bun package scripts for build, test, typecheck, content validation, feed generation, and month archive population.
- TypeScript configuration with strict checking.
- Vite 8 + React preview app under `src/app/`.
- Vitest tests for HTML helpers, feed rendering, and entry-list rendering.
- Typed content helpers under `src/lib/`.
- Agent-runnable tools under `src/tools/`.
- `AGENTS.md` rewritten as a lean operational contract.
- README updated to describe the static production surface and typed tooling surface.

## Near-Term Next Steps

- Move index/year/month archive generation fully into typed tools.
- Add a dry-run mode and JSON output to every content command.
- Add a typed daily-entry assembler that consumes structured JSON and writes `pages/YYYY-MM-DD.html` from `templates/entry.html`.
- Add fixture-based tests for month rollover.
- Decide whether React becomes a source-rendered production layer later, or remains tooling-only.

## Non-Goals For This Pass

- No public URL moves.
- No migration of historical daily pages.
- No deployment change from GitHub Pages root static hosting.
- No rewrite of p5.js sketches.

