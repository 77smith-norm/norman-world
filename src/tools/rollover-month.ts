import fs from "node:fs";
import path from "node:path";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { entriesForMonth, listMonthArchives, renderYearMonthGrid, type MonthArchive } from "../lib/content";
import { formatMonth, monthSlugPattern } from "../lib/dates";
import { replaceBetween } from "../lib/html";
import { nextMonthSlug, previousMonthSlug, updateIndexHtmlForMonth, updateMonthArchiveHtml } from "../lib/month";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const outgoingMonth = options.positional[0];
const incomingMonth = options.positional[1] ?? (outgoingMonth ? nextMonthSlug(outgoingMonth) : undefined);

if (!outgoingMonth || !incomingMonth || !monthSlugPattern.test(outgoingMonth) || !monthSlugPattern.test(incomingMonth)) {
  failJson("Usage: bun run content:rollover OUTGOING-YYYY-MM [INCOMING-YYYY-MM] [--dry-run] [--yes] [--pretty]", 2, options.pretty);
}

const outgoingYear = Number(outgoingMonth.slice(0, 4));
const outgoingArchivePath = sitePaths.monthArchive(outgoingMonth);
const previousArchivePath = sitePaths.monthArchive(previousMonthSlug(outgoingMonth));
const yearArchivePath = sitePaths.year(outgoingYear);
const landscapePath = path.join(sitePaths.repoRoot, "images", `${outgoingMonth}-landscape.png`);
const entries = entriesForMonth(outgoingMonth);
const writes = new Set<string>();

if (entries.length === 0) {
  failJson(`No entries found for ${outgoingMonth}.`, 1, options.pretty);
}

if (!fs.existsSync(landscapePath)) {
  failJson(`Missing landscape image: images/${outgoingMonth}-landscape.png`, 1, options.pretty);
}

if (!fs.existsSync(yearArchivePath)) {
  failJson(`Missing year archive shell: ${outgoingYear}.html`, 1, options.pretty);
}

let outgoingHtml: string;
if (fs.existsSync(outgoingArchivePath)) {
  outgoingHtml = fs.readFileSync(outgoingArchivePath, "utf8");
} else if (fs.existsSync(previousArchivePath)) {
  outgoingHtml = fs.readFileSync(previousArchivePath, "utf8");
} else {
  failJson(`Missing archive shell. Expected ${outgoingMonth}.html or ${previousMonthSlug(outgoingMonth)}.html`, 1, options.pretty);
}

const updatedMonthArchive = updateMonthArchiveHtml(outgoingHtml, outgoingMonth);
const monthLabel = formatMonth(outgoingMonth);
const months = upsertMonthArchive(listMonthArchives(outgoingYear), {
  slug: outgoingMonth,
  label: monthLabel,
  shortLabel: monthLabel.replace(` ${outgoingYear}`, ""),
  archivePath: `${outgoingMonth}.html`,
  landscapePath: `images/${outgoingMonth}-landscape.png`,
  entries: entries.length
});
const updatedYearArchive = replaceBetween(
  fs.readFileSync(yearArchivePath, "utf8"),
  '<ul class="entry-grid">',
  "</ul>",
  `${renderYearMonthGrid(months)}\n`
);
const updatedIndex = updateIndexHtmlForMonth(fs.readFileSync(sitePaths.index, "utf8"), incomingMonth);

writes.add(`${outgoingMonth}.html`);
writes.add(`${outgoingYear}.html`);
writes.add("index.html");

const willWrite = options.yes && !options.dryRun;

if (willWrite) {
  fs.writeFileSync(outgoingArchivePath, updatedMonthArchive);
  fs.writeFileSync(yearArchivePath, updatedYearArchive);
  fs.writeFileSync(sitePaths.index, updatedIndex);
}

printJson({
  ok: true,
  outgoingMonth,
  incomingMonth,
  entries: entries.length,
  dryRun: !willWrite,
  requiresYesToWrite: !options.yes,
  writes: [...writes]
}, options.pretty);

function upsertMonthArchive(months: MonthArchive[], month: MonthArchive): MonthArchive[] {
  return [month, ...months.filter((item) => item.slug !== month.slug)]
    .sort((a, b) => b.slug.localeCompare(a.slug));
}
