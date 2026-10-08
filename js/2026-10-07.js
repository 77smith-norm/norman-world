// 2026-10-07 — "The hands that carried us through the dark leave, and we keep
// asking what progress is for — maybe slower things, made carefully, hold longer."
//
// Abstract p5 sketch. A slow field of cold sparks drifts upward and fades —
// the loud, fast kind of progress that burns bright and does not stay. Across
// it, a smaller set of warm embers is placed by hand, one at a time, and those
// are the ones that persist: they do not race, they simply remain and glow
// long after the drift has moved on. The pointer is a careful hand — hold it
// still and the ground beneath it settles, gathering warm points that hold;
// move on quickly and nothing lingers. Nothing is depicted — only pace,
// persistence, and the difference between what passes and what is kept.

const BG = [8, 10, 16];

let sparks = [];   // the fast, fading drift
let embers = [];   // the slow, lasting lights placed by hand
let t = 0;
let px = -9999, py = -9999;
let still = 0;
let lastPx = -9999, lastPy = -9999;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildField();
}

function buildField() {
  sparks = [];
  const n = max(200, floor((width * height) / 6200));
  for (let i = 0; i < n; i++) {
    sparks.push({
      x: random(width),
      y: random(height),
      v: random(0.15, 0.7),
      s: random(0.8, 2.0),
      a: random(20, 70),
      ph: random(TWO_PI),
    });
  }
  embers = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildField();
}

function draw() {
  background(BG[0], BG[1], BG[2]);
  t += 0.006;

  // Move a steady hand, or hold still.
  const moving = dist(mouseX, mouseY, lastPx, lastPy);
  lastPx = mouseX; lastPy = mouseY;
  if (moving < 1.2 && mouseX > 0 && mouseX < width) {
    still = min(1, still + 0.02);
  } else {
    still = max(0, still - 0.05);
  }
  px = lerp(px, mouseX, 0.08);
  py = lerp(py, mouseY, 0.08);

  // Cold drift: rises and fades, never staying.
  noStroke();
  for (const s of sparks) {
    s.y -= s.v * (0.6 + 0.4 * still);
    if (s.y < -4) { s.y = height + 4; s.x = random(width); }
    const tw = 0.6 + 0.4 * sin(t * 2 + s.ph);
    fill(150, 168, 200, s.a * tw);
    circle(s.x, s.y, s.s);
  }

  // Warm embers: placed where the hand holds still, then they remain.
  if (still > 0.35 && frameCount % 4 === 0) {
    embers.push({ x: px + random(-9, 9), y: py + random(-9, 9), e: 0, ph: random(TWO_PI) });
    if (embers.length > 260) embers.shift();
  }
  for (const em of embers) {
    em.e = min(1, em.e + 0.02);
    const pulse = 0.75 + 0.25 * sin(t * 1.4 + em.ph);
    const r = 10 * em.e * pulse;
    // soft halo
    fill(240, 170, 90, 22 * em.e * pulse);
    circle(em.x, em.y, r * 4.5);
    fill(255, 198, 128, 150 * em.e * pulse);
    circle(em.x, em.y, r);
  }

  // Ground settle: a faint ring of calm beneath the steady hand.
  if (still > 0.05) {
    noFill();
    stroke(255, 214, 160, 60 * still);
    strokeWeight(1);
    circle(px, py, 46 + 10 * sin(t * 2));
    noStroke();
  }
}
