// 2026-11-10 — "The things worth keeping keep working in the quiet,
// long after the last signal fades."
//
// A field of points that simply holds its place. Rings are sent outward,
// wander, and die. Nothing reconnects. The lamp stays lit anyway.

let field = [];
let pings = [];
let t = 0;

const INK = [11, 15, 26];
const BONE = [232, 226, 214];
const AMBER = [242, 192, 122];
const TEAL = [52, 111, 106];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  buildField();
}

function buildField() {
  field = [];
  const step = Math.max(42, Math.min(width, height) / 15);
  for (let x = step * 0.5; x < width; x += step) {
    for (let y = step * 0.5; y < height; y += step) {
      field.push({
        x: x + random(-6, 6),
        y: y + random(-6, 6),
        seed: random(1000),
        hold: random(0.35, 1)
      });
    }
  }
}

function draw() {
  // slow breath of the room's darkness
  const breath = 0.5 + 0.5 * Math.sin(t * 0.0055);
  background(INK[0], INK[1], INK[2]);

  drawLampGlow(breath);
  drawFields(breath);
  seedPing();
  drawPings();
  drawHorizon();

  t += 1;
}

function drawLampGlow(breath) {
  const cx = width * 0.82;
  const cy = height * 0.24;
  const reach = Math.min(width, height) * (0.55 + 0.06 * breath);
  const rings = 26;
  for (let i = rings; i > 0; i--) {
    const p = i / rings;
    const r = reach * p;
    const a = 20 * (1 - p) * (0.7 + 0.3 * breath);
    fill(AMBER[0], AMBER[1], AMBER[2], a);
    circle(cx, cy, r * 2);
  }
  // the filament itself
  fill(AMBER[0], AMBER[1], AMBER[2], 190);
  circle(cx, cy, 4 + breath * 2);
}

function drawFields(breath) {
  const d = Math.min(width, height) * 0.34;
  for (const n of field) {
    const near = constrain(1 - dist(mouseX, mouseY, n.x, n.y) / d, 0, 1);
    const drift = 0.55 + 0.45 * noise(n.seed, t * 0.004);
    const a = (26 + 90 * n.hold * drift) * (0.6 + 0.4 * breath) + near * 110;

    // every third point is drawn in amber — the ones that stayed warm
    const warm = n.seed % 3 < 0.9;
    const col = warm ? AMBER : BONE;
    fill(col[0], col[1], col[2], a);
    const size = 1.4 + n.hold * 1.8 + near * 2.6;
    circle(n.x, n.y, size);

    // connection stubs that never complete
    if (near > 0.55) {
      stroke(TEAL[0], TEAL[1], TEAL[2], near * 46);
      strokeWeight(0.7);
      line(n.x, n.y, n.x + (mouseX - n.x) * 0.06, n.y + (mouseY - n.y) * 0.06);
      noStroke();
    }
  }
}

function seedPing() {
  if (field.length === 0) return;
  if (frameCount % 46 === 0) {
    const n = field[Math.floor(random(field.length))];
    pings.push({ x: n.x, y: n.y, r: 4, life: 1, rate: random(0.9, 1.9) });
  }
  if (frameCount % 180 === 0) {
    const n = field[Math.floor(random(field.length))];
    for (let k = 0; k < 3; k++) {
      pings.push({
        x: n.x, y: n.y, r: 6 + k * 10, life: 0.85, rate: random(0.4, 0.7)
      });
    }
  }
}

function drawPings() {
  for (let i = pings.length - 1; i >= 0; i--) {
    const p = pings[i];
    p.r += p.rate;
    p.life -= 0.0065;
    if (p.life <= 0) { pings.splice(i, 1); continue; }

    noFill();
    strokeWeight(1);
    stroke(BONE[0], BONE[1], BONE[2], 70 * p.life * p.life);
    circle(p.x, p.y, p.r * 2);
    stroke(TEAL[0], TEAL[1], TEAL[2], 40 * p.life);
    circle(p.x, p.y, p.r * 2.7);
    noStroke();
  }
}

function drawHorizon() {
  // the shelf line: a single steady rule the whole scene rests on
  const y = height * 0.78;
  stroke(BONE[0], BONE[1], BONE[2], 26);
  strokeWeight(1);
  line(width * 0.06, y, width * 0.94, y);
  noStroke();
}

function mousePressed() {
  for (let k = 0; k < 4; k++) {
    pings.push({ x: mouseX, y: mouseY, r: 2 + k * 12, life: 1, rate: 1.2 });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildField();
}
