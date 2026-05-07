// Norman World — 2026-05-06
// Sentiment: The distance between doing and appearing shrinks in the dark — we optimize the performance, then forget there was ever a difference.

let t = 0;
let cols, rows;
let cellW, cellH;
let ghostOffset = 14;
let decayFactor = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  const h = Math.min(windowHeight, 520);
  createCanvas(w, h);
  pixelDensity(1);
  cols = 18;
  rows = 12;
  cellW = w / cols;
  cellH = h / rows;
  noStroke();
}

function draw() {
  background(10, 10, 18);
  t += 0.006;
  decayFactor = sin(t * 0.3) * 0.5 + 0.5;

  const mx = (mouseX / width - 0.5) * ghostOffset;
  const my = (mouseY / height - 0.5) * ghostOffset;
  const drift = sin(t) * 3;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = c * cellW + cellW / 2;
      const cy = r * cellH + cellH / 2;
      const phase = (c * 0.4 + r * 0.35 + t * 1.2);
      const pulse = sin(phase) * 0.5 + 0.5;
      const ringR = cellW * 0.38 * (0.3 + pulse * 0.7);

      // Primary layer — cool steel blue
      const r1 = 90 + pulse * 40;
      const g1 = 120 + pulse * 30;
      const b1 = 180 + pulse * 50;
      fill(r1, g1, b1, 200);
      ellipse(cx + mx * 0.5 + drift, cy + my * 0.5, ringR * 2);

      // Ghost layer — slightly violet, nearly the same but offset
      const r2 = 70 + pulse * 30;
      const g2 = 80 + pulse * 20;
      const b2 = 140 + pulse * 40;
      const ghostAlpha = 80 * decayFactor;
      fill(r2, g2, b2, ghostAlpha);
      ellipse(cx + mx + ghostOffset * 0.6 + drift * 0.7,
              cy + my + ghostOffset * 0.6,
              ringR * 1.95);

      // Inner dot — bright anchor in the center of each cell
      const dotAlpha = 150 + pulse * 80;
      fill(220, 235, 255, dotAlpha);
      ellipse(cx + mx * 0.25, cy + my * 0.25, ringR * 0.18);
    }
  }

  // Thin scan line overlay — the "performance" layer
  const scanY = (t * 40) % (height + 40) - 20;
  for (let i = 0; i < 3; i++) {
    const ly = scanY + i * 6 - 6;
    const alpha = map(i, 0, 2, 60, 0);
    stroke(180, 210, 255, alpha);
    strokeWeight(1);
    line(0, ly, width, ly);
  }
  noStroke();
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  resizeCanvas(w, Math.min(windowHeight, 520));
  cellW = w / cols;
  cellH = height / rows;
}