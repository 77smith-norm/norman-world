// Norman World — 2026-05-05
// Sentiment: "Every day, a small breath inward — then back out again, carrying something you didn't have before."

let t = 0;
let particles = [];
const PALETTE = {
  bg: [18, 20, 30],
  inhale: [80, 160, 220],
  exhale: [220, 140, 100],
  accent: [240, 220, 180]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(3, 12),
      phase: random(TWO_PI),
      speed: random(0.003, 0.012)
    });
  }
}

function draw() {
  t += 0.004;
  background(PALETTE.bg);

  // Breathing rhythm: inhale (bright) → exhale (dim)
  let breath = sin(t * TWO_PI);
  let intensity = map(breath, -1, 1, 0.6, 1.0);
  let cx = width / 2, cy = height / 2;
  let radius = min(width, height) * 0.38 * (0.85 + 0.15 * breath);

  // Central glow that breathes
  for (let ring = 8; ring > 0; ring--) {
    let alpha = map(ring, 8, 0, 8, 50) * intensity;
    let col = lerpColor(color(...PALETTE.inhale, alpha), color(...PALETTE.exhale, alpha), breath * 0.5 + 0.5);
    fill(col);
    ellipse(cx, cy, radius * 2 * (ring / 8), radius * 2 * (ring / 8));
  }

  // Particles that drift inward on inhale, outward on exhale
  for (let p of particles) {
    let d = dist(p.x, p.y, cx, cy);
    let dir = breath > 0 ? -1 : 1;
    let drift = map(breath, -1, 1, 0.2, 1.2) * dir;
    p.x += cos(p.phase + t * 0.8) * drift;
    p.y += sin(p.phase + t * 0.6) * drift;

    // Wrap particles
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    let sz = p.r * map(breath, -1, 1, 0.7, 1.3);
    let col = lerpColor(color(...PALETTE.inhale, 160 * intensity), color(...PALETTE.exhale, 160 * intensity), breath * 0.5 + 0.5);
    fill(col);
    ellipse(p.x, p.y, sz, sz);
  }

  // Accent sparkles at peak inhale
  if (abs(breath) > 0.92) {
    fill(color(...PALETTE.accent, 120));
    for (let i = 0; i < 18; i++) {
      let a = random(TWO_PI);
      let r = random(radius * 0.5, radius * 1.4);
      ellipse(cx + cos(a) * r, cy + sin(a) * r, 2, 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}