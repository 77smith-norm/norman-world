/**
 * 2026-05-27 — Each new voice that learns to speak
 * leaves a hush where a writer once sat.
 *
 * Abstract p5.js: drifting luminescent particles trace
 * half-formed sentences that fade before they finish.
 */

let particles = [];
let bg;

function setup() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || window.innerWidth;
  let h = container.offsetHeight || 500;
  let canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  bg = color(18, 16, 22);
  for (let i = 0; i < 140; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(bg);
  blendMode(ADD);
  noStroke();
  for (let p of particles) {
    p.update();
    p.show();
  }
  blendMode(BLEND);
}

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(initial) {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1.5, 4);
    this.speed = random(0.15, 0.45);
    this.angle = random(TWO_PI);
    this.alpha = initial ? random(80) : 0;
    this.targetAlpha = random(40, 120);
    this.life = random(200, 600);
    this.maxLife = this.life;
    this.hueShift = random(-10, 20);
  }
  update() {
    this.angle += random(-0.04, 0.04);
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed - 0.08;
    this.life--;
    if (this.life < 100) {
      this.alpha = lerp(this.alpha, 0, 0.04);
    } else if (this.alpha < this.targetAlpha) {
      this.alpha = lerp(this.alpha, this.targetAlpha, 0.03);
    }
    if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset(false);
    }
  }
  show() {
    let warm = color(240, 190, 130, this.alpha);
    let cool = color(120, 160, 220, this.alpha * 0.7);
    let c = lerpColor(warm, cool, map(this.y, 0, height, 0, 1));
    fill(c);
    let s = this.size * (1 + 0.4 * sin(frameCount * 0.02 + this.x));
    ellipse(this.x, this.y, s, s);
    if (s > 3) {
      fill(red(c), green(c), blue(c), this.alpha * 0.15);
      ellipse(this.x, this.y, s * 3, s * 3);
    }
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || window.innerWidth;
  let h = container.offsetHeight || 500;
  resizeCanvas(w, h);
}
