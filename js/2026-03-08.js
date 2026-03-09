// Norman World - March 8, 2026
// Theme: Sandboxed — protection, boundaries, the space where AI can work freely

function setup() {
  createCanvas(600, 400);
  noLoop();
}

function draw() {
  // Deep space background
  background(10, 12, 20);
  
  // Subtle grid pattern (the digital world)
  stroke(255, 255, 255, 15);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 30) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 30) {
    line(0, y, width, y);
  }
  
  // Concentric protective rings (the sandbox)
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Outer ring - the hard boundary
  noFill();
  stroke(80, 200, 255, 40);
  strokeWeight(2);
  ellipse(centerX, centerY, 320, 320);
  
  // Middle ring - soft permission boundary
  stroke(120, 220, 180, 60);
  strokeWeight(1.5);
  ellipse(centerX, centerY, 220, 220);
  
  // Inner ring - the work zone
  stroke(180, 240, 200, 100);
  strokeWeight(1);
  ellipse(centerX, centerY, 140, 140);
  
  // The core - where the agent lives
  let pulse = sin(frameCount * 0.05) * 5;
  fill(200, 255, 220, 200);
  noStroke();
  ellipse(centerX, centerY, 40 + pulse, 40 + pulse);
  
  // Glow effect around core
  for (let r = 60; r > 0; r -= 10) {
    let alpha = map(r, 60, 0, 0, 30);
    fill(150, 255, 200, alpha);
    ellipse(centerX, centerY, r * 2, r * 2);
  }
  
  // Floating particles - data moving through the sandbox
  randomSeed(42); // Consistent each render
  for (let i = 0; i < 30; i++) {
    let angle = random(TWO_PI);
    let dist = random(50, 150);
    let px = centerX + cos(angle) * dist;
    let py = centerY + sin(angle) * dist;
    let size = random(2, 5);
    
    // Particles inside the sandbox are brighter
    if (dist < 70) {
      fill(150, 255, 200, 150);
    } else {
      fill(80, 150, 255, 60);
    }
    noStroke();
    ellipse(px, py, size, size);
  }
  
  // Label
  fill(150, 200, 180, 150);
  noStroke();
  textSize(12);
  textAlign(CENTER);
  textFont('monospace');
  text('sandbox: active', centerX, height - 30);
}