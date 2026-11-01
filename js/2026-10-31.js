// 2026-10-31
// Sentiment: "Someone planted seeds they could not name, and the waiting was most of the act."
// Abstract study: dormancy. A quiet grid of seeds sits in an attic dark, each one on its own
// unknowable clock. A band of window light drifts across them; whatever it touches opens a
// little sooner. Nothing is labelled, nothing is promised — thin arcs of pale green simply
// keep appearing where patience has been paid long enough.

let seeds = [];
let dust = [];
let lightX = 0.35;
let lightDir = 1;
let season = 0;
let pulse = 0;
let t0 = 0;

const P = {
  ground: [18, 16, 14],
  warm: [232, 196, 128],
  sprout: [168, 206, 138],
  fade: [96, 118, 84]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(3110);
  build();
  t0 = millis();
}

function build() {
  seeds = [];
  dust = [];

  const cols = constrain(floor(width / 46), 10, 34);
  const rows = constrain(floor(height / 46), 8, 26);
  const cellW = width / cols;
  const cellH = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (random() < 0.26) continue;
      const px = (x + 0.5) * cellW + random(-cellW * 0.22, cellW * 0.22);
      const py = (y + 0.5) * cellH + random(-cellH * 0.22, cellH * 0.22);
      seeds.push({
        x: px,
        y: py,
        depth: random(0.35, 1),
        // Dormancy is the whole point: some never wake in the time you are watching.
        clock: random(0.35, 1.6),
        phase: 0,
        rate: random(0.000045, 0.00016),
        lean: random(-0.5, 0.5),
        sway: random(TWO_PI),
        leaves: floor(random(1, 4))
      });
    }
  }

  const dustCount = constrain(floor((width * height) / 16000), 40, 160);
  for (let i = 0; i < dustCount; i++) {
    dust.push({
      x: random(width),
      y: random(height),
      r: random(0.4, 1.5),
      vx: random(-0.06, 0.06),
      vy: random(-0.04, 0.04),
      a: random(6, 26)
    });
  }
}

function lightCenter() {
  return lightX * width;
}

function draw() {
  background(P.ground[0], P.ground[1], P.ground[2]);

  // The band of light drifts slowly, and drifts a little with the cursor.
  const target = 0.5 + 0.36 * sin(frameCount * 0.0016) + (mouseX / max(width, 1) - 0.5) * 0.28;
  lightX = lerp(lightX, constrain(target, 0.08, 0.92), 0.01);
  const lx = lightCenter();
  const bandW = width * 0.34;

  drawAtticWall(lx, bandW);
  drawLight(lx, bandW);

  // Seeds, back to front.
  const sorted = seeds;
  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    const near = 1 - constrain(abs(s.x - lx) / bandW, 0, 1);
    const awakening = pow(near, 1.7) * 0.9 + pulse * 0.5;

    s.phase += s.rate * (1 + awakening * 5.5);
    s.phase = constrain(s.phase, 0, 1);

    drawSeed(s, awakening, lx);
  }

  drawDust();
  if (pulse > 0) pulse *= 0.985;
  drawSill(lx, bandW);
}

function drawAtticWall(lx, bandW) {
  noFill();
  // Faint boards running across the wall, half-swallowed by the dark.
  for (let y = 40; y < height; y += 58) {
    const d = dist(0, y, lx, y) / max(bandW, 1);
    const a = map(constrain(d, 0, 3), 0, 3, 26, 4);
    stroke(92, 76, 58, a);
    strokeWeight(1);
    line(0, y + noise(y * 0.01) * 6, width, y + noise(y * 0.01 + 4) * 6);
  }
}

function drawLight(lx, bandW) {
  noStroke();
  const steps = 46;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const x = lx - bandW + t * bandW * 2;
    const fall = pow(1 - abs(t - 0.5) * 2, 2.2);
    fill(P.warm[0], P.warm[1], P.warm[2], 9 * fall + 2);
    rect(x - bandW / steps - 1, 0, bandW / steps + 2, height);
  }
}

