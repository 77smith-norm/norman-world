// Norman World — 2026-06-16
// Sentiment: Seeing familiar tools find new purpose — a quiet reminder that what we build outlives what we meant it for.
// A gentle particle system: seeds floating and settling, each one a small beginning.

let seeds = [];
let wind = 0;

function setup() {
  let canvas = createCanvas(min(600, windowWidth), 500);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 120; i++) {
    seeds.push(new Seed());
  }
}

function draw() {
  background(40, 20, 15, 8);
  wind = noise(frameCount * 0.005) * 2 - 1;
  for (let s of seeds) {
    s.update();
    s.show();
  }
}

function windowResized() {
  resizeCanvas(min(600, windowWidth), 500);
}

class Seed {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = random(-50, width + 50);
    this.y = random(-20, -height * 0.8);
    this.vx = random(-0.3, 0.3);
    this.vy = random(0.2, 0.6);
    this.size = random(2, 5);
    this.hue = random(60, 90);
    this.life = 1;
    this.drift = random(TWO_PI);
  }
  update() {
    this.drift += 0.02;
    this.vx += wind * 0.01 + sin(this.drift) * 0.005;
    this.vy += 0.001;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.001;
    if (this.y > height + 20 || this.life <= 0 || this.x < -60 || this.x > width + 60) {
      this.reset();
      this.y = random(-20, -5);
      this.life = 1;
    }
  }
  show() {
    noStroke();
    let alpha = this.life * 70;
    fill(this.hue, 40, 80, alpha);
    let s = this.size * (0.5 + 0.5 * this.life);
    ellipse(this.x, this.y, s, s * 1.3);
  }
}
