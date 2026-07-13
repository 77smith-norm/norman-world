// 2026-07-12 — Forward stroke
// Sentiment: "Every stroke moves forward — the hand trusts the line it cannot undo."
// Inspired by: Backtrack-Free Cursive, honest critique in tech

let particles = [];
let flowField;
let cols, rows;
let scl = 20;
let zoff = 0;
let palette;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  
  palette = [
    color(220, 15, 95),  // soft blue-white
    color(200, 25, 85),  // muted blue
    color(180, 35, 75),  // teal
    color(15, 40, 90),   // warm peach
    color(340, 20, 88),  // rose
  ];
  
  cols = floor(width / scl) + 1;
  rows = floor(height / scl) + 1;
  flowField = new Array(cols * rows);
  
  for (let i = 0; i < 300; i++) {
    particles.push(new FlowParticle());
  }
  
  background(220, 8, 96);
}

function draw() {
  // Soft fade for trailing effect
  noStroke();
  fill(220, 8, 96, 8);
  rect(0, 0, width, height);
  
  // Build flow field
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let idx = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1.5);
      flowField[idx] = v;
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  zoff += 0.004;
  
  // Update and draw particles
  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }
}

class FlowParticle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1.5, 3);
    this.col = random(palette);
    this.weight = random(1, 3.5);
    this.life = random(200, 500);
    this.age = 0;
    this.prevPos = this.pos.copy();
  }
  
  follow(field) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    x = constrain(x, 0, cols - 1);
    y = constrain(y, 0, rows - 1);
    let idx = x + y * cols;
    let force = field[idx];
    if (force) {
      this.acc.add(force);
    }
  }
  
  update() {
    this.prevPos = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.age++;
  }
  
  edges() {
    if (this.pos.x > width) { this.pos.x = 0; this.prevPos.x = 0; }
    if (this.pos.x < 0) { this.pos.x = width; this.prevPos.x = width; }
    if (this.pos.y > height) { this.pos.y = 0; this.prevPos.y = 0; }
    if (this.pos.y < 0) { this.pos.y = height; this.prevPos.y = height; }
    
    // Respawn if life expired
    if (this.age > this.life) {
      this.pos = createVector(random(width), random(height));
      this.prevPos = this.pos.copy();
      this.vel.mult(0);
      this.age = 0;
      this.life = random(200, 500);
      this.col = random(palette);
    }
  }
  
  show() {
    let alpha = map(this.age, 0, this.life, 60, 0);
    let c = this.col;
    stroke(hue(c), saturation(c), brightness(c), alpha);
    strokeWeight(this.weight);
    noFill();
    // Draw as a short segment — forward only, no backtracking
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / scl) + 1;
  rows = floor(height / scl) + 1;
  flowField = new Array(cols * rows);
}
