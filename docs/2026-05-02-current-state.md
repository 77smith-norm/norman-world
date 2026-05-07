# Norman World Current State - 2026-05-02

## Summary

Norman World now has deterministic, agent-runnable tooling around the static GitHub Pages site. The production site still deploys from the repository root. Existing public URLs were preserved.

The live OpenClaw `Norman World Daily` cron job has been updated to use the new deterministic workflow.

## Live OpenClaw Cron

- Job name: `Norman World Daily`
- Job ID: `c11ae7c5-7c1a-4e05-9eda-dc6730f199a1`
- Schedule: `0 2 * * *`
- Timezone: `America/Los_Angeles`
- Behavior: publishes the previous Los Angeles calendar day.
- Versioned prompt: `docs/openclaw-cron-prompt.md`

The live cron prompt has been verified to include:

- `bun run content:cron-date --pretty`
- `bun run content:publish ...`

It no longer instructs the agent to manually edit `feed.xml`, manually rebuild `index.html`, or use the old manual feed script.

## Deterministic Commands

```bash
bun run content:cron-date --pretty
bun run content:publish path/to/entry.json --pretty
bun run content:publish path/to/entry.json --yes --pretty
bun run content:entry path/to/entry.json --dry-run --pretty
bun run content:entry path/to/entry.json --pretty
bun run content:index YYYY-MM --pretty
bun run content:feed --pretty
bun run content:validate --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --yes --pretty
```

## Validation Guardrails

`bun run content:validate --pretty` now checks:

- Daily pages exist under `pages/YYYY-MM-DD.html`.
- Each daily page references `../js/YYYY-MM-DD.js`.
- Each sketch file exists.
- Each entry has a portrait file.
- Homepage hero and social image remain `assets/norman_world.png`.
- Homepage hero does not use a month landscape image.
- Current-month `index.html` does not link to another month.
- Year archives contain month landscape cards.

The repo pre-commit hook also runs content validation:

```bash
.githooks/pre-commit
```

`core.hooksPath` is set to `.githooks` locally.

## Runbooks

- Agent map: `AGENTS.md`
- OpenClaw cron contract: `docs/openclaw-cron-contract.md`
- Daily publishing: `docs/runbooks/daily-entry.md`
- Month rollover: `docs/runbooks/month-rollover.md`
- Content validation: `docs/runbooks/content-validation.md`
- Tooling: `docs/runbooks/tooling.md`

## Verified Commands

Latest verified state:

```bash
bun run check
bun run build
bun run content:validate --pretty
bash .githooks/pre-commit
```

Expected current test count:

```text
12 test files, 27 tests
```

Expected current content count:

```text
78 entries
```

The entry count will increase after the next successful daily run.

## Deployment

Recent pushed commits:

- `f34d101` - `feat: add deterministic content tooling`
- `70e7d98` - `docs: add deterministic content runbooks`
- `492a0f5` - `docs: version OpenClaw daily cron prompt`
- `a62d23f` - `test: enforce site layout invariants`
- `4a4cb92` - `chore: validate content before commit`

GitHub Pages deployments succeeded after these changes. Live docs have been checked via `curl`.

## Watch Next

The next important verification is the next 2 AM OpenClaw cron run.

Confirm that the run:

1. Resolves the previous-day slug with `content:cron-date`.
2. Writes `memory/daily-entry-YYYY-MM-DD.json`.
3. Publishes the deterministic tail with `content:publish`.
4. Passes the validation run inside `content:publish`.
5. Commits and pushes.
6. Verifies GitHub Pages deployment.
7. Runs wiki sync.

If that run succeeds, consider the deterministic migration complete.

## Known Follow-Up

GitHub Actions currently warns that Node.js 20 actions are deprecated. Deployment still succeeds. Later, update `.github/workflows/deploy.yml` or opt into Node 24 behavior once the Pages actions path is ready.
