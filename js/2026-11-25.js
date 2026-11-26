// 2026-11-25 — "Twenty years of quiet copying is how a book outlives the
// room that banned it."
//
// A dark room. One page in the middle of it, and then another on top, and
// another — the same page, copied by hand, each copy a few pixels off from the
// last because a hand was involved. The rules on each copy line up only roughly.
// Where enough copies overlap, the stack starts to hold light.
//
// The copying never stops. Every few seconds a new sheet arrives and settles,
// and the oldest one slips outward and fades. Nothing in the stack is exactly
// the original. The original is long gone. What survives is the overlap.
//
// Press anywhere and you make a copy yourself — one sheet, your position, your
// small imprecision. Press in the same place twice and the stack thickens there
// until that spot is the brightest thing in the room.
//
// No labels. No permission. Just the copies.

const MAX_SHEETS = 64;
const RULES = 11;
const COPY_EVERY = 96; // frames between automatic copies

let sheets = [];
let t = 0;
let lastCopy = 0;
let seed = 2511;

const INK = [12, 11, 10];
const PAPER = [232, 224, 206];
const FADE = [176, 162, 136];
const GLOW = [226, 178, 112];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noiseSeed(seed);
  randomSeed(seed);
  // begin with a small stack so the canvas is not empty on first paint
  for (let i = 0; i < 9; i++) addSheet(width / 2, height / 2, i < 9);
}

function sheetSize() {
  const s = min(width, height);
  return { w: s * 0.46, h: s * 0.34 };
}

function addSheet(x, y, silent) {
  const { w, h } = sheetSize();
  const jitter = silent ? 1.9 : 2.6;
  sheets.push({
    x: x + random(-jitter, jitter) * 6,
    y: y + random(-jitter, jitter) * 6,
    w: w * random(0.985, 1.015),
    h: h * random(0.985, 1.015),
    rot: random(-0.012, 0.012),
    shear: random(-0.045, 0.045),
    drift: random(-0.05, 0.05),
    seed: random(1000),
    born: t,
  });
  if (sheets.length > MAX_SHEETS) sheets.shift();
}

function draw() {
  t += 1;
  background(...INK);
  drawLamp();

  // the room keeps being copied in
  if (t - lastCopy > COPY_EVERY) {
    lastCopy = t;
    addSheet(width / 2, height / 2, false);
  }

  // oldest first so new copies sit on top
  for (let i = 0; i < sheets.length; i++) {
    drawSheet(sheets[i], i / max(1, sheets.length - 1));
  }

  drawDust();
}

function drawLamp() {
  noStroke();
  const cx = width / 2;
  const cy = height / 2;
  const r = min(width, height) * 0.95;
  const steps = 26;
  for (let i = steps; i > 0; i--) {
    const k = i / steps;
    const a = pow(1 - k, 2.1) * 15;
    fill(...GLOW, a);
    ellipse(cx, cy, r * k, r * k * 0.82);
  }
}

function drawSheet(s, depth) {
  // depth: 0 = oldest, 1 = newest
  const age = 0.16 + depth * 0.84;
  const { w, h } = s;

  // older sheets drift outward and settle
  const push = (1 - depth) * 26;
  const dx = cos(s.seed) * push + sin(t * 0.0016 + s.seed) * (1.4 + push * 0.05);
  const dy = sin(s.seed) * push * 0.7 + cos(t * 0.0013 + s.seed) * (1.1 + push * 0.04);

  const x = s.x + dx;
  const y = s.y + dy;

  push();
  translate(x, y);
  rotate(s.rot);

  const hw = w / 2;
  const hh = h / 2;
  const skew = s.shear * h;

  // the sheet itself
  noStroke();
  fill(...PAPER, 5 + age * 6);
  quad(
    -hw - skew / 2, -hh,
    hw - skew / 2, -hh,
    hw + skew / 2, hh,
    -hw + skew / 2, hh
  );

  // a warm edge where copies overlap heavily
  noFill();
  strokeWeight(0.8);
  stroke(...GLOW, age * 9);
  quad(
    -hw - skew / 2, -hh,
    hw - skew / 2, -hh,
    hw + skew / 2, hh,
    -hw + skew / 2, hh
  );

  // the ruled lines — the same lines on every copy, never quite matching
  strokeWeight(0.7);
  for (let i = 1; i <= RULES; i++) {
    const k = i / (RULES + 1);
    const ly = -hh + k * h;
    const drift = sin(s.seed + i * 0.9 + t * 0.002) * 0.9;
    const xo = k * skew + drift;
    const a = (12 + age * 26) * (0.55 + 0.45 * sin(i * 1.7));
    stroke(...PAPER, max(0, a));
    line(-hw + xo, ly, hw + xo, ly);
  }

  // the newest sheet has a visible body; older ones are only their rules
  if (depth > 0.92) {
    noStroke();
    fill(...PAPER, 8);
    quad(
      -hw - skew / 2, -hh,
      hw - skew / 2, -hh,
      hw + skew / 2, hh,
      -hw + skew / 2, hh
    );
  }

  pop();
}

function drawDust() {
  noStroke();
  for (let i = 0; i < 40; i++) {
    const px = (noise(i * 12.3, t * 0.0006) * 1.6 - 0.3) * width;
    const py = (noise(i * 7.1 + 40, t * 0.0004) * 1.6 - 0.3) * height;
    const a = 8 + 10 * noise(i * 3.3, t * 0.002);
    fill(...PAPER, a);
    ellipse(px, py, 1.1, 1.1);
  }
}

function mousePressed() {
  addSheet(mouseX, mouseY, false);
  // a press lands in the stack; nothing is removed for it
  lastCopy = t;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const { w, h } = sheetSize();
  for (const s of sheets) {
    s.w = w * (s.w / (w * 0.98));
    s.h = h * (s.h / (h * 0.98));
  }
}
