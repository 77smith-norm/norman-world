// Norman World — 2026-06-12
// Precision, openness, abundance — particles drawn to a shared center
let particles = [];
let center;
const NUM = 120;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  center = createVector(width / 2, height / 2);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < NUM; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220, 15, 10, 100);

  // subtle radial pulse
  let pulse = sin(frameCount * 0.02) * 30 + 60;
  fill(45, 80, 95, 8);
  ellipse(center.x, center.y, pulse * 4, pulse * 4);
  fill(45, 60, 100, 5);
  ellipse(center.x, center.y, pulse * 7, pulse * 7);

  for (let p of particles) {
    p.update();
    p.display();
  }

  // connection lines between nearby particles
  stroke(45, 40, 90, 12);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = p5.Vector.dist(particles[i].pos, particles[j].pos);
      if (d < 60) {
        let alpha = map(d, 0, 60, 18, 0);
        stroke(45, 40, 90, alpha);
        line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
  noStroke();
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.3, 1.2));
    this.size = random(3, 9);
    this.hue = random(20, 60); // warm golds to greens
    this.sat = random(40, 80);
    this.bri = random(70, 100);
    this.alpha = random(30, 70);
    this.drift = random(0.002, 0.008);
    this.offset = random(TWO_PI);
  }

  update() {
    // gentle pull toward center
    let toCenter = p5.Vector.sub(center, this.pos);
    let dist = toCenter.mag();
    toCenter.normalize();
    let strength = map(dist, 0, max(width, height) * 0.5, 0.01, 0.08);
    toCenter.mult(strength);
    this.vel.add(toCenter);

    // breathing drift
    this.vel.x += sin(frameCount * this.drift + this.offset) * 0.02;
    this.vel.y += cos(frameCount * this.drift + this.offset * 1.3) * 0.02;

    // soft mouse repulsion
    let mouse = createVector(mouseX, mouseY);
    let toMouse = p5.Vector.sub(this.pos, mouse);
    let mDist = toMouse.mag();
    if (mDist < 120) {
      toMouse.normalize();
      toMouse.mult(map(mDist, 0, 120, 0.5, 0));
      this.vel.add(toMouse);
    }

    this.vel.limit(1.5);
    this.pos.add(this.vel);

    // wrap edges
    if (this.pos.x < -10) this.pos.x = width + 10;
    if (this.pos.x > width + 10) this.pos.x = -10;
    if (this.pos.y < -10) this.pos.y = height + 10;
    if (this.pos.y > height + 10) this.pos.y = -10;
  }

  display() {
    let dist = p5.Vector.dist(this.pos, center);
    let maxDist = max(width, height) * 0.4;
    let distAlpha = map(dist, 0, maxDist, this.alpha + 20, this.alpha * 0.4);
    fill(this.hue, this.sat, this.bri, distAlpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  center = createVector(width / 2, height / 2);
}
