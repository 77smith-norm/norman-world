import { formatMonth, monthSlugPattern } from "./dates";
import { replaceBetween } from "./html";
import { entriesForMonth, renderEntryListForBase } from "./content";

export function nextMonthSlug(monthSlug: string): string {
  if (!monthSlugPattern.test(monthSlug)) {
    throw new Error(`Invalid month slug "${monthSlug}". Expected YYYY-MM.`);
  }

  const date = new Date(`${monthSlug}-01T12:00:00`);
  date.setMonth(date.getMonth() + 1);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function previousMonthSlug(monthSlug: string): string {
  if (!monthSlugPattern.test(monthSlug)) {
    throw new Error(`Invalid month slug "${monthSlug}". Expected YYYY-MM.`);
  }

  const date = new Date(`${monthSlug}-01T12:00:00`);
  date.setMonth(date.getMonth() - 1);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function updateMonthArchiveHtml(html: string, monthSlug: string): string {
  const monthLabel = formatMonth(monthSlug);
  const entries = entriesForMonth(monthSlug);

  return replaceBetween(
    html,
    '<ul class="entry-grid">',
    "</ul>",
    `${renderEntryListForBase(entries)}\n`
  )
    .replace(/<title>.*?<\/title>/, `<title>${monthLabel} - Norman World</title>`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${monthLabel} - Norman World">`)
    .replace(/<meta property="og:url" content=".*?\/\d{4}-\d{2}\.html">/, `<meta property="og:url" content="https://77smith-norm.github.io/norman-world/${monthSlug}.html">`)
    .replace(/<meta property="og:image" content=".*?\/images\/\d{4}-\d{2}-landscape\.png">/, `<meta property="og:image" content="https://77smith-norm.github.io/norman-world/images/${monthSlug}-landscape.png">`)
    .replace(/<p class="month">.*?<\/p>/, `<p class="month">${monthLabel}</p>`)
    .replace(/<img src="images\/\d{4}-\d{2}-landscape\.(png|jpg|jpeg|webp)" alt="[^"]*">/, `<img src="images/${monthSlug}-landscape.png" alt="${monthLabel} Landscape">`);
}

export function updateIndexHtmlForMonth(html: string, monthSlug: string): string {
  const monthLabel = formatMonth(monthSlug);
  const entries = entriesForMonth(monthSlug);

  return replaceBetween(
    html
      .replace(/<title>.*?<\/title>/, `<title>Norman World — ${monthLabel}</title>`)
      .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="Norman World — ${monthLabel}">`)
      .replace(/<p class="month">.*?<\/p>/, `<p class="month">${monthLabel}</p>`),
    '<ul class="entry-grid">',
    "</ul>",
    `${renderEntryListForBase(entries)}\n`
  );
}
