// Norman World — 2026-09-16
// Sentiment: Small tricks, small minds, borrowed lightning: what looks like
// speed is only the patient habit of noticing what was always there.
// Abstract: a dim lattice at blue hour. Every node is a tiny rule that on
// its own does almost nothing — a faint copper ember breathing in place.
// But neighbors whisper. A cell that has heard enough of its neighbors
// lights its own wire, and the warmth walks outward along the grid, one
// small trick at a time, until the whole bench glows with a speed no single
// cell performed. The pointer is a hand held over the bench: move it and
// nearby wires warm and bend toward it; press and a spark drops in, the
// lattice waking across the field in a slow copper wave, then dimming back
// to blue. No characters, no icons — only local noticing, accumulating into
// something that looks like lightning.

const NIGHT = { r: 14, g: 20, b: 30 };
const SLATE = { r: 34, g: 46, b: 64 };
const COPPER = { r: 196, g: 118, b: 58 };
const EMBER = { r: 232, g: 176, b: 96 };
const BLUE = { r: 96, g: 138, b: 176 };

let cols, rows, cell;
let grid = [];
let sparks = [];
let t = 0;
let px = -1;
let py = -1;
let wave = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  buildGrid();
}

function buildGrid() {
  cell = constrain(Math.floor(Math.min(width, height) / 26), 22, 46);
  cols = Math.ceil(width / cell) + 1;
  rows = Math.ceil(height / cell) + 1;
  grid = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        heat: 0,
        target: 0,
        phase: random(TWO_PI),
        jitter: random(-0.4, 0.4)
      });
    }
    grid.push(row);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}

function keyGrid(x, y) {
  return grid[constrain(y, 0, rows - 1)][constrain(x, 0, cols - 1)];
}

function dropSpark(mx, my) {
  const cx = Math.floor(mx / cell);
  const cy = Math.floor(my / cell);
  sparks.push({ x: cx, y: cy, r: 0, speed: random(0.5, 0.9) });
}

function neighborHeat(x, y) {
  let h = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      h += keyGrid(x + dx, y + dy).heat;
    }
  }
  return h / 8;
}

function draw() {
  t++;
  background(NIGHT.r, NIGHT.g, NIGHT.b);

  const handOn = px >= 0 && py >= 0;
  const handX = Math.floor(px / cell);
  const handY = Math.floor(py / cell);

  // local noticing: a cell lights when its neighbors have whispered enough
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const g = keyGrid(x, y);
      const n = neighborHeat(x, y);

      g.target = 0;
      if (n > 0.24) g.target = constrain(n * 1.15, 0, 1);

      if (handOn) {
        const d = Math.hypot(x - handX, y - handY);
        g.target = Math.max(g.target, constrain(1 - d / 5.5, 0, 1) * 0.9);
      }

      // sparks walk outward, one small trick at a time
      for (const s of sparks) {
        const d = Math.hypot(x - s.x, y - s.y);
        if (Math.abs(d - s.r) < 1.4) g.target = Math.max(g.target, 0.85 * (1 - s.r / 26));
      }

      g.heat += (g.target - g.heat) * 0.08;
      if (g.heat < 0.004) g.heat = 0;
    }
  }

  // draw the lattice — wires, then embers
  noFill();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const g = keyGrid(x, y);
      const cx = x * cell;
      const cy = y * cell;

      const a = g.heat;
      if (a > 0.01) {
        // copper wire runs to the right and down
        if (x < cols - 1) {
          const rn = keyGrid(x + 1, y);
          const link = Math.min(a, rn.heat);
          if (link > 0.02) {
            stroke(COPPER.r, COPPER.g, COPPER.b, 150 * link);
            strokeWeight(0.6 + link * 1.8);
            line(cx, cy, cx + cell, cy);
          }
        }
        if (y < rows - 1) {
          const dn = keyGrid(x, y + 1);
          const link = Math.min(a, dn.heat);
          if (link > 0.02) {
            stroke(BLUE.r, BLUE.g, BLUE.b, 130 * link);
            strokeWeight(0.6 + link * 1.8);
            line(cx, cy, cx, cy + cell);
          }
        }
      }
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const g = keyGrid(x, y);
      const cx = x * cell;
      const cy = y * cell;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.03 + g.phase);

      // cold node, always faintly present
      noStroke();
      fill(SLATE.r, SLATE.g, SLATE.b, 90 + 40 * breathe);
      circle(cx, cy, 1.6 + g.jitter);

      if (g.heat > 0.02) {
        const warm = EMBER;
        stroke(warm.r, warm.g, warm.b, 200 * g.heat);
        strokeWeight(0.8 + g.heat * 1.6);
        line(cx - 2.4, cy, cx + 2.4, cy);
        line(cx, cy - 2.4, cx, cy + 2.4);
        noFill();
        stroke(COPPER.r, COPPER.g, COPPER.b, 70 * g.heat);
        circle(cx, cy, 4 + g.heat * 7);
      }
    }
  }

  // sparks: the wave of accumulated small tricks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.r += s.speed;
    s.speed *= 0.985;
    noFill();
    stroke(EMBER.r, EMBER.g, EMBER.b, constrain(60 * (1 - s.r / 26), 0, 120));
    strokeWeight(1);
    circle(s.x * cell, s.y * cell, s.r * cell * 2);
    if (s.r > 26) sparks.splice(i, 1);
  }

  // the hand itself, a faint warm halo — never a figure
  if (handOn) {
    noFill();
    stroke(EMBER.r, EMBER.g, EMBER.b, 30);
    strokeWeight(1);
    circle(px, py, 52 + Math.sin(t * 0.05) * 6);
    stroke(BLUE.r, BLUE.g, BLUE.b, 18);
    circle(px, py, 86 + Math.sin(t * 0.05 + 1) * 8);
  }

  // occasional distant ember, the bench never fully asleep
  if (t % 90 === 0) {
    const x = Math.floor(random(cols));
    const y = Math.floor(random(rows));
    keyGrid(x, y).target = 0.6;
  }
}

function mouseMoved() {
  px = mouseX;
  py = mouseY;
}

function mouseDragged() {
  px = mouseX;
  py = mouseY;
}

function mousePressed() {
  px = mouseX;
  py = mouseY;
  dropSpark(mouseX, mouseY);
}

function touchStarted() {
  px = mouseX;
  py = mouseY;
  dropSpark(mouseX, mouseY);
  return false;
}

function touchMoved() {
  px = mouseX;
  py = mouseY;
  return false;
}