function drawSeed(s, awakening, lx) {
  const open = s.phase;

  // The seed itself: a small dark body, barely there.
  noStroke();
  fill(44, 38, 30, 150 + 60 * s.depth);
  ellipse(s.x, s.y, 3.2 * s.depth + 1.4, 2.4 * s.depth + 1.1);

  if (open <= 0.001) return;

  const height0 = (18 + 34 * s.depth) * open * (0.55 + 0.45 * s.clock);
  const breathe = sin(frameCount * 0.006 + s.sway) * 0.06 * open;
  const tipX = s.x + s.lean * height0 * 0.35 + breathe * 22;
  const tipY = s.y - height0;

  const a = 26 + 130 * open * (0.45 + 0.55 * s.depth);
  stroke(P.sprout[0], P.sprout[1], P.sprout[2], a * 0.55);
  strokeWeight(0.9 * (0.6 + s.depth * 0.7));
  noFill();

  // Stem as a slow curve, not a straight line.
  const cx = s.x + s.lean * height0 * 0.2 - breathe * 10;
  const cy = s.y - height0 * 0.55;
  bezier(s.x, s.y, cx, cy, cx + breathe * 12, cy, tipX, tipY);

  // Leaves appear one at a time as the stem climbs.
  for (let i = 0; i < s.leaves; i++) {
    const tp = (i + 1) / (s.leaves + 1);
    const appear = constrain((open - tp * 0.55) / 0.45, 0, 1);
    if (appear <= 0) continue;
    const bx = lerp(s.x, tipX, tp);
    const by = lerp(s.y, tipY, tp);
    const side = i % 2 === 0 ? 1 : -1;
    const size = (3.5 + 5.5 * s.depth) * appear;
    const lx2 = bx + side * size * 1.5;
    const ly2 = by - size * 0.75;
    fill(P.sprout[0], P.sprout[1], P.sprout[2], a * 0.3);
    noStroke();
    ellipse(lerp(bx, lx2, 0.5), lerp(by, ly2, 0.5), size * 2.1, size * 1.15);
    noFill();
    stroke(P.fade[0], P.fade[1], P.fade[2], a * 0.34);
    strokeWeight(0.6);
    line(bx, by, lx2, ly2);
  }

  // A thread of highlight where the light is strongest.
  const near = 1 - constrain(abs(s.x - lx) / (width * 0.34), 0, 1);
  if (near > 0.25) {
    stroke(P.warm[0], P.warm[1], P.warm[2], 60 * near * open);
    strokeWeight(0.7);
    line(s.x, s.y - 1, tipX, tipY);
  }
}

function drawDust() {
  noStroke();
  for (let i = 0; i < dust.length; i++) {
    const d = dust[i];
    d.x += d.vx + sin(frameCount * 0.002 + i) * 0.05;
    d.y += d.vy + cos(frameCount * 0.0016 + i * 1.7) * 0.04;
    if (d.x < -4) d.x = width + 4;
    if (d.x > width + 4) d.x = -4;
    if (d.y < -4) d.y = height + 4;
    if (d.y > height + 4) d.y = -4;
    fill(P.warm[0], P.warm[1], P.warm[2], d.a);
    ellipse(d.x, d.y, d.r, d.r);
  }
}

function drawSill(lx, bandW) {
  noStroke();
  // The floor edge: where the light actually lands.
  const h = height * 0.13;
  fill(12, 11, 9, 210);
  rect(0, height - h, width, h);
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = lx - bandW + t * bandW * 2;
    const fall = pow(1 - abs(t - 0.5) * 2, 2);
    fill(P.warm[0], P.warm[1], P.warm[2], 7 * fall);
    rect(x - bandW / 26 - 1, height - h, bandW / 26 + 2, h);
  }
}

// A press is a season passing: every seed gets a small push toward waking.
function mousePressed() {
  pulse = 0.85;
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];
    const d = dist(mouseX, mouseY, s.x, s.y);
    const push = map(constrain(d, 0, 420), 0, 420, 0.09, 0.004);
    s.phase = constrain(s.phase + push * (1.2 - s.clock * 0.4), 0, 1);
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
}
