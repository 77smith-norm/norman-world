let particles = [];
let flowLines = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }
  for (let i = 0; i < 8; i++) {
    flowLines.push(new FlowLine());
  }
}

function draw() {
  background(245, 242, 235);
  for (let line of flowLines) {
    line.update();
    line.display();
  }
  for (let p of particles) {
    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.3, 0.3);
    this.size = random(2, 5);
    this.alpha = random(60, 140);
    this.offset = random(1000);
  }
  update() {
    this.x += this.vx + sin(frameCount * 0.01 + this.offset) * 0.3;
    this.y += this.vy + cos(frameCount * 0.008 + this.offset) * 0.2;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
    this.alpha = 80 + sin(frameCount * 0.02 + this.offset) * 40;
  }
  display() {
    noStroke();
    fill(120, 110, 100, this.alpha);
    circle(this.x, this.y, this.size);
  }
}

class FlowLine {
  constructor() {
    this.points = [];
    this.offset = random(1000);
    for (let i = 0; i < 12; i++) {
      this.points.push(createVector(random(width), random(height)));
    }
  }
  update() {
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      p.x += sin(frameCount * 0.005 + i + this.offset) * 0.8;
      p.y += cos(frameCount * 0.004 + i * 0.5 + this.offset) * 0.5;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    }
  }
  display() {
    stroke(90, 85, 80, 35);
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let p of this.points) {
      curveVertex(p.x, p.y);
    }
    endShape();
  }
}