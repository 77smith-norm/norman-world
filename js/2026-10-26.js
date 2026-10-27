// 2026-10-26
// Sentiment: "Proofs fall like leaves tonight; what we thought impossible quietly loosens, and reason keeps walking further than we marked."
// Abstract study: impossible bounds dissolving — rigid grids that soften and drift like leaves,
// small lights of reasoning wandering further than the fences we drew for them.
// Nothing here is a character; only the quiet motion of limits coming undone.

let LEAVES = [];
let GRID = { cols: 0, rows: 0 };
let t = 0;

const INKS = [
  [46, 58, 96],
  [86, 102, 148],
  [148, 132, 96],
  [70, 110, 118],
];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  buildGrid();
  seedLeaves();
}

function buildGrid() {
  GRID.cols = constrain(floor(width / 110), 5, 20);
  GRID.rows = constrain(floor(height / 110), 4, 14);
}

function seedLeaves() {
  LEAVES = [];
  const n = constrain(floor((width + height) / 14), 60, 220);
  for (let i = 0; i < n; i++) {
    LEAVES.push(newLeaf(random(width), random(height)));
  }
}

function newLeaf(x, y) {
  return {
    x, y,
    vx: random(-0.3, 0.3),
    vy: random(0.2, 0.9),
    size: random(3, 11),
    rot: random(TWO_PI),
    spin: random(-0.02, 0.02),
    tone: floor(random(INKS.length)),
    phase: random(1000),
    glow: random() < 0.18,
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
  seedLeaves();
}

function draw() {
  background(16, 19, 34);
  t += 0.008;

  drawGrid();
  drawLeaves();
  drawLantern();
}

function drawGrid() {
  push();
  noFill();
  const cw = width / GRID.cols;
  const ch = height / GRID.rows;
  for (let i = 0; i <= GRID.cols; i++) {
    for (let j = 0; j <= GRID.rows; j++) {
      const x = i * cw;
      const y = j * ch;
      const wob = noise(i * 0.4, j * 0.4, t * 0.6) * 14;
      const fade = 14 + 22 * noise(i * 0.3 + 50, j * 0.3, t * 0.4);
      stroke(150, 160, 210, fade);
      strokeWeight(0.6);
      line(x - cw, y + wob * 0.2, x + wob, y + wob);
    }
  }
  pop();
}

function drawLeaves() {
  push();
  for (const l of LEAVES) {
    const gust = noise(l.x * 0.002, l.y * 0.002, t) - 0.5;
    l.x += l.vx + gust * 1.2 + (mouseX - width / 2) * 0.0004;
    l.y += l.vy * (0.7 + 0.6 * noise(l.phase, t * 0.8));
    l.rot += l.spin + gust * 0.03;

    if (l.y > height + 12) {
      l.y = -12;
      l.x = random(width);
    }
    if (l.x > width + 12) l.x = -12;
    if (l.x < -12) l.x = width + 12;

    const tone = INKS[l.tone];
    translate(l.x, l.y);
    rotate(l.rot);
    if (l.glow) {
      noStroke();
      fill(245, 220, 150, 90);
      ellipse(0, 0, l.size * 2.4, l.size * 1.2);
      fill(250, 235, 180, 160);
      ellipse(0, 0, l.size * 1.1, l.size * 0.55);
    } else {
      noStroke();
      fill(tone[0], tone[1], tone[2], 150);
      ellipse(0, 0, l.size * 1.6, l.size * 0.8);
      stroke(200, 210, 240, 60);
      strokeWeight(0.5);
      line(-l.size * 0.7, 0, l.size * 0.7, 0);
    }
    rotate(-l.rot);
    translate(-l.x, -l.y);
  }
  pop();
}

function drawLantern() {
  push();
  noStroke();
  const lx = lerp(width * 0.5, mouseX, 0.25);
  const ly = lerp(height * 0.4, mouseY, 0.25);
  for (let i = 8; i >= 1; i--) {
    const p = i / 8;
    fill(250, 220, 150, 4 + 5 * (1 - p));
    ellipse(lx, ly, 320 * p, 320 * p);
  }
  fill(252, 232, 170, 220);
  ellipse(lx, ly, 10, 10);
  pop();
}

function mousePressed() {
  for (let k = 0; k < 8; k++) {
    if (LEAVES.length > 300) LEAVES.shift();
    LEAVES.push(newLeaf(mouseX + random(-24, 24), mouseY + random(-24, 24)));
  }
  return false;
}

function touchEnded() {
  for (let k = 0; k < 6; k++) {
    if (LEAVES.length > 300) LEAVES.shift();
    LEAVES.push(newLeaf(mouseX + random(-24, 24), mouseY + random(-24, 24)));
  }
  return false;
}
