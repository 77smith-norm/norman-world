// 2026-10-23
// Sentiment: "The fragile things last not through strength but through tending — held in the dark, for months and years, by hands that keep showing up."
// Abstract study: a containment field — one wandering spark held inside a breathing ring of force,
// surrounded by motes that drift in, get turned back, and try again.
// Nothing here is a character; the field is made of tending, not of shapes.

let SPARK;
let MOTES = [];
let t = 0;
let home = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let pulse = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  home = { x: width * 0.5, y: height * 0.5 };
  target = { x: home.x, y: home.y };
  reset();
}

function reset() {
  SPARK = {
    x: home.x + random(-30, 30),
    y: home.y + random(-30, 30),
    vx: random(-1.1, 1.1),
    vy: random(-1.1, 1.1),
    trail: [],
  };
  MOTES = [];
  const n = constrain(floor((width * height) / 34000), 30, 120);
  for (let i = 0; i < n; i++) {
    MOTES.push({
      x: random(width),
      y: random(height),
      ph: random(TWO_PI),
      r: random(0.8, 2.2),
      s: random(0.15, 0.6),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  home = { x: width * 0.5, y: height * 0.5 };
  target = { x: home.x, y: home.y };
  reset();
}

// the held radius: never still, always breathing a little wider, a little tighter
function fieldRadius() {
  const base = min(width, height) * 0.19;
  return base + 14 * sin(t * 0.6) + 5 * sin(t * 1.7 + 1.3);
}

function draw() {
  // the dark chamber — filter of low light, so trails linger
  background(7, 9, 15);

  t += 0.012;
  home.x = lerp(home.x, target.x, 0.03);
  home.y = lerp(home.y, target.y, 0.03);
  const R = fieldRadius();

  drawChamber(R);
  drawMotes(R);
  drawSpark(R);
}

function drawChamber(R) {
  push();
  noStroke();
  const g = min(width, height) * 0.9;
  for (let i = 28; i >= 0; i--) {
    const p = i / 28;
    const rr = g * (0.15 + p * 0.5);
    fill(24 + 10 * (1 - p), 30 + 8 * (1 - p), 52 - 12 * p, 7);
    ellipse(home.x, home.y, rr * 2.4, rr * 2.0);
  }

  // the coils of containment — thin arcs that shift phase against each other
  noFill();
  for (let k = 0; k < 4; k++) {
    const off = (k / 4) * TWO_PI;
    const rpm = R * (0.72 + k * 0.09);
    stroke(120, 168, 220, 34 - k * 5);
    strokeWeight(1.1);
    arc(home.x, home.y, rpm * 2, rpm * 2, t * (0.4 + k * 0.13) + off, t * (0.4 + k * 0.13) + off + PI * 1.25);
  }

  // the membrane itself — brightest where it is asked to hold
  strokeWeight(1.4);
  stroke(168, 214, 255, 70);
  ellipse(home.x, home.y, R * 2, R * 2 * (0.94 + 0.06 * sin(t * 0.9)));
  strokeWeight(0.8);
  stroke(120, 168, 220, 30);
  ellipse(home.x, home.y, R * 1.55 * 2, R * 1.55 * 2);

  if (pulse > 0.01) {
    strokeWeight(2);
    stroke(255, 240, 214, 120 * pulse);
    ellipse(home.x, home.y, R * 2 * (1 + (1 - pulse) * 0.5), R * 2 * (1 + (1 - pulse) * 0.5));
    pulse *= 0.94;
  }
  pop();
}

function drawMotes(R) {
  noStroke();
  for (const m of MOTES) {
    m.x += cos(m.ph + t * m.s) * 0.35;
    m.y += sin(m.ph * 1.3 + t * m.s) * 0.35;

    // anything drifting in gets turned back — nothing is lost, only redirected
    const dx = m.x - home.x;
    const dy = m.y - home.y;
    const d = sqrt(dx * dx + dy * dy) || 1;
    if (d < R + 8) {
      const push = (R + 8 - d) * 0.06;
      m.x += (dx / d) * push;
      m.y += (dy / d) * push;
    }
    if (m.x < -5) m.x = width + 5;
    if (m.x > width + 5) m.x = -5;
    if (m.y < -5) m.y = height + 5;
    if (m.y > height + 5) m.y = -5;

    fill(150, 172, 205, 40);
    ellipse(m.x, m.y, m.r, m.r);
  }
}

function drawSpark(R) {
  // the spark moves freely, but the field keeps it near — a soft leash, not a cage
  SPARK.vx += random(-0.05, 0.05);
  SPARK.vy += random(-0.05, 0.05);
  const dx = home.x - SPARK.x;
  const dy = home.y - SPARK.y;
  const d = sqrt(dx * dx + dy * dy) || 1;
  const leash = max(0, d - R * 0.55) * 0.0018;
  SPARK.vx += (dx / d) * leash * 12;
  SPARK.vy += (dy / d) * leash * 12;

  const sp = sqrt(SPARK.vx * SPARK.vx + SPARK.vy * SPARK.vy) || 1;
  const maxSp = 1.6;
  if (sp > maxSp) {
    SPARK.vx = (SPARK.vx / sp) * maxSp;
    SPARK.vy = (SPARK.vy / sp) * maxSp;
  }
  SPARK.vx *= 0.985;
  SPARK.vy *= 0.985;
  SPARK.x += SPARK.vx;
  SPARK.y += SPARK.vy;

  SPARK.trail.push({ x: SPARK.x, y: SPARK.y });
  if (SPARK.trail.length > 150) SPARK.trail.shift();

  // trail: what tending leaves behind
  noFill();
  for (let i = 1; i < SPARK.trail.length; i++) {
    const a = (i / SPARK.trail.length) * 90;
    stroke(255, 236, 196, a);
    strokeWeight((i / SPARK.trail.length) * 1.8);
    line(SPARK.trail[i - 1].x, SPARK.trail[i - 1].y, SPARK.trail[i].x, SPARK.trail[i].y);
  }

  // the spark itself
  noStroke();
  const glow = 26 + 4 * sin(t * 3);
  fill(255, 226, 170, 26);
  ellipse(SPARK.x, SPARK.y, glow, glow);
  fill(255, 244, 220, 60);
  ellipse(SPARK.x, SPARK.y, glow * 0.55, glow * 0.55);
  fill(255, 252, 240, 235);
  ellipse(SPARK.x, SPARK.y, 4.5, 4.5);
}

function mouseMoved() {
  target.x = mouseX;
  target.y = mouseY;
}

function mouseDragged() {
  target.x = mouseX;
  target.y = mouseY;
  return false;
}

// pressing nudges the spark outward — the field answers by pulling it back
function mousePressed() {
  const a = random(TWO_PI);
  SPARK.vx += cos(a) * 5;
  SPARK.vy += sin(a) * 5;
  pulse = 1;
  return false;
}

function touchMoved() {
  target.x = mouseX;
  target.y = mouseY;
  return false;
}
