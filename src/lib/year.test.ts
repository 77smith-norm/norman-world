import { describe, expect, it } from "vitest";
import { renderYearMonthGrid, type MonthArchive } from "./content";

const months: MonthArchive[] = [
  {
    slug: "2026-04",
    label: "April 2026",
    shortLabel: "April",
    archivePath: "2026-04.html",
    landscapePath: "images/2026-04-landscape.png",
    entries: 30
  }
];

describe("renderYearMonthGrid", () => {
  it("renders month cards with root-relative site paths", () => {
    const html = renderYearMonthGrid(months);

    expect(html).toContain('href="2026-04.html"');
    expect(html).toContain('src="images/2026-04-landscape.png"');
    expect(html).toContain("April");
  });

  it("renders an empty state when no months are complete", () => {
    expect(renderYearMonthGrid([])).toContain("No completed months yet.");
  });
});
