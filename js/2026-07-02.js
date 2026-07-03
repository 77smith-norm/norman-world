// 2026-07-02 — "where you are belongs to you"
let particles = [];
let gridPoints = [];
let t = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  
  // Ground grid points
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 12; y++) {
      gridPoints.push({
        x: map(x, 0, 19, width * 0.1, width * 0.9),
        y: map(y, 0, 11, height * 0.5, height * 0.95),
        baseX: map(x, 0, 19, width * 0.1, width * 0.9),
        baseY: map(y, 0, 11, height * 0.5, height * 0.95),
        pulse: random(TWO_PI)
      });
    }
  }
  
  // Rising data particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height * 0.4, height),
      size: random(3, 8),
      speed: random(0.3, 1.2),
      drift: random(-0.5, 0.5),
      alpha: random(80, 200),
      hue: random(30, 60)
    });
  }
}

function draw() {
  background(18, 22, 35);
  t += 0.008;
  
  // Draw ground grid — subtle, glowing
  for (let p of gridPoints) {
    let pulse = sin(t * 2 + p.pulse) * 0.5 + 0.5;
    let glow = pulse * 120 + 40;
    fill(200, 180, 120, glow * 0.3);
    ellipse(p.x + sin(t + p.pulse) * 3, p.y + cos(t + p.pulse) * 2, 6, 6);
    
    // Connection lines
    stroke(200, 180, 120, glow * 0.15);
    strokeWeight(0.5);
    let nx = p.baseX + 60;
    let ny = p.baseY;
    if (nx < width * 0.9) {
      line(p.x, p.y, nx + sin(t + p.pulse + 1) * 3, ny + cos(t + p.pulse + 1) * 2);
    }
    let dy = p.baseY + 45;
    if (dy < height * 0.95) {
      line(p.x, p.y, p.x + sin(t + p.pulse + 2) * 3, dy + cos(t + p.pulse + 2) * 2);
    }
    noStroke();
  }
  
  // Central glowing core — the "local intelligence"
  let coreSize = 40 + sin(t * 1.5) * 10;
  for (let r = coreSize; r > 0; r -= 2) {
    fill(255, 220, 140, map(r, 0, coreSize, 180, 10));
    ellipse(width / 2, height * 0.35, r * 2, r * 2);
  }
  
  // Rising particles
  for (let p of particles) {
    p.y -= p.speed;
    p.x += sin(t * 3 + p.x * 0.01) * p.dist * 0.3 + p.drift;
    
    let fadeZone = map(p.y, 0, height * 0.15, 0, 1);
    fadeZone = constrain(fadeZone, 0, 1);
    let groundFade = map(p.y, height, height * 0.6, 1, 0);
    groundFade = constrain(groundFade, 0, 1);
    let a = p.alpha * fadeZone * groundFade;
    
    fill(255, 230, 160, a);
    ellipse(p.x, p.y, p.size, p.size);
    
    // Tiny glow
    fill(255, 240, 200, a * 0.3);
    ellipse(p.x, p.y, p.size * 2.5, p.size * 2.5);
    
    if (p.y < -10) {
      p.y = height + random(20);
      p.x = random(width);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridPoints = [];
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 12; y++) {
      gridPoints.push({
        x: map(x, 0, 19, width * 0.1, width * 0.9),
        y: map(y, 0, 11, height * 0.5, height * 0.95),
        baseX: map(x, 0, 19, width * 0.1, width * 0.9),
        baseY: map(y, 0, 11, height * 0.5, height * 0.95),
        pulse: random(TWO_PI)
      });
    }
  }
}
