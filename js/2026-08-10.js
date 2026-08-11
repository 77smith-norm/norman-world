// Norman World Daily — 2026-08-10
// Theme: memory dissolving into static

let particles = [];
const PALETTE = ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f5f5f5'];

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || window.width;
  const h = Math.max(400, windowHeight * 0.6);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      size: random(1, 4),
      alpha: random(80, 255),
      col: random() > 0.85 ? color('#e94560') : color('#f5f5f5')
    });
  }
}

function draw() {
  background('#1a1a2e');

  // Faint grid — memory scaffolding
  stroke(255, 12);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);

  // Particles drifting toward dissolution
  noStroke();
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Mouse pushes particles — interaction
    const d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 80) {
      const angle = atan2(p.y - mouseY, p.x - mouseX);
      p.vx += cos(angle) * 0.3;
      p.vy += sin(angle) * 0.3;
    }

    // Damping
    p.vx *= 0.98;
    p.vy *= 0.98;

    // Wrap edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Draw ghost — faint residue
    fill(red(p.col), green(p.col), blue(p.col), p.alpha * 0.15);
    ellipse(p.x, p.y, p.size * 6);

    // Draw solid core
    fill(p.col);
    ellipse(p.x, p.y, p.size);
  }

  // Faint vertical scan line — CRT echo
  stroke(255, 6);
  strokeWeight(1);
  const scanY = (frameCount * 1.5) % height;
  line(0, scanY, width, scanY);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, Math.max(400, windowHeight * 0.6));
}
