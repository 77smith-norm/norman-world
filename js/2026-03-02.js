// Norman World - 2026-03-02
// "Truth becomes the rare artifact in an age of infinite synthesis."

let particles = [];
let truthForming = false;
let synthesisDrift = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  
  // Create particles representing synthesized content
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }
  
  textAlign(CENTER, CENTER);
}

function draw() {
  // Deep void background with subtle movement
  background(10, 8, 15);
  
  synthesisDrift += 0.002;
  
  // Draw subtle grid of synthesized reality
  stroke(30, 25, 45, 40);
  strokeWeight(1);
  let gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      let offsetX = sin(synthesisDrift + y * 0.01) * 3;
      let offsetY = cos(synthesisDrift + x * 0.01) * 3;
      point(x + offsetX, y + offsetY);
    }
  }
  
  // Particles drift and seek form
  let truthParticles = particles.filter(p => p.isTruth);
  let synthParticles = particles.filter(p => !p.isTruth);
  
  // Synth particles swirl chaotically
  for (let p of synthParticles) {
    p.update(true);
    p.display();
  }
  
  // Truth particles slowly converge toward center
  for (let p of truthParticles) {
    p.update(false);
    p.display();
  }
  
  // Draw the "truth" when enough particles gather
  if (truthParticles.length > 0) {
    let avgX = truthParticles.reduce((sum, p) => sum + p.x, 0) / truthParticles.length;
    let avgY = truthParticles.reduce((sum, p) => sum + p.y, 0) / truthParticles.length;
    
    // Gentle pulse at truth center
    let pulse = sin(frameCount * 0.03) * 20 + 40;
    noStroke();
    
    // Glow effect
    for (let r = pulse * 3; r > 0; r -= pulse / 3) {
      let alpha = map(r, 0, pulse * 3, 80, 0);
      fill(200, 220, 255, alpha);
      ellipse(avgX, avgY, r, r);
    }
    
    // Core truth
    fill(220, 240, 255, 200);
    ellipse(avgX, avgY, 8, 8);
    
    // Label
    fill(150, 160, 180, 150 + sin(frameCount * 0.05) * 50);
    textSize(12);
    text('truth', avgX, avgY + 25);
  }
  
  // Instructions
  fill(80, 70, 100, 100);
  textSize(11);
  text('particles seek form | synthesis drifts', width / 2, height - 25);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(2, 5);
    // Some particles represent truth, most represent synthesis
    this.isTruth = random() < 0.15;
    this.baseHue = this.isTruth ? 200 : random(280, 340);
  }
  
  update(chaotic) {
    if (chaotic) {
      // Synthesis particles drift without purpose
      this.vx += random(-0.3, 0.3);
      this.vy += random(-0.3, 0.3);
      this.vx *= 0.98;
      this.vy *= 0.98;
    } else {
      // Truth particles slowly seek the center
      let centerX = width / 2 + sin(frameCount * 0.01) * 50;
      let centerY = height / 2 + cos(frameCount * 0.008) * 30;
      let dx = centerX - this.x;
      let dy = centerY - this.y;
      this.vx += dx * 0.001;
      this.vy += dy * 0.001;
      this.vx *= 0.96;
      this.vy *= 0.96;
    }
    
    this.x += this.vx;
    this.y += this.vy;
    
    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  
  display() {
    noStroke();
    if (this.isTruth) {
      fill(180, 200, 255, 180);
    } else {
      fill(100, 80, 120, 80);
    }
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}