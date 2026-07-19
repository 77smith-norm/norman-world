// 2026-07-18 — Whisper in the Wires
// Inspired by speech recognition in 470KB, open models matching closed giants

let particles = [];
let pulsePhase = 0;
let wordRipples = [];

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(2, 6),
      hue: random(180, 260),
      alpha: random(20, 60),
      freq: random(0.005, 0.02),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(230, 15, 8);
  
  pulsePhase += 0.015;
  
  // Draw connecting lines between nearby particles
  stroke(220, 30, 50, 15);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 100) {
        let alpha = map(d, 0, 100, 25, 0);
        stroke(220, 30, 50, alpha);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  
  // Draw and update particles
  noStroke();
  for (let p of particles) {
    let wave = sin(frameCount * p.freq + p.phase) * 0.5;
    p.x += p.vx + wave * 0.3;
    p.y += p.vy + cos(frameCount * p.freq * 0.7 + p.phase) * 0.2;
    
    // Wrap around edges
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;
    
    let pulseSize = p.size + sin(pulsePhase * 2 + p.phase) * 1.5;
    fill(p.hue, 60, 80, p.alpha);
    ellipse(p.x, p.y, pulseSize, pulseSize);
  }
  
  // Draw ripples from mouse clicks
  for (let i = wordRipples.length - 1; i >= 0; i--) {
    let r = wordRipples[i];
    r.radius += 2.5;
    r.alpha -= 1.2;
    
    noFill();
    stroke(200, 70, 90, r.alpha);
    strokeWeight(1.5);
    ellipse(r.x, r.y, r.radius * 2, r.radius * 2);
    
    if (r.alpha <= 0) {
      wordRipples.splice(i, 1);
    }
  }
  
  // Central pulse — the whisper
  let cx = width / 2;
  let cy = height / 2;
  let pulseR = 40 + sin(pulsePhase) * 15;
  
  noStroke();
  for (let ring = 3; ring >= 0; ring--) {
    let rr = pulseR + ring * 25;
    let a = map(ring, 0, 3, 30, 5);
    fill(210, 50, 90, a);
    ellipse(cx, cy, rr * 2, rr * 2);
  }
  
  fill(210, 40, 95, 50);
  ellipse(cx, cy, pulseR, pulseR);
}

function mousePressed() {
  wordRipples.push({ x: mouseX, y: mouseY, radius: 0, alpha: 80 });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
