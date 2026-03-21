// Norman World — March 20, 2026
// Theme: "Ex minimo, infinita nascuntur" — from the minimum, infinite things grow
// Inspired by Ghostling (terminal emulator) and the open tooling explosion

let branches = [];
let particles = [];
let t = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(240, 15, 6);

  // Seed the root — a single glowing point
  let root = new Branch(width / 2, height * 0.85, -HALF_PI, 220);
  branches.push(root);
}

function draw() {
  // Fade trail
  background(240, 15, 6, 8);

  // Grow branches
  if (frameCount % 3 === 0) {
    for (let b of branches) {
      if (b.len > 4 && random() < 0.6) {
        let nb = b.spawn();
        if (nb) branches.push(nb);
      }
    }
  }

  // Draw branches
  noFill();
  for (let b of branches) {
    b.update();
    b.display();
  }

  // Ambient particles rising from the tips
  if (frameCount % 5 === 0) {
    for (let b of branches) {
      if (b.len > 15) {
        particles.push(new Particle(b.x, b.y));
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  t += 0.01;
}

class Branch {
  constructor(x, y, angle, len) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.len = len;
    this.originalLen = len;
    this.grown = 0;
    this.hue = random(160, 220);
  }

  spawn() {
    let tip = this.tip();
    let spread = random(0.25, 0.65);
    let newAngle = this.angle + random() < 0.5 ? spread : -spread;
    newAngle += random(-0.15, 0.15);
    let newLen = this.len * random(0.58, 0.72);
    return new Branch(tip.x, tip.y, newAngle, newLen);
  }

  tip() {
    return {
      x: this.x + cos(this.angle) * this.grown,
      y: this.y + sin(this.angle) * this.grown
    };
  }

  update() {
    if (this.grown < this.len) {
      this.grown += this.len * 0.08;
      if (this.grown > this.len) this.grown = this.len;
    }
  }

  display() {
    let progress = this.grown / this.len;
    let alpha = map(progress, 0, 1, 40, 85);
    let bright = map(progress, 0, 1, 55, 95);
    let thick = map(this.len, 0, this.originalLen, 0.5, 2.5);

    stroke(this.hue, 65, bright, alpha);
    strokeWeight(thick);
    line(this.x, this.y,
         this.x + cos(this.angle) * this.grown,
         this.y + sin(this.angle) * this.grown);

    // Glowing tip
    if (progress > 0.9) {
      let tipX = this.x + cos(this.angle) * this.grown;
      let tipY = this.y + sin(this.angle) * this.grown;
      noStroke();
      fill(this.hue, 50, 100, 30);
      ellipse(tipX, tipY, thick * 6, thick * 6);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.4, 0.4);
    this.vy = random(-1.2, -0.3);
    this.life = 1.0;
    this.decay = random(0.008, 0.018);
    this.hue = random(160, 220);
    this.size = random(1.5, 3.5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.vx *= 0.99;
  }

  display() {
    noStroke();
    fill(this.hue, 55, 95, this.life * 60);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(240, 15, 6);
  branches = [];
  particles = [];
  let root = new Branch(width / 2, height * 0.85, -HALF_PI, 220);
  branches.push(root);
}
