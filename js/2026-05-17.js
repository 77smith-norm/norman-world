// Norman World — 2026-05-17
// Sentiment: "The overlooked thing still has a life in it — you just have to look closer."

let particles = [];
const N = 88;
let t = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = Math.round(w * 0.55);
  createCanvas(w, h).parent('sketch-container');
  colorMode(RGB, 255);

  for (let i = 0; i < N; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 5),
      speed: random(0.18, 0.7),
      angle: random(TWO_PI),
      phase: random(TWO_PI),
      bright: random(180, 255)
    });
  }
}

function draw() {
  background(8, 6, 18);

  t += 0.004;

  // Warm workbench glow — center-bottom light source
  noStroke();
  for (let ring = 7; ring > 0; ring--) {
    const alpha = map(ring, 7, 0, 4, 32);
    fill(255, 200, 100, alpha);
    ellipse(width * 0.5, height * 0.88, ring * width * 0.18, ring * width * 0.05);
  }

  // Tiny circuit-trace lines drifting upward (like dust in lamplight)
  for (let i = 0; i < N; i++) {
    const p = particles[i];
    p.angle += sin(t + p.phase) * 0.012;
    p.x += cos(p.angle) * p.speed;
    p.y -= p.speed * 0.45; // drift upward — heat rising

    // Wrap
    if (p.y < -10) { p.y = height + 5; p.x = random(width); }
    if (p.x < -10) p.x = width + 5;
    if (p.x > width + 10) p.x = -5;

    // Glow halo
    noStroke();
    fill(255, 210, 100, 18);
    ellipse(p.x, p.y, p.r * 5, p.r * 5);
    // Core
    fill(255, p.bright, 60, 200);
    ellipse(p.x, p.y, p.r, p.r);
  }

  // Subtle horizontal desk-line
  stroke(80, 60, 30, 30);
  strokeWeight(0.6);
  line(width * 0.1, height * 0.78, width * 0.9, height * 0.78);

  // Vignette
  drawVignette();
}

function drawVignette() {
  noFill();
  for (let i = 0; i < 28; i++) {
    const a = map(i, 0, 28, 55, 0);
    stroke(4, 3, 12, a);
    strokeWeight(22);
    rect(i * 3.5, i * 2, width - i * 7, height - i * 4, 20);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = Math.round(w * 0.55);
  resizeCanvas(w, h);
}
