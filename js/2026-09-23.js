// 2026-09-23 — "What is broken is not lost; patience turns the smallest wheel
// until the whole room keeps time again."
//
// Abstract p5 sketch. Concentric rings of brass-toned tick marks sit slightly
// out of phase, each turning at its own deliberate rate. Over time the rings
// drift toward alignment; when their marks line up they flare briefly — the
// room catching time — then loosen again into patient, unhurried motion.
// Nothing here is ever deleted or reset; it only takes as long as it takes.
// Move the pointer to nudge the nearest ring's phase a little closer.

let rings = [];
let driftPhase = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  buildRings();
}

function buildRings() {
  rings = [];
  const maxR = min(width, height) * 0.42;
  const count = constrain(floor(maxR / 26), 6, 14);
  for (let i = 0; i < count; i++) {
    rings.push({
      base: maxR * ((i + 1) / count),
      speed: 0.0016 * (0.35 + 0.11 * i) * (i % 2 === 0 ? 1 : -1),
      phase: random(TWO_PI),
      teeth: 12 + i * 4,
      align: 0, // how recently this ring lined up with its neighbour
      drift: random(1000),
    });
  }
}

function draw() {
  // Dark, warm ground — a room at dusk, not a void.
  background(16, 13, 11, 30);

  driftPhase += 0.0011;
  const cx = width * 0.5 + sin(driftPhase * 1.3) * width * 0.06;
  const cy = height * 0.5 + cos(driftPhase * 0.9) * height * 0.05;

  const px = constrain(mouseX, 0, width);
  const py = constrain(mouseY, 0, height);
  const pointerOn = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  // Advance each ring and measure how well it aligns with the one inside it.
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    r.phase += r.speed;

    const prev = i > 0 ? rings[i - 1] : null;
    const gap = prev ? abs(angleDiff(r.phase * r.teeth, prev.phase * prev.teeth)) : PI;
    const closeness = max(0, 1 - gap / 0.55);
    r.align = max(r.align * 0.94, closeness);

    // The pointer gently pulls the nearest ring toward its neighbour's phase.
    if (pointerOn) {
      const d = dist(px, py, cx, cy);
      const w = max(0, 1 - abs(d - r.base) / 90);
      if (w > 0) {
        r.phase += angleDiff(prev ? prev.phase : r.phase, r.phase) * 0.02 * w;
      }
    }
  }

  const warm = 0.5 + 0.5 * sin(driftPhase * 2.4);

  noFill();
  for (const r of rings) {
    // The ring itself: a faint, slow circle.
    stroke(
      lerp(96, 176, r.align),
      lerp(78, 132, r.align),
      lerp(58, 84, r.align),
      20 + 60 * r.align
    );
    strokeWeight(0.8);
    ellipse(cx, cy, r.base * 2, r.base * 2);

    // The teeth: brass ticks that brighten as the ring finds alignment.
    for (let t = 0; t < r.teeth; t++) {
      const a = r.phase + (TWO_PI * t) / r.teeth;
      const inner = r.base - 5 - 7 * r.align;
      const outer = r.base + 5 + 9 * r.align;
      const x1 = cx + cos(a) * inner;
      const y1 = cy + sin(a) * inner;
      const x2 = cx + cos(a) * outer;
      const y2 = cy + sin(a) * outer;

      const lit = max(0, r.align - 0.25) / 0.75;
      stroke(
        lerp(140, 255, lit),
        lerp(112, 198, lit),
        lerp(74, 118, lit),
        26 + 180 * lit * (0.7 + 0.3 * warm)
      );
      strokeWeight(0.8 + 1.4 * lit);
      line(x1, y1, x2, y2);
    }
  }

  // When the innermost and outermost nearly agree, the whole room glows.
  const outer = rings[rings.length - 1];
  const inner = rings[0];
  if (outer && inner) {
    const allAligned =
      rings.reduce((a, r) => a + r.align, 0) / rings.length;
    if (allAligned > 0.72) {
      noStroke();
      fill(255, 208, 138, (allAligned - 0.72) * 90);
      ellipse(cx, cy, 26 + 60 * allAligned, 26 + 60 * allAligned);
    }
  }

  // A still hub where the smallest wheel turns.
  noStroke();
  fill(214, 176, 116, 120);
  ellipse(cx, cy, 4, 4);

  if (pointerOn) {
    noFill();
    stroke(255, 204, 132, 40);
    strokeWeight(1);
    ellipse(px, py, 34, 34);
  }
}

// Shortest signed angular difference.
function angleDiff(target, current) {
  let d = (target - current) % TWO_PI;
  if (d > PI) d -= TWO_PI;
  if (d < -PI) d += TWO_PI;
  return d;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildRings();
}
