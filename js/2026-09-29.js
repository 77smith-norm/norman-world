// 2026-09-29 — "Old engines wake again while quiet batteries hold the dark,
// and something always-on learns to wait."
//
// Abstract p5 sketch. A wall of dormant cells sits in the dark, each charging
// and releasing on its own long rhythm — a home battery bank breathing through
// the night. A slow band of light sweeps across them and leaves faint wakes.
// Every so often a cell ignites briefly, the way a long-retired engine turns
// over once more before going quiet again. No figure is drawn — only cells,
// charge, and the patient hold between them.

let cells = [];
let cols, rows, cellW, cellH;
let t = 0;
let sweep = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(29);
  randomSeed(29);
  buildGrid();
}

function buildGrid() {
  cellW = 46;
  cellH = 46;
  cols = ceil(width / cellW) + 1;
  rows = ceil(height / cellH) + 1;
  cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({
        x: x * cellW + cellW * 0.5,
        y: y * cellH + cellH * 0.5,
        phase: random(TWO_PI),
        rate: random(0.004, 0.011),
        ignition: 0,
        wake: 0,
      });
    }
  }
}

function draw() {
  background(9, 11, 16);
  t += 1;
  sweep += 0.0032;
  if (sweep > 1.15) sweep = -0.15;

  const hand = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  // The sweeping band of light, left to right and back into the dark.
  const bandX = sweep * width;

  noStroke();
  for (const c of cells) {
    // Each cell breathes on its own clock — charge rising and falling slowly.
    const charge = 0.5 + 0.5 * sin(t * c.rate + c.phase);

    // The band warms what it passes and leaves a lingering wake.
    const d = abs(c.x - bandX);
    const near = max(0, 1 - d / (cellW * 3.5));
    c.wake = max(c.wake * 0.985, near);

    // A rare, brief ignition — a dormant engine turning over once more.
    if (random() < 0.00035) c.ignition = 1;
    c.ignition = max(0, c.ignition - 0.012);

    let warm = constrain(near * 0.7 + c.wake * 0.5 + c.ignition, 0, 1);
    if (hand) {
      const dh = dist(c.x, c.y, mouseX, mouseY);
      warm = max(warm, max(0, 1 - dh / 190));
    }

    const col = lerpColor(
      color(38, 52, 78), // dark, holding
      color(250, 206, 128), // warm, awake
      warm
    );
    col.setAlpha(28 + 150 * charge * (0.35 + 0.65 * warm));
    fill(col);
    circle(c.x, c.y, 5 + 10 * charge + warm * 8);
  }

  // The leading edge of the sweep itself — the passing attention.
  noFill();
  stroke(255, 226, 176, 26);
  strokeWeight(1);
  line(bandX, 0, bandX, height);

  if (hand) {
    noFill();
    stroke(255, 224, 170, 34);
    strokeWeight(1);
    circle(mouseX, mouseY, 54 + sin(t * 0.05) * 7);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
