import { describe, expect, it } from "vitest";
import { renderAtomFeed } from "./feed";
import type { Entry } from "./content";

function entry(slug: string, sentiment: string): Entry {
  return {
    slug,
    file: `${slug}.html`,
    pagePath: `pages/${slug}.html`,
    date: new Date(`${slug}T12:00:00`),
    displayDate: "May 1, 2026",
    sentiment,
    portraitPath: `images/${slug}-norm.png`
  };
}

describe("renderAtomFeed", () => {
  it("uses the newest entry as the feed updated timestamp", () => {
    const xml = renderAtomFeed([
      entry("2026-05-02", "Newer"),
      entry("2026-05-01", "Older")
    ]);

    expect(xml).toContain(`<updated>${new Date("2026-05-02T12:00:00").toISOString()}</updated>`);
    expect(xml.indexOf("<title>2026-05-02</title>")).toBeLessThan(
      xml.indexOf("<title>2026-05-01</title>")
    );
  });

  it("keeps sentiment text in CDATA", () => {
    const xml = renderAtomFeed([entry("2026-05-01", "Patience & signal <together>")]);

    expect(xml).toContain("<summary><![CDATA[Patience & signal <together>]]></summary>");
  });
});
