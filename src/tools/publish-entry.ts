import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { entriesForMonth, listEntries } from "../lib/content";
import { monthSlugFromDateSlug } from "../lib/dates";
import { renderDailyEntry, type DailyEntryInput } from "../lib/entry";
import { renderAtomFeed } from "../lib/feed";
import { updateIndexHtmlForMonth } from "../lib/month";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const inputPath = options.positional[0];

if (!inputPath) {
  failJson("Usage: bun run content:publish path/to/entry.json [--yes] [--pretty]", 2, options.pretty);
}

const absoluteInputPath = path.resolve(sitePaths.repoRoot, inputPath);

if (!fs.existsSync(absoluteInputPath)) {
  failJson(`Input file not found: ${inputPath}`, 1, options.pretty);
}

const input = JSON.parse(fs.readFileSync(absoluteInputPath, "utf8")) as DailyEntryInput;
const entryMonth = monthSlugFromDateSlug(input.date);
const template = fs.readFileSync(path.join(sitePaths.repoRoot, "templates", "entry.html"), "utf8");
const entryHtml = renderDailyEntry(template, input);
const entryPath = path.join(sitePaths.pages, `${input.date}.html`);
const writes = [`pages/${input.date}.html`, "index.html", "feed.xml"];
const willWrite = options.yes && !options.dryRun;

if (willWrite) {
  fs.writeFileSync(entryPath, entryHtml);

  const indexHtml = updateIndexHtmlForMonth(fs.readFileSync(sitePaths.index, "utf8"), entryMonth);
  const feedXml = renderAtomFeed(listEntries());

  fs.writeFileSync(sitePaths.index, indexHtml);
  fs.writeFileSync(sitePaths.feed, feedXml);

  const validation = spawnSync("bun", ["run", "content:validate", options.pretty ? "--pretty" : ""].filter(Boolean), {
    cwd: sitePaths.repoRoot,
    encoding: "utf8"
  });

  if (validation.status !== 0) {
    process.stderr.write(validation.stderr);
    process.stdout.write(validation.stdout);
    process.exit(validation.status ?? 1);
  }
}

printJson({
  ok: true,
  entryDate: input.date,
  entryMonth,
  entriesInMonth: entriesForMonth(entryMonth).length,
  dryRun: !willWrite,
  requiresYesToWrite: !options.yes,
  writes,
  validation: willWrite ? "passed" : "not run"
}, options.pretty);
