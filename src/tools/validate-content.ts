import fs from "node:fs";
import path from "node:path";
import { parseCliArgs, printJson } from "../lib/cli";
import { listEntries } from "../lib/content";
import { sitePaths } from "../lib/paths";

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];
const options = parseCliArgs();
const entries = listEntries();

for (const entry of entries) {
  const pageFile = path.join(sitePaths.pages, entry.file);
  const html = fs.readFileSync(pageFile, "utf8");

  if (!entry.portraitPath) {
    errors.push({ file: entry.pagePath, message: `Missing portrait for ${entry.slug}` });
  }

  if (!html.includes(`../js/${entry.slug}.js`)) {
    errors.push({ file: entry.pagePath, message: `Missing sketch script ../js/${entry.slug}.js` });
  }

  if (!fs.existsSync(path.join(sitePaths.repoRoot, "js", `${entry.slug}.js`))) {
    errors.push({ file: `js/${entry.slug}.js`, message: "Missing sketch file" });
  }
}

const sorted = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
if (entries.map((entry) => entry.slug).join(",") !== sorted.map((entry) => entry.slug).join(",")) {
  errors.push({ file: "pages/", message: "Entries are not sorted newest first" });
}

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors }, null, options.pretty ? 2 : 0));
  process.exit(1);
}

printJson({ ok: true, entries: entries.length }, options.pretty);
