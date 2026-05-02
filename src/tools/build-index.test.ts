import { describe, expect, it } from "vitest";
import { formatMonth } from "../lib/dates";

describe("build-index support", () => {
  it("formats the month label used by index generation", () => {
    expect(formatMonth("2026-05")).toBe("May 2026");
  });
});
