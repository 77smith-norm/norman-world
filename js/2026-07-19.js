let cols, rows;
let cellSize = 20;
let time = 0;
let hiddenGrid = [];
let revealRadius = 120;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  rebuildGrid();
}

function rebuildGrid() {
  cols = ceil(width / cellSize) + 1;
  rows = ceil(height / cellSize) + 1;
  hiddenGrid = [];
  for (let y = 0; y < rows; y++) {
    hiddenGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      hiddenGrid[y][x] = {
        brightness: 0,
        hue: random(200, 280),
        phase: random(TWO_PI),
        size: random(0.3, 1.0)
      };
    }
  }
}

function draw() {
  background(230, 20, 8);
  time += 0.008;

  let mx = mouseX;
  let my = mouseY;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = x * cellSize;
      let py = y * cellSize;
      let d = dist(mx, my, px, py);

      let cell = hiddenGrid[y][x];

      // gentle ambient breathing
      let breath = (sin(time * 2 + cell.phase) + 1) * 0.5;

      // reveal near cursor — warm glow
      let reveal = constrain(1 - d / revealRadius, 0, 1);
      reveal = reveal * reveal; // falloff

      cell.brightness = lerp(cell.brightness, breath * 15 + reveal * 85, 0.08);

      // shift hue toward warm when revealed
      let hue = lerp(cell.hue, 30, reveal);
      let sat = lerp(60, 20, reveal);
      let bri = cell.brightness;
      let alpha = lerp(30, 90, reveal);

      fill(hue, sat, bri, alpha);

      let sz = cellSize * cell.size * (0.5 + reveal * 0.5 + breath * 0.2);
      let drift = sin(time + cell.phase) * 2;

      ellipse(px + drift, py + drift, sz, sz);
    }
  }

  // soft center glow
  let glowSize = revealRadius * 1.5 + sin(time * 3) * 20;
  for (let r = glowSize; r > 0; r -= 8) {
    let alpha = map(r, 0, glowSize, 12, 0);
    fill(35, 40, 100, alpha);
    ellipse(mx, my, r * 2, r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rebuildGrid();
}
