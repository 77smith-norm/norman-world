import { formatMonth } from "./dates";
import { entriesForMonth } from "./content";

export interface ValidationError {
  file: string;
  message: string;
}

const HERO_VARIANT_PATTERN = /^norman_world(?:_[a-z0-9]+)*$/;
const DEFAULT_HERO_LIGHT = "norman_world_plumo";
const DEFAULT_HERO_DARK = "norman_world_plumo_dark";

export function validateHomePage(html: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const ogMatch = html.match(/<meta property="og:image" content="https:\/\/77smith-norm\.github\.io\/norman-world\/assets\/([^"\.]+)\.png">/);
  if (!ogMatch || !HERO_VARIANT_PATTERN.test(ogMatch[1])) {
    errors.push({
      file: "index.html",
      message: "Homepage OG image must be a norman_world hero variant under assets/"
    });
  }

  const twMatch = html.match(/<meta name="twitter:image" content="https:\/\/77smith-norm\.github\.io\/norman-world\/assets\/([^"\.]+)\.png">/);
  if (!twMatch || !HERO_VARIANT_PATTERN.test(twMatch[1])) {
    errors.push({
      file: "index.html",
      message: "Homepage Twitter image must be a norman_world hero variant under assets/"
    });
  }

  const heroSection = html.match(/<div class="hero">[\s\S]*?<\/div>\s*<\/div>/);
  if (!heroSection) {
    errors.push({
      file: "index.html",
      message: "Homepage must include a <div class=\"hero\"> block"
    });
  } else {
    const heroHtml = heroSection[0];
    const lightSrc = heroHtml.match(/class="light-img"[^>]*src="assets\/([^"\.]+)\.png"/);
    const darkSrc = heroHtml.match(/class="dark-img"[^>]*src="assets\/([^"\.]+)\.png"/);

    if (!lightSrc || lightSrc[1] !== DEFAULT_HERO_LIGHT) {
      errors.push({
        file: "index.html",
        message: `Homepage hero light image must default to assets/${DEFAULT_HERO_LIGHT}.png`
      });
    }

    if (!darkSrc || darkSrc[1] !== DEFAULT_HERO_DARK) {
      errors.push({
        file: "index.html",
        message: `Homepage hero dark image must default to assets/${DEFAULT_HERO_DARK}.png`
      });
    }
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

const VALID_SKETCH_MOUNT_IDS = ["sketch-container", "canvas-container"] as const;

export function validateEntryPage(html: string, slug: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const pageFile = `pages/${slug}.html`;

  const sketchSection = html.match(/<section class="sketch">[\s\S]*?<\/section>/);
  if (!sketchSection) {
    errors.push({
      file: pageFile,
      message: "Entry page is missing the <section class=\"sketch\"> wrapper"
    });
    return errors;
  }

  const mountIds = collectMountIds(sketchSection[0]);
  if (mountIds.length === 0) {
    errors.push({
      file: pageFile,
      message: `Entry page is missing a sketch mount inside <section class="sketch">; expected one of ${formatList(VALID_SKETCH_MOUNT_IDS)} as <div id="...">. Without it the p5.js sketch has no mount point and renders at the bottom of <body>.`
    });
  }

  if (!/<script[^>]+p5(?:\.min)?\.js/i.test(html)) {
    errors.push({
      file: pageFile,
      message: "Entry page does not load p5.js (no <script> referencing p5.js or p5.min.js)"
    });
  }

  return errors;
}

export function validateEntrySketch(jsSource: string, slug: string, mountIds: readonly string[] = VALID_SKETCH_MOUNT_IDS): ValidationError[] {
  const errors: ValidationError[] = [];
  const sketchFile = `js/${slug}.js`;

  if (!jsSource.trim()) {
    errors.push({ file: sketchFile, message: "Sketch file is empty" });
    return errors;
  }

  const code = stripJsCommentsAndStrings(jsSource);
  const usesCreateCanvas = /\bcreateCanvas\s*\(/.test(code);
  const usesInstanceMode = /\bnew\s+p5\s*\(/.test(code);

  if (!usesCreateCanvas && !usesInstanceMode) {
    errors.push({
      file: sketchFile,
      message: `Sketch never calls createCanvas() or \`new p5(...)\` — no canvas will appear inside ${formatList(mountIds)}`
    });
    return errors;
  }

  const mountList = mountIds.length > 0 ? mountIds : VALID_SKETCH_MOUNT_IDS;
  const mountAlternation = mountList.map(escapeRegex).join("|");

  if (usesInstanceMode) {
    if (!new RegExp(`['"](${mountAlternation})['"]`).test(jsSource)) {
      errors.push({
        file: sketchFile,
        message: `Sketch uses instance mode but does not reference a known mount id (${formatList(mountList)}) — canvas will mount on <body>`
      });
    }
    return errors;
  }

  if (!new RegExp(`\\.parent\\s*\\(\\s*['"](${mountAlternation})['"]\\s*\\)`).test(jsSource)) {
    errors.push({
      file: sketchFile,
      message: `Sketch calls createCanvas() but never \`.parent('sketch-container')\` (or another valid mount: ${formatList(mountList)}); p5.js will append the canvas to <body>, pushing it below the entry layout`
    });
  }

  return errors;
}

function collectMountIds(sketchSectionHtml: string): string[] {
  const ids: string[] = [];
  for (const id of VALID_SKETCH_MOUNT_IDS) {
    if (new RegExp(`<div\\s+id="${id}"\\s*>\\s*</div>`).test(sketchSectionHtml)) {
      ids.push(id);
    }
  }
  return ids;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatList(values: readonly string[]): string {
  return values.map((value) => `'${value}'`).join(" or ");
}

function stripJsCommentsAndStrings(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""');
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

