import { spawnSync } from "node:child_process";

const result = spawnSync("bun", ["run", "src/tools/generate-feed.ts"], {
  stdio: "inherit"
});

process.exit(result.status ?? 1);
