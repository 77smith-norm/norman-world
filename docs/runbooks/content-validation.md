# Content Validation Runbook

Use this after any daily entry, archive, index, feed, portrait, sketch, or tooling change.

## Fast Validation

```bash
bun run content:validate --pretty
```

Expected result:

```json
{
  "ok": true,
  "entries": 74
}
```

The entry count will grow over time.

## Full Validation

```bash
bun run check
bun run build
bun run content:validate --pretty
```

## What The Validator Checks

- Daily pages are discoverable under `pages/YYYY-MM-DD.html`.
- Each daily page references its sketch script.
- Each referenced sketch exists under `js/YYYY-MM-DD.js`.
- Each entry has a portrait file under `images/YYYY-MM-DD-norm.*`.
- Entry discovery is newest-first.

## Common Repairs

Missing portrait:

```bash
ls images/YYYY-MM-DD-norm.*
```

Missing sketch:

```bash
ls js/YYYY-MM-DD.js
```

Broken feed:

```bash
bun run content:feed --pretty
bun run content:validate --pretty
```

Broken index:

```bash
bun run content:index YYYY-MM --pretty
bun run content:validate --pretty
```

