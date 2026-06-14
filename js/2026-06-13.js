// 2026-06-13 — "The truest signal is the one that arrives without noise."
// Inspired by: Census Bureau banning noise infusion, Every Frame Perfect (Tonsky), GLM 5.2
// Theme: clarity emerging from distortion — clean geometry dissolving static

let particles = [];
let noiseField = [];
let clarityRadius = 0;
let targetClarity = 0;
let phase = 0;
let cols, rows;
let cellSize = 20;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  cols = ceil(width / cellSize);
  rows = ceil(height / cellSize);
  
  // Initialize noise field
  for (let i = 0; i < cols * rows; i++) {
    noiseField.push(0);
  }
  
  // Create signal particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(3, 8),
      hue: random([200, 210, 220, 230, 180, 190]),
      noiseOffset: random(1000),
      trail: []
    });
  }
}

function draw() {
  background(220, 15, 10);
  
  // Clarity grows near mouse, fades elsewhere
  if (mouseIsPressed || touches.length > 0) {
    targetClarity = min(targetClarity + 0.02, 1);
  } else {
    targetClarity = max(targetClarity - 0.005, 0);
  }
  
  clarityRadius = lerp(clarityRadius, targetClarity, 0.05);
  phase += 0.008;
  
  // Update noise field
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let idx = y * cols + x;
      let nx = x * 0.08;
      let ny = y * 0.08;
      let n = noise(nx, ny, phase) * 2 - 1;
      
      // Clarity dampens noise near center/mouse
      let cx = (mouseX || width / 2) / cellSize;
      let cy = (mouseY || height / 2) / cellSize;
      let d = dist(x, y, cx, cy) / max(cols, rows);
      let clarity = pow(1 - d, 2) * clarityRadius;
      noiseField[idx] = n * (1 - clarity);
    }
  }
  
  // Draw noise field as subtle grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let idx = y * cols + x;
      let n = abs(noiseField[idx]);
      if (n > 0.15) {
        let a = map(n, 0.15, 1, 0, 0.15);
        fill(200, 40, 80, a);
        rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
  
  // Draw clarity zones (clean circles where noise dissolves)
  if (clarityRadius > 0.01) {
    let mx = mouseX || width / 2;
    let my = mouseY || height / 2;
    let r = clarityRadius * min(width, height) * 0.4;
    
    for (let ring = 0; ring < 3; ring++) {
      let rr = r * (1 - ring * 0.25);
      let a = clarityRadius * 0.08 * (1 - ring * 0.3);
      fill(200, 10, 95, a);
      ellipse(mx, my, rr * 2, rr * 2);
    }
  }
  
  // Update and draw particles
  for (let p of particles) {
    let nx = p.x * 0.005;
    let ny = p.y * 0.005;
    let angle = noise(nx, ny, phase * 0.5) * TWO_PI * 2;
    
    // Noise displacement
    let col = floor(p.x / cellSize);
    let row = floor(p.y / cellSize);
    let idx = constrain(row, 0, rows - 1) * cols + constrain(col, 0, cols - 1);
    let n = noiseField[idx] || 0;
    
    p.vx += cos(angle) * 0.3 + n * 2;
    p.vy += sin(angle) * 0.3 + n * 2;
    
    // Clarity pull toward center of clarity zone
    if (clarityRadius > 0.1) {
      let mx = mouseX || width / 2;
      let my = mouseY || height / 2;
      let d = dist(p.x, p.y, mx, my);
      if (d < clarityRadius * min(width, height) * 0.3) {
        let pullStrength = 0.02 * clarityRadius;
        p.vx += (mx - p.x) * pullStrength;
        p.vy += (my - p.y) * pullStrength;
        p.vx *= 0.92;
        p.vy *= 0.92;
      }
    }
    
    // Damping
    p.vx *= 0.94;
    p.vy *= 0.94;
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Wrap
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
    
    // Trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 8) p.trail.shift();
    
    // Draw trail
    for (let i = 0; i < p.trail.length - 1; i++) {
      let t = p.trail[i];
      let a = (i / p.trail.length) * 0.4;
      fill(p.hue, 50, 90, a);
      let s = p.size * (i / p.trail.length) * 0.6;
      ellipse(t.x, t.y, s, s);
    }
    
    // Draw particle
    fill(p.hue, 40, 95, 0.8);
    ellipse(p.x, p.y, p.size, p.size);
    
    // Highlight in clarity zone
    if (clarityRadius > 0.1) {
      let mx = mouseX || width / 2;
      let my = mouseY || height / 2;
      let d = dist(p.x, p.y, mx, my);
      if (d < clarityRadius * min(width, height) * 0.3) {
        fill(50, 30, 100, clarityRadius * 0.5);
        ellipse(p.x, p.y, p.size * 2, p.size * 2);
      }
    }
  }
  
  // Draw connecting lines between nearby clear particles
  if (clarityRadius > 0.2) {
    let mx = mouseX || width / 2;
    let my = mouseY || height / 2;
    let clearParticles = particles.filter(p => {
      return dist(p.x, p.y, mx, my) < clarityRadius * min(width, height) * 0.25;
    });
    
    stroke(200, 20, 90, clarityRadius * 0.15);
    strokeWeight(0.5);
    for (let i = 0; i < clearParticles.length; i++) {
      for (let j = i + 1; j < clearParticles.length; j++) {
        let a = clearParticles[i];
        let b = clearParticles[j];
        let d = dist(a.x, a.y, b.x, b.y);
        if (d < 100) {
          line(a.x, a.y, b.x, b.y);
        }
      }
    }
    noStroke();
  }
  
  // Subtle instruction text
  let alpha = map(sin(frameCount * 0.03), -1, 1, 0.1, 0.4);
  fill(200, 15, 90, alpha);
  textAlign(CENTER);
  textSize(13);
  textFont('Georgia');
  text('press and hold to clarify', width / 2, height - 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / cellSize);
  rows = ceil(height / cellSize);
  noiseField = [];
  for (let i = 0; i < cols * rows; i++) {
    noiseField.push(0);
  }
}
