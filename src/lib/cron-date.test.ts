import { describe, expect, it } from "vitest";
import { previousLocalDateSlug } from "./dates";

describe("previousLocalDateSlug", () => {
  it("returns the previous Los Angeles calendar day for a 2 AM cron run", () => {
    expect(previousLocalDateSlug(new Date("2026-05-03T09:00:00Z"))).toBe("2026-05-02");
  });

  it("handles month boundaries", () => {
    expect(previousLocalDateSlug(new Date("2026-06-01T09:00:00Z"))).toBe("2026-05-31");
  });
});
