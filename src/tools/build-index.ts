import fs from "node:fs";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { entriesForMonth } from "../lib/content";
import { monthSlugPattern } from "../lib/dates";
import { updateIndexHtmlForMonth } from "../lib/month";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const monthSlug = options.positional[0];

if (!monthSlug || !monthSlugPattern.test(monthSlug)) {
  failJson("Usage: bun run content:index YYYY-MM [--dry-run] [--pretty]", 2, options.pretty);
}

const entries = entriesForMonth(monthSlug);
const html = updateIndexHtmlForMonth(fs.readFileSync(sitePaths.index, "utf8"), monthSlug);

if (!options.dryRun) {
  fs.writeFileSync(sitePaths.index, html);
}

printJson({
  ok: true,
  path: "index.html",
  month: monthSlug,
  entries: entries.length,
  dryRun: options.dryRun
}, options.pretty);
