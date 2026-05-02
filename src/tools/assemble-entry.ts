import fs from "node:fs";
import path from "node:path";
import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { renderDailyEntry, type DailyEntryInput } from "../lib/entry";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const inputPath = options.positional[0];

if (!inputPath) {
  failJson("Usage: bun run content:entry path/to/entry.json [--dry-run] [--pretty]", 2, options.pretty);
}

const absoluteInputPath = path.resolve(sitePaths.repoRoot, inputPath);

if (!fs.existsSync(absoluteInputPath)) {
  failJson(`Input file not found: ${inputPath}`, 1, options.pretty);
}

const input = JSON.parse(fs.readFileSync(absoluteInputPath, "utf8")) as DailyEntryInput;
const template = fs.readFileSync(path.join(sitePaths.repoRoot, "templates", "entry.html"), "utf8");
const html = renderDailyEntry(template, input);
const outputPath = path.join(sitePaths.pages, `${input.date}.html`);
const relativeOutputPath = `pages/${input.date}.html`;

if (!options.dryRun) {
  fs.writeFileSync(outputPath, html);
}

printJson({
  ok: true,
  path: relativeOutputPath,
  dryRun: options.dryRun,
  bytes: html.length
}, options.pretty);

