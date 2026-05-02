import fs from "node:fs";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { listMonthArchives, renderYearMonthGrid } from "../lib/content";
import { replaceBetween } from "../lib/html";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const yearArg = options.positional[0];
const year = Number(yearArg);

if (!yearArg || !Number.isInteger(year) || year < 2000 || year > 3000) {
  failJson("Usage: bun run content:year YYYY [--dry-run] [--pretty]", 2, options.pretty);
}

const outputPath = sitePaths.year(year);

if (!fs.existsSync(outputPath)) {
  failJson(`${year}.html does not exist. Create the year archive shell first, then run this command.`, 1, options.pretty);
}

const months = listMonthArchives(year);
const html = fs.readFileSync(outputPath, "utf8");
const next = replaceBetween(
  html,
  '<ul class="entry-grid">',
  "</ul>",
  `${renderYearMonthGrid(months)}\n`
);

if (!options.dryRun) {
  fs.writeFileSync(outputPath, next);
}

printJson({
  ok: true,
  path: `${year}.html`,
  months: months.map((month) => month.slug),
  dryRun: options.dryRun
}, options.pretty);

