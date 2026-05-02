import { describe, expect, it } from "vitest";
import { nextMonthSlug, previousMonthSlug, updateIndexHtmlForMonth, updateMonthArchiveHtml } from "./month";

describe("month slug helpers", () => {
  it("moves across year boundaries", () => {
    expect(nextMonthSlug("2026-12")).toBe("2027-01");
    expect(previousMonthSlug("2026-01")).toBe("2025-12");
  });
});

describe("updateMonthArchiveHtml", () => {
  it("updates archive shell metadata and grid for a month", () => {
    const html = `<!doctype html>
<title>April 2026 - Norman World</title>
<meta property="og:title" content="April 2026 - Norman World">
<meta property="og:url" content="https://77smith-norm.github.io/norman-world/2026-04.html">
<meta property="og:image" content="https://77smith-norm.github.io/norman-world/images/2026-04-landscape.png">
<p class="month">April 2026</p>
<img src="images/2026-04-landscape.png" alt="April 2026 Landscape">
<ul class="entry-grid"><li>old</li></ul>`;

    const next = updateMonthArchiveHtml(html, "2026-05");

    expect(next).toContain("<title>May 2026 - Norman World</title>");
    expect(next).toContain('content="https://77smith-norm.github.io/norman-world/2026-05.html"');
    expect(next).toContain('content="https://77smith-norm.github.io/norman-world/images/2026-05-landscape.png"');
    expect(next).toContain('<p class="month">May 2026</p>');
    expect(next).toContain('src="images/2026-05-landscape.png"');
    expect(next).not.toContain("<li>old</li>");
  });
});

describe("updateIndexHtmlForMonth", () => {
  it("updates title, og title, month label, and grid", () => {
    const html = `<!doctype html>
<title>Norman World — April 2026</title>
<meta property="og:title" content="Norman World — April 2026">
<p class="month">April 2026</p>
<ul class="entry-grid"><li>old</li></ul>`;

    const next = updateIndexHtmlForMonth(html, "2026-06");

    expect(next).toContain("<title>Norman World — June 2026</title>");
    expect(next).toContain('content="Norman World — June 2026"');
    expect(next).toContain('<p class="month">June 2026</p>');
    expect(next).toContain("Next entries arriving shortly.");
    expect(next).not.toContain("<li>old</li>");
  });
});
