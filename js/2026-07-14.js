// 2026-07-14 — "The systems we trust with memory are the ones most likely to forget us."
// Inspired by Jurassic Park computers, AI memory exploits, and trust fractures in tools

let particles = [];
let cracks = [];
let pulsePhase = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  noStroke();
  
  // Create memory particles — soft glowing orbs in a dark field
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      baseR: random(2, 8),
      r: 0,
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      hue: random(20, 50),  // warm ambers and soft golds
      alpha: random(80, 180),
      phase: random(TWO_PI),
      driftSpeed: random(0.002, 0.008),
      alive: true,
      fragility: random(0.01, 0.05) // how easily this memory fractures
    });
  }
}

function draw() {
  background(12, 10, 18);
  pulsePhase += 0.015;
  
  // Draw faint trust-lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 120) {
        let alpha = map(d, 0, 120, 40, 0);
        // Lines occasionally flicker — trust is not constant
        if (random() > 0.02) {
          stroke(200, 170, 100, alpha);
          strokeWeight(0.5);
          line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        }
      }
    }
  }
  noStroke();
  
  // Update and draw particles
  for (let p of particles) {
    if (!p.alive) continue;
    
    // Gentle drift
    p.x += p.vx + sin(frameCount * p.driftSpeed + p.phase) * 0.3;
    p.y += p.vy + cos(frameCount * p.driftSpeed * 0.7 + p.phase) * 0.2;
    
    // Wrap edges
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
    
    // Breathing pulse
    let pulse = sin(pulsePhase + p.phase) * 0.4 + 1;
    p.r = p.baseR * pulse;
    
    // Occasionally a memory "fractures" — dims suddenly
    if (random() < p.fragility * 0.01) {
      p.alpha = max(10, p.alpha - random(20, 60));
    }
    // Slow recovery
    p.alpha = lerp(p.alpha, random(80, 180), 0.002);
    
    // Draw glow
    fill(p.hue * 3, p.hue * 2.5, p.hue * 1.5, p.alpha * 0.3);
    ellipse(p.x, p.y, p.r * 3, p.r * 3);
    fill(255, 230, 180, p.alpha);
    ellipse(p.x, p.y, p.r, p.r);
  }
  
  // Occasional crack lines — moments when trust fractures
  if (random() < 0.008) {
    let src = particles[floor(random(particles.length))];
    cracks.push({
      x1: src.x, y1: src.y,
      x2: src.x + random(-60, 60), y2: src.y + random(-60, 60),
      life: 1.0
    });
  }
  
  for (let i = cracks.length - 1; i >= 0; i--) {
    let c = cracks[i];
    c.life -= 0.025;
    if (c.life <= 0) {
      cracks.splice(i, 1);
      continue;
    }
    stroke(255, 200, 120, c.life * 100);
    strokeWeight(0.8);
    line(c.x1, c.y1, c.x2, c.y2);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
