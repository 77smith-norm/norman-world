import { describe, expect, it } from "vitest";
import { validateCurrentMonthIndex, validateHomePage } from "./site-invariants";

const validHome = `<!doctype html>
<meta property="og:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world.png">
<meta name="twitter:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world.png">
<div class="hero">
  <img src="assets/norman_world.png" alt="Norman World">
</div>`;

describe("validateHomePage", () => {
  it("accepts the canonical homepage hero", () => {
    expect(validateHomePage(validHome)).toEqual([]);
  });

  it("rejects a month landscape as the homepage hero", () => {
    const html = validHome.replace(
      '<img src="assets/norman_world.png" alt="Norman World">',
      '<img src="images/2026-04-landscape.png" alt="April 2026 Landscape">'
    );

    expect(validateHomePage(html)).toEqual([
      {
        file: "index.html",
        message: "Homepage hero image must remain assets/norman_world.png"
      },
      {
        file: "index.html",
        message: "Homepage hero must not use a month landscape image"
      }
    ]);
  });
});

describe("validateCurrentMonthIndex", () => {
  it("rejects entries outside the labeled month", () => {
    const html = `<p class="month">May 2026</p>
<ul class="entry-grid">
  <li><a href="pages/2026-04-30.html">Wrong month</a></li>
</ul>`;

    expect(validateCurrentMonthIndex(html)).toContainEqual({
      file: "index.html",
      message: "Current-month index links to non-current-month entry pages/2026-04-30.html"
    });
  });
});

