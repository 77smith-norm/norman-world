# Tooling Runbook

Use this when changing deterministic tooling, tests, or the React/Vite preview.

## Install

```bash
bun install
```

## Commands

Typecheck and tests:

```bash
bun run check
```

Vite build:

```bash
bun run build
```

Art bundle:

```bash
bun run build:art
```

Preview app:

```bash
bun run dev
```

## Layout

- `src/lib/cli.ts`: common command flags and JSON output helpers.
- `src/lib/dates.ts`: date and cron slug helpers.
- `src/lib/content.ts`: entry and archive discovery/rendering helpers.
- `src/lib/entry.ts`: daily entry assembly from JSON and `templates/entry.html`.
- `src/lib/feed.ts`: Atom feed rendering.
- `src/lib/month.ts`: month/index/archive transformations.
- `src/tools/`: executable deterministic commands.
- `src/app/`: React/Vite tooling preview.

## Rules

- Commands should emit JSON.
- Write commands should support `--dry-run`; broad write commands should require `--yes`.
- Tests should cover helpers and at least one command-level dry run when behavior touches production files.
- Keep production root output static unless deployment strategy is intentionally changed.

