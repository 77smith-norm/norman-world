// 2026-03-15 - Watching the watchers
// Sentiment: "We stack megabytes into towers while governments stack surveillance—and still we find clever ways to teach the machines."

let particles = [];
let gridSize = 20;
let observationPoints = [];

function setup() {
  let canvas = createCanvas(640, 360);
  canvas.parent('sketch-container');
  
  // Create particles
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  // Create observation grid points (surveillance nodes)
  for (let x = 0; x < width; x += gridSize * 3) {
    for (let y = 0; y < height; y += gridSize * 3) {
      observationPoints.push(createVector(x, y));
    }
  }
}

function draw() {
  // Dark background with subtle scanlines
  background(8, 8, 12);
  
  // Draw observation grid (the watchers)
  noFill();
  stroke(40, 80, 60, 40);
  strokeWeight(0.5);
  for (let pt of observationPoints) {
    // Subtle pulse
    let d = dist(mouseX, mouseY, pt.x, pt.y);
    let alpha = map(d, 0, 300, 60, 10);
    stroke(40, 80, 60, alpha);
    rect(pt.x, pt.y, gridSize, gridSize);
  }
  
  // Draw connecting lines between nearby particles (data streams)
  stroke(100, 150, 200, 15);
  strokeWeight(0.3);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = particles[i].pos.dist(particles[j].pos);
      if (d < 60) {
        line(particles[i].pos.x, particles[i].pos.y, 
             particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
  
  // Update and draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Draw central eye (the machine watching)
  let eyeX = width / 2;
  let eyeY = height / 2;
  let eyeSize = 30 + sin(frameCount * 0.02) * 5;
  
  // Outer glow
  noStroke();
  for (let r = 80; r > 0; r -= 10) {
    fill(200, 50, 50, map(r, 80, 0, 2, 15));
    ellipse(eyeX, eyeY, r * 2);
  }
  
  // Eye ring
  stroke(180, 40, 40);
  strokeWeight(2);
  noFill();
  ellipse(eyeX, eyeY, eyeSize * 2);
  
  // Pupil follows average particle position
  let avgX = 0, avgY = 0;
  for (let p of particles) {
    avgX += p.pos.x;
    avgY += p.pos.y;
  }
  avgX /= particles.length;
  avgY /= particles.length;
  
  let pupilOffset = createVector(avgX - eyeX, avgY - eyeY).limit(8);
  
  fill(255);
  noStroke();
  ellipse(eyeX + pupilOffset.x, eyeY + pupilOffset.y, eyeSize);
  fill(30);
  ellipse(eyeX + pupilOffset.x, eyeY + pupilOffset.y, eyeSize * 0.4);
  
  // Title
  fill(120, 140, 160);
  noStroke();
  textSize(10);
  textAlign(RIGHT);
  text('OBSERVATION // 2026-03-15', width - 10, height - 10);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.3);
    this.acc = createVector(0, 0);
    this.size = random(2, 5);
  }
  
  update() {
    // Gentle wandering
    this.acc.add(p5.Vector.random2D().mult(0.02));
    
    // Flee from observation points
    for (let pt of observationPoints) {
      let d = dist(this.pos.x, this.pos.y, pt.x, pt.y);
      if (d < 40) {
        let flee = p5.Vector.sub(this.pos, createVector(pt.x, pt.y));
        flee.normalize();
        flee.mult(0.08);
        this.acc.add(flee);
      }
    }
    
    this.vel.add(this.acc);
    this.vel.limit(1.5);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Wrap around edges
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }
  
  display() {
    // Trail effect
    let speed = this.vel.mag();
    fill(150, 200, 255, map(speed, 0, 1.5, 30, 150));
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
