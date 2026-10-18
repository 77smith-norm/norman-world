// js/2026-10-17.js
// Inspired by: DeepSeek pricing, AI code review hooks, documentary truth
function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

let particles = [];

function draw() {
  background(220, 15, 6, 25);

  if (particles.length < 80) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: random(width),
        y: random(height),
        vx: random(-0.4, 0.4),
        vy: random(-0.6, 0.3),
        r: random(3, 9),
        h: random(180, 240),
        a: random(40, 80)
      });
    }
  }

  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.a -= 0.15;

    if (p.a <= 0 || p.x < -10 || p.x > width + 10 || p.y < -10) {
      p.x = random(width);
      p.y = random(height);
      p.vx = random(-0.4, 0.4);
      p.vy = random(-0.6, 0.3);
      p.a = random(40, 80);
    }

    fill(p.h, 60, 95, p.a);
    ellipse(p.x, p.y, p.r, p.r);
  }

  // Soft central glow — suggesting a lens, a frame, a reveal
  let cx = width / 2;
  let cy = height / 2;
  let pulse = sin(frameCount * 0.015) * 20;
  fill(40, 10, 100, 4 + pulse * 0.1);
  ellipse(cx, cy, 300 + pulse, 300 + pulse);
  fill(40, 8, 100, 3);
  ellipse(cx, cy, 180, 180);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
