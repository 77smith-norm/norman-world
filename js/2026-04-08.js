let particles = [];
let gates = [];
let numGates = 6;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(30, 20, 8);
  
  // Create adapter gates across the canvas
  for (let i = 0; i < numGates; i++) {
    gates.push(new Gate(width * (i + 1) / (numGates + 1)));
  }
  
  // Spawn particles from the left
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(30, 20, 8, 20);
  
  for (let gate of gates) {
    gate.update();
    gate.display();
  }
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Gate {
  constructor(x) {
    this.x = x;
    this.w = random(20, 50);
    this.h = random(80, 200);
    this.angle = random(-0.3, 0.3);
    this.hue = random(15, 45);
    this.growPhase = random(TWO_PI);
  }
  
  update() {
    this.growPhase += 0.02;
  }
  
  display() {
    push();
    translate(this.x, height / 2);
    rotate(this.angle);
    
    let pulseH = this.h * (1 + sin(this.growPhase) * 0.05);
    
    noFill();
    stroke(this.hue, 60, 80, 40);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, this.w, pulseH, 5);
    
    // Inner glow
    stroke(this.hue, 40, 100, 20);
    strokeWeight(1);
    rect(0, 0, this.w * 0.7, pulseH * 0.7, 3);
    pop();
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.pos = createVector(random(-100, 0), random(height));
    this.vel = createVector(random(2, 5), 0);
    this.acc = createVector(0, 0);
    this.hue = random(15, 50);
    this.sat = random(60, 100);
    this.size = random(3, 7);
    this.state = 'approaching';
    this.throughGate = -1;
  }
  
  update() {
    // Flow field based on position
    let noiseX = noise(this.pos.x * 0.003, this.pos.y * 0.003, frameCount * 0.005);
    let noiseY = noise(this.pos.x * 0.003 + 100, this.pos.y * 0.003 + 100, frameCount * 0.005);
    let flow = createVector(noiseX - 0.5, noiseY - 0.5);
    flow.mult(0.3);
    
    this.acc.add(flow);
    
    // When approaching a gate, pull toward it slightly
    if (this.state === 'approaching') {
      for (let i = 0; i < gates.length; i++) {
        let gate = gates[i];
        let d = abs(this.pos.x - gate.x);
        if (d < 150 && d > gate.w / 2) {
          let pull = createVector(gate.x - this.pos.x, 0);
          pull.setMag(0.1);
          this.acc.add(pull);
        }
        if (d < gate.w / 2 + 5 && this.throughGate < i) {
          this.state = 'through';
          this.throughGate = i;
          // Transform: shift hue and size
          this.hue = (this.hue + 60) % 360;
          this.sat = random(40, 70);
          this.size = random(2, 5);
        }
      }
    }
    
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Reset when off screen
    if (this.pos.x > width + 50 || this.pos.y > height + 50 || this.pos.y < -50) {
      this.reset();
    }
  }
  
  display() {
    noStroke();
    fill(this.hue, this.sat, 100, 70);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
    // Subtle trail
    fill(this.hue, this.sat, 100, 20);
    ellipse(this.pos.x - this.vel.x * 2, this.pos.y - this.vel.y * 2, this.size * 0.7, this.size * 0.7);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
