import { describe, expect, it } from "vitest";
import { renderDailyEntry, validateDailyEntryInput } from "./entry";

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
});

