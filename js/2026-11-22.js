// 2026-11-22 — "A fake city still grows real birds; nobody watching is not the
// same as nobody there."
//
// A built world, drawn once and faintly: vertical struts, a dusk sky laid down in
// bands, nothing that resolves into a picture. Over it, a field of small marks
// drifts on a slow noise current, each one pulled toward one of three invisible
// roosts it was never told about. They are not arranged. They gather.
//
// Every few seconds a broadcast sweep crosses the canvas, and the marks it
// touches brighten and shift — as if the world were being replayed from an
// archive and the marks had to be re-placed by whoever kept the tape. Then the
// sweep is gone and they drift again.
//
// Your hand is the only other force. Hold anywhere and the marks scatter out of
// reach; let go and they come back to the same three empty places. Nobody is
// watching. They come back anyway.

const MARKS = 760;

let marks = [];
let roosts = [];
let t = 0;
let sweepY = 0;
let sweepV = 0;

const INK = [9, 12, 20];
const DUSK = [36, 30, 58];
const AMBER = [216, 152, 74];
const MINT = [151, 209, 190];
const PAPER = [238, 232, 218];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noiseSeed(2211);
  randomSeed(2211);
  layout();
  sweepY = -height * 0.3;
  sweepV = height * 0.00042;
}

function layout() {
  roosts = [
    createVector(width * 0.22, height * 0.36),
    createVector(width * 0.63, height * 0.28),
    createVector(width * 0.46, height * 0.72),
  ];

  marks = [];
  for (let i = 0; i < MARKS; i++) {
    marks.push({
      p: createVector(random(width), random(height)),
      v: createVector(0, 0),
      roost: i % roosts.length,
      seed: random(1000),
      len: random(3, 9),
      warm: random() < 0.18,
      glow: 0,
    });
  }
}

function draw() {
  t += 1;
  drawSky();
  drawStruts();
  drawMarks();
  drawSweep();
  sweepY += sweepV;
  if (sweepY > height * 1.3) sweepY = -height * 0.3;
}

function drawSky() {
  noStroke();
  const bands = 48;
  const h = height / bands;
  for (let i = 0; i < bands; i++) {
    const k = i / (bands - 1);
    const c = lerpColor(color(...INK), color(...DUSK), pow(k, 1.6));
    fill(c);
    rect(0, i * h, width, h + 1);
  }
  // a low, sourceless glow where the sun would be if this place had one
  for (let i = 0; i < 26; i++) {
    const r = width * (0.62 - i * 0.021);
    fill(...AMBER, 3 + i * 0.5);
    ellipse(width * 0.68, height * 0.86, r * 2, r * 0.85);
  }
}

function drawStruts() {
  const step = constrain(width / 14, 46, 120);
  stroke(...PAPER, 12);
  strokeWeight(1);
  for (let x = step * 0.5; x < width; x += step) {
    const drift = sin(t * 0.004 + x * 0.01) * 2;
    line(x + drift, 0, x + drift, height);
  }
  // windows, most of them dark
  noStroke();
  for (let x = step * 0.5; x < width; x += step) {
    for (let y = height * 0.12; y < height * 0.8; y += step * 1.15) {
      const on = noise(x * 0.02, y * 0.02, 3.1);
      if (on > 0.72) {
        fill(...AMBER, 10 + (on - 0.72) * 120);
        rect(x + step * 0.22, y, step * 0.34, step * 0.5);
      }
    }
  }
}

function drawMarks() {
  const mx = mouseX;
  const my = mouseY;
  const hand = mouseIsPressed;

  for (const m of marks) {
    // the current: slow, mostly sideways, so the field reads as weather
    const a = noise(m.p.x * 0.0018, m.p.y * 0.0018, t * 0.0016) * TWO_PI * 2;
    const push = createVector(cos(a), sin(a)).mult(0.22);
    m.v.add(push);

    // the roost: weak, constant, never explained
    const r = roosts[m.roost];
    const to = createVector(r.x - m.p.x, r.y - m.p.y);
    const d = max(to.mag(), 1);
    m.v.add(to.normalize().mult(min(d * 0.0009, 0.16)));

    // the hand
    if (hand) {
      const away = createVector(m.p.x - mx, m.p.y - my);
      const hd = max(away.mag(), 1);
      if (hd < 190) {
        m.v.add(away.normalize().mult((190 - hd) * 0.012));
      }
    }

    m.v.mult(0.965);
    m.p.add(m.v);
    m.glow *= 0.94;

    // wrap, so the field never thins out at the edges
    if (m.p.x < -20) m.p.x = width + 20;
    if (m.p.x > width + 20) m.p.x = -20;
    if (m.p.y < -20) m.p.y = height + 20;
    if (m.p.y > height + 20) m.p.y = -20;

    const ang = atan2(m.v.y, m.v.x);
    const col = m.warm ? AMBER : MINT;
    const base = 26 + m.glow * 120;

    stroke(...col, base);
    strokeWeight(1.1 + m.glow * 1.4);
    noFill();
    const wob = sin(t * 0.02 + m.seed) * 0.5;
    arc(
      m.p.x,
      m.p.y,
      m.len * 2,
      m.len * 0.9,
      ang - PI * 0.62 + wob,
      ang + PI * 0.62 + wob
    );
  }
}

function drawSweep() {
  if (sweepY < -height * 0.1 || sweepY > height * 1.1) return;
  const band = height * 0.16;
  for (let i = 0; i < 16; i++) {
    const k = i / 15;
    const y = sweepY + (k - 0.5) * band;
    fill(...PAPER, 3 + (1 - abs(k - 0.5) * 2) * 9);
    noStroke();
    rect(0, y, width, band / 16 + 1);
  }
  // whatever the sweep passes over is re-placed, slightly
  for (const m of marks) {
    if (abs(m.p.y - sweepY) < band * 0.5) {
      m.glow = 1;
      m.p.x += sin(m.seed + t * 0.05) * 0.6;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}
