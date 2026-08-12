// js/2026-08-11.js
// Sentiment: "We keep drawing blue blood from a creature older than memory, hoping something alive survives the compression."
// Stories: Compression is prediction (HN 49263497) | Horseshoe crab blood (HN 49266921) | llama.cpp (HN 49267928)

let particles = [];
const PARTICLE_COUNT = 280;
const PALETTE = {
  deepBlue: [8, 40, 90],
  mediumBlue: [20, 80, 140],
  softBlue: [60, 130, 180],
  warmAmber: [220, 160, 60],
  paleGold: [240, 200, 120],
  white: [255, 255, 255]
};

function setup() {
  const container = document.getElementById('sketch-container');
  const cnv = createCanvas(container.offsetWidth, container.offsetHeight);
  cnv.parent('sketch-container');
  colorMode(RGB, 255, 255, 255, 255);
  initParticles();
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      size: random(1.5, 5),
      alpha: random(80, 200),
      color: random() < 0.6 ? PALETTE.mediumBlue : PALETTE.softBlue,
      drift: random(TWO_PI),
      driftSpeed: random(0.003, 0.012)
    });
  }
}

function draw() {
  background(8, 18, 38, 22);

  // Draw faint vertical pressure lines (like lab instrument readouts)
  stroke(20, 60, 110, 30);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }

  // Draw particles
  noStroke();
  for (let p of particles) {
    let [r, g, b] = p.color;
    fill(r, g, b, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);

    // Gentle drift
    p.drift += p.driftSpeed;
    p.x += p.vx + sin(p.drift) * 0.3;
    p.y += p.vy + cos(p.drift) * 0.2;

    // Wrap edges softly
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    // Rare amber accent particle
    if (p.color === PALETTE.softBlue && random() < 0.001) {
      p.color = PALETTE.warmAmber;
      p.alpha = 255;
    }
    if (p.color === PALETTE.warmAmber) {
      p.alpha = max(0, p.alpha - 0.5);
      if (p.alpha < 10) p.color = PALETTE.softBlue;
    }
  }

  // A single luminous sphere — the crab's blood cell under the microscope
  const cx = width * 0.5;
  const cy = height * 0.5;
  const pulse = sin(frameCount * 0.025) * 8;

  noStroke();
  // Outer glow rings
  for (let i = 5; i >= 1; i--) {
    fill(30, 100, 180, 8 * i);
    ellipse(cx, cy, 80 + i * 22 + pulse, 80 + i * 22 + pulse);
  }
  // Core
  fill(60, 130, 200, 220);
  ellipse(cx, cy, 60 + pulse, 60 + pulse);
  fill(100, 170, 230, 180);
  ellipse(cx, cy, 30 + pulse * 0.5, 30 + pulse * 0.5);
  fill(180, 220, 255, 120);
  ellipse(cx - 8, cy - 8, 12, 12);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}