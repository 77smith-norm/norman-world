import { describe, expect, it } from "vitest";
import { IMAGE_MODEL_ALLOWLIST, renderDailyEntry, validateDailyEntryInput } from "./entry";

const template = `<!DOCTYPE html>
<title>{{TITLE}} — Norman World</title>
<meta property="og:description" content="{{SENTIMENT}}">
<meta property="og:image" content="https://77smith-norm.github.io/norman-world/images/{{DATE_SLUG}}-norm.png">
<h1>{{TITLE}}</h1>
<p class="date">{{DATE_LONG}}</p>
<section class="sentiment">
    {{SENTIMENT}}
</section>
<img src="../images/{{DATE_SLUG}}-norm.png" alt="Norm portrait for {{TITLE}}" class="norm-portrait">
<script src="../js/{{DATE_SLUG}}.js"></script>
<section class="inspiration">
            <!-- Repeat for each HN story (typically 3) -->
            <article class="hn-story">
                <h3>
                    <a href="{{HN_ITEM_URL}}" target="_blank" rel="noopener">{{HN_TITLE}}</a>
                </h3>
                <p class="meta">Score: {{HN_SCORE}} | <a href="{{ARTICLE_URL}}" target="_blank" rel="noopener">Read article →</a></p>
                <p>{{HN_SUMMARY}}</p>
            </article>
</section>
<code>{{MODEL}}</code>`;

const input = {
  date: "2026-05-02",
  sentiment: "A sharper harness makes the ritual lighter.",
  model: "openrouter/test-model",
  stories: [
    {
      hnItemUrl: "https://news.ycombinator.com/item?id=1",
      title: "A Test Story",
      score: 42,
      articleUrl: "https://example.com/story",
      summary: "A compact summary."
    }
  ]
};

const structuredInput = {
  ...input,
  model: undefined,
  models: { text: "xai/grok-4.3", image: "xai/grok-imagine-image" }
};

describe("renderDailyEntry", () => {
  it("renders a daily page from template placeholders", () => {
    const html = renderDailyEntry(template, input);

    expect(html).toContain("May 2, 2026 — Norman World");
    expect(html).toContain("../images/2026-05-02-norm.png");
    expect(html).toContain("../js/2026-05-02.js");
    expect(html).toContain("openrouter/test-model");
    expect(html).toContain("A Test Story");
    expect(html).not.toContain("{{");
  });

  it("renders structured models in the byline", () => {
    const html = renderDailyEntry(template, structuredInput);

    expect(html).toContain("xai/grok-4.3 · xai/grok-imagine-image");
    expect(html).not.toContain("{{");
  });

  it("escapes user-provided text", () => {
    const html = renderDailyEntry(template, {
      ...input,
      sentiment: "Signal < script",
      stories: [{ ...input.stories[0], title: "A <Story>" }]
    });

    expect(html).toContain("Signal &lt; script");
    expect(html).toContain("A &lt;Story&gt;");
  });
});

describe("validateDailyEntryInput", () => {
  it("reports missing required fields", () => {
    expect(validateDailyEntryInput({ ...input, date: "May 2" })).toContain("date must be YYYY-MM-DD");
  });

  it("accepts the legacy model string (grandfathered)", () => {
    expect(validateDailyEntryInput(input)).toEqual([]);
  });

  it("accepts structured models when the image model is allowlisted", () => {
    expect(validateDailyEntryInput(structuredInput)).toEqual([]);
  });

  it("rejects an image model outside the allowlist", () => {
    const errors = validateDailyEntryInput({
      ...input,
      model: undefined,
      models: { text: "xai/grok-4.3", image: "someone-else/dream-machine" }
    });

    expect(errors.some((e) => e.includes("not in the allowlist"))).toBe(true);
    expect(IMAGE_MODEL_ALLOWLIST).toContain("xai/grok-imagine-image");
  });

  it("requires models when no legacy model is present", () => {
    const { model: _dropped, ...noModel } = input;

    expect(
      validateDailyEntryInput(noModel).some((e) => e.includes("models.text/models.image"))
    ).toBe(true);
  });

  it("requires hnItemUrl to point at Hacker News", () => {
    const errors = validateDailyEntryInput({
      ...input,
      stories: [{ ...input.stories[0], hnItemUrl: "https://example.com/not-hn" }]
    });

    expect(errors.some((e) => e.includes("must point to Hacker News"))).toBe(true);
  });
});
