// 2026-09-19 — "The grammar of holding on"
// A drifting form keeps something close that will never resolve.
// Ripples leave it in rings that never fully fade — carrying is the motion.

let t = 0;
let rings = [];
let motes = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 26; i++) rings.push(newRing(i * 0.06));
  for (let i = 0; i < 90; i++) motes.push(newMote());
}

function newRing(offset) {
  return {
    p: (offset + random(0, 1)) % 1,
    sp: random(0.0009, 0.0022),
    off: random(-0.5, 0.5),
    w: random(0.5, 1.6)
  };
}

function newMote() {
  return {
    x: random(-0.2, 1.2),
    y: random(0.1, 0.95),
    r: random(0.6, 2.4),
    sp: random(0.02, 0.09),
    ph: random(TWO_PI)
  };
}

function draw() {
  t += 0.004;

  // Deep water: a slow vertical gradient, cold at the top, darker below.
  for (let y = 0; y < height; y += 4) {
    const k = y / height;
    stroke(218 - 18 * k, 42, 10 + 10 * (1 - k), 100);
    line(0, y, width, y);
  }
  noStroke();

  // The drift: a large slow circuit, never still, never far.
  const cx = width * 0.5 + sin(t * 0.5) * width * 0.09;
  const cy = height * 0.54 + cos(t * 0.37) * height * 0.05;

  // Rings leaving the carried thing — they thin but do not vanish.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  noFill();
  for (const r of rings) {
    r.p += r.sp;
    if (r.p >= 1) Object.assign(r, newRing(0));
    const rw = r.p * min(width, height) * (0.55 + r.off * 0.12);
    const alpha = (1 - r.p) * 16 * (0.6 + 0.4 * sin(t * 1.3 + r.off * 5));
    stroke(200 - 30 * r.p, 34, 62, alpha * r.w);
    strokeWeight(1 + r.w);
    ellipse(cx, cy + r.off * height * 0.05, rw, rw * 0.72);
  }
  drawingContext.restore();
  noStroke();

  // The pale body of the carrier — soft, bone-lit, faintly luminous.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (let i = 10; i >= 0; i--) {
    const k = i / 10;
    fill(196, 16 - k * 8, 34 + k * 20, 2.4);
    ellipse(cx, cy, 250 + k * 320, 120 + k * 150);
  }
  drawingContext.restore();

  // What is carried: a small dark form, held close, one shade below the light.
  const hx = cx - 34 + sin(t * 0.9) * 6;
  const hy = cy + 26 + cos(t * 1.1) * 4;
  push();
  fill(222, 52, 9, 92);
  ellipse(hx, hy, 44, 26);
  fill(216, 44, 14, 60);
  ellipse(hx, hy, 60, 38);
  pop();

  // Suspended motes — the slow snow of an ocean, drifting up through it all.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  noStroke();
  for (const m of motes) {
    m.y -= m.sp * 0.0016;
    if (m.y < 0.05) { Object.assign(m, newMote()); m.y = 0.95; }
    const a = 8 + 10 * (0.5 + 0.5 * sin(t * 2 + m.ph));
    fill(195, 20, 78, a);
    ellipse(m.x * width + sin(t + m.ph) * 6, m.y * height, m.r * 2, m.r * 2);
  }
  drawingContext.restore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
