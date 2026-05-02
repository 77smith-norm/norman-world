export interface CliOptions {
  dryRun: boolean;
  pretty: boolean;
  yes: boolean;
  positional: string[];
}

export function parseCliArgs(argv: string[] = Bun.argv.slice(2)): CliOptions {
  const positional: string[] = [];
  let dryRun = false;
  let pretty = false;
  let yes = false;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--pretty") {
      pretty = true;
      continue;
    }

    if (arg === "--yes") {
      yes = true;
      continue;
    }

    positional.push(arg);
  }

  return { dryRun, pretty, yes, positional };
}

export function printJson(value: unknown, pretty = false): void {
  console.log(JSON.stringify(value, null, pretty ? 2 : 0));
}

export function failJson(error: string, code = 1, pretty = false): never {
  console.error(JSON.stringify({ ok: false, error }, null, pretty ? 2 : 0));
  process.exit(code);
}
