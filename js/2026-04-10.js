let particles = [];
let walls = [];
let numWalls = 7;
let numParticles = 200;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(30, 10, 8);
  
  // Create walls with narrow gaps at varying positions
  let spacing = width / (numWalls + 1);
  for (let i = 0; i < numWalls; i++) {
    let gapY = random(height * 0.2, height * 0.8);
    walls.push(new Wall(spacing * (i + 1), gapY));
  }
  
  // Spawn particles on left side
  for (let i = 0; i < numParticles; i++) {
    let p = new Particle();
    p.pos.x = random(-200, 0);
    particles.push(p);
  }
}

function draw() {
  background(30, 10, 8, 25);
  
  for (let wall of walls) {
    wall.display();
  }
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Wall {
  constructor(x, gapY) {
    this.x = x;
    this.gapY = gapY;
    this.gapSize = 60;
    this.hue = random(15, 45);
    this.pulsePhase = random(TWO_PI);
  }
  
  display() {
    this.pulsePhase += 0.015;
    let alpha = 40 + sin(this.pulsePhase) * 15;
    
    noFill();
    // Top section
    stroke(this.hue, 50, 80, alpha);
    strokeWeight(2);
    line(this.x, 0, this.x, this.gapY - this.gapSize / 2);
    // Bottom section
    line(this.x, this.gapY + this.gapSize / 2, this.x, height);
    
    // Gap glow
    stroke(this.hue, 30, 100, 20);
    strokeWeight(8);
    line(this.x, this.gapY - this.gapSize / 2, this.x, this.gapY + this.gapSize / 2);
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.pos = createVector(random(-200, 0), random(height));
    this.vel = createVector(random(1.5, 3), 0);
    this.acc = createVector(0, 0);
    this.hue = random(15, 50);
    this.sat = random(60, 90);
    this.size = random(2, 5);
    this.alpha = 80;
    this.modified = false;
  }
  
  update() {
    // Gentle vertical oscillation
    let noiseY = noise(this.pos.x * 0.002, frameCount * 0.003) - 0.5;
    this.acc.y = noiseY * 0.15;
    
    // Accelerate slightly as approaching walls
    for (let wall of walls) {
      let d = wall.x - this.pos.x;
      if (d > 0 && d < 80) {
        // Pull toward gap
        let gapPull = (wall.gapY - this.pos.y) * 0.003;
        this.acc.y += gapPull;
        // Slight speed boost approaching gap
        this.acc.x += 0.02;
      }
    }
    
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Reset when off right edge
    if (this.pos.x > width + 20) {
      this.reset();
    }
    if (this.pos.y < -20 || this.pos.y > height + 20) {
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }
  
  display() {
    noStroke();
    fill(this.hue, this.sat, 95, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
    // Faint trail
    fill(this.hue, this.sat, 80, 15);
    ellipse(this.pos.x - this.vel.x * 3, this.pos.y, this.size * 0.7, this.size * 0.7);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
