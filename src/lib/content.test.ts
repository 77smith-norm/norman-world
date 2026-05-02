import { describe, expect, it } from "vitest";
import { renderEntryList } from "./content";
import type { Entry } from "./content";

const baseEntry: Entry = {
  slug: "2026-05-01",
  file: "2026-05-01.html",
  pagePath: "pages/2026-05-01.html",
  date: new Date("2026-05-01T12:00:00Z"),
  displayDate: "May 1, 2026",
  sentiment: "A patient signal.",
  portraitPath: "images/2026-05-01-norm.png"
};

describe("renderEntryList", () => {
  it("renders stable relative paths for GitHub Pages root output", () => {
    const html = renderEntryList([baseEntry]);

    expect(html).toContain('href="pages/2026-05-01.html"');
    expect(html).toContain('src="images/2026-05-01-norm.png"');
    expect(html).toContain("May 1, 2026");
  });

  it("renders an empty state when no entries exist", () => {
    expect(renderEntryList([])).toContain("Next entries arriving shortly.");
  });
});

