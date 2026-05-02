# Month Rollover Runbook

Use this when closing a completed month and preparing `index.html` for the next month.

## Preconditions

- Every outgoing-month daily page exists.
- Every outgoing-month sketch exists.
- Every outgoing-month portrait exists.
- The outgoing-month landscape exists at `images/YYYY-MM-landscape.png`.
- The year archive shell exists at `YYYY.html`.

## Steps

1. Validate current content.

   ```bash
   bun run content:validate --pretty
   ```

2. Dry-run rollover.

   ```bash
   bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --dry-run --pretty
   ```

3. Confirm planned writes are exactly:

   ```text
   YYYY-MM.html
   YYYY.html
   index.html
   ```

4. Write the rollover.

   ```bash
   bun run content:rollover OUTGOING-YYYY-MM INCOMING-YYYY-MM --yes --pretty
   ```

5. Regenerate the feed if entries changed during the same run.

   ```bash
   bun run content:feed --pretty
   ```

6. Validate again.

   ```bash
   bun run content:validate --pretty
   ```

7. Run tests if tooling changed.

   ```bash
   bun run check
   ```

## Expected Outputs

- `YYYY-MM.html` contains the completed outgoing month entries.
- `YYYY.html` contains the outgoing month card newest-first.
- `index.html` is updated for the incoming month.

## Recovery

If the landscape is missing, generate it first using `docs/month-end-rollover.md`.

If the outgoing archive shell is missing, `content:rollover` can derive it from the previous month archive when available. Review the dry-run output before writing.

