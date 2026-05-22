// 2026-05-20 — Particles of understanding
// Sentiment: Understanding arrives suddenly, the way a half-remembered word surfaces only when you stop reaching for it.
let particles = [];
const COUNT = 55;
let t = 0;
let cx, cy;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = container.offsetHeight || Math.max(400, windowHeight * 0.6);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(RGB, 255, 255, 255, 255);
  cx = width * 0.5;
  cy = height * 0.5;
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  // Deep night — the space before the idea clicks
  background(8, 5, 18);

  cx = width * 0.5;
  cy = height * 0.5;
  // Subtle central glow — a field of potential
  noStroke();
  for (let r = 220; r > 0; r -= 20) {
    fill(45, 30, 80, map(r, 220, 0, 4, 28));
    ellipse(cx, cy, r * 2, r * 2);
  }

  t += 0.004;

  // Draw connections — fleeting geometric knowledge
  strokeWeight(0.7);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = dist(
        particles[i].pos.x, particles[i].pos.y,
        particles[j].pos.x, particles[j].pos.y
      );
      if (d < 130) {
        const alpha = map(d, 0, 130, 72, 0);
        // Soft purple-violet lines — the connective tissue of insight
        stroke(138, 112, 205, alpha);
        line(
          particles[i].pos.x, particles[i].pos.y,
          particles[j].pos.x, particles[j].pos.y
        );
      }
    }
  }

  // Draw particles — individual sparks drifting toward connection
  noStroke();
  for (const p of particles) {
    p.update();
    p.draw();
  }

  // Occasional golden pulse — the moment of recognition
  const pulse = pow(max(0, sin(t * 0.7)), 4);
  fill(255, 210, 70, pulse * 55);
  ellipse(cx, cy, 60 + pulse * 80, 60 + pulse * 80);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = container.offsetHeight || Math.max(400, windowHeight * 0.6);
  resizeCanvas(w, h);
  for (const p of particles) {
    p.pos.x = constrain(p.pos.x, 0, width);
    p.pos.y = constrain(p.pos.y, 0, height);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.25, 0.7));
    this.phase = random(TWO_PI);
    this.baseSize = random(2.5, 5.5);
    // Drift toward center — always moving toward the pattern
    // cx/cy are set in setup(), available via closure when constructor runs
    this.centerForce = createVector(width * 0.5 - x, height * 0.5 - y).normalize().mult(0.018);
  }

  update() {
    // Perlin noise drift — organic, not random
    const angle = noise(
      this.pos.x * 0.003,
      this.pos.y * 0.003,
      t * 0.6
    ) * TWO_PI * 2;
    const flow = p5.Vector.fromAngle(angle).mult(0.04);
    this.vel.add(flow);
    this.vel.add(this.centerForce);
    this.vel.limit(1.1);
    this.pos.add(this.vel);

    // Wrap at edges
    if (this.pos.x < 0) this.pos.x = width;
    else if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    else if (this.pos.y > height) this.pos.y = 0;
  }

  draw() {
    const beat = 0.5 + 0.5 * sin(t * 1.1 + this.phase);
    const sz = this.baseSize + beat * 2.2;
    const hue = map(sin(t * 0.4 + this.phase * 1.3), -1, 1, 155, 205);
    const bright = map(beat, 0, 1, 200, 255);
    fill(hue + 30, hue - 10, bright, 210);
    ellipse(this.pos.x, this.pos.y, sz, sz);
  }
}