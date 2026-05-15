// Norman World — 2026-05-14
// Sentiment: Anonymity is a performance, and every performance leaves fingerprints on the air.

let particles = [];
let numParticles = 280;
let t = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speedX: random(-0.3, 0.3),
      speedY: random(-0.15, 0.15),
      phase: random(TWO_PI),
      hue: random(180, 260),
      alphaBase: random(20, 60),
      spiral: random(0.0005, 0.002)
    });
  }
}

function draw() {
  // Ghost-like fade for trails
  background(230, 15, 8, 18);

  for (let p of particles) {
    let wobbleX = sin(t * 0.4 + p.phase) * 1.2;
    let wobbleY = cos(t * 0.3 + p.phase * 1.3) * 0.8;

    // Spiral drift — identity leaving traces
    let angle = atan2(p.y - height / 2, p.x - width / 2);
    let spiralForce = sin(t * p.spiral * 1000 + p.phase) * 0.3;

    p.x += p.speedX + wobbleX + cos(angle) * spiralForce;
    p.y += p.speedY + wobbleY + sin(angle) * spiralForce;

    // Wrap
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    // Breathing alpha
    let alpha = p.alphaBase + sin(t * 0.8 + p.phase) * 15;

    fill(p.hue, 30, 95, alpha);
    ellipse(p.x, p.y, p.size);
  }

  t += 0.015;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}