// 2026-11-07
// Sentiment: "Some truths wait inside objects for the right light; the instrument you build is how they answer."
// Abstract study in latent field. A dark plate holds a quiet specimen: nothing is visible until a corona bleeds
// out of it, filament by filament, violet grading into cold cyan. The field is always there, faint and unbothered,
// breathing at its own rate. Bring the cursor close and the filaments lean outward and brighten, as if something
// on the other side noticed the probe. Pull away and the glow subsides to a murmur. Click and the plate discharges
// once, a hard ring of light that decays back into the hum. Nothing here is revealed to the naked eye. It is
// revealed to the instrument, and the instrument is whatever you build and hold steady.

let filaments = [];
let motes = [];
let bursts = [];
let center = { x: 0, y: 0 };
let field = 0.25;
let probe = { x: 0, y: 0, near: 0 };
let t0 = 0;
let lastW = 0;
let lastH = 0;

const P = {
  ink: [7, 8, 14],
  deep: [14, 15, 26],
  violet: [146, 108, 232],
  cyan: [112, 208, 226],
  pale: [222, 232, 238]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(7711);
  randomSeed(7711);
  probe.x = width * 0.72;
  probe.y = height * 0.34;
  build();
  background(P.ink[0], P.ink[1], P.ink[2]);
  t0 = millis();
  lastW = width;
  lastH = height;
}

function build() {
  center = { x: width * 0.5, y: height * 0.55 };

  filaments = [];
  const count = constrain(round(min(width, height) / 2.4), 120, 340);
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * TWO_PI + random(-0.02, 0.02);
    filaments.push({
      ang,
      r0: min(width, height) * (0.06 + random() * 0.05),
      len: min(width, height) * (0.10 + random() * 0.26),
      curl: random(0.5, 2.4),
      phase: random(TWO_PI),
      rate: random(0.4, 1.5),
      w: random(0.4, 1.3),
      hue: random(),
      seg: 9 + floor(random() * 6)
    });
  }

  motes = [];
  const mCount = constrain(round((width * height) / 26000), 40, 170);
  for (let i = 0; i < mCount; i++) {
    motes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.18, 0.18),
      vy: random(-0.22, -0.05),
      s: random(0.6, 1.9),
      a: random(8, 34)
    });
  }
}

function draw() {
  // The plate never fully clears; light lingers where it was.
  noStroke();
  fill(P.ink[0], P.ink[1], P.ink[2], 46);
  rect(0, 0, width, height);
  fill(P.deep[0], P.deep[1], P.deep[2], 8);
  rect(0, 0, width, height);

  const t = (millis() - t0) * 0.001;

  // --- probe: the instrument, and how near it is held ---
  let d = 0;
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    probe.x = lerp(probe.x, mouseX, 0.12);
    probe.y = lerp(probe.y, mouseY, 0.12);
    d = dist(probe.x, probe.y, center.x, center.y);
  } else {
    d = dist(width * 0.72, height * 0.34, center.x, center.y);
  }
  const reach = min(width, height) * 0.72;
  const target = constrain(1 - d / reach, 0, 1);
  probe.near = lerp(probe.near, target, 0.045);

  // Ambient field breathes; the probe pushes it outward.
  const ambient = 0.22 + 0.10 * sin(t * 0.55);
  field = lerp(field, ambient + probe.near * 0.85, 0.05);

  // --- bursts: one hard discharge, then decay ---
  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.t += 0.012;
    if (b.t > 1) bursts.splice(i, 1);
  }

  // --- the corona ---
  push();
  blendMode(ADD);
  strokeCap(ROUND);
  for (const f of filaments) {
    const pulse = 0.55 + 0.45 * sin(t * f.rate + f.phase);
    const stretch = 1 + field * 1.9 * pulse;

    // filaments lean toward the probe, not away from it
    let ang = f.ang;
    if (probe.near > 0.01) {
      const pa = atan2(probe.y - center.y, probe.x - center.x);
      const diff = atan2(sin(pa - ang), cos(pa - ang));
      ang += diff * 0.22 * probe.near;
    }

    const wgt = f.w * (0.7 + probe.near * 0.9);
    const alpha = (18 + 96 * pulse) * (0.35 + field * 0.65);
    const cv = f.hue;
    const r = lerp(P.violet[0], P.cyan[0], cv);
    const g = lerp(P.violet[1], P.cyan[1], cv);
    const b = lerp(P.violet[2], P.cyan[2], cv);

    let px = center.x + cos(ang) * f.r0;
    let py = center.y + sin(ang) * f.r0;

    for (let s = 1; s <= f.seg; s++) {
      const u = s / f.seg;
      const rr = f.r0 + f.len * stretch * u;
      const wob = (noise(f.ang * 2.1 + s * 0.22, t * 0.25 + f.phase) - 0.5) * f.curl * 26 * u;
      const x = center.x + cos(ang) * rr + cos(ang + HALF_PI) * wob;
      const y = center.y + sin(ang) * rr + sin(ang + HALF_PI) * wob;
      stroke(r, g, b, alpha * (1 - u * 0.72));
      strokeWeight(max(0.3, wgt * (1 - u * 0.6)));
      line(px, py, x, y);
      px = x;
      py = y;
    }
  }

  // core: a small cold ember, never a face
  for (let i = 4; i >= 1; i--) {
    noStroke();
    fill(P.pale[0], P.pale[1], P.pale[2], 5 + field * 8);
    circle(center.x, center.y, min(width, height) * 0.05 * i * (1 + field * 0.35));
  }

  // discharge rings
  for (const b of bursts) {
    const e = 1 - b.t;
    noFill();
    stroke(P.cyan[0], P.cyan[1], P.cyan[2], 150 * e * e);
    strokeWeight(1.4 * e + 0.2);
    circle(b.x, b.y, min(width, height) * (0.05 + b.t * 1.15));
    stroke(P.violet[0], P.violet[1], P.violet[2], 90 * e * e);
    circle(b.x, b.y, min(width, height) * (0.03 + b.t * 0.72));
  }

  // motes: dust in the room, indifferent to the experiment
  for (const m of motes) {
    m.x += m.vx;
    m.y += m.vy;
    if (m.y < -4) { m.y = height + 4; m.x = random(width); }
    if (m.x < -4) m.x = width + 4;
    if (m.x > width + 4) m.x = -4;
    noStroke();
    fill(P.pale[0], P.pale[1], P.pale[2], m.a * (0.4 + probe.near * 0.5));
    circle(m.x, m.y, m.s);
  }
  pop();

  // the probe itself, only a point of attention
  noStroke();
  fill(P.pale[0], P.pale[1], P.pale[2], 18 + probe.near * 60);
  circle(probe.x, probe.y, 2 + probe.near * 2.4);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    bursts.push({ x: mouseX, y: mouseY, t: 0 });
    field = min(1.6, field + 0.45);
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  return false;
}

function windowResized() {
  if (width === lastW && height === lastH) return;
  resizeCanvas(windowWidth, windowHeight);
  const keep = field;
  const keepNear = probe.near;
  build();
  field = keep;
  probe.near = keepNear;
  lastW = width;
  lastH = height;
  background(P.ink[0], P.ink[1], P.ink[2]);
}
