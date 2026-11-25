// 2026-11-24 — "What felt like a floor was only the last place we looked;
// even a button's click is a small decision of the hand."
//
// A ruled plane, drawn as if it were the bottom of something: thin horizontal
// lines, evenly spaced, holding still. It looks like a floor because floors are
// what we call the last line we have examined.
//
// A slow band climbs the canvas. Everything it crosses is measured again, and
// the lines inside it bend a little and brighten — not much, a few pixels, the
// amount a floor would move if it had been a guess. Above the band the plane is
// dark and settled; below it, already re-checked, it is slightly elsewhere.
//
// Press anywhere and a small ring goes out from your fingertip, and the lines it
// passes through are permanently nudged. One press is almost nothing. Hold and
// press again, in different places, and the plane stops being regular — it
// becomes the record of where a hand decided to touch it.
//
// Nothing is being solved. The band keeps climbing. The floor keeps being the
// last place looked.

const RULES = 26;
const STEPS = 64;

let rules = [];
let presses = [];
let t = 0;
let scanY = 0;
let scanV = 0;

const INK = [10, 11, 16];
const SLATE = [28, 32, 44];
const CHALK = [226, 224, 214];
const BRASS = [214, 168, 92];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noiseSeed(2411);
  randomSeed(2411);
  buildRules();
  scanY = height * 1.15;
  scanV = -height * 0.00028;
}

function buildRules() {
  rules = [];
  for (let i = 0; i < RULES; i++) {
    const k = i / (RULES - 1);
    const offs = [];
    for (let s = 0; s < STEPS; s++) {
      offs.push(0);
    }
    rules.push({
      k,
      y: height * (0.08 + k * 0.84),
      seed: random(1000),
      offs,
      lit: 0,
    });
  }
}

function draw() {
  t += 1;
  background(...INK);

  drawVignette();
  drawRules();
  drawPresses();
  drawScan();

  scanY += scanV;
  if (scanY < -height * 0.2) scanY = height * 1.2;

  // presses age out visually but their displacement stays
  for (const p of presses) p.age += 1;
  presses = presses.filter((p) => p.age < 260);
}

function drawVignette() {
  noStroke();
  const bands = 40;
  const h = height / bands;
  for (let i = 0; i < bands; i++) {
    const k = i / (bands - 1);
    const edge = pow(abs(k - 0.5) * 2, 2.2);
    const c = lerpColor(color(...SLATE), color(...INK), edge);
    fill(c);
    rect(0, i * h, width, h + 1);
  }
}

function drawRules() {
  const bandHalf = height * 0.13;

  for (const r of rules) {
    const nearScan = abs(r.y - scanY);
    const inBand = nearScan < bandHalf;
    const glow = inBand ? 1 - nearScan / bandHalf : 0;

    // the band re-measures the line: it brightens, and it moves
    r.lit = lerp(r.lit, glow, 0.12);

    noFill();
    strokeWeight(1);

    for (let s = 0; s < STEPS - 1; s++) {
      const x1 = (s / (STEPS - 1)) * width;
      const x2 = ((s + 1) / (STEPS - 1)) * width;

      const y1 = lineY(r, s, glow);
      const y2 = lineY(r, s + 1, glow);

      const warm = r.lit > 0.35 && s % 9 === 0;
      const col = warm ? BRASS : CHALK;
      const a = 12 + r.lit * 46 + (warm ? 18 * r.lit : 0);

      stroke(...col, a);
      line(x1, y1, x2, y2);
    }

    // the line's own weight, faint, so the plane reads as one surface
    stroke(...CHALK, 4 + r.lit * 8);
    strokeWeight(0.6);
    line(0, r.y, width, r.y);
  }
}

function lineY(r, s, glow) {
  const x = (s / (STEPS - 1)) * width;

  // a slow, permanent wave — the plane was never exactly flat
  let y = r.y + sin(x * 0.006 + r.seed + t * 0.0015) * 1.6;

  // the band's re-measurement: a bend that fades behind the sweep
  if (glow > 0) {
    y += sin(x * 0.011 + r.seed * 2 + t * 0.004) * glow * 4.2;
  }

  // every press has moved this line a little, and never moved it back
  for (const p of presses) {
    const d = dist(x, r.y, p.x, p.y);
    if (d < p.reach) {
      const k = (1 - d / p.reach) * p.strength;
      y += sin(r.seed + s * 0.4 + p.age * 0.01) * k * 5.5;
      y += (p.y - r.y) * k * 0.16;
    }
  }

  return y;
}

function drawScan() {
  if (scanY < -height * 0.2 || scanY > height * 1.2) return;
  const band = height * 0.26;
  noStroke();
  for (let i = 0; i < 18; i++) {
    const k = i / 17;
    const y = scanY + (k - 0.5) * band;
    const a = (1 - abs(k - 0.5) * 2) * 7;
    fill(...CHALK, a);
    rect(0, y, width, band / 18 + 1);
  }
}

function drawPresses() {
  for (const p of presses) {
    const life = 1 - p.age / 260;
    const r = 6 + p.age * 2.1;
    noFill();
    strokeWeight(1.1);
    stroke(...BRASS, 70 * life * life);
    ellipse(p.x, p.y, r * 2, r * 0.62);
    stroke(...CHALK, 22 * life);
    ellipse(p.x, p.y, r * 1.2, r * 0.4);
  }
}

function mousePressed() {
  const reach = min(width, height) * 0.34;
  presses.push({
    x: mouseX,
    y: mouseY,
    age: 0,
    reach,
    strength: random(0.7, 1.25),
  });
  if (presses.length > 14) presses.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const keep = presses.map((p) => ({ ...p }));
  buildRules();
  presses = keep;
  scanY = height * 1.15;
}
