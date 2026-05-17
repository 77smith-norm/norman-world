import { describe, expect, it } from "vitest";
import {
  validateCurrentMonthIndex,
  validateEntryPage,
  validateEntrySketch,
  validateHomePage
} from "./site-invariants";

const validHome = `<!doctype html>
<meta property="og:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world_plumo.png">
<meta name="twitter:image" content="https://77smith-norm.github.io/norman-world/assets/norman_world_plumo.png">
<div class="hero">
  <div class="hero-image" data-hero-cycler>
    <img class="light-img" src="assets/norman_world_plumo.png" alt="Norman World" data-variants="norman_world_plumo,norman_world">
    <img class="dark-img" src="assets/norman_world_plumo_dark.png" alt="Norman World" data-variants="norman_world_plumo_dark,norman_world_dark">
  </div>
  <div class="hero-content"></div>
</div>`;

describe("validateHomePage", () => {
  it("accepts the canonical homepage hero", () => {
    expect(validateHomePage(validHome)).toEqual([]);
  });

  it("rejects a month landscape as the homepage hero", () => {
    const html = validHome.replace(
      '<img class="light-img" src="assets/norman_world_plumo.png" alt="Norman World" data-variants="norman_world_plumo,norman_world">',
      '<img class="light-img" src="images/2026-04-landscape.png" alt="April 2026 Landscape">'
    );

    expect(validateHomePage(html)).toEqual([
      {
        file: "index.html",
        message: "Homepage hero light image must default to assets/norman_world_plumo.png"
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

const validEntryPage = (slug: string) => `<section class="sketch">
  <div id="sketch-container"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <script src="../js/${slug}.js"></script>
</section>`;

describe("validateEntryPage", () => {
  it("accepts the canonical sketch section", () => {
    expect(validateEntryPage(validEntryPage("2026-05-15"), "2026-05-15")).toEqual([]);
  });

  it("flags a missing #sketch-container mount", () => {
    const html = validEntryPage("2026-05-15").replace('<div id="sketch-container"></div>', "");
    expect(validateEntryPage(html, "2026-05-15")).toContainEqual({
      file: "pages/2026-05-15.html",
      message:
        'Entry page is missing a sketch mount inside <section class="sketch">; expected one of \'sketch-container\' or \'canvas-container\' as <div id="...">. Without it the p5.js sketch has no mount point and renders at the bottom of <body>.'
    });
  });

  it("accepts canvas-container as an alternate mount id", () => {
    const html = validEntryPage("2026-05-15").replace(
      '<div id="sketch-container"></div>',
      '<div id="canvas-container"></div>'
    );
    expect(validateEntryPage(html, "2026-05-15")).toEqual([]);
  });

  it("accepts p5.js loaded from <head> rather than the sketch section", () => {
    const html = `<head><script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script></head>
<section class="sketch">
  <div id="sketch-container"></div>
  <script src="../js/2026-05-15.js"></script>
</section>`;
    expect(validateEntryPage(html, "2026-05-15")).toEqual([]);
  });

  it("flags a missing sketch section wrapper", () => {
    expect(validateEntryPage("<div>no sketch</div>", "2026-05-15")).toContainEqual({
      file: "pages/2026-05-15.html",
      message: 'Entry page is missing the <section class="sketch"> wrapper'
    });
  });
});

const goodSketch = `function setup() {
  const cnv = createCanvas(400, 400);
  cnv.parent('sketch-container');
}`;

const orphanSketch = `function setup() {
  createCanvas(400, 400);
}`;

describe("validateEntrySketch", () => {
  it("accepts a sketch that parents its canvas", () => {
    expect(validateEntrySketch(goodSketch, "2026-05-15")).toEqual([]);
  });

  it("flags a sketch that never parents its canvas", () => {
    expect(validateEntrySketch(orphanSketch, "2026-05-09")).toEqual([
      {
        file: "js/2026-05-09.js",
        message:
          "Sketch calls createCanvas() but never `.parent('sketch-container')` (or another valid mount: 'sketch-container' or 'canvas-container'); p5.js will append the canvas to <body>, pushing it below the entry layout"
      }
    ]);
  });

  it("accepts double-quoted .parent and ignores .parent calls hidden in comments", () => {
    const src = `function setup() {
  // Forgot canvas.parent("sketch-container") on the previous version
  const c = createCanvas(400, 400);
  c.parent("sketch-container");
}`;
    expect(validateEntrySketch(src, "2026-05-15")).toEqual([]);
  });

  it("flags a .parent call that targets the wrong container", () => {
    const src = `function setup() {
  const c = createCanvas(400, 400);
  c.parent('wrong-id');
}`;
    expect(validateEntrySketch(src, "2026-05-15")).toEqual([
      {
        file: "js/2026-05-15.js",
        message:
          "Sketch calls createCanvas() but never `.parent('sketch-container')` (or another valid mount: 'sketch-container' or 'canvas-container'); p5.js will append the canvas to <body>, pushing it below the entry layout"
      }
    ]);
  });

  it("accepts instance mode mounted at sketch-container", () => {
    const src = `new p5((p) => {
  p.setup = () => { p.createCanvas(400, 400); };
}, 'sketch-container');`;
    expect(validateEntrySketch(src, "2026-05-15")).toEqual([]);
  });

  it("flags an empty sketch file", () => {
    expect(validateEntrySketch("   \n  ", "2026-05-15")).toEqual([
      { file: "js/2026-05-15.js", message: "Sketch file is empty" }
    ]);
  });
});

