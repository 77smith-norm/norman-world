// Norman World - 2026-03-03
// "The bottleneck isn't creation. It's trust."

let particles = [];
let bottleneckX;
let trustLevel = 0;
let verifiedCount = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  
  bottleneckX = width * 0.4;
  
  // Create particles representing code/content being generated
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }
  
  textAlign(CENTER, CENTER);
}

function draw() {
  // Dark background
  background(8, 10, 18);
  
  // Draw the bottleneck gate
  drawBottleneck();
  
  // Update and draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Draw verification stats
  drawStats();
  
  // Instructions
  fill(80, 70, 100, 100);
  textSize(11);
  text('generation → verification | trust gates flow', width / 2, height - 25);
}

function drawBottleneck() {
  // The gate structure
  let gateY = height / 2;
  let gateHeight = 200;
  
  // Vertical pillars
  stroke(60, 50, 80);
  strokeWeight(8);
  line(bottleneckX - 30, 50, bottleneckX - 30, height - 50);
  line(bottleneckX + 30, 50, bottleneckX + 30, height - 50);
  
  // The trust gate - more open = more trust
  let gateOpen = map(trustLevel, 0, 100, 0.2, 0.95);
  let gateGap = gateHeight * (1 - gateOpen);
  
  // Gate glow based on trust
  let glowAlpha = map(trustLevel, 0, 100, 30, 150);
  for (let i = 5; i > 0; i--) {
    stroke(100, 120, 180, glowAlpha / i);
    strokeWeight(i * 4);
    line(bottleneckX - 25, gateY - gateGap/2, bottleneckX + 25, gateY - gateGap/2);
    line(bottleneckX - 25, gateY + gateGap/2, bottleneckX + 25, gateY + gateGap/2);
  }
  
  // Gate bars
  stroke(80, 70, 100);
  strokeWeight(3);
  let barCount = 8;
  for (let i = 0; i < barCount; i++) {
    let y1 = gateY - gateGap/2 + (gateGap / barCount) * i;
    let y2 = gateY - gateGap/2 + (gateGap / barCount) * (i + 1);
    if (y2 - y1 > 5) {
      line(bottleneckX - 20, y1, bottleneckX + 20, y1);
    }
  }
  
  // Trust label
  fill(120, 130, 170, 180);
  noStroke();
  textSize(14);
  text('TRUST', bottleneckX, 35);
  textSize(12);
  text(Math.floor(trustLevel) + '%', bottleneckX, height - 35);
}

function drawStats() {
  // Stats on the right side
  let statsX = width - 120;
  
  fill(60, 70, 100, 150);
  textSize(11);
  textAlign(LEFT);
  text('created: ' + particles.length, statsX, 50);
  text('verified: ' + verifiedCount, statsX, 70);
  text('awaiting: ' + (particles.length - verifiedCount), statsX, 90);
  
  textAlign(CENTER);
}

class Particle {
  constructor() {
    this.x = random(-100, bottleneckX - 50);
    this.y = random(height * 0.2, height * 0.8);
    this.vx = random(1, 3);
    this.vy = random(-0.5, 0.5);
    this.size = random(3, 6);
    this.verified = false;
    this.color = color(random(100, 140), random(80, 120), random(160, 200), 180);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Gentle wave motion
    this.vy += sin(this.x * 0.02 + frameCount * 0.05) * 0.1;
    
    // Check if particle reaches bottleneck
    if (!this.verified && this.x > bottleneckX - 40) {
      // Simulate verification - higher trust = more likely to pass
      if (random(100) < trustLevel) {
        this.verified = true;
        verifiedCount++;
        // Change color to show verified status
        this.color = color(120, 180, 140, 200);
        this.vx *= 1.2; // Pass through faster
      } else {
        // Rejected - bounce back
        this.vx *= -0.5;
        this.x = bottleneckX - 50;
      }
    }
    
    // Wrap around when past the gate
    if (this.x > width + 50) {
      this.x = -50;
      this.y = random(height * 0.2, height * 0.8);
      this.verified = false;
      this.color = color(random(100, 140), random(80, 120), random(160, 200), 180);
    }
    
    // Keep in bounds vertically
    if (this.y < 50) this.y = 50;
    if (this.y > height - 50) this.y = height - 50;
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
    
    // Trail for verified particles
    if (this.verified && this.x > bottleneckX) {
      fill(red(this.color), green(this.color), blue(this.color), 50);
      ellipse(this.x - 10, this.y, this.size * 0.8, this.size * 0.8);
    }
  }
}

// Slowly oscillate trust level
function mouseMoved() {
  trustLevel = constrain(map(mouseX, 0, width, 0, 100), 0, 100);
}

function windowResized() {
  resizeCanvas(800, 600);
  bottleneckX = width * 0.4;
}