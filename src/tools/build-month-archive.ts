import fs from "node:fs";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { monthSlugPattern } from "../lib/dates";
import { entriesForMonth } from "../lib/content";
import { updateMonthArchiveHtml } from "../lib/month";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const monthSlug = options.positional[0];

if (!monthSlug || !monthSlugPattern.test(monthSlug)) {
  failJson("Usage: bun run content:month YYYY-MM [--dry-run] [--pretty]", 2, options.pretty);
}

const outputPath = sitePaths.monthArchive(monthSlug);
if (!fs.existsSync(outputPath)) {
  failJson(`${monthSlug}.html does not exist. Copy the previous archive first, then run this command.`, 1, options.pretty);
}

const entries = entriesForMonth(monthSlug);
const next = updateMonthArchiveHtml(fs.readFileSync(outputPath, "utf8"), monthSlug);

if (!options.dryRun) {
  fs.writeFileSync(outputPath, next);
}

printJson({ ok: true, path: `${monthSlug}.html`, entries: entries.length, dryRun: options.dryRun }, options.pretty);
