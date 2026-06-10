let particles = [];
let flowLines = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }
  for (let i = 0; i < 12; i++) {
    flowLines.push(new FlowLine());
  }
}

function draw() {
  background(18, 18, 28);
  // Subtle mirror/reflection layer
  fill(255, 255, 255, 8);
  rect(0, height * 0.45, width, height * 0.1);
  
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
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.size = random(2, 4);
    this.alpha = random(60, 140);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    // Gentle attraction to center for "hum"
    let cx = width / 2;
    let cy = height / 2;
    this.vx += (cx - this.x) * 0.00001;
    this.vy += (cy - this.y) * 0.00001;
  }
  
  display() {
    noStroke();
    fill(200, 220, 255, this.alpha);
    circle(this.x, this.y, this.size);
    // Shadow echo
    fill(40, 40, 60, this.alpha * 0.3);
    circle(this.x + 2, this.y + 2, this.size * 1.2);
  }
}

class FlowLine {
  constructor() {
    this.points = [];
    this.offset = random(1000);
    for (let i = 0; i < 20; i++) {
      this.points.push(createVector(random(width), random(height)));
    }
  }
  
  update() {
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      p.x += sin(frameCount * 0.01 + i + this.offset) * 0.4;
      p.y += cos(frameCount * 0.012 + i * 0.7 + this.offset) * 0.3;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }
  
  display() {
    stroke(120, 140, 200, 35);
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}