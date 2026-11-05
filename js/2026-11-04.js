// 2026-11-04
// Sentiment: "A thousand paths close quietly. The small ones keep walking, and the liquid finds the one left open."
// Abstract study in narrowing: a fan of hairline routes drawn from everywhere on the left edge toward a single
// convergence point. One by one they go dark, on no schedule anyone can predict, and the small marks that were
// walking them stop and fade with the line. Underneath, a shallow liquid seeks its level — it is pressed down
// where the cursor rests, and it always finds the same flat answer. When the last path closes, the field waits,
// then reopens itself. The lesson is not about the closing. It is about the waiting.

let strands = [];
let cols = [];
let t0 = 0;
let lastW = 0;
let lastH = 0;
let nextCloseAt = 0;
let reopenedAt = -1;
let lastPress = 0;

const P = {
  ink: [10, 13, 17],
  deep: [17, 24, 30],
  steel: [84, 100, 112],
  bone: [226, 220, 206],
  amber: [222, 162, 86],
  ember: [160, 96, 62],
  teal: [92, 156, 148]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(4114);
  randomSeed(4114);
  build();
  t0 = millis();
  lastW = width;
  lastH = height;
}

function build() {
  const fx = width * 0.79;
  const fy = height * 0.42;

  strands = [];
  const count = constrain(round(min(width, 1500) / 17), 40, 84);
  for (let i = 0; i < count; i++) {
    strands.push({
      y0: height * 0.06 + random() * height * 0.86,
      bow: (noise(i * 0.23 + 12) - 0.5) * 1.5,
      phase: random(TWO_PI),
      wob: 0.4 + noise(i * 0.31 + 40) * 1.4,
      closed: false,
      lit: 1,
      speed: 0.012 + random() * 0.03,
      u: random(),
      walker: random() < 0.72
    });
  }
  // Start with the fan intact; the closing is the event, not the default.
  nextCloseAt = 3.5;

  cols = [];
  const n = max(40, floor(width / 9));
  for (let i = 0; i < n; i++) {
    cols.push({ h: 0, v: 0 });
  }
}

function draw() {
  background(P.ink[0], P.ink[1], P.ink[2]);

  const seconds = (millis() - t0) / 1000;
  const fx = width * 0.79;
  const fy = height * 0.42;

  updateClosures(seconds);

  // A dim field behind the routes: the air they cross, slightly warmer near the convergence.
  drawField(fx, fy, seconds);
  drawStrands(fx, fy, seconds);
  drawWalkers(fx, fy, seconds);

  stepLiquid(seconds);
  drawLiquid(seconds);

  drawConvergence(fx, fy, seconds);
}

function updateClosures(seconds) {
  const open = strands.filter(s => !s.closed);
  const interval = 1.5 + noise(seconds * 0.07) * 2.8;

  if (open.length > 0 && seconds > nextCloseAt) {
    // Close one at random, but favour the outer routes first so the fan thins from the edges inward.
    const weights = open.map(s => 0.35 + abs(s.y0 - height * 0.5) / height);
    let total = weights.reduce((a, b) => a + b, 0);
    let r = random(total);
    let pick = open[0];
    for (let i = 0; i < open.length; i++) {
      r -= weights[i];
      if (r <= 0) { pick = open[i]; break; }
    }
    pick.closed = true;
    nextCloseAt = seconds + interval;
  }

  if (open.length === 0 && reopenedAt < 0) {
    reopenedAt = seconds + 6.5;
  }

  if (reopenedAt > 0 && seconds > reopenedAt) {
    strands.forEach((s, i) => {
      s.closed = false;
      // Staggered reopening so the fan comes back as a drawing, not as a switch.
      s.lit = min(s.lit, -i * 0.012);
    });
    reopenedAt = -1;
    nextCloseAt = seconds + 4 + random(3);
  }
}

