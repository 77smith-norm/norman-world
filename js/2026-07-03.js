// 2026-07-03 — "The invisible air we breathe shapes every thought we think."
let particles = [];
let breathPhase = 0;
let maxParticles = 180;
let canvasW, canvasH;

function setup() {
  canvasW = min(windowWidth, 720);
  canvasH = min(windowHeight, 540);
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('sketch-container');
  noStroke();
  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: random(canvasW),
      y: random(canvasH),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(2, 6),
      hue: random(180, 240),
      alpha: random(60, 140)
    });
  }
}

function draw() {
  // Background fades slowly — trails
  background(15, 18, 30, 25);
  
  breathPhase += 0.008;
  let breathFactor = sin(breathPhase) * 0.5 + 0.5; // 0..1
  let density = 0;
  
  // Calculate local density influence
  for (let p of particles) {
    p.x += p.vx + (noise(p.x * 0.005, frameCount * 0.002) - 0.5) * 1.5;
    p.y += p.vy + (noise(p.y * 0.005, frameCount * 0.003) - 0.5) * 1.5;
    
    // Wrap
    if (p.x < 0) p.x = canvasW;
    if (p.x > canvasW) p.x = 0;
    if (p.y < 0) p.y = canvasH;
    if (p.y > canvasH) p.y = 0;
    
    // Density check — count nearby particles
    let localCount = 0;
    for (let other of particles) {
      let d = dist(p.x, p.y, other.x, other.y);
      if (d < 60) localCount++;
    }
    density = max(density, localCount);
    
    // Size pulse based on breath
    let sizeMod = 1 + breathFactor * 0.4;
    let drawSize = p.size * sizeMod;
    
    // Color shift with density — more crowded = warmer
    let shift = map(localCount, 0, 10, 0, 60);
    let r = map(p.hue + shift, 180, 300, 80, 220);
    let g = map(p.hue + shift, 180, 300, 140, 100);
    let b = map(p.hue + shift, 180, 300, 220, 180);
    
    fill(r, g, b, p.alpha * (0.6 + breathFactor * 0.4));
    ellipse(p.x, p.y, drawSize, drawSize);
    
    // Draw connection lines for nearby particles
    for (let other of particles) {
      let d = dist(p.x, p.y, other.x, other.y);
      if (d < 50 && d > 0) {
        let lineAlpha = map(d, 0, 50, 40, 0) * breathFactor;
        stroke(180, 200, 240, lineAlpha);
        strokeWeight(0.5);
        line(p.x, p.y, other.x, other.y);
        noStroke();
      }
    }
  }
  
  // Draw breath indicator — subtle expanding ring
  let ringSize = canvasH * 0.15 + breathFactor * canvasH * 0.2;
  noFill();
  stroke(180, 200, 240, 15 + breathFactor * 20);
  strokeWeight(1);
  ellipse(canvasW / 2, canvasH / 2, ringSize, ringSize);
  noStroke();
}

function windowResized() {
  canvasW = min(windowWidth, 720);
  canvasH = min(windowHeight, 540);
  resizeCanvas(canvasW, canvasH);
}
