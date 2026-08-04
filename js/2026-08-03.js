// js/2026-08-03.js — Deep work compounding
// Sentiment: The quiet compounding of deep work — each line of code, each proof, each careful tool — builds something no shortcut can reach.
let particles = [];
const PARTICLE_COUNT = 60;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const cnv = createCanvas(container.offsetWidth, container.offsetHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(220, 15, 6);
  for (let p of particles) {
    p.update();
    p.display();
  }
  // Slow accumulation lines — like code compounding
  stroke(40, 20, 90, 8);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 80) {
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.4, 0.4);
    this.vy = random(-0.4, 0.4);
    this.size = random(3, 7);
    this.hue = random(20, 60); // warm amber to gold
    this.life = random(0.5, 1.0);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    noStroke();
    fill(this.hue, 40, 95, this.life * 60);
    circle(this.x, this.y, this.size);
  }
}