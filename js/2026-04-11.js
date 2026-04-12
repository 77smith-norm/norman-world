let strata = [];
let particles = [];
let numStrata = 8;
let numParticles = 180;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(220, 15, 6);
  
  // Create horizontal strata
  let spacing = height / (numStrata + 1);
  for (let i = 0; i < numStrata; i++) {
    let y = spacing * (i + 1);
    let numCracks = floor(random(2, 6));
    let cracks = [];
    for (let j = 0; j < numCracks; j++) {
      cracks.push({
        x: random(width),
        width: random(15, 45),
        strength: random(0.5, 1)
      });
    }
    strata.push({
      y: y,
      cracks: cracks,
      hue: 200 + i * 12,
      pulsePhase: random(TWO_PI)
    });
  }
  
  // Spawn particles at bottom
  for (let i = 0; i < numParticles; i++) {
    let p = new Particle();
    p.pos.y = random(height * 0.7, height);
    particles.push(p);
  }
}

function draw() {
  background(220, 15, 6, 15);
  
  // Draw strata
  for (let s of strata) {
    s.pulsePhase += 0.01;
    let alpha = 30 + sin(s.pulsePhase) * 10;
    
    noFill();
    stroke(s.hue, 25, 50, alpha);
    strokeWeight(1);
    line(0, s.y, width, s.y);
    
    // Draw cracks
    for (let c of s.cracks) {
      noStroke();
      fill(s.hue, 20, 80, 8 * c.strength);
      let crackW = c.width * (0.6 + sin(s.pulsePhase * c.strength) * 0.4);
      rect(c.x - crackW / 2, s.y - 15, crackW, 30, 2);
    }
  }
  
  // Draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height * 0.8, height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.hue = random(15, 45);
    this.sat = random(60, 90);
    this.size = random(2, 5);
    this.speed = random(0.3, 0.8);
    this.wobblePhase = random(TWO_PI);
    this.wobbleSpeed = random(0.02, 0.05);
    this.life = random(200, 400);
    this.maxLife = this.life;
  }
  
  update() {
    // Gentle upward drift
    this.acc.y = -this.speed * 0.03;
    
    // Horizontal wobble
    this.wobblePhase += this.wobbleSpeed;
    this.acc.x = cos(this.wobblePhase) * 0.02;
    
    // Check if near a crack in any stratum
    for (let s of strata) {
      let dY = abs(this.pos.y - s.y);
      if (dY < 30) {
        for (let c of s.cracks) {
          let dX = abs(this.pos.x - c.x);
          if (dX < c.width / 2) {
            // Accelerate through crack
            this.acc.y -= 0.05 * c.strength;
          }
        }
      }
    }
    
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.life--;
    
    if (this.life <= 0 || this.pos.y < -10 || this.pos.y > height + 10) {
      this.reset();
    }
  }
  
  reset() {
    this.pos = createVector(random(width), random(height * 0.85, height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.hue = random(15, 45);
    this.life = random(200, 400);
    this.maxLife = this.life;
    this.wobblePhase = random(TWO_PI);
  }
  
  display() {
    let lifeRatio = this.life / this.maxLife;
    let alpha = lifeRatio * 70;
    let brightness = 90 + lifeRatio * 10;
    
    noStroke();
    fill(this.hue, this.sat, brightness, alpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
    // Glow
    fill(this.hue, this.sat * 0.5, 100, alpha * 0.2);
    ellipse(this.pos.x, this.pos.y, this.size * 2.5, this.size * 2.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
