// 2026-06-27 — "The quietest signal finds you when you stop pretending to be awake."
let t = 0;
let waves = [];
let particles = [];
let canvasW, canvasH;

function setup() {
  canvasW = min(windowWidth, 800);
  canvasH = min(windowHeight, 600);
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('sketch-container');
  noStroke();
  
  // Initialize radio wave rings
  for (let i = 0; i < 8; i++) {
    waves.push({
      x: canvasW / 2,
      y: canvasH / 2,
      r: i * 40 + 20,
      speed: 0.3 + i * 0.05,
      alpha: 180 - i * 18,
      phase: i * 0.4
    });
  }
  
  // Floating signal particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(canvasW),
      y: random(canvasH),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(2, 6),
      alpha: random(40, 160),
      hue: random(200, 280)
    });
  }
}

function draw() {
  // Deep navy to soft indigo gradient background
  for (let y = 0; y < canvasH; y++) {
    let inter = map(y, 0, canvasH, 0, 1);
    let c = lerpColor(color(10, 8, 30), color(25, 20, 60), inter);
    stroke(c);
    line(0, y, canvasW, y);
  }
  noStroke();
  
  t += 0.008;
  
  // Draw expanding radio wave circles
  for (let w of waves) {
    let pulse = sin(t * w.speed + w.phase) * 0.5 + 0.5;
    let currentR = w.r + pulse * 30;
    let a = w.alpha * (1 - currentR / (canvasW * 0.7));
    if (a > 0) {
      stroke(140, 160, 255, a);
      strokeWeight(1.5);
      noFill();
      ellipse(w.x, w.y, currentR * 2, currentR * 2);
    }
  }
  noStroke();
  
  // Central glow — the quiet signal
  let glowSize = 40 + sin(t * 1.5) * 15;
  for (let r = glowSize; r > 0; r -= 3) {
    let a = map(r, 0, glowSize, 120, 0);
    fill(180, 200, 255, a);
    ellipse(canvasW / 2, canvasH / 2, r * 2, r * 2);
  }
  
  // Floating particles rising like static finding order
  for (let p of particles) {
    p.x += p.vx + sin(t * 2 + p.y * 0.01) * 0.2;
    p.y += p.vy;
    
    // Wrap around
    if (p.y < -10) { p.y = canvasH + 10; p.x = random(canvasW); }
    if (p.x < -10) p.x = canvasW + 10;
    if (p.x > canvasW + 10) p.x = -10;
    
    let distToCenter = dist(p.x, p.y, canvasW / 2, canvasH / 2);
    let proximity = map(distToCenter, 0, canvasW * 0.5, 1, 0);
    let a = p.alpha * proximity;
    let s = p.size * (0.5 + proximity * 0.5);
    
    fill(p.hue * 0.7 + 50, p.hue * 0.5 + 100, 255, a);
    ellipse(p.x, p.y, s, s);
  }
  
  // Subtle horizontal scan lines — like tuning a dial
  for (let y = 0; y < canvasH; y += 4) {
    let scanAlpha = sin(t * 3 + y * 0.05) * 8 + 8;
    fill(255, 255, 255, scanAlpha);
    rect(0, y, canvasW, 1);
  }
}

function windowResized() {
  canvasW = min(windowWidth, 800);
  canvasH = min(windowHeight, 600);
  resizeCanvas(canvasW, canvasH);
}
