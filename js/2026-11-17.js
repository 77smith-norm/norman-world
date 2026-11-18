// 2026-11-17 — "The invisible layer goes dark first, and someone quietly
// copies the rooms where people once asked for help."
//
// A field of points, the kind nobody looks at directly: each one holds a small
// halo of answer. They go out on their own slow schedule, from the edges
// inward, and the field thins without any event to mark it. A pale band sweeps
// left to right without stopping; wherever it crosses a point that has gone
// dark, it leaves a thin ring behind instead of relighting it — a copy, not a
// repair. Rings drift up and fade. Move to warm and hold the points near the
// pointer; press to send a faster sweep that copies everything it passes.

let nodes = [];
let rings = [];
let t = 0;
let sweepX = 0;
let sweepSpeed = 0.9;
let burst = 0;

const VOID = [5, 7, 9];
const DEEP = [11, 15, 21];
const CYAN = [136, 196, 214];
const AMBER = [232, 196, 138];
const BAND = [206, 220, 232];
const DARK = [24, 29, 36];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedField();
  sweepX = -width * 0.15;
}

function seedField() {
  nodes = [];
  rings = [];
  noiseSeed(1711);

  const target = constrain(Math.floor((width * height) / 5200), 90, 620);
  let guard = 0;
  while (nodes.length < target && guard < target * 40) {
    guard++;
    const x = random(width * 0.02, width * 0.98);
    const y = random(height * 0.05, height * 0.95);
    // a loose lattice: keep points from stacking on each other
    let tooClose = false;
    for (const n of nodes) {
      if (abs(n.x - x) < 26 && abs(n.y - y) < 26) { tooClose = true; break; }
    }
    if (tooClose) continue;

    const edge = Math.min(x / width, 1 - x / width) + Math.min(y / height, 1 - y / height);
    nodes.push({
      x,
      y,
      // points nearer the rim die sooner — the perimeter goes first
      rim: constrain(1 - edge * 1.1, 0, 1),
      life: 1,
      out: 0,
      phase: random(TWO_PI),
      rate: random(0.006, 0.02),
      r: random(1.5, 3.6),
      warmth: random(),
      crossed: -1
    });
  }
}

function draw() {
  t += 1;
  burst *= 0.94;

  drawGround();

  const speed = sweepSpeed + burst * 26;
  sweepX += speed;
  if (sweepX > width * 1.16) {
    sweepX = -width * 0.16;
    for (const n of nodes) n.crossed = -1;
  }

  stepNodes();
  drawBand(sweepX);
  drawNodes();
  drawRings();
}

function drawGround() {
  const g = drawingContext.createLinearGradient(0, 0, width * 0.35, height);
  g.addColorStop(0, `rgb(${VOID[0]},${VOID[1]},${VOID[2]})`);
  g.addColorStop(0.55, `rgb(${DEEP[0]},${DEEP[1]},${DEEP[2]})`);
  g.addColorStop(1, `rgb(${VOID[0] + 2},${VOID[1] + 3},${VOID[2] + 5})`);
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  // a barely-there grid, the shape of the layer rather than its contents
  stroke(80, 110, 128, 12);
  strokeWeight(1);
  const step = Math.max(56, width / 22);
  for (let x = step * 0.5; x < width; x += step) line(x, 0, x, height);
  for (let y = step * 0.5; y < height; y += step) line(0, y, width, y);
  noStroke();
}

function stepNodes() {
  for (const n of nodes) {
    const d = dist(mouseX, mouseY, n.x, n.y);
    const near = d < 130 ? 1 - d / 130 : 0;

    // slow autonomous decay, faster at the edges
    const drain = (0.00006 + n.rim * 0.00042) * (1 + 0.35 * sin(t * 0.004 + n.phase));
    n.life = constrain(n.life - drain - 0.0016 * burst, 0, 1);

    if (near > 0) n.life = constrain(n.life + near * 0.006, 0, 1);

    if (n.life < 0.02) n.out = 1;

    // the sweep copies what is already dark, it does not restore it
    const nearBand = abs(n.x - sweepX) < 3;
    if (nearBand && n.crossed !== Math.floor(sweepX / 40)) {
      n.crossed = Math.floor(sweepX / 40);
      if (n.life < 0.55) {
        rings.push({
          x: n.x,
          y: n.y,
          r: n.r,
          grow: random(0.12, 0.34),
          life: 1,
          drift: random(-0.12, 0.12),
          vy: random(0.06, 0.34),
          warm: n.warmth + (n.life < 0.15 ? 0.25 : 0)
        });
      }
    }
  }
}

function drawBand(x) {
  const w = 120;
  const g = drawingContext.createLinearGradient(x - w, 0, x + w, 0);
  g.addColorStop(0, 'rgba(206,220,232,0)');
  g.addColorStop(0.5, `rgba(206,220,232,${0.05 + 0.03 * burst})`);
  g.addColorStop(1, 'rgba(206,220,232,0)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(x - w, 0, w * 2, height);

  stroke(BAND[0], BAND[1], BAND[2], 26 + 22 * burst);
  strokeWeight(1);
  line(x, 0, x, height);
  noStroke();
}

function drawNodes() {
  for (const n of nodes) {
    const breathe = sin(t * n.rate + n.phase) * 0.5 + 0.5;
    const a = n.life * (0.35 + 0.65 * breathe);

    if (a < 0.015) {
      // the socket where a point used to be
      fill(DARK[0], DARK[1], DARK[2], 150);
      circle(n.x, n.y, n.r * 1.2);
      continue;
    }

    const warm = n.warmth > 0.86;
    const col = warm ? AMBER : CYAN;

    fill(col[0], col[1], col[2], 22 * a);
    circle(n.x, n.y, n.r * 7.5 * (0.7 + breathe * 0.5));

    fill(col[0], col[1], col[2], 40 * a);
    circle(n.x, n.y, n.r * 3.2);

    fill(col[0], col[1], col[2], 225 * a);
    circle(n.x, n.y, n.r * 1.35);
  }
}

function drawRings() {
  for (let i = rings.length - 1; i >= 0; i--) {
    const g = rings[i];
    const k = 1 - g.life;
    const rad = g.r * 2 + k * 34 * (1 + burst);

    noFill();
    const col = g.warm > 1 ? AMBER : CYAN;
    stroke(col[0], col[1], col[2], 130 * g.life * g.life);
    strokeWeight(1 + 0.8 * g.life);
    circle(g.x, g.y, rad);
    noStroke();

    g.y += g.vy;
    g.x += g.drift;
    g.life -= 0.0055 + 0.004 * burst;

    if (g.life <= 0) rings.splice(i, 1);
  }
}

function mousePressed() {
  burst = 1;
}

function touchStarted() {
  burst = 1;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedField();
}