function drawField(fx, fy, seconds) {
  // Air. A soft radial wash, no shape you could point at.
  noStroke();
  const steps = 26;
  for (let i = steps; i > 0; i--) {
    const t = i / steps;
    const r = max(width, height) * 0.9 * t;
    const a = 3.2 * (1 - t);
    fill(P.deep[0] + 4, P.deep[1] + 6, P.deep[2] + 7, a);
    circle(fx, fy, r * 2);
  }

  // The fan's shadow: where the thousand paths used to be, in aggregate.
  stroke(P.steel[0], P.steel[1], P.steel[2], 10);
  strokeWeight(1);
  const shadowCount = 40;
  for (let i = 0; i < shadowCount; i++) {
    const y0 = (i / shadowCount) * height;
    const c = controlPoint(y0, 0, fx, fy, 0);
    noFill();
    beginShape();
    for (let k = 0; k <= 12; k++) {
      const u = k / 12;
      const p = bez(y0, c, fx, fy, u, 0);
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function controlPoint(y0, bow, fx, fy, seconds) {
  return {
    x: width * 0.48,
    y: lerp(y0, fy, 0.42) + bow * height * 0.22 + sin(seconds * 0.1) * 4
  };
}

function bez(y0, c, fx, fy, u, wobble) {
  const p0 = { x: -12, y: y0 };
  const p1 = { x: c.x, y: c.y };
  const p2 = { x: fx, y: fy + wobble };
  const mu = 1 - u;
  return {
    x: mu * mu * p0.x + 2 * mu * u * p1.x + u * u * p2.x,
    y: mu * mu * p0.y + 2 * mu * u * p1.y + u * u * p2.y
  };
}

function drawStrands(fx, fy, seconds) {
  for (let i = 0; i < strands.length; i++) {
    const s = strands[i];

    // Lit ramps toward the target state. Nothing snaps.
    const target = s.closed ? 0.055 : 1;
    s.lit += (target - s.lit) * (s.closed ? 0.012 : 0.02);

    const c = controlPoint(s.y0, s.bow, fx, fy, seconds);
    const breath = sin(seconds * (0.16 + s.wob * 0.05) + s.phase) * s.wob;

    const a = s.lit;
    let r = lerp(P.steel[0], P.amber[0], a);
    let g = lerp(P.steel[1], P.amber[1], a);
    let b = lerp(P.steel[2], P.amber[2], a);

    noFill();
    stroke(r, g, b, 26 + a * 148);
    strokeWeight(0.6 + a * 0.75);
    beginShape();
    const segs = 34;
    for (let k = 0; k <= segs; k++) {
      const u = k / segs;
      const p = bez(s.y0, c, fx, fy, u, breath * sin(u * PI) * 6);
      vertex(p.x, p.y);
    }
    endShape();

    // A closed route leaves a thread of cold steel behind it and nothing else.
    if (a < 0.4) {
      stroke(P.steel[0], P.steel[1], P.steel[2], 14);
      strokeWeight(0.5);
      beginShape();
      for (let k = 0; k <= segs; k += 2) {
        const u = k / segs;
        const p = bez(s.y0, c, fx, fy, u, 0);
        vertex(p.x, p.y);
      }
      endShape();
    }
  }
}

function drawWalkers(fx, fy, seconds) {
  for (let i = 0; i < strands.length; i++) {
    const s = strands[i];
    if (!s.walker) continue;

    const c = controlPoint(s.y0, s.bow, fx, fy, seconds);
    const a = s.lit;
    if (a < 0.05) continue;

    s.u += s.speed * 0.004 * (0.6 + a * 0.9);
    if (s.u > 0.985) s.u = 0.02;

    // Trail first, faint.
    for (let k = 3; k >= 1; k--) {
      const uu = max(0.01, s.u - k * 0.016);
      const p = bez(s.y0, c, fx, fy, uu, 0);
      fill(P.amber[0], P.amber[1], P.amber[2], 22 * a);
      noStroke();
      circle(p.x, p.y, 2.4 - k * 0.35);
    }

    const p = bez(s.y0, c, fx, fy, s.u, 0);
    noStroke();
    fill(P.bone[0], P.bone[1], P.bone[2], 210 * a);
    circle(p.x, p.y, 3.2);
    fill(P.amber[0], P.amber[1], P.amber[2], 150 * a);
    circle(p.x, p.y, 6.4);
  }
}

function stepLiquid(seconds) {
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const left = cols[max(0, i - 1)].h;
    const right = cols[min(n - 1, i + 1)].h;
    const col = cols[i];
    col.v += (left + right - 2 * col.h) * 0.115;
    col.v -= col.h * 0.006;
    col.v *= 0.955;
    col.h += col.v;
  }

  // Cursor as weight: it presses the surface down and the surface pushes back out from under it.
  if (mouseX > 0 && mouseX < width && mouseY > height * 0.55) {
    const idx = floor((mouseX / width) * n);
    for (let k = -7; k <= 7; k++) {
      const j = idx + k;
      if (j < 0 || j >= n) continue;
      const fall = 1 - abs(k) / 8;
      cols[j].v -= 0.10 * fall * fall;
    }
  }
}

function drawLiquid(seconds) {
  const n = cols.length;
  const base = height * 0.865;

  noStroke();
  for (let i = 0; i < n; i++) {
    const x = (i / n) * width;
    const w = width / n + 1;
    const surface = base + cols[i].h * 26;
    const tension = constrain(abs(cols[i].v) * 6, 0, 1);
    const r = lerp(P.teal[0], P.bone[0], tension * 0.5);
    const g = lerp(P.teal[1], P.bone[1], tension * 0.5);
    const b = lerp(P.teal[2], P.bone[2], tension * 0.5);
    fill(r, g, b, 30 + tension * 40);
    rect(x, surface, w, height - surface + 2);
  }

  // The surface line: the only straight thing in the drawing, and it is not quite straight.
  noFill();
  stroke(P.bone[0], P.bone[1], P.bone[2], 70);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < n; i++) {
    const x = (i / n) * width;
    vertex(x, base + cols[i].h * 26);
  }
  endShape();
}

function drawConvergence(fx, fy, seconds) {
  const open = strands.filter(s => !s.closed).length;
  const glow = open === 0 ? 0.35 : 1;
  const breathe = 0.5 + 0.5 * sin(seconds * 0.9);

  noFill();
  stroke(P.amber[0], P.amber[1], P.amber[2], 40 * glow);
  strokeWeight(0.7);
  circle(fx, fy, 26 + breathe * 6);

  noStroke();
  fill(P.bone[0], P.bone[1], P.bone[2], (150 + breathe * 60) * glow);
  circle(fx, fy, 3.4);
  fill(P.amber[0], P.amber[1], P.amber[2], 40 * glow);
  circle(fx, fy, 34 + breathe * 10);
}

function mousePressed() {
  // A splash: the liquid answers, then forgets.
  const n = cols.length;
  const idx = constrain(floor((mouseX / width) * n), 0, n - 1);
  for (let k = -9; k <= 9; k++) {
    const j = idx + k;
    if (j < 0 || j >= n) continue;
    const fall = 1 - abs(k) / 10;
    cols[j].v += (k === 0 ? -2.2 : -0.9 * fall);
  }
  lastPress = millis();
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
  lastW = width;
  lastH = height;
}
