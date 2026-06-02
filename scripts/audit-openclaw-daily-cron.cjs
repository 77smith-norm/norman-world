#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repo = path.resolve(__dirname, "..");
const openclaw = "/Users/norm/.openclaw";
const jobId = "c11ae7c5-7c1a-4e05-9eda-dc6730f199a1";
const runsPath = path.join(openclaw, "cron", "runs", `${jobId}.jsonl`);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: repo, encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function latestRun() {
  const lines = fs.readFileSync(runsPath, "utf8").trim().split(/\n/).filter(Boolean);
  return JSON.parse(lines[lines.length - 1]);
}

const cronDate = JSON.parse(run("bun", ["run", "content:cron-date", "--pretty"]).replace(/^\$.*\n/, ""));
const required = [cronDate.entryJson, cronDate.prompt, cronDate.page, cronDate.sketch, cronDate.portrait];
const missing = required.filter((relativePath) => !fs.existsSync(path.join(repo, relativePath)));
const runRecord = latestRun();
const sessionPath = runRecord.sessionId
  ? path.join(openclaw, "agents", "main", "sessions", `${runRecord.sessionId}.jsonl`)
  : null;
let promptErrors = [];

if (sessionPath && fs.existsSync(sessionPath)) {
  promptErrors = fs.readFileSync(sessionPath, "utf8")
    .split(/\n/)
    .filter((line) => line.includes("openclaw:prompt-error"))
    .map((line) => JSON.parse(line).data?.error)
    .filter(Boolean);
}

const ok = missing.length === 0
  && runRecord.status === "ok"
  && Boolean(runRecord.summary)
  && runRecord.deliveryStatus !== "not-delivered"
  && promptErrors.length === 0;

console.log(JSON.stringify({
  ok,
  entryDate: cronDate.entryDate,
  missing,
  latestRun: {
    status: runRecord.status,
    summaryPresent: Boolean(runRecord.summary),
    deliveryStatus: runRecord.deliveryStatus ?? null,
    sessionId: runRecord.sessionId ?? null
  },
  promptErrors
}, null, 2));

process.exit(ok ? 0 : 1);
