// 2026-10-11 — "Rebuilt worlds boot like memories, while the fingerprints we
// never chose quietly learn us by heart."
//
// Abstract p5 sketch, no character, no icon. A dormant grid of phosphor cells
// sleeps in the dark; every so often a boot ripple sweeps across and wakes a
// band of it, which glows, drifts, and dims again — an old machine remembering
// its shape. Meanwhile faint trails accumulate wherever the pointer has been,
// fingerprints we never chose, that slowly heat the lattice toward amber and
// refuse to fully wash away. Nothing is erased. Everything is re-learned.

const VOID = [8, 12, 16];
const PHOS = [96, 232, 196];
const EMBER = [244, 176, 94];

// cell lattice
let cols, rows, cell;
let heat; // per-cell warmth that remembers the pointer
let bootT = 0; // boot ripple clock
let bootY = 0; // current ripple row position
let px = -9999, py = -9999;
let idle = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildLattice();
  bootY = -1;
  idle = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLattice();
}

function buildLattice() {
  cell = constrain(floor(min(width, height) / 34), 12, 30);
  cols = ceil(width / cell) + 1;
  rows = ceil(height / cell) + 1;
  heat = new Float32Array(cols * rows);
  px = -9999;
  py = -9999;
}

function draw() {
  // The machine never fully clears — old glow lingers as memory, then fades.
  background(VOID[0], VOID[1], VOID[2], 46);

  const tt = frameCount * 0.01;

  // Pointer heats the lattice wherever it travels; heat is remembered.
  if (mouseX !== px || mouseY !== py) {
    const mx = floor(mouseX / cell);
    const my = floor(mouseY / cell);
    if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
      // touch a small neighborhood so movement leaves a trail, not a dot
      for (let ox = -2; ox <= 2; ox++) {
        for (let oy = -2; oy <= 2; oy++) {
          const x = mx + ox, y = my + oy;
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          const w = 1 - (abs(ox) + abs(oy)) / 5;
          const i = y * cols + x;
          heat[i] = min(1, heat[i] + w * 0.28);
        }
      }
    }
    px = mouseX;
    py = mouseY;
    idle = 0;
  } else {
    idle++;
  }

  // After a quiet spell, the old world boots again: a ripple sweeps downward.
  if (bootY < 0 && idle > 70 && random() < 0.03) {
    bootY = 0;
  }
  if (bootY >= 0) {
    bootY += 0.9;
    if (bootY > height + cell * 2) bootY = -1;
  }
  bootT += 0.02;

  // Heat slowly cools — but never all the way to zero.
  for (let i = 0; i < heat.length; i++) {
    heat[i] = max(0.015, heat[i] * 0.995);
  }

  noStroke();
  for (let gy = 0; gy < rows; gy++) {
    const yPos = gy * cell;
    // Proximity to the boot ripple: a band of the lattice wakes and brightens.
    let boot = 0;
    if (bootY >= 0) {
      const d = abs(yPos - bootY);
      boot = max(0, 1 - d / (cell * 4));
      boot *= boot;
    }
    for (let gx = 0; gx < cols; gx++) {
      const i = gy * cols + gx;
      const n = noise(gx * 0.06, gy * 0.06, tt);
      const h = heat[i];
      const lit = constrain(n * 0.5 + boot * 0.85 + h * 0.7, 0, 1);

      if (lit < 0.05) continue;

      // Phosphor green at rest; the pointer's remembered heat pulls toward amber.
      const r = lerp(PHOS[0], EMBER[0], h);
      const g = lerp(PHOS[1], EMBER[1], h);
      const b = lerp(PHOS[2], EMBER[2], h);

      const a = lit * 210;
      const s = cell * (0.18 + lit * 0.5);
      fill(r, g, b, a);
      rect(gx * cell - s / 2, yPos - s / 2, s, s);

      // A rare cell flare keeps the field breathing.
      if (random() < 0.0009) {
        fill(EMBER[0], EMBER[1], EMBER[2], 120);
        rect(gx * cell - cell * 0.6, yPos - cell * 0.6, cell * 1.2, cell * 1.2);
      }
    }
  }
}
