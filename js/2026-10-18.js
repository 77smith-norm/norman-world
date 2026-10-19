// js/2026-10-18.js
// Inspired by: hybrid reasoning agents, Gibson and cyberspace, medieval rabbits
// A continuous field that keeps condensing into discrete marks — thought
// arriving before language, then leaving a trace that can be fenced.

let field = [];
let marks = [];
let t = 0;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  buildField();
}

function buildField() {
  field = [];
  const step = 34;
  for (let x = -step; x < width + step; x += step) {
    for (let y = -step; y < height + step; y += step) {
      field.push({
        bx: x,
        by: y,
        x: x,
        y: y,
        seed: random(1000)
      });
    }
  }
  marks = [];
}

function draw() {
  // Slow wash so old marks fade rather than vanish.
  background(255, 8, 6, 7);
  t += 0.006;

  const mx = mouseX || width * 0.5;
  const my = mouseY || height * 0.5;

  // Latent field: a continuous surface of drift, no discrete units yet.
  for (const p of field) {
    const flow = noise(p.bx * 0.0022, p.by * 0.0022, t) - 0.5;
    const swirl = noise(p.by * 0.0016, t * 0.7) - 0.5;

    const dx = mx - p.bx;
    const dy = my - p.by;
    const d2 = dx * dx + dy * dy;
    const pull = 1 / (1 + d2 * 0.00006);

    p.x = p.bx + flow * 42 + swirl * 26 - dx * 0.03 * pull;
    p.y = p.by + swirl * 38 + flow * 20 - dy * 0.03 * pull;

    const hue = 258 + sin(p.seed + t * 1.4) * 22;
    const sat = 26 + pull * 34;
    const bri = 58 + pull * 32;
    const alpha = 14 + pull * 46;

    fill(hue, sat, bri, alpha);
    const r = 3.2 + pull * 5.5;
    ellipse(p.x, p.y, r, r);

    // Every so often the field commits to a mark — a token, a word.
    if (random(1) < 0.0022 + pull * 0.01) {
      marks.push({
        x: p.x,
        y: p.y,
        life: 100,
        size: random(9, 22),
        hue: random(30, 46)
      });
    }
  }

  // The marks: what survives after the thinking becomes text.
  for (let i = marks.length - 1; i >= 0; i--) {
    const m = marks[i];
    m.life -= 0.55;
    if (m.life <= 0) {
      marks.splice(i, 1);
      continue;
    }
    const a = m.life * 0.34;
    noFill();
    stroke(m.hue, 62, 96, a);
    strokeWeight(1.1);
    rect(m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
    noStroke();
    fill(m.hue, 40, 100, a * 0.5);
    ellipse(m.x, m.y, 2.6, 2.6);
  }

  // A faint enclosure near the pointer — a fence drawn around nothing.
  const ringR = 130 + sin(t * 3) * 12;
  noFill();
  stroke(212, 30, 90, 12);
  strokeWeight(1);
  ellipse(mx, my, ringR * 2, ringR * 2);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildField();
}
