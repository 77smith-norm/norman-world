// Norman World — 2026-09-15
// Sentiment: To hear a bird and answer with a drawing: that is the whole of
// memory — listen, hold, return it as something softer.
// Abstract: a pale paper field where sound arrives from below as rising
// motes, each one a brief chirp. Motes are caught — held — and slowly
// re-spoken as fine ink strokes that trace the shape of what was heard,
// then fade into the paper like a mark that has been remembered long
// enough to soften. The pointer is an ear: move it and nearby motes bend
// toward it; press and a whole flock arrives at once, every stroke laying
// itself down together, the field briefly dense with ink, then quieting.
// No characters, no icons — only listening, holding, and the softer return.

const PAPER = { r: 244, g: 241, b: 232 };
const INK = { r: 38, g: 42, b: 52 };
const SEPIA = { r: 148, g: 112, b: 74 };
const SKY = { r: 118, g: 148, b: 172 };
const GOLD = { r: 214, g: 176, b: 96 };

let motes = [];
let strokes = [];
let t = 0;
let px = -1;
let py = -1;
let held = 0;
let flock = 0;
let paperGrain = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  buildGrain();
}

function buildGrain() {
  paperGrain = [];
  const n = Math.floor((width * height) / 9000);
  for (let i = 0; i < n; i++) {
    paperGrain.push({
      x: random(width),
      y: random(height),
      a: random(4, 14),
      s: random(0.4, 1.4)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrain();
}

function spawnMote(force) {
  motes.push({
    x: random(width * 0.06, width * 0.94),
    y: height + random(10, 60),
    vy: random(0.5, 1.5) * force,
    sway: random(-0.6, 0.6),
    phase: random(TWO_PI),
    life: 0,
    maxLife: random(180, 340),
    tone: random() < 0.5 ? SEPIA : SKY,
    amp: random(12, 46)
  });
}

function speak(m) {
  // turn a held chirp into a fine ink stroke, softened with age
  strokes.push({
    pts: [],
    x: m.x,
    y: m.y,
    drift: random(-0.25, 0.25),
    age: 0,
    tone: m.tone,
    width: random(0.6, 1.7)
  });
}

function draw() {
  t++;
  background(PAPER.r, PAPER.g, PAPER.b);

  // paper texture
  noStroke();
  for (const g of paperGrain) {
    fill(INK.r, INK.g, INK.b, g.a);
    circle(g.x, g.y, g.s);
  }

  if (flock > 0) {
    flock *= 0.94;
    for (let i = 0; i < 4; i++) spawnMote(1.6);
  }
  if (t % 22 === 0) spawnMote(1);

  // ear: the pointer bends nearby motes toward itself
  const earOn = px >= 0 && py >= 0;

  for (let i = motes.length - 1; i >= 0; i--) {
    const m = motes[i];
    m.life++;
    m.phase += 0.03;

    if (earOn) {
      const dx = px - m.x;
      const dy = py - m.y;
      const d = Math.hypot(dx, dy) + 1;
      const pull = constrain(220 / (d * d), 0, 2.4);
      m.x += dx * pull * 0.02;
      m.y += dy * pull * 0.02;
    }

    m.x += Math.sin(m.phase) * m.sway;
    m.y -= m.vy;

    const fade = m.life / m.maxLife;
    const alpha = fade < 0.15 ? map(fade, 0, 0.15, 0, 190)
                             : map(fade, 0.5, 1, 190, 0);

    stroke(m.tone.r, m.tone.g, m.tone.b, alpha * 0.85);
    strokeWeight(2.1);
    point(m.x, m.y);

    // held long enough — it becomes a mark
    if (m.life > m.maxLife * 0.45 && m.life % 3 === 0 && strokes.length < 900) {
      speak(m);
    }

    if (m.y < -20 || fade >= 1) motes.splice(i, 1);
  }

  // the returning: strokes trace and soften into the paper
  for (let i = strokes.length - 1; i >= 0; i--) {
    const s = strokes[i];
    s.age++;
    const wob = Math.sin(s.age * 0.05 + s.x * 0.01) * 6;
    const tx = s.x + s.drift * s.age * 0.3;
    const ty = s.y - s.age * 0.35 + wob;

    if (s.pts.length === 0 || dist(tx, ty, s.pts[s.pts.length - 1].x, s.pts[s.pts.length - 1].y) > 2) {
      s.pts.push({ x: tx, y: ty });
    }
    if (s.pts.length > 90) s.pts.shift();

    const soft = constrain(1 - s.age / 420, 0, 1);
    noFill();
    stroke(s.tone.r, s.tone.g, s.tone.b, 90 * soft);
    strokeWeight(s.width * (0.5 + soft));
    beginShape();
    for (const p of s.pts) vertex(p.x, p.y);
    endShape();

    // the echo, when a stroke has fully softened
    if (s.age > 420) {
      stroke(s.tone.r, s.tone.g, s.tone.b, 24);
      strokeWeight(s.width * 0.5);
      beginShape();
      for (const p of s.pts) vertex(p.x, p.y - 1.5);
      endShape();
      strokes.splice(i, 1);
    }
  }

  // the ear itself, drawn as a faint listening ring — never a figure
  if (earOn) {
    noFill();
    stroke(GOLD.r, GOLD.g, GOLD.b, 40);
    strokeWeight(1);
    circle(px, py, 46 + Math.sin(t * 0.06) * 6);
    stroke(GOLD.r, GOLD.g, GOLD.b, 18);
    circle(px, py, 78 + Math.sin(t * 0.06 + 1) * 8);
  }
}

function mouseMoved() {
  px = mouseX;
  py = mouseY;
}

function mouseDragged() {
  px = mouseX;
  py = mouseY;
}

function mousePressed() {
  flock = 1;
  px = mouseX;
  py = mouseY;
}

function touchStarted() {
  flock = 1;
  px = mouseX;
  py = mouseY;
  return false;
}

function touchMoved() {
  px = mouseX;
  py = mouseY;
  return false;
}
