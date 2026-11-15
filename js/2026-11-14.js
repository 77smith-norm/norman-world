// 2026-11-14 — "The rocket falls on purpose, and someone waits below with
// open hands. Most of the work happens before the vessel exists."
//
// Half-discs come down out of the dark one at a time and settle against
// whatever is already there, flat side down, until the ground is covered in a
// packing nobody designed. Each one locks where it lands, not where it was
// aimed. When a piece finally comes to rest, a single warm ring goes out of it
// and is gone. Move to lean the field; press to drop a piece where you point.

let pieces = [];
let settled = [];
let pulses = [];
let falling = null;
let lean = 0;
let leanTarget = 0;
let t = 0;
let spawnTimer = 0;

const SKY = [8, 10, 16];
const DEEP = [16, 20, 30];
const PALE = [222, 228, 240];
const ICE = [128, 148, 176];
const AMBER = [238, 202, 150];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedField();
}

function groundY() {
  return height * 0.84;
}

function seedField() {
  settled = [];
  pulses = [];
  falling = null;
  pieces = [];
  // begin with a few already down, so the field is never empty
  const base = Math.floor(width / 26);
  for (let i = 0; i < base; i++) {
    settle({
      x: random(width),
      y: groundY(),
      r: random(minSide() * 0.018, minSide() * 0.05),
      born: -Infinity
    }, true);
  }
  spawn();
}

function minSide() {
  return Math.min(width, height);
}

function spawn(atX) {
  const r = random(minSide() * 0.02, minSide() * 0.075);
  const x = atX !== undefined ? atX : random(r, width - r);
  falling = { x, y: -r * 1.6, r, v: 0.4 + r * 0.006 };
}

function draw() {
  t += 1;
  lean = lerp(lean, leanTarget, 0.04);

  drawSky();

  push();
  translate(lean * width * 0.03, 0);

  if (spawnTimer > 0) spawnTimer -= 1;
  if (!falling && settled.length < Math.floor(width / 12)) {
    spawn();
  }
  if (falling) stepFalling();

  drawSettled();
  drawPulses();
  drawGround();
  drawFalling();
  pop();
}

function stepFalling() {
  const p = falling;
  p.v += 0.22 + p.r * 0.004;
  p.y += p.v;

  const gy = groundY();
  let hit = null;
  let best = Infinity;

  if (p.y >= gy) {
    hit = { y: gy, x: p.x };
  }

  for (const s of settled) {
    const dx = p.x - s.x;
    const dy = p.y - s.y;
    const need = p.r + s.r;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < need) {
      const k = (need - d) / Math.max(d, 0.001);
      if (k < best) {
        best = k;
        hit = { y: s.y + (dy / Math.max(d, 0.001)) * need, x: s.x + (dx / Math.max(d, 0.001)) * need };
      }
    }
  }

  if (hit) {
    const rest = { x: constrain(hit.x, p.r, width - p.r), y: hit.y, r: p.r, born: t };
    if (rest.y <= gy + 0.5) rest.y = Math.min(rest.y, gy);
    if (rest.y > gy) rest.y = gy;
    settle(rest, false);
    falling = null;
    spawnTimer = Math.floor(random(14, 40));
  }
}

function settle(s, silent) {
  settled.push(s);
  if (!silent) {
    pulses.push({ x: s.x, y: s.y, r: s.r, life: 1 });
  }
}

function drawSky() {
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, `rgb(${SKY[0]},${SKY[1]},${SKY[2]})`);
  g.addColorStop(0.62, `rgb(${DEEP[0]},${DEEP[1]},${DEEP[2]})`);
  g.addColorStop(1, 'rgb(5,6,10)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);
}

function drawSettled() {
  for (const s of settled) {
    // upper half only: flat side down on the ground or on the piece below
    const age = constrain((t - s.born) / 90, 0, 1);
    const ease = s.born === -Infinity ? 1 : age;

    fill(PALE[0], PALE[1], PALE[2], 8 + 26 * ease);
    arc(s.x, s.y, s.r * 2, s.r * 2, PI, TWO_PI, PIE);

    noFill();
    stroke(ICE[0], ICE[1], ICE[2], 34 + 40 * ease);
    strokeWeight(1);
    arc(s.x, s.y, s.r * 2, s.r * 2, PI, TWO_PI, OPEN);
    noStroke();
  }
}

function drawFalling() {
  if (!falling) return;
  const p = falling;
  noFill();
  stroke(PALE[0], PALE[1], PALE[2], 120);
  strokeWeight(1.2);
  arc(p.x, p.y, p.r * 2, p.r * 2, PI, TWO_PI, OPEN);
  stroke(AMBER[0], AMBER[1], AMBER[2], 40);
  strokeWeight(2);
  line(p.x - p.r * 0.5, p.y, p.x + p.r * 0.5, p.y);
  noStroke();
}

function drawPulses() {
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i];
    const k = 1 - p.life;
    noFill();
    stroke(AMBER[0], AMBER[1], AMBER[2], 130 * p.life);
    strokeWeight(1 + 1.4 * p.life);
    arc(p.x, p.y, p.r * 2 * (1 + k * 2.2), p.r * 2 * (1 + k * 2.2), PI, TWO_PI, OPEN);
    noStroke();
    p.life -= 0.022;
    if (p.life <= 0) pulses.splice(i, 1);
  }
}

function drawGround() {
  const gy = groundY();
  stroke(ICE[0], ICE[1], ICE[2], 30);
  strokeWeight(1);
  line(width * 0.04, gy, width * 0.96, gy);
  noStroke();

  // a chalk haze over the settled field — the part that was decided already
  const g = drawingContext.createLinearGradient(0, gy - height * 0.18, 0, gy);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(30,38,54,0.28)');
  drawingContext.fillStyle = g;
  rect(0, gy - height * 0.18, width, height * 0.18);
}

function mouseMoved() {
  leanTarget = (mouseX / Math.max(1, width) - 0.5) * 2;
}

function dropHere() {
  if (!falling) spawn(constrain(mouseX, 0, width));
}

function mousePressed() {
  dropHere();
}

function touchStarted() {
  dropHere();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedField();
}
