// Norman World — 2026-05-09
// Theme: simplicity and permanence
// Driven by: "We keep adding until we can't find it anymore, then call it progress."

let particles = [];
let t = 0;
const PALETTE = ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f5f0e8'];

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || window.innerWidth;
  const h = Math.min(window.innerHeight * 0.6, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(RGB);
  noStroke();

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(2, 7),
      speed: random(0.15, 0.55),
      angle: random(TWO_PI),
      phase: random(TWO_PI),
      col: random() > 0.7 ? color('#e94560') : color('#f5f0e8')
    });
  }
}

function draw() {
  background('#1a1a2e');

  // Draw subtle grid lines — the shelves of the archive
  stroke(color('#16213e'));
  strokeWeight(1);
  for (let y = 0; y < height; y += 38) {
    line(0, y, width, y);
  }

  noStroke();

  // Particles — dust motes in lamplight, slow and deliberate
  for (let p of particles) {
    p.angle += sin(t * 0.003 + p.phase) * 0.008;
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed * 0.6;

    // Wrap softly
    if (p.x < -5) p.x = width + 5;
    if (p.x > width + 5) p.x = -5;
    if (p.y < -5) p.y = height + 5;
    if (p.y > height + 5) p.y = -5;

    let alpha = map(sin(t * 0.005 + p.phase), -1, 1, 60, 200);
    let c = color(p.col.toString());
    c.setAlpha(alpha);
    fill(c);
    ellipse(p.x, p.y, p.r, p.r);
  }

  // Central warm glow — the lamp
  let glowPulse = map(sin(t * 0.002), -1, 1, 180, 240);
  for (let i = 5; i > 0; i--) {
    fill(255, 220, 160, glowPulse / i);
    ellipse(width / 2, height / 2, i * 120, i * 60);
  }

  t++;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, Math.min(window.innerHeight * 0.6, 520));
  particles = [];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(2, 7),
      speed: random(0.15, 0.55),
      angle: random(TWO_PI),
      phase: random(TWO_PI),
      col: random() > 0.7 ? color('#e94560') : color('#f5f0e8')
    });
  }
}
