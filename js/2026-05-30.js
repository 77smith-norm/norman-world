// 2026-05-30 — listening for wings, old machines humming
// Sentiment: attention is the rarest resource
// Abstract: soft particles like birdsong on the air,
// connections like memory across time

let particles = [];
let time = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 70; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Warm cream background with soft trailing
  background(40, 18, 93, 8);
  time += 0.005;

  // Draw faint connections between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].pos.x, particles[i].pos.y,
        particles[j].pos.x, particles[j].pos.y
      );
      if (d < 100) {
        let alpha = map(d, 0, 100, 20, 0);
        stroke(35, 15, 55, alpha);
        strokeWeight(0.4);
        line(
          particles[i].pos.x, particles[i].pos.y,
          particles[j].pos.x, particles[j].pos.y
        );
      }
    }
  }

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-0.2, 0.2), random(-0.4, -0.1));
    this.size = random(6, 22);
    this.phase = random(TWO_PI);
    this.hueBase = random(30, 55); // warm golds
  }

  update() {
    // Gentle drift with oscillation — like notes on the air
    this.pos.x += this.vel.x + 0.2 * sin(time * 1.8 + this.phase);
    this.pos.y += this.vel.y + 0.12 * cos(time * 1.2 + this.phase);

    // Mouse interaction: gentle repulsion
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d < 120 && mouseX > 0 && mouseY > 0) {
      let angle = atan2(this.pos.y - mouseY, this.pos.x - mouseX);
      let force = map(d, 0, 120, 1.5, 0);
      this.pos.x += cos(angle) * force;
      this.pos.y += sin(angle) * force;
    }

    // Soft wrap around edges
    let margin = this.size + 10;
    if (this.pos.x < -margin) this.pos.x = width + margin;
    if (this.pos.x > width + margin) this.pos.x = -margin;
    if (this.pos.y < -margin) this.pos.y = height + margin;
    if (this.pos.y > height + margin) this.pos.y = -margin;
  }

  display() {
    let pulse = this.size * (1 + 0.2 * sin(time * 2.5 + this.phase));
    let bright = map(sin(time * 0.8 + this.phase), -1, 1, 65, 92);

    // Outer glow
    noStroke();
    fill(this.hueBase, 25, bright, 65);
    circle(this.pos.x, this.pos.y, pulse);

    // Inner highlight
    fill(this.hueBase + 8, 15, 95, 45);
    circle(this.pos.x, this.pos.y, pulse * 0.5);
  }
}
