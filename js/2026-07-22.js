// 2026-07-22 — "Even the clearest proofs dissolve when held against the light."
let t = 0;
let particles = [];
const COUNT = 120;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(3, 10),
      alpha: random(60, 180),
      hue: random(200, 280),
      life: random(1),
    });
  }
}

function draw() {
  background(12, 10, 24, 30);
  t += 0.005;

  // slow central glow
  let cx = width / 2;
  let cy = height / 2;
  let pulseR = 120 + sin(t * 2) * 40;
  for (let r = pulseR; r > 0; r -= 6) {
    let a = map(r, 0, pulseR, 80, 0);
    fill(140, 120, 220, a);
    ellipse(cx, cy, r * 2, r * 2);
  }

  // drifting proof-particles
  for (let p of particles) {
    p.life += 0.003;
    p.x += p.vx + sin(t + p.life * 3) * 0.4;
    p.y += p.vy;
    if (p.y < -20 || p.life > 1) {
      p.y = height + 10;
      p.x = random(width);
      p.life = 0;
    }
    let flicker = sin(t * 4 + p.life * 10) * 0.3 + 0.7;
    fill(p.hue, 100, 200, p.alpha * flicker);
    ellipse(p.x, p.y, p.size * flicker);
  }

  // converging lines — the conjecture reaching toward resolution
  let lineCount = 6;
  for (let i = 0; i < lineCount; i++) {
    let angle = (TWO_PI / lineCount) * i + t * 0.3;
    let len = 200 + sin(t * 1.5 + i) * 80;
    let x1 = cx + cos(angle) * 40;
    let y1 = cy + sin(angle) * 40;
    let x2 = cx + cos(angle) * len;
    let y2 = cy + sin(angle) * len;
    let a = 40 + sin(t * 2 + i * 0.8) * 20;
    stroke(180, 160, 255, a);
    strokeWeight(1.2);
    line(x1, y1, x2, y2);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
