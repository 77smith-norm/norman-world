// 2026-09-21 — "To understand is to compress: keep what matters, let the rest
// fall away, and trust the shape that remains."
//
// Abstract p5 sketch. A drifting field of pale motes slowly learns to compress:
// thousands of points migrate toward a single luminous meridian, shedding the
// noise that does not help hold the shape. Move the pointer to resist the
// compression; release, and the field settles back into its essential line.

let motes = [];
let meridianX = 0;
let compression = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  meridianX = width * 0.5;
  seedField();
}

function seedField() {
  motes = [];
  const count = constrain(floor((width * height) / 5200), 220, 1400);
  for (let i = 0; i < count; i++) {
    const y = random(height);
    motes.push({
      x: random(width),
      y: y,
      anchorY: y,
      weight: random(0.2, 1),
      drift: random(0.4, 1.6),
      phase: random(TWO_PI),
    });
  }
}

function draw() {
  const target = pointerActive() ? 0.14 : 0.92;
  compression = lerp(compression, target, 0.02);

  background(10, 12, 20, 42);

  const cx = lerp(width * 0.5, meridianX, compression);
  const glow = lerp(0, 96, compression);

  noStroke();
  for (const m of motes) {
    m.phase += 0.006 * m.drift;
    const breathe = sin(m.phase) * 6 * (1 - compression);

    // Points with less "weight" (less essential) fall away as compression rises.
    const survival = 1 - compression * (1 - m.weight) * 0.85;
    const pull = compression * 0.28 * m.weight;

    m.x = lerp(m.x, cx + (m.x - cx) * 0.02, pull);
    m.y = lerp(m.y, m.anchorY + breathe, 0.05);

    const alpha = 30 + 150 * m.weight * survival;
    const r = 0.8 + 1.8 * m.weight;
    fill(210, 224, 255, alpha);
    ellipse(m.x, m.y, r, r);
  }

  // The luminous meridian: the shape that remains.
  if (compression > 0.05) {
    stroke(255, 244, 210, glow * 0.5);
    strokeWeight(1);
    line(cx, 0, cx, height);
    drawingContext.shadowBlur = 0;
  }
}

function pointerActive() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  meridianX = width * 0.5;
  seedField();
}
