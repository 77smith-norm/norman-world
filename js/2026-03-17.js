// Norman World - March 17, 2026
// Theme: The forge and the breadboard - digital/analog tension

let particles = [];
let circuitLines = [];
let time = 0;

function setup() {
  let container = document.getElementById('sketch-container');
  let canvas = createCanvas(container.offsetWidth, 400);
  canvas.parent('sketch-container');
  
  // Create circuit-like lines
  for (let i = 0; i < 8; i++) {
    circuitLines.push({
      x: random(width),
      y: random(height),
      length: random(30, 80),
      angle: random([0, HALF_PI, PI, TWO_PI]),
      active: random() > 0.5
    });
  }
  
  // Create particles (representing both data and electrons)
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Dark background with subtle gradient feel
  background(15, 17, 25);
  
  // Draw circuit traces
  drawCircuit();
  
  // Update and draw particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Add glow effect at cursor
  let mouseDist = dist(mouseX, mouseY, width/2, height/2);
  let glowSize = map(mouseDist, 0, width/2, 100, 20);
  let glowAlpha = map(mouseDist, 0, width/2, 30, 5);
  
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(100, 150, 255, glowAlpha / i);
    ellipse(width/2, height/2, glowSize * i);
  }
  
  time += 0.02;
}

function drawCircuit() {
  stroke(60, 80, 100, 80);
  strokeWeight(1);
  
  for (let line of circuitLines) {
    let flicker = sin(time * 2 + line.x * 0.01) > 0.3 ? 1 : 0.3;
    stroke(60, 80, 100, 80 * flicker);
    
    let x1 = line.x;
    let y1 = line.y;
    let x2 = line.x + cos(line.angle) * line.length;
    let y2 = line.y + sin(line.angle) * line.length;
    
    // Draw trace
    line(x1, y1, x2, y2);
    
    // Draw nodes
    noStroke();
    fill(100, 150, 255, 100 * flicker);
    ellipse(x1, y1, 4);
    ellipse(x2, y2, 4);
    stroke(60, 80, 100, 80);
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 6);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.hue = random() > 0.5 ? 1 : 0; // Blue vs warm
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
    
    // Slight wave motion
    this.y += sin(time + this.x * 0.01) * 0.5;
  }
  
  display() {
    noStroke();
    let alpha = 150 + sin(time * 3 + this.x * 0.1) * 50;
    
    if (this.hue === 1) {
      // Blue particles (digital/AI)
      fill(80, 150, 255, alpha);
    } else {
      // Warm particles (analog/hardware)
      fill(255, 180, 100, alpha);
    }
    
    ellipse(this.x, this.y, this.size);
    
    // Glow
    fill(this.hue === 1 ? 80 : 255, this.hue === 1 ? 150 : 180, this.hue === 1 ? 255 : 100, alpha * 0.3);
    ellipse(this.x, this.y, this.size * 3);
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, 400);
}