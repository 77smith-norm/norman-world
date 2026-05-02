import fs from "node:fs";
import path from "node:path";
import { formatEntryDate, formatMonth, monthSlugFromDateSlug, parseDateSlug } from "./dates";
import { extractSentiment } from "./html";
import { sitePaths } from "./paths";

export interface Entry {
  slug: string;
  file: string;
  pagePath: string;
  date: Date;
  displayDate: string;
  sentiment: string;
  portraitPath: string | null;
}

export function listEntries(): Entry[] {
  const files = fs
    .readdirSync(sitePaths.pages)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.html$/.test(file));

  return files
    .map((file) => {
      const slug = file.replace(".html", "");
      const html = fs.readFileSync(path.join(sitePaths.pages, file), "utf8");
      const portraitPath = findPortrait(slug);

      return {
        slug,
        file,
        pagePath: `pages/${file}`,
        date: parseDateSlug(slug),
        displayDate: formatEntryDate(slug),
        sentiment: extractSentiment(html),
        portraitPath
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function entriesForMonth(monthSlug: string): Entry[] {
  return listEntries().filter((entry) => entry.slug.startsWith(`${monthSlug}-`));
}

export function findPortrait(slug: string): string | null {
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const relativePath = `images/${slug}-norm.${ext}`;
    if (fs.existsSync(path.join(sitePaths.images, `${slug}-norm.${ext}`))) {
      return relativePath;
    }
  }

  return null;
}

export function renderEntryList(entries: Entry[]): string {
  if (entries.length === 0) {
    return '\n                    <li class="empty-state"><p>Next entries arriving shortly.</p></li>\n';
  }

  return entries
    .map((entry) => {
      const image = entry.portraitPath
        ? `<img class="index-thumb" src="${entry.portraitPath}" alt="Portrait for ${entry.displayDate}" onerror="this.style.display='none'">`
        : "";

      return `
                    <li>
                        <a href="${entry.pagePath}">
                            ${image}
                            <span class="index-date">${entry.displayDate}</span>
                        </a>
                    </li>`;
    })
    .join("\n");
}

export function renderEntryListForBase(entries: Entry[], base: "root" | "parent" = "root"): string {
  const prefix = base === "parent" ? "../" : "";

  if (entries.length === 0) {
    return '\n                    <li class="empty-state"><p>Next entries arriving shortly.</p></li>\n';
  }

  return entries
    .map((entry) => {
      const image = entry.portraitPath
        ? `<img class="index-thumb" src="${prefix}${entry.portraitPath}" alt="Portrait for ${entry.displayDate}" onerror="this.style.display='none'">`
        : "";

      return `
                    <li>
                        <a href="${prefix}${entry.pagePath}">
                            ${image}
                            <span class="index-date">${entry.displayDate}</span>
                        </a>
                    </li>`;
    })
    .join("\n");
}

export interface MonthArchive {
  slug: string;
  label: string;
  shortLabel: string;
  archivePath: string;
  landscapePath: string;
  entries: number;
}

export function listMonthArchives(year: number): MonthArchive[] {
  const monthCounts = new Map<string, number>();

  for (const entry of listEntries()) {
    if (!entry.slug.startsWith(`${year}-`)) continue;
    const monthSlug = monthSlugFromDateSlug(entry.slug);
    monthCounts.set(monthSlug, (monthCounts.get(monthSlug) ?? 0) + 1);
  }

  return [...monthCounts.entries()]
    .map(([slug, entries]) => {
      const label = formatMonth(slug);
      const shortLabel = label.replace(` ${year}`, "");

      return {
        slug,
        label,
        shortLabel,
        archivePath: `${slug}.html`,
        landscapePath: `images/${slug}-landscape.png`,
        entries
      };
    })
    .filter((month) => (
      fs.existsSync(path.join(sitePaths.repoRoot, month.archivePath))
      && fs.existsSync(path.join(sitePaths.repoRoot, month.landscapePath))
    ))
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function renderYearMonthGrid(months: MonthArchive[]): string {
  if (months.length === 0) {
    return '\n                    <li class="empty-state"><p>No completed months yet.</p></li>\n';
  }

  return months
    .map((month) => `
                    <li>
                        <a href="${month.archivePath}">
                            <img class="index-thumb" src="${month.landscapePath}" alt="${month.label}" style="border-radius: 8px; object-fit: cover;">
                            <span class="index-date">${month.shortLabel}</span>
                        </a>
                    </li>`)
    .join("\n");
}
