// Norman World - March 12, 2026
// Theme: Willingness to look stupid - vulnerability as creative moat

let seeds = [];
let revealed = 0;
let revealSpeed = 0.5;

function setup() {
  let container = document.getElementById('sketch-container');
  let canvas = createCanvas(container.offsetWidth, 400);
  canvas.parent('sketch-container');
  
  // Create seeds that will reveal themselves over time
  for (let i = 0; i < 25; i++) {
    seeds.push(new Seed(random(width), random(height), i * 2));
  }
}

function draw() {
  // Dark theme background with subtle gradient
  let bgTop = color(20, 25, 35);
  let bgBottom = color(35, 30, 50);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(bgTop, bgBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Gradually reveal seeds
  if (revealed < seeds.length) {
    revealed += revealSpeed;
  }
  
  // Draw seeds (only revealed ones)
  for (let i = 0; i < floor(revealed); i++) {
    seeds[i].update();
    seeds[i].draw();
  }
  
  // Add some floating particles for atmosphere
  drawParticles();
}

function drawParticles() {
  noStroke();
  for (let i = 0; i < 30; i++) {
    let x = (frameCount * 0.3 + i * 47) % width;
    let y = (frameCount * 0.2 + i * 31) % height;
    let alpha = map(sin(frameCount * 0.02 + i), -1, 1, 10, 40);
    fill(255, 255, 255, alpha);
    ellipse(x, y, 2, 2);
  }
}

class Seed {
  constructor(x, y, delay) {
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.size = random(15, 35);
    this.wobbleOffset = random(1000);
    this.color = color(
      random(180, 240),
      random(200, 255),
      random(220, 255),
      random(150, 220)
    );
    this.velX = random(-0.3, 0.3);
    this.velY = random(-0.5, -0.1); // drift upward
  }
  
  update() {
    this.x += this.velX + sin(frameCount * 0.02 + this.wobbleOffset) * 0.5;
    this.y += this.velY;
    
    // Wrap around
    if (this.y < -this.size) {
      this.y = height + this.size;
      this.x = random(width);
    }
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
  }
  
  draw() {
    // Wobbly circle - looks slightly foolish but beautiful
    push();
    translate(this.x, this.y);
    
    // Draw the wobbly shape
    noFill();
    stroke(this.color);
    strokeWeight(2);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let offset = map(sin(a * 3 + frameCount * 0.03 + this.wobbleOffset), -1, 1, -5, 5);
      let r = this.size / 2 + offset;
      let px = cos(a) * r;
      let py = sin(a) * r;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    // Inner glow
    noStroke();
    let glowAlpha = map(sin(frameCount * 0.05 + this.wobbleOffset), -1, 1, 50, 150);
    fill(red(this.color), green(this.color), blue(this.color), glowAlpha);
    ellipse(0, 0, this.size * 0.6);
    
    pop();
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, 400);
}