// 2026-10-24
// Sentiment: "Ambition says reach further; craft says stay longer — the honest work is somehow doing both at once."
// Abstract study: rays cast outward from a drifting center toward distant marks, then drawn back before they arrive —
// reach and return, over and over, never quite landing, never fully withdrawn.
// Nothing here is a character; only the strain between going far and staying near.

let CORE = { x: 0, y: 0 };
let AIM = { x: 0, y: 0 };
let RAYS = [];
let t = 0;
let surge = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  CORE = { x: width / 2, y: height / 2 };
  AIM = { x: CORE.x, y: CORE.y };
  buildRays();
}

function buildRays() {
  RAYS = [];
  const n = constrain(floor(min(width, height) / 9), 40, 110);
  for (let i = 0; i < n; i++) {
    RAYS.push({
      a: random(TWO_PI),
      ph: random(TWO_PI),
      span: random(0.35, 1.0), // how far this ray is willing to go
      rate: random(0.5, 1.3),  // how fast it goes and comes back
      warm: random(1),
      r: random(1.0, 2.4),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  CORE = { x: width / 2, y: height / 2 };
  AIM = { x: CORE.x, y: CORE.y };
  buildRays();
}

// the reach: a slow swell and settle, so the whole field breathes between
// "further" and "longer" without ever stopping at either
function reachAt(ph, rate) {
  const s = sin(t * 0.9 * rate + ph);
  return 0.5 - 0.5 * cos(PI * (0.5 + 0.5 * s));
}

function draw() {
  // warm paper — daylight work, not the dark
  background(246, 241, 230);

  t += 0.012;
  CORE.x = lerp(CORE.x, AIM.x, 0.035);
  CORE.y = lerp(CORE.y, AIM.y, 0.035);

  drawMarks();
  drawGather();
  for (const r of RAYS) drawRay(r);

  if (surge > 0.01) {
    noFill();
    strokeWeight(1.6);
    stroke(196, 96, 52, 110 * surge);
    const rr = min(width, height) * (0.12 + (1 - surge) * 0.55);
    ellipse(CORE.x, CORE.y, rr * 2, rr * 2);
    surge *= 0.94;
  }
}

// the distant marks — the "further" that is always drawn slightly out of range
function drawMarks() {
  push();
  noStroke();
  const R = min(width, height) * 0.44;
  for (const r of RAYS) {
    const a = r.a + 0.06 * sin(t * 0.3 + r.ph);
    const d = R * (0.55 + 0.45 * r.span);
    const x = CORE.x + cos(a) * d;
    const y = CORE.y + sin(a) * d;
    const g = 0.5 + 0.5 * sin(t * 0.7 * r.rate + r.ph);
    fill(90, 86, 78, 14 + 22 * g);
    ellipse(x, y, 2.4, 2.4);
  }
  pop();
}

// the small dense thing at the center: the work that stays
function drawGather() {
  push();
  noStroke();
  const base = min(width, height) * 0.05;
  for (let i = 16; i >= 0; i--) {
    const p = i / 16;
    const rr = base * (0.5 + p * 1.6);
    fill(70 + 40 * p, 64 + 34 * p, 56 + 28 * p, 10 + 12 * (1 - p));
    ellipse(CORE.x, CORE.y, rr * 2, rr * 1.9);
  }
  fill(52, 48, 44, 210);
  ellipse(CORE.x, CORE.y, base * 0.5, base * 0.5);
  pop();
}

function drawRay(r) {
  const reach = reachAt(r.ph, r.rate);
  const far = min(width, height) * 0.46 * r.span;
  const len = far * reach;

  const wob = 0.09 * sin(t * 1.4 + r.ph * 1.7);
  const a = r.a + wob;
  const ex = CORE.x + cos(a) * len;
  const ey = CORE.y + sin(a) * len;

  // warm for the ones stretching out, cool for the ones settled back in
  const warm = r.warm;
  const cr = lerp(58, 196, warm);
  const cg = lerp(92, 108, warm);
  const cb = lerp(120, 62, warm);

  const alpha = 26 + 90 * (1 - reach * 0.55);
  stroke(cr, cg, cb, alpha);
  strokeWeight(1.1);
  noFill();
  line(CORE.x + cos(a) * 6, CORE.y + sin(a) * 6, ex, ey);

  // the tip brightens where it strains hardest
  if (reach > 0.55) {
    noStroke();
    const glow = 1 + 5 * (reach - 0.55);
    fill(cr, cg, cb, 90 * (reach - 0.55));
    ellipse(ex, ey, glow, glow);
  }

  // a faint bound: the returning arc traces where the reaching left off
  noFill();
  stroke(cr, cg, cb, 20 + 40 * reach);
  strokeWeight(0.7);
  arc(CORE.x, CORE.y, len * 2, len * 2, a - 0.14, a + 0.14);
}

function mouseMoved() {
  AIM.x = mouseX;
  AIM.y = mouseY;
}

function mouseDragged() {
  AIM.x = mouseX;
  AIM.y = mouseY;
  return false;
}

// pressing sends every ray out at once — then the field takes them back
function mousePressed() {
  for (const r of RAYS) r.rate = random(0.9, 1.7);
  surge = 1;
  return false;
}

function touchMoved() {
  AIM.x = mouseX;
  AIM.y = mouseY;
  return false;
}

function touchEnded() {
  for (const r of RAYS) r.rate = random(0.5, 1.3);
  surge = 1;
  return false;
}
