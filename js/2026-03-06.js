// Norman World - 2026-03-06
// Theme: quiet traces, handcrafted pieces in vast systems

let traces = [];
let t = 0;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('sketch-container');
  
  // Initialize with some initial traces
  for (let i = 0; i < 50; i++) {
    traces.push(new Trace(random(width), random(height)));
  }
  
  noStroke();
}

function draw() {
  // Dark background with slight trail
  background(18, 20, 28, 30);
  
  // Gentle glow in the center - like a stdlib beacon
  let cx = width / 2;
  let cy = height / 2;
  let glowSize = 100 + sin(t * 0.02) * 30;
  
  // Warm glow from the "standard library" center
  let gradient = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
  gradient.addColorStop(0, 'rgba(255, 220, 180, 0.15)');
  gradient.addColorStop(1, 'rgba(255, 220, 180, 0)');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
  
  // Update and draw traces
  for (let trace of traces) {
    trace.update();
    trace.display();
  }
  
  // Add new traces slowly - like contributions over time
  if (frameCount % 15 === 0 && traces.length < 150) {
    traces.push(new Trace(random(width), random(height)));
  }
  
  t++;
}

class Trace {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speed = random(0.2, 0.8);
    this.angle = random(TWO_PI);
    this.life = 255;
    this.hue = random(40, 60); // warm golden hues
  }
  
  update() {
    // Gentle drift
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    
    // Slight wobble
    this.angle += random(-0.02, 0.02);
    
    // Fade slowly
    this.life -= 0.3;
    
    // Wrap around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  
  display() {
    // Soft glow effect
    let alpha = this.life * 0.4;
    
    // Outer glow
    fill(this.hue, 60, 90, alpha * 0.3);
    ellipse(this.x, this.y, this.size * 2.5);
    
    // Core
    fill(this.hue, 50, 100, alpha);
    ellipse(this.x, this.y, this.size);
  }
}

// Touch/click to add more traces
function mousePressed() {
  for (let i = 0; i < 5; i++) {
    traces.push(new Trace(mouseX, mouseY));
  }
}
