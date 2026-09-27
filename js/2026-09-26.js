// 2026-09-26 — "What we put away does not stop; it keeps running in the
// dark, waiting for the light to find it again."
//
// Abstract p5 sketch. A wall of mechanical flip-dots sits dark, and a slow
// brightness field drifts across it on its own — the buried things are still
// turning over in the dark, keeping their own time. Move the pointer and the
// dots it passes flip toward light and hold it a moment before settling back
// into the field.

let t = 0;
let dots = [];
let cell = 16;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildGrid();
}

function buildGrid() {
  cell = 16;
  const cols = ceil(width / cell) + 1;
  const rows = ceil(height / cell) + 1;
  dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        x: c * cell + cell * 0.5,
        y: r * cell + cell * 0.5,
        state: 0, // target orientation: 0 dark, 1 lit
        prog: 0, // eased flip progress toward state
        hold: 0, // frames of held light after being found
        gold: random() < 0.06,
      });
    }
  }
}

function draw() {
  background(6, 8, 16);
  t += 1;

  const px = mouseX;
  const py = mouseY;
  const pointerOn = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  const drift = t * 0.004;

  for (const d of dots) {
    // The buried field: a slow brightness wave crossing the panel.
    const n = noise(d.x * 0.0022, d.y * 0.0022, drift);
    let target = n > 0.62 ? 1 : 0;

    // The pointer "finds" dots: they flip to light and hold it briefly.
    if (pointerOn) {
      const dist2 = (d.x - px) * (d.x - px) + (d.y - py) * (d.y - py);
      if (dist2 < 60 * 60) d.hold = 90;
    }
    if (d.hold > 0) {
      d.hold -= 1;
      target = 1;
    }

    d.state = target;
    d.prog += (d.state - d.prog) * 0.18;
    drawDot(d);
  }
}

function drawDot(d) {
  const p = d.prog;

  // Dark disc face — the dot at rest.
  noStroke();
  fill(18, 22, 32);
  circle(d.x, d.y, cell * 0.86);

  if (p > 0.01) {
    // Lit face, revealed as the dot flips, gold or pale cyan.
    const lit = d.gold ? color(240, 200, 120) : color(150, 200, 240);
    lit.setAlpha(255 * p);
    fill(lit);
    circle(d.x, d.y, cell * 0.62 * p);
    fill(255, 255, 255, 200 * p * p);
    circle(d.x, d.y, cell * 0.2 * p);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
