// 2026-08-02 — stillness and the edge of motion
// Sentiment: Each system eventually becomes immobile; the craft is knowing when to hold still and when to let go.

let particles = [];
let cols, rows;
let cellSize = 40;
let t = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = container.offsetHeight || windowHeight;
  createCanvas(w, h).parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  cols = ceil(width / cellSize);
  rows = ceil(height / cellSize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(3, 8),
      hue: random(200, 260),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(230, 15, 8, 25);

  // Grid of subtle anchors
  stroke(220, 20, 30, 15);
  strokeWeight(0.5);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let x = c * cellSize;
      let y = r * cellSize;
      let d = dist(mouseX, mouseY, x, y);
      let influence = sin(t * 0.5 - d * 0.02) * 0.5 + 0.5;
      let alpha = map(influence, 0, 1, 5, 25);
      stroke(220, 20, 30, alpha);
      let s = cellSize * 0.3 * influence;
      rect(x - s/2, y - s/2, s, s);
    }
  }

  // Still particles — barely moving, with occasional micro-drift
  noStroke();
  for (let p of particles) {
    let phase = sin(t * 0.3 + p.phase) * 0.5 + 0.5;
    p.vx = p.vx * 0.95 + random(-0.05, 0.05);
    p.vy = p.vy * 0.95 + random(-0.05, 0.05);
    p.x += p.vx;
    p.y += p.vy;

    // Soft glow
    fill(p.hue, 40, 90, map(phase, 0, 1, 20, 60));
    ellipse(p.x, p.y, p.size * map(phase, 0, 1, 0.7, 1.2));
    fill(p.hue, 30, 100, map(phase, 0, 1, 5, 20));
    ellipse(p.x, p.y, p.size * 2.5 * map(phase, 0, 1, 0.5, 1));
  }

  // A single still center — the anchor
  let cx = width / 2;
  let cy = height / 2;
  noFill();
  stroke(210, 30, 70, 20);
  strokeWeight(1);
  let r = 80 + sin(t * 0.2) * 20;
  ellipse(cx, cy, r * 2);
  stroke(210, 30, 70, 10);
  ellipse(cx, cy, r * 3.5);

  t += 0.02;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}