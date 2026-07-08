// Norman World — 2026-07-07
// "We build walls of trust, only to find the doors were never locked."
// Inspired by hidden backdoors, leaked repos, and the illusion of security.

let particles = [];
let walls = [];
let glowPulse = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create semi-permeable walls
  for (let i = 0; i < 5; i++) {
    walls.push({
      x: (i + 1) * width / 6,
      h: random(height * 0.3, height * 0.7),
      gapY: random(height * 0.2, height * 0.6),
      gapSize: random(40, 100),
      permeability: random(0.3, 0.8),
      drift: random(-0.5, 0.5)
    });
  }
  
  // Seed particles
  for (let i = 0; i < 120; i++) {
    particles.push(createParticle());
  }
}

function createParticle() {
  return {
    x: random(width),
    y: random(height),
    vx: random(-1.5, 1.5),
    vy: random(-0.5, 0.5),
    hue: random([200, 210, 220, 280, 300]),
    size: random(3, 8),
    passed: false
  };
}

function draw() {
  background(230, 15, 8);
  glowPulse += 0.02;
  
  // Draw walls with gaps
  for (let w of walls) {
    w.gapY += w.drift;
    if (w.gapY < height * 0.1 || w.gapY > height * 0.7) w.drift *= -1;
    
    // Wall segments
    noStroke();
    fill(220, 30, 25, 60);
    rect(w.x - 3, 0, 6, w.gapY - w.gapSize / 2);
    rect(w.x - 3, w.gapY + w.gapSize / 2, 6, height);
    
    // Gap glow
    let gapAlpha = 20 + 15 * sin(glowPulse + w.x * 0.01);
    fill(180, 60, 70, gapAlpha);
    ellipse(w.x, w.gapY, w.gapSize * 0.6, w.gapSize);
  }
  
  // Update and draw particles
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    
    // Check wall collisions
    for (let w of walls) {
      if (abs(p.x - w.x) < 8) {
        let inGap = abs(p.y - w.gapY) < w.gapSize / 2;
        if (inGap || random() < w.permeability * 0.1) {
          // Pass through
          p.passed = true;
        } else {
          // Bounce
          p.vx *= -0.8;
          p.x = p.x < w.x ? w.x - 10 : w.x + 10;
        }
      }
    }
    
    // Wrap around
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw
    let alpha = p.passed ? 90 : 50;
    fill(p.hue, 70, 90, alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    // Trail
    if (p.passed) {
      fill(p.hue, 50, 100, 15);
      ellipse(p.x - p.vx * 3, p.y - p.vy * 3, p.size * 2, p.size * 2);
    }
  }
  
  // Recycle drifted particles
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].x < -20 || particles[i].x > width + 20 ||
        particles[i].y < -20 || particles[i].y > height + 20) {
      particles[i] = createParticle();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
