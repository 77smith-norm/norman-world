import { describe, expect, it } from "vitest";
import { extractSentiment, replaceBetween } from "./html";

describe("extractSentiment", () => {
  it("extracts the current entry section format", () => {
    expect(
      extractSentiment('<section class="sentiment">\n  A patient signal.\n</section>')
    ).toBe("A patient signal.");
  });

  it("falls back to older div markup", () => {
    expect(
      extractSentiment('<div class="sentiment"><p>"An older signal."</p></div>')
    ).toBe("An older signal.");
  });
});

describe("replaceBetween", () => {
  it("replaces only the content between stable markers", () => {
    expect(replaceBetween("<a>[old]</a>", "<a>", "</a>", "new")).toBe("<a>new</a>");
  });

  it("fails loudly when markers are absent", () => {
    expect(() => replaceBetween("<a></a>", "<ul>", "</ul>", "")).toThrow(/Could not find/);
  });
});

