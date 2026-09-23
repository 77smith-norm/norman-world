// 2026-09-22 — "Some problems wait twenty years for the right mind; some tools
// wait longer. Nothing forgotten is truly gone — it merely lacks its hour."
//
// Abstract p5 sketch. A wide field of dormant marks lies almost perfectly still,
// dim and settled. Slow rings of "hour" pulse outward from a drifting centre;
// when a ring passes over a mark it briefly ignites, swings a short warm arc,
// then cools back into dormancy. Nothing is ever deleted — it only waits.
// Move the pointer to steer where the next hour begins; the field keeps its
// own patient rhythm either way.

let marks = [];
let rings = [];
let originX = 0;
let originY = 0;
let driftPhase = 0;
let lastPulse = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  originX = width * 0.5;
  originY = height * 0.5;
  seedField();
}

function seedField() {
  marks = [];
  const count = constrain(floor((width * height) / 6200), 180, 1100);
  for (let i = 0; i < count; i++) {
    marks.push({
      x: random(width),
      y: random(height),
      heat: 0,       // how recently this mark was woken
      glow: 0,       // visual warmth, decays slowly
      seed: random(1000),
    });
  }
  rings = [];
}

function draw() {
  // Deep, quiet ground. The field is never black — dormancy still has colour.
  background(12, 14, 22, 26);

  driftPhase += 0.0022;
  originX = width * 0.5 + sin(driftPhase * 1.7) * width * 0.22;
  originY = height * 0.5 + cos(driftPhase * 1.1) * height * 0.18;

  // A new hour begins roughly every few seconds. Long gaps are the point.
  if (millis() - lastPulse > 2600) {
    lastPulse = millis();
    rings.push({ r: 4, life: 1, x: originX, y: originY });
  }

  // Advance and retire the rings.
  for (const ring of rings) {
    ring.r += 2.4 + ring.r * 0.006;
    ring.life -= 0.0035;
  }
  rings = rings.filter((r) => r.life > 0 && r.r < max(width, height) * 1.1);

  // Wake any mark the rings pass over.
  for (const m of marks) {
    for (const ring of rings) {
      const d = dist(m.x, m.y, ring.x, ring.y);
      if (abs(d - ring.r) < 9) {
        m.heat = min(1, m.heat + 0.05 * ring.life);
        m.glow = min(1, m.glow + 0.04 * ring.life);
      }
    }
    m.heat *= 0.96;
    m.glow *= 0.985;
  }

  // Draw the marks. Dormant ones are faint and still; woken ones swing a
  // short arc before settling back down.
  for (const m of marks) {
    const activity = max(m.heat, m.glow * 0.5);
    const angle = m.seed + frameCount * 0.004 * (0.2 + activity);
    const swing = activity * 7;

    const ax = m.x + cos(angle) * swing;
    const ay = m.y + sin(angle) * swing;

    const warmth = m.glow;
    const r = 0.7 + 1.6 * activity + warmth * 0.8;
    fill(
      lerp(120, 255, warmth),
      lerp(130, 214, warmth),
      lerp(170, 150, warmth),
      22 + 150 * activity
    );
    noStroke();
    ellipse(ax, ay, r, r);

    // A short warm trail on the most awake marks.
    if (activity > 0.35) {
      stroke(255, 206, 130, activity * 90);
      strokeWeight(0.8);
      line(m.x, m.y, ax, ay);
      noStroke();
    }
  }

  // The travelling hours themselves: faint, patient rings.
  for (const ring of rings) {
    noFill();
    stroke(150, 170, 220, 26 * ring.life);
    strokeWeight(1);
    ellipse(ring.x, ring.y, ring.r * 2, ring.r * 2);
  }

  // Where the pointer is, the next hour gathers a little sooner.
  const px = constrain(mouseX, 0, width);
  const py = constrain(mouseY, 0, height);
  if (pointerActive()) {
    noFill();
    stroke(255, 200, 130, 46);
    strokeWeight(1);
    ellipse(px, py, 40 + sin(frameCount * 0.03) * 6, 40 + sin(frameCount * 0.03) * 6);
    originX = lerp(originX, px, 0.05);
    originY = lerp(originY, py, 0.05);
  }
}

function pointerActive() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedField();
}
