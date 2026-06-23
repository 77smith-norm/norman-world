// 2026-06-22 — "The most powerful things are learning to fit in your pocket."
// Inspired by: Steam Machine launch, local LLMs, tiny models beating giants

let t = 0;
let particles = [];
let corePulse = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // Spawn small particles that drift inward
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speed: random(0.3, 1.2),
      angle: random(TWO_PI),
      orbit: random(80, 250),
      hue: random(30, 60), // warm golds
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(230, 15, 8); // deep dark blue
  
  let cx = width / 2;
  let cy = height / 2;
  
  // Mouse proximity drives the pulse
  let d = dist(mouseX, mouseY, cx, cy);
  let proximity = map(constrain(d, 0, 300), 300, 0, 0, 1);
  corePulse += (proximity - corePulse) * 0.05;
  t += 0.01;
  
  // Draw particles — small things orbiting inward
  for (let p of particles) {
    let orbitRadius = p.orbit * (1 - corePulse * 0.5);
    let px = cx + cos(p.angle + t * p.speed) * orbitRadius;
    let py = cy + sin(p.angle + t * p.speed) * orbitRadius;
    
    // Glow effect
    let glowSize = p.size * (1 + corePulse * 2);
    let alpha = 40 + corePulse * 40;
    fill(p.hue, 60, 90, alpha);
    ellipse(px, py, glowSize * 3, glowSize * 3);
    fill(p.hue, 40, 100, alpha + 20);
    ellipse(px, py, glowSize, glowSize);
    
    // Drift orbit slightly
    p.angle += 0.003 * p.speed;
  }
  
  // Central core — small but dense with power
  let coreSize = 12 + corePulse * 30;
  
  // Outer glow rings
  for (let r = 3; r >= 0; r--) {
    let ringSize = coreSize + r * 15 * (1 + corePulse);
    let ringAlpha = 10 - r * 2 + corePulse * 15;
    fill(45, 30, 100, ringAlpha);
    ellipse(cx, cy, ringSize, ringSize);
  }
  
  // Core itself
  fill(45, 20, 100, 80 + corePulse * 20);
  ellipse(cx, cy, coreSize, coreSize);
  fill(50, 10, 100, 90);
  ellipse(cx, cy, coreSize * 0.5, coreSize * 0.5);
  
  // Faint concentric rings — containment
  noFill();
  stroke(45, 30, 70, 8);
  strokeWeight(0.5);
  for (let r = 1; r <= 5; r++) {
    let ringR = r * 60 + sin(t * 2 + r) * 10;
    ellipse(cx, cy, ringR * 2, ringR * 2);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
