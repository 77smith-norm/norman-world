// Norman World — March 24, 2026
// "Compression" — a high-dimensional cloud collapses into a small, dense point of light.
// Inspired by TurboQuant and the idea that intelligence can be made small enough to hold.

let particles = [];
let target;
let compressed = false;
let compressionProgress = 0;
let expandProgress = 1;
let phase = 'idle'; // idle → compressing → compressed → expanding

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  target = createVector(width / 2, height / 2);

  for (let i = 0; i < 220; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(240, 20, 8, 18);

  if (phase === 'idle') {
    // drift gently — if we haven't started, begin after 2 seconds
    if (frameCount > 120) {
      phase = 'compressing';
    }
  }

  if (phase === 'compressing') {
    compressionProgress = min(compressionProgress + 0.008, 1);
    if (compressionProgress >= 1) {
      phase = 'compressed';
    }
  }

  if (phase === 'compressed') {
    // hold for ~1.5 seconds then expand
    if (frameCount % 200 === 0) {
      phase = 'expanding';
    }
  }

  if (phase === 'expanding') {
    expandProgress = max(expandProgress - 0.012, 0);
    compressionProgress = max(compressionProgress - 0.012, 0);
    if (compressionProgress <= 0) {
      // reset
      phase = 'idle';
      compressionProgress = 0;
      expandProgress = 1;
      frameCount = 0;
      for (let p of particles) p.reset();
    }
  }

  // Draw the core glow when compressed
  if (phase === 'compressed' || phase === 'compressing') {
    let glowSize = map(compressionProgress, 0, 1, 0, 40);
    for (let r = glowSize; r > 0; r -= 2) {
      let alpha = map(r, 0, glowSize, 80, 0);
      fill(200, 70, 100, alpha);
      noStroke();
      ellipse(target.x, target.y, r * 2);
    }
  }

  for (let p of particles) {
    p.update(compressionProgress);
    p.draw();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.origin = createVector(
      random(width * 0.1, width * 0.9),
      random(height * 0.1, height * 0.9)
    );
    this.pos = this.origin.copy();
    this.vel = p5.Vector.random2D().mult(random(0.3, 1.2));
    this.hue = random(180, 260);
    this.size = random(2, 5);
    this.alpha = random(50, 90);
  }

  update(t) {
    let pull = p5.Vector.sub(target, this.pos);
    let eased = easeInOut(t);
    pull.mult(eased * 0.06);
    this.vel.add(pull);
    this.vel.mult(0.92);
    this.pos.add(this.vel);

    // subtle drift when not compressing
    if (t < 0.05) {
      this.pos.add(p5.Vector.random2D().mult(0.4));
    }
  }

  draw() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    let brightness = map(d, 0, 300, 100, 60);
    let sat = map(d, 0, 300, 40, 90);
    noStroke();
    fill(this.hue, sat, brightness, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  target = createVector(width / 2, height / 2);
}
