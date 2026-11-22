// 2026-11-21 — "Three rivals agree on one bolt, a century's proof closes —
// nothing we build holds unless the parts agree to fit."
//
// An ideal lattice, drawn always and faintly, as if it were never in question.
// On top of it, the parts: small plates that mostly do not sit where they belong.
// Each one is nudged by a slow noise field, so alignment drifts through the
// field like weather instead of being decided once. Two things pull a part true:
// a bright horizontal scan that passes down the canvas and leaves agreement
// behind it, and your own hand, held down anywhere.
//
// Nothing is ever locked. Release and the plates wander off again, one by one,
// and the lattice underneath has not moved at all. That is the whole argument
// of the piece: the structure is easy, the fitting is the work.

let cells = [];
let cell = 72;
let cols = 20;
let rows = 12;
let t = 0;
let lock = 0;
let scanY = 0;

const INK = [17, 18, 20];
const PAPER = [242, 238, 228];
const BRASS = [178, 129, 66];
const SLATE = [98, 114, 126];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  noiseSeed(2026);
  layout();
  scanY = -height * 0.2;
}

function layout() {
  cell = constrain(Math.round(Math.min(width, height) / 10), 34, 92);
  cols = Math.ceil(width / cell) + 2;
  rows = Math.ceil(height / cell) + 2;
  cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      cells.push({
        i: i,
        j: j,
        seed: i * 137.5 + j * 61.7,
        drift: 1000 + i * 17 + j * 43
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}

function draw() {
  t += 0.008;
  background(PAPER);

  const pointer = mouseX > 0 && mouseY > 0;
  lock = lerp(lock, mouseIsPressed ? 1 : 0, mouseIsPressed ? 0.10 : 0.014);

  // The scan: agreement travelling downward, leaving the parts true behind it.
  scanY += Math.max(0.8, height * 0.0016);
  if (scanY > height + cell * 3) scanY = -cell * 3;
  const band = cell * 2.6;

  // The lattice. Never disturbs.
  stroke(INK[0], INK[1], INK[2], 24);
  strokeWeight(1);
  for (let i = 0; i <= cols; i++) {
    line(i * cell, 0, i * cell, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * cell, width, j * cell);
  }
  noStroke();

  for (let k = 0; k < cells.length; k++) {
    const p = cells[k];
    const cx = (p.i + 0.5) * cell;
    const cy = (p.j + 0.5) * cell;

    // Slow weather of agreement across the field.
    const n = noise(p.i * 0.13, p.j * 0.15, t * 0.85);
    const scanLift = Math.max(0, 1 - Math.abs(cy - scanY) / band);

    let fit = 0.24 + n * 0.5 + scanLift * 0.55 + lock * 0.95;
    fit = constrain(fit, 0, 1);

    const loose = 1 - fit;

    // A part out of place: offset, and turned a little.
    let ox = (noise(p.drift, t * 1.7) - 0.5) * cell * 0.58 * loose;
    let oy = (noise(p.drift + 51, t * 1.7) - 0.5) * cell * 0.58 * loose;
    const rot = (noise(p.drift + 96, t * 0.6) - 0.5) * 1.1 * loose;

    // A hand nearby pushes instead of fitting.
    if (pointer) {
      const d = dist(mouseX, mouseY, cx, cy);
      const reach = cell * 3.4;
      if (d < reach) {
        const f = (1 - d / reach) * cell * 0.55;
        const a = Math.atan2(cy - mouseY, cx - mouseX);
        ox += Math.cos(a) * f;
        oy += Math.sin(a) * f;
        fit *= 0.5;
      }
    }

    const s = cell * (0.30 + 0.17 * fit);

    push();
    translate(cx + ox, cy + oy);
    rotate(rot);
    rectMode(CENTER);

    // Plate
    stroke(INK[0], INK[1], INK[2], 70 + 150 * fit);
    strokeWeight(1.25);
    fill(PAPER[0], PAPER[1], PAPER[2], 240);
    rect(0, 0, s, s, s * 0.14);

    // Seat mark: brass when seated, slate when stray
    noStroke();
    fill(
      lerp(BRASS[0], SLATE[0], loose),
      lerp(BRASS[1], SLATE[1], loose),
      lerp(BRASS[2], SLATE[2], loose),
      120 + 120 * fit
    );
    circle(0, 0, s * (0.16 + 0.06 * fit));

    // A faint halo only for the ones that have truly taken a seat.
    if (fit > 0.93) {
      noFill();
      stroke(BRASS[0], BRASS[1], BRASS[2], 55);
      strokeWeight(1);
      rect(0, 0, s * 1.32, s * 1.32, s * 0.2);
    }

    pop();
  }

  // The scan line itself, barely there.
  noStroke();
  fill(PAPER[0], PAPER[1], PAPER[2], 40);
  rect(0, scanY - band, width, band * 2);
  fill(INK[0], INK[1], INK[2], 18);
  rect(0, scanY, width, 1);
}
