import fs from "node:fs";
import { parseCliArgs, printJson } from "../lib/cli";
import { listEntries } from "../lib/content";
import { renderAtomFeed } from "../lib/feed";
import { sitePaths } from "../lib/paths";

const options = parseCliArgs();
const xml = renderAtomFeed(listEntries());

if (!options.dryRun) {
  fs.writeFileSync(sitePaths.feed, xml);
}

printJson({ ok: true, path: "feed.xml", dryRun: options.dryRun }, options.pretty);
