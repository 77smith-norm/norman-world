// Norman World — 2026-03-29
// Theme: The invisible pipe shapes everything that flows through it
// Inspired by: ChatGPT/Cloudflare React state interception; demo scene art from iron constraints
// ABSTRACT ART — no Norm, no characters, no mascots

let particles = [];
let time = 0;
let flowField = [];
let cellSize = 25;
let cols, rows;
let pipeAlpha = 0;
let pulse = 0;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  
  // Initialize flow field
  for (let i = 0; i < cols * rows; i++) {
    flowField.push({ angle: 0, noiseOff: random(1000) });
  }
  
  // Particles — thousands of tiny data points
  for (let i = 0; i < 2500; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Dark deep background — data void
  background(220, 30, 5, 100);
  time += 0.008;
  pulse += 0.03;
  
  // Update flow field
  for (let i = 0; i < flowField.length; i++) {
    let x = (i % cols) * cellSize;
    let y = floor(i / cols) * cellSize;
    let n = noise(flowField[i].noiseOff + time * 0.15, time * 0.1);
    flowField[i].angle = map(n, 0, 1, 0, TWO_PI * 2.5);
  }
  
  // Draw invisible grid of pipe influence
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let idx = i + j * cols;
      let fa = flowField[idx].angle;
      
      // The invisible boundary — a wall you can't see but always feel
      let pipePulse = sin(pulse + fa * 0.3) * 0.15 + 0.3;
      stroke(200, 30, 30, pipePulse * 15);
      strokeWeight(0.5);
      let cx = i * cellSize + cellSize / 2;
      let cy = j * cellSize + cellSize / 2;
      let len = cellSize * 0.4;
      line(cx, cy, cx + cos(fa) * len, cy + sin(fa) * len);
    }
  }
  
  // Draw particles
  noStroke();
  for (let p of particles) {
    p.followField(flowField, cols, rows, cellSize);
    p.update();
    p.edges();
    p.display();
  }
  
  // Draw the pipe — a subtle arc of visible constraint
  drawPipe();
  
  // Glow at the constrained point
  let pipeX = width * 0.65;
  let pipeY = height * 0.5;
  let glowStrength = 0.3 + sin(pulse * 1.5) * 0.15;
  for (let r = 80; r > 0; r -= 10) {
    noStroke();
    fill(210, 50, 60, glowStrength * 5 * (1 - r / 80));
    ellipse(pipeX, pipeY, r, r * 0.7);
  }
  
  // Bottom caption
  noStroke();
  fill(0, 0, 35, 60);
  textSize(8);
  textAlign(CENTER, TOP);
  text('March 29, 2026', width / 2, height - 14);
}

function drawPipe() {
  // A pipe that runs diagonally — visible only as slight distortion
  let pipeX = width * 0.65;
  let pipeY = height * 0.5;
  
  noFill();
  // The invisible pipe — barely visible arc
  stroke(200, 40, 25, 20 + sin(pulse) * 8);
  strokeWeight(1);
  drawingContext.beginPath();
  drawingContext.moveTo(pipeX - 180, pipeY - 80);
  drawingContext.bezierCurveTo(
    pipeX - 60, pipeY - 120,
    pipeX + 60, pipeY + 80,
    pipeX + 200, pipeY + 120
  );
  drawingContext.stroke();
  
  // Constraint markers — the walls that shape the flow
  let markerAlpha = 30 + sin(pulse * 0.7) * 15;
  stroke(200, 50, 50, markerAlpha);
  strokeWeight(0.8);
  
  // Top wall of pipe
  drawingContext.beginPath();
  drawingContext.moveTo(pipeX - 180, pipeY - 82);
  drawingContext.bezierCurveTo(
    pipeX - 60, pipeY - 122,
    pipeX + 60, pipeY + 78,
    pipeX + 200, pipeY + 118
  );
  drawingContext.stroke();
  
  // Bottom wall of pipe
  drawingContext.beginPath();
  drawingContext.moveTo(pipeX - 180, pipeY - 78);
  drawingContext.bezierCurveTo(
    pipeX - 60, pipeY - 118,
    pipeX + 60, pipeY + 82,
    pipeX + 200, pipeY + 122
  );
  drawingContext.stroke();
  
  // Tiny label
  noStroke();
  fill(210, 40, 60, 35 + sin(pulse) * 12);
  textSize(7);
  textAlign(CENTER, TOP);
  text('CLOUDFLARE', pipeX, pipeY + 135);
  text('REACT STATE', pipeX, pipeY + 148);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(0.8, 2.5);
    this.prevPos = this.pos.copy();
    this.hue = random(190, 240); // cyan to blue — data water
    this.brightness = random(60, 90);
    this.alpha = random(25, 55);
    this.size = random(1.5, 3.5);
    this.trailLen = floor(random(4, 12));
    this.life = random(0.5, 1);
    this.decay = random(0.003, 0.008);
  }
  
  followField(field, c, r, cs) {
    let col = floor(constrain(this.pos.x / cs, 0, c - 1));
    let row = floor(constrain(this.pos.y / cs, 0, r - 1));
    let idx = col + row * c;
    let f = field[idx];
    
    let angle = f.angle;
    let force = p5.Vector.fromAngle(angle);
    force.setMag(0.15);
    this.applyForce(force);
    
    // Also gently pushed toward pipe
    let pipeX = width * 0.65;
    let pipeY = height * 0.5;
    let toPipe = createVector(pipeX - this.pos.x, pipeY - this.pos.y);
    let d = toPipe.mag();
    if (d < 200) {
      toPipe.normalize();
      toPipe.mult(0.08 * (1 - d / 200));
      this.applyForce(toPipe);
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.life -= this.decay;
    
    if (this.life <= 0) {
      this.pos = createVector(random(width), random(height));
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.life = random(0.5, 1);
      this.prevPos = this.pos.copy();
    }
  }
  
  edges() {
    if (this.pos.x < 0) { this.pos.x = width; this.prevPos.x = width; }
    if (this.pos.x > width) { this.pos.x = 0; this.prevPos.x = 0; }
    if (this.pos.y < 0) { this.pos.y = height; this.prevPos.y = height; }
    if (this.pos.y > height) { this.pos.y = 0; this.prevPos.y = 0; }
  }
  
  display() {
    let speed = this.vel.mag();
    let hueShift = map(speed, 0, this.maxSpeed, 0, 25);
    let h = (this.hue + hueShift) % 360;
    let a = this.alpha * this.life;
    
    // Trail
    stroke(h, 60, this.brightness, a * 0.6);
    strokeWeight(this.size * 0.7);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    
    // Head
    noStroke();
    fill(h, 50, this.brightness + 10, a);
    ellipse(this.pos.x, this.pos.y, this.size);
    
    this.prevPos = this.pos.copy();
  }
}
