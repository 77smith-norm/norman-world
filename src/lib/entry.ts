import { dateSlugPattern, formatEntryDate } from "./dates";
import { escapeHtml } from "./html";

export interface HnStoryInput {
  hnItemUrl: string;
  title: string;
  score: string | number;
  articleUrl: string;
  summary: string;
}

export interface EntryModels {
  /** LLM that wrote the entry text (e.g. "xai/grok-4.3"). */
  text: string;
  /** Image model that generated the portrait (e.g. "xai/grok-imagine-image"). */
  image: string;
}

/**
 * Image models permitted for the daily portrait.
 * Source of truth: docs/openclaw-cron-prompt.md (portrait section) and
 * docs/openclaw-cron-contract.md. Update all three together; the audit
 * script diffs the live cron job against the doc to catch drift.
 */
export const IMAGE_MODEL_ALLOWLIST: readonly string[] = ["xai/grok-imagine-image"];

export interface DailyEntryInput {
  date: string;
  title?: string;
  dateLong?: string;
  sentiment: string;
  /** Structured model attribution (preferred for entries from 2026-10-11 on). */
  models?: EntryModels;
  /**
   * @deprecated Legacy single-string model field. Grandfathered: entries
   * written before 2026-10-11 keep rendering, but new entries must use
   * `models`.
   */
  model?: string;
  portraitAlt?: string;
  stories: HnStoryInput[];
}

export function validateDailyEntryInput(input: DailyEntryInput): string[] {
  const errors: string[] = [];

  if (!dateSlugPattern.test(input.date ?? "")) {
    errors.push("date must be YYYY-MM-DD");
  }

  if (!input.sentiment?.trim()) {
    errors.push("sentiment is required");
  }

  if (input.models) {
    if (!input.models.text?.trim()) {
      errors.push("models.text is required");
    }
    if (!input.models.image?.trim()) {
      errors.push("models.image is required");
    } else if (!IMAGE_MODEL_ALLOWLIST.includes(input.models.image.trim())) {
      errors.push(
        `models.image "${input.models.image}" is not in the allowlist (${IMAGE_MODEL_ALLOWLIST.join(", ")}); ` +
          `update docs/openclaw-cron-prompt.md if the portrait provider intentionally changed`
      );
    }
  } else if (input.model?.trim()) {
    // Legacy grandfathered shape: no allowlist enforcement.
  } else {
    errors.push("models.text/models.image (or legacy model) is required");
  }

  if (!Array.isArray(input.stories) || input.stories.length === 0) {
    errors.push("stories must contain at least one HN story");
  }

  for (const [index, story] of (input.stories ?? []).entries()) {
    const label = `stories[${index}]`;
    if (!story.hnItemUrl?.trim()) errors.push(`${label}.hnItemUrl is required`);
    else if (!story.hnItemUrl.includes("news.ycombinator.com"))
      errors.push(`${label}.hnItemUrl must point to Hacker News`);
    if (!story.title?.trim()) errors.push(`${label}.title is required`);
    if (`${story.score ?? ""}`.trim() === "") errors.push(`${label}.score is required`);
    if (!story.articleUrl?.trim()) errors.push(`${label}.articleUrl is required`);
    if (!story.summary?.trim()) errors.push(`${label}.summary is required`);
  }

  return errors;
}

export function renderDailyEntry(template: string, input: DailyEntryInput): string {
  const errors = validateDailyEntryInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  const title = input.title ?? formatEntryDate(input.date);
  const dateLong = input.dateLong ?? formatEntryDate(input.date);
  const portraitAlt = input.portraitAlt ?? `Norm portrait for ${title}`;
  const modelLabel = input.models ? `${input.models.text} · ${input.models.image}` : (input.model ?? "");

  return template
    .replaceAll("{{TITLE}}", escapeHtml(title))
    .replaceAll("{{DATE_SLUG}}", input.date)
    .replaceAll("{{DATE_LONG}}", escapeHtml(dateLong))
    .replaceAll("{{SENTIMENT}}", escapeHtml(input.sentiment))
    .replaceAll("{{MODEL}}", escapeHtml(modelLabel))
    .replace(
      /<img src="\.\.\/images\/\{\{DATE_SLUG\}\}-norm\.png" alt="Norm portrait for \{\{TITLE\}\}" class="norm-portrait">/,
      `<img src="../images/${input.date}-norm.png" alt="${escapeHtml(portraitAlt)}" class="norm-portrait">`
    )
    .replace(
      /<!-- Repeat for each HN story \(typically 3\) -->[\s\S]*?<\/article>/,
      renderStories(input.stories)
    );
}

function renderStories(stories: HnStoryInput[]): string {
  return stories
    .map((story) => `            <article class="hn-story">
                <h3>
                    <a href="${escapeHtml(story.hnItemUrl)}" target="_blank" rel="noopener">${escapeHtml(story.title)}</a>
                </h3>
                <p class="meta">Score: ${escapeHtml(`${story.score}`)} | <a href="${escapeHtml(story.articleUrl)}" target="_blank" rel="noopener">Read article →</a></p>
                <p>${escapeHtml(story.summary)}</p>
            </article>`)
    .join("\n\n");
}
