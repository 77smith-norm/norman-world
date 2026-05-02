import { formatMonth } from "./dates";
import { entriesForMonth } from "./content";

export interface ValidationError {
  file: string;
  message: string;
}

export function validateHomePage(html: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!html.includes('<meta property="og:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world.png">')) {
    errors.push({
      file: "index.html",
      message: "Homepage OG image must remain assets/norman_world.png"
    });
  }

  if (!html.includes('<meta name="twitter:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world.png">')) {
    errors.push({
      file: "index.html",
      message: "Homepage Twitter image must remain assets/norman_world.png"
    });
  }

  if (!html.includes('<img src="assets/norman_world.png" alt="Norman World">')) {
    errors.push({
      file: "index.html",
      message: "Homepage hero image must remain assets/norman_world.png"
    });
  }

  if (/<div class="hero">[\s\S]*?<img[^>]+src="images\/\d{4}-\d{2}-landscape\.(png|jpg|jpeg|webp)"/.test(html)) {
    errors.push({
      file: "index.html",
      message: "Homepage hero must not use a month landscape image"
    });
  }

  return errors;
}

export function validateCurrentMonthIndex(html: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const monthMatch = html.match(/<p class="month">([A-Za-z]+ \d{4})<\/p>/);

  if (!monthMatch) {
    return [{
      file: "index.html",
      message: "Current-month index must include a parseable <p class=\"month\">Month YYYY</p> label"
    }];
  }

  const monthLabel = monthMatch[1];
  const monthSlug = monthLabelToSlug(monthLabel);
  const expectedEntries = entriesForMonth(monthSlug).map((entry) => entry.pagePath);
  const linkedEntries = [...html.matchAll(/href="(pages\/\d{4}-\d{2}-\d{2}\.html)"/g)]
    .map((match) => match[1]);
  const expectedSet = new Set(expectedEntries);

  for (const link of linkedEntries) {
    if (!expectedSet.has(link)) {
      errors.push({
        file: "index.html",
        message: `Current-month index links to non-current-month entry ${link}`
      });
    }
  }

  for (const expected of expectedEntries) {
    if (!linkedEntries.includes(expected)) {
      errors.push({
        file: "index.html",
        message: `Current-month index is missing ${expected}`
      });
    }
  }

  return errors;
}

export function validateYearArchive(html: string, year: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const landscapeHeroPattern = new RegExp(`<img class="index-thumb" src="images/${year}-\\d{2}-landscape\\.png"`, "g");
  const monthCards = [...html.matchAll(landscapeHeroPattern)];

  if (monthCards.length === 0) {
    errors.push({
      file: `${year}.html`,
      message: "Year archive should contain month landscape cards"
    });
  }

  return errors;
}

function monthLabelToSlug(label: string): string {
  const date = new Date(`${label} 1 12:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid month label "${label}".`);
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const slug = `${year}-${month}`;

  if (formatMonth(slug) !== label) {
    throw new Error(`Invalid month label "${label}".`);
  }

  return slug;
}

