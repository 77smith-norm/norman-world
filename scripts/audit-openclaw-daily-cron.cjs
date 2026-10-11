#!/usr/bin/env node
/**
 * Audit the Norman World Daily OpenClaw cron job against the live runtime.
 *
 * Checks:
 *   1. Expected artifacts for the current entry date exist
 *      (entry JSON, prompt, page, sketch, portrait).
 *   2. Recent run receipts in the OpenClaw sqlite DB are healthy
 *      (no errors in the trailing window, sane durations).
 *   3. The live cron job prompt is byte-identical to
 *      docs/openclaw-cron-prompt.md (single source of truth; drift here
 *      is what silently changed the portrait provider in 2026).
 *   4. No missing entry days in the trailing window (gaps are reported,
 *      not fatal — see the documented backfill policy).
 *
 * Read-only. Exits 0 when healthy, 1 otherwise. JSON report on stdout.
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repo = path.resolve(__dirname, "..");
const openclaw = "/Users/norm/.openclaw";
const jobId = "c11ae7c5-7c1a-4e05-9eda-dc6730f199a1";
const TRAILING_RUNS = 14;
const TRAILING_DAYS = 30;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: repo, encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function queryDb(sql) {
  const result = spawnSync("sqlite3", ["-separator", "\t", path.join(openclaw, "state", "openclaw.sqlite"), sql], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`sqlite3 failed: ${result.stderr}`);
  }
  return result.stdout.trim().split("\n").filter(Boolean).map((line) => line.split("\t"));
}

const report = { ok: true, checks: {} };
function fail(check, detail) {
  report.ok = false;
  report.checks[check] = { ok: false, ...detail };
}
function pass(check, detail) {
  report.checks[check] = { ok: true, ...detail };
}

// 1. Expected artifacts for the current entry date.
const cronDate = JSON.parse(run("bun", ["run", "content:cron-date"]).replace(/^\$.*\n/, ""));
const required = [cronDate.entryJson, cronDate.prompt, cronDate.page, cronDate.sketch, cronDate.portrait];
const missing = required.filter((rel) => !fs.existsSync(path.join(repo, rel)));
if (missing.length > 0) fail("artifacts", { entryDate: cronDate.entryDate, missing });
else pass("artifacts", { entryDate: cronDate.entryDate, missing: [] });

// 2. Recent run receipts.
const rows = queryDb(
  `SELECT started_at_ms, status, finished_at_ms - started_at_ms, substr(error_text, 1, 160) ` +
    `FROM cron_run_receipts WHERE job_id = '${jobId}' ` +
    `ORDER BY started_at_ms DESC LIMIT ${TRAILING_RUNS};`
);
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const runs = rows.map(([startedMs, status, durMs, err]) => ({
  started: fmt.format(new Date(Number(startedMs))),
  status,
  durationS: Math.round(Number(durMs) / 1000),
  error: err || null,
}));
const badRuns = runs.filter((r) => r.status !== "ok");
// Slow-run anomaly detection: flag runs far above the trailing median.
// Duration anomalies are warnings, not failures — they point at the stage
// (image generation, wiki compile, deploy watch) worth investigating.
const okDurations = runs.filter((r) => r.status === "ok").map((r) => r.durationS).sort((a, b) => a - b);
const median = okDurations.length ? okDurations[Math.floor(okDurations.length / 2)] : 0;
const slowRuns = runs.filter((r) => r.status === "ok" && median > 0 && r.durationS > median * 2.5);
if (badRuns.length > 0) fail("runReceipts", { trailing: TRAILING_RUNS, badRuns, runs });
else
  pass("runReceipts", {
    trailing: TRAILING_RUNS,
    badRuns: [],
    recentDurationsS: runs.map((r) => r.durationS),
    medianDurationS: median,
    slowRuns,
  });

// 3. Prompt drift: live job must match the doc verbatim.
const jobsDoc = JSON.parse(fs.readFileSync(path.join(openclaw, "cron", "jobs.json.migrated"), "utf8"));
const jobList = Array.isArray(jobsDoc) ? jobsDoc : Object.values(jobsDoc.jobs ?? jobsDoc);
const liveJob = jobList.find((j) => j.id === jobId);
const docPrompt = fs.readFileSync(path.join(repo, "docs", "openclaw-cron-prompt.md"), "utf8");
if (!liveJob) {
  fail("promptDrift", { reason: `job ${jobId} not found in jobs.json.migrated` });
} else if (liveJob.payload?.message !== docPrompt) {
  fail("promptDrift", {
    reason: "live cron prompt differs from docs/openclaw-cron-prompt.md",
    liveChars: liveJob.payload?.message?.length ?? 0,
    docChars: docPrompt.length,
    fix: "copy the doc verbatim into the live job payload.message",
  });
} else {
  pass("promptDrift", { liveChars: liveJob.payload.message.length });
}

// 4. Missing entry days in the trailing window (reported, not fatal).
const pagesDir = path.join(repo, "pages");
const have = new Set(
  fs.readdirSync(pagesDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.html$/.test(f)).map((f) => f.slice(0, 10))
);
const gaps = [];
const today = new Date(fmt.format(new Date()).slice(0, 10) + "T12:00:00");
for (let i = 1; i <= TRAILING_DAYS; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  const slug = d.toISOString().slice(0, 10);
  if (!have.has(slug)) gaps.push(slug);
}
report.checks.gaps = { ok: true, trailingDays: TRAILING_DAYS, gaps };

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
