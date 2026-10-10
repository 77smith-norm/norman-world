// 2026-10-09 — "An old game made new, a runtime swallowed whole, a machine that
// still cannot choose — the future arrives in familiar shapes."
//
// Abstract p5 sketch, no character, no icon. A field of covered tiles sits in
// cool blue-grey. Move the pointer slowly and warmth spreads outward tile by
// tile — an old, familiar grid made new. But hold nothing and the warmth
// recedes: every revealed square cools back into the covered dark. The field
// never resolves on its own. It only answers a patient hand.

const BG = [10, 12, 16];
const COOL = [26, 32, 43];
const WARM = [242, 186, 122];

let cols, rows;
const cell = 44;
let grid = [];
let queue = [];
let t = 0;
let lastPx = -9999, lastPy = -9999;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildGrid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}

function buildGrid() {
  cols = ceil(width / cell);
  rows = ceil(height / cell);
  grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        reveal: 0,                  // 0 covered .. 1 warm
        dots: floor(random(1, 5)),  // abstract cluster size
        phase: random(TWO_PI),
      });
    }
    grid.push(row);
  }
  queue = [];
}

function draw() {
  background(BG[0], BG[1], BG[2]);
  t += 0.01;

  // Decisions never hold: everything cools back toward the covered dark.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c].reveal = max(0, grid[r][c].reveal - 0.006);
    }
  }

  // A patient hand: only slow movement awakens the field.
  const d = dist(mouseX, mouseY, lastPx, lastPy);
  const onCanvas =
    mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  lastPx = mouseX;
  lastPy = mouseY;

  if (onCanvas && d < 4) {
    const c = floor(mouseX / cell);
    const r = floor(mouseY / cell);
    if (c >= 0 && c < cols && r >= 0 && r < rows) queue.push({ r, c, depth: 0 });
  }

  // Warmth spreads outward, one tile at a time (breadth-first, then stops).
  let budget = 6;
  while (queue.length && budget-- > 0) {
    const { r, c, depth } = queue.shift();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    const g = grid[r][c];
    g.reveal = min(1, g.reveal + 0.5);
    if (depth < 5) {
      queue.push({ r: r + 1, c, depth: depth + 1 });
      queue.push({ r: r - 1, c, depth: depth + 1 });
      queue.push({ r, c: c + 1, depth: depth + 1 });
      queue.push({ r, c: c - 1, depth: depth + 1 });
    }
  }
  if (queue.length > 400) queue.splice(0, queue.length - 400);

  noStroke();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const g = grid[r][c];
      const x = c * cell;
      const y = r * cell;

      // Covered tile: cool and flat, and it breathes very slightly.
      const breathe = 3 * sin(t * 0.7 + (r + c) * 0.15);
      fill(COOL[0] + breathe, COOL[1] + breathe, COOL[2] + breathe, 220);
      rect(x + 2, y + 2, cell - 4, cell - 4, 4);

      // Revealed tile: warm light laid gently on top of the machinery.
      if (g.reveal > 0.01) {
        fill(WARM[0], WARM[1], WARM[2], 238 * g.reveal);
        rect(x + 2, y + 2, cell - 4, cell - 4, 4);
        // An abstract cluster that counts nothing in particular.
        for (let i = 0; i < g.dots; i++) {
          const a = g.phase + i * 2.4 + t * 0.6;
          const rr = cell * 0.16 * (1 + 0.25 * sin(t * 1.4 + i));
          fill(28, 22, 16, 200 * g.reveal);
          circle(
            x + cell / 2 + cos(a) * cell * 0.22,
            y + cell / 2 + sin(a) * cell * 0.22,
            rr
          );
        }
      }
    }
  }

  // A faint sheen over the grid: the old shape, still legible underneath.
  stroke(96, 116, 148, 20);
  strokeWeight(1);
  for (let c = 0; c <= cols; c++) line(c * cell, 0, c * cell, height);
  for (let r = 0; r <= rows; r++) line(0, r * cell, width, r * cell);

  // Heartbeat of the hand where it waits.
  if (onCanvas && d < 4) {
    noFill();
    stroke(255, 206, 150, 60);
    strokeWeight(1);
    const px = floor(mouseX / cell) * cell + cell / 2;
    const py = floor(mouseY / cell) * cell + cell / 2;
    rect(px - cell / 2 + 2, py - cell / 2 + 2, cell - 4, cell - 4, 4);
  }
}
