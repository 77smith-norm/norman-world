// js/2026-08-09.js — p5.js sketch for Norman World daily entry
// Theme: ephemeral sandboxes, cost pressure, fractal noise — sentiment-driven abstract art

let t = 0;
let particles = [];
const PALETTE = ['#e8d5f0', '#c9a8e0', '#8b5cf6', '#4c1d95', '#1a0533'];
const STORY_THEMES = ['ephemeral', 'cost', 'signal'];

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('sketch-container');
  colorMode(RGB, 255);
  noStroke();
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      size: random(2, 12),
      hue: random(PALETTE),
      phase: random(TWO_PI),
      decay: random(0.3, 0.9)
    });
  }
}

function draw() {
  // Deep purple fade — sandbox dissolving
  fill(26, 5, 51, 18);
  rect(0, 0, width, height);

  // Layered 1/f noise fields
  for (let layer = 0; layer < 3; layer++) {
    let alpha = map(layer, 0, 2, 30, 10);
    let scl = map(layer, 0, 2, 0.003, 0.009);
    let ts = t * map(layer, 0, 2, 0.08, 0.2);
    for (let x = 0; x < width; x += 12) {
      for (let y = 0; y < height; y += 12) {
        let n = noise(x * scl + ts, y * scl + ts, frameCount * 0.002);
        let bright = map(n, 0, 1, 30, 220);
        let col = PALETTE[(layer + 1) % PALETTE.length];
        fill(red(col), green(col), blue(col), alpha * n);
        let sz = map(n, 0, 1, 2, 8 + layer * 4);
        rect(x, y, sz, sz);
      }
    }
  }

  // Orbiting particles — each a "sandbox" that spawns and fades
  for (let p of particles) {
    p.x += p.vx + sin(t * 0.3 + p.phase) * 0.3;
    p.y += p.vy + cos(t * 0.3 + p.phase) * 0.3;
    p.phase += 0.01;

    // Wrap edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Pulse: cost meter
    let pulse = sin(t * p.decay + p.phase) * 0.5 + 0.5;
    let sz = p.size * (0.5 + pulse * 0.8);
    let alpha = map(pulse, 0, 1, 20, 120);

    let c = color(p.hue);
    fill(red(c), green(c), blue(c), alpha);
    ellipse(p.x, p.y, sz, sz);

    // Inner glow ring — the signal underneath
    noFill();
    stroke(255, 255, 255, alpha * 0.4);
    strokeWeight(0.5);
    ellipse(p.x, p.y, sz * 1.4, sz * 1.4);
    noStroke();
  }

  t += 0.016;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
