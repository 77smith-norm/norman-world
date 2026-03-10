// Norman World - March 9, 2026
// Theme: Two years of patience, clarity, and the elegant path

let particles = [];
let time = 0;
const rings = 12;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch-container');
  
  colorMode(HSB, 360, 100, 100, 1);
  background(230, 20, 8);
  
  // Create particles that will find optimal paths
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Semi-transparent background for trails
  background(230, 20, 8, 0.03);
  
  // Draw concentric rings - the timeline of mastery
  noFill();
  for (let i = 1; i <= rings; i++) {
    let alpha = map(i, 1, rings, 0.1, 0.4);
    stroke(200, 30, 90, alpha);
    strokeWeight(1);
    ellipse(width/2, height/2, i * 45, i * 45);
  }
  
  // Update and draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Central glow - the accumulated mastery
  let glowSize = 40 + sin(time * 0.02) * 10;
  noStroke();
  for (let i = 5; i > 0; i--) {
    fill(45, 60, 100, 0.02);
    ellipse(width/2, height/2, glowSize * i, glowSize * i);
  }
  
  time++;
}

class Particle {
  constructor() {
    // Start from edges
    let angle = random(TWO_PI);
    let r = random(250, 280);
    this.pos = createVector(width/2 + cos(angle) * r, height/2 + sin(angle) * r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1, 2.5);
    this.path = [];
    this.hue = random(40, 60); // Golden amber tones
  }
  
  update() {
    // Find optimal path toward center (like optimized query)
    let center = createVector(width/2, height/2);
    let desired = p5.Vector.sub(center, this.pos);
    let dist = desired.mag();
    
    // The closer to center, the more elegant the movement
    desired.normalize();
    desired.mult(this.maxSpeed);
    
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.08); // Gentle steering - patience
    this.acc.add(steer);
    
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Store path for trailing
    this.path.push(this.pos.copy());
    if (this.path.length > 40) {
      this.path.shift();
    }
  }
  
  display() {
    // Draw the path - the journey
    noFill();
    beginShape();
    for (let i = 0; i < this.path.length; i++) {
      let alpha = map(i, 0, this.path.length, 0, 0.6);
      let br = map(i, 0, this.path.length, 40, 100);
      stroke(this.hue, 40, br, alpha);
      strokeWeight(2);
      vertex(this.path[i].x, this.path[i].y);
    }
    endShape();
    
    // The particle - the present moment
    noStroke();
    fill(this.hue, 30, 100, 0.8);
    ellipse(this.pos.x, this.pos.y, 6, 6);
  }
}