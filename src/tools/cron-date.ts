import { failJson, parseCliArgs, printJson } from "../lib/cli";
import { monthSlugFromDateSlug, previousLocalDateSlug } from "../lib/dates";

const options = parseCliArgs();
const nowArg = options.positional[0];
const now = nowArg ? new Date(nowArg) : new Date();

if (Number.isNaN(now.getTime())) {
  failJson("Usage: bun run content:cron-date [ISO_NOW] [--pretty]", 2, options.pretty);
}

const entryDate = previousLocalDateSlug(now);

printJson({
  ok: true,
  cronTimeZone: "America/Los_Angeles",
  entryDate,
  entryMonth: monthSlugFromDateSlug(entryDate),
  entryJson: `memory/daily-entry-${entryDate}.json`,
  prompt: `prompts/${entryDate}-prompt.txt`,
  page: `pages/${entryDate}.html`,
  sketch: `js/${entryDate}.js`,
  portrait: `images/${entryDate}-norm.png`
}, options.pretty);
