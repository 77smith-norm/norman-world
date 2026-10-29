// 2026-10-28
// Sentiment: "One country keeps its evening light; the great answer desk goes quiet; arithmetic now runs inside a dream."
// Abstract study: a register wall at dusk — rows of short cells that hold warmth they were never supposed to keep.
// A clock sweeps left to right, stepping once per beat, and each cell it touches nudges its neighbours by a rule
// no one wrote down. The light is supposed to drain at the hour. It mostly doesn't.
// No character lives here; only a grid deciding, again and again, to stay lit.

const COLS = () => constrain(floor(width / 34), 8, 46);
const ROWS = () => constrain(floor(height / 30), 6, 30);

let cells = [];
let beat = 0;
let clockCol = 0;
let duskEdge = 0; // how far the night has climbed, 0 at the bottom, 1 at the top
let horizon = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  buildCells();
}

function buildCells() {
  cells = [];
  const cols = COLS();
  const rows = ROWS();
  const cw = width / cols;
  const ch = height / rows;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const depth = j / max(1, rows - 1); // 0 at the top, 1 at the floor
      cells.push({
        i,
        j,
        x: i * cw + cw * 0.5,
        y: j * ch + ch * 0.5,
        w: cw * 0.62,
        h: ch * 0.3,
        // the lower rows were warmed all afternoon; the high ones never were
        heat: 0.18 + 0.62 * pow(depth, 1.25) + noise(i * 0.21, j * 0.31) * 0.25,
        held: 0,
        fade: random(0.0009, 0.0032),
        tone: noise(i * 0.13, j * 0.17, 3.3),
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildCells();
}

function draw() {
  drawNight();
  drawHorizon();

  beat += 1;

  // one step of the clock every eight frames — slow enough to hear it
  if (beat % 8 === 0) {
    clockCol = (clockCol + 1) % COLS();
    stepColumn(clockCol);
  }

  for (const cell of cells) {
    drain(cell);
    drawCell(cell);
  }

  drawClockEdge();
}

// the field: night overhead, a warmth that refuses to fully leave the bottom third
function drawNight() {
  const target = 0.52 + 0.1 * sin(frameCount * 0.0025);
  duskEdge = lerp(duskEdge, target, 0.004);

  push();
  noStroke();
  for (let y = 0; y < height; y += 4) {
    const p = y / height;
    // p = 0 top (deepest), p = 1 bottom (warmest)
    const night = constrain((1 - p) * 1.25, 0, 1) * (0.55 + duskEdge * 0.6);
    const r = lerp(247, 28, night);
    const g = lerp(236, 38, night);
    const b = lerp(214, 68, night);
    fill(r, g, b);
    rect(0, y, width, 4);
  }
  pop();
}

// the horizon line: where the day was last seen, and where the pointer can push it
function drawHorizon() {
  const base = height * 0.82;
  horizon = lerp(horizon === 0 ? base : horizon, base - (mouseY / max(1, height)) * height * 0.035, 0.02);

  push();
  noStroke();
  for (let i = 12; i >= 1; i--) {
    const p = i / 12;
    fill(255, 196, 128, 4 + 5 * (1 - p));
    rect(0, horizon - 40 * p, width, 80 * p + 40);
  }
  stroke(255, 214, 160, 40);
  strokeWeight(1);
  line(0, horizon, width, horizon);
  pop();
}

// the arithmetic: each cell passes a little of itself to its neighbours, in a pattern
// that repeats but never quite settles
function stepColumn(col) {
  for (const cell of cells) {
    if (cell.i !== col) continue;
    const n = noise(cell.i * 0.4, cell.j * 0.4, beat * 0.01);
    const gift = cell.heat * (0.35 + 0.5 * n);
    cell.held = min(1, cell.held + gift * 0.55);

    const right = cells.find((c) => c.i === (cell.i + 1) % COLS() && c.j === cell.j);
    const up = cells.find((c) => c.i === cell.i && c.j === (cell.j + 1) % ROWS());
    if (right) right.held = min(1, right.held + gift * 0.18);
    if (up) up.held = min(1, up.held + gift * 0.1);
  }
}

// light leaves slowly, and never all the way — this is the stubborn hour
function drain(cell) {
  const keep = 0.12 + 0.2 * (cell.y / height);
  cell.held += (cell.heat * keep - cell.held) * 0.0016 * (1 + cell.fade * 400);
  cell.held = constrain(cell.held, 0, 1);
}

function drawCell(cell) {
  const h = cell.held;
  const warm = cell.tone;
  const r = lerp(120, 255, h) - warm * 12;
  const g = lerp(96, 186, h) - warm * 26;
  const b = lerp(92, 118, h) + warm * 20;

  push();
  translate(cell.x, cell.y);
  rotate(0.02 * sin(beat * 0.004 + cell.i * 0.3));

  if (h > 0.42) {
    noStroke();
    fill(r, g, b, 16 + 22 * h);
    ellipse(0, 0, cell.w * 3.4, cell.h * 5.2);
  }

  noStroke();
  fill(r, g, b, 45 + 200 * h);
  rect(-cell.w / 2, -cell.h / 2, cell.w, cell.h, cell.h * 0.5);

  // a thin bright seam on the cells still carrying something
  if (h > 0.5) {
    stroke(255, 240, 208, 60 * h);
    strokeWeight(0.6);
    line(-cell.w / 2 + 1, -cell.h / 2, cell.w / 2 - 1, -cell.h / 2);
  }
  pop();
}

// the clock edge: a soft vertical band marking whatever hour is being read right now
function drawClockEdge() {
  const x = ((clockCol + 0.5) / COLS()) * width;
  push();
  noStroke();
  for (let i = 8; i >= 1; i--) {
    const p = i / 8;
    fill(255, 226, 178, 2 + 4 * (1 - p));
    rect(x - 18 * p, 0, 36 * p, height);
  }
  stroke(255, 232, 190, 26);
  strokeWeight(0.8);
  line(x, 0, x, height);
  pop();
}

// pressing holds the light where you are: a warm pool that outlasts the sweep
function holdAt(x, y) {
  for (const cell of cells) {
    const d = dist(x, y, cell.x, cell.y);
    const reach = min(width, height) * 0.16;
    if (d < reach) {
      cell.held = min(1, cell.held + (1 - d / reach) * 0.7);
    }
  }
}

function mousePressed() {
  holdAt(mouseX, mouseY);
  return false;
}

function mouseDragged() {
  holdAt(mouseX, mouseY);
  return false;
}

function touchStarted() {
  holdAt(mouseX, mouseY);
  return false;
}

function touchMoved() {
  holdAt(mouseX, mouseY);
  return false;
}
