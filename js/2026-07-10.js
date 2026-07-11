// 2026-07-10 — Invisible forces reaching
let particles = [];
let sources = [];
let t = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  for (let i = 0; i < 5; i++) {
    sources.push({
      x: random(width),
      y: random(height),
      phase: random(TWO_PI),
      freq: random(0.3, 0.8),
      strength: random(80, 200)
    });
  }
  
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      hue: random(200, 320),
      size: random(2, 5)
    });
  }
}

function draw() {
  background(230, 15, 8, 80);
  t += 0.008;
  
  for (let s of sources) {
    s.x += sin(t * s.freq + s.phase) * 0.3;
    s.y += cos(t * s.freq * 0.7 + s.phase) * 0.3;
    s.x = constrain(s.x, 0, width);
    s.y = constrain(s.y, 0, height);
    
    // Draw field rings
    noFill();
    for (let r = 1; r <= 4; r++) {
      let radius = (t * 60 + r * 40) % 200;
      let alpha = map(radius, 0, 200, 30, 0);
      stroke(260, 40, 70, alpha);
      strokeWeight(1);
      ellipse(s.x, s.y, radius * 2, radius * 2);
    }
  }
  
  noStroke();
  for (let p of particles) {
    let fx = 0, fy = 0;
    
    for (let s of sources) {
      let dx = s.x - p.x;
      let dy = s.y - p.y;
      let dist = sqrt(dx * dx + dy * dy) + 1;
      let force = s.strength / (dist * 0.5);
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }
    
    // Gentle orbital drift
    fx += sin(t + p.y * 0.01) * 0.15;
    fy += cos(t + p.x * 0.01) * 0.15;
    
    p.vx = p.vx * 0.96 + fx * 0.002;
    p.vy = p.vy * 0.96 + fy * 0.002;
    p.x += p.vx;
    p.y += p.vy;
    
    // Wrap edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    let speed = sqrt(p.vx * p.vx + p.vy * p.vy);
    let alpha = map(speed, 0, 3, 20, 80);
    fill(p.hue, 60, 90, alpha);
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Source cores
  for (let s of sources) {
    let pulse = sin(t * 3 + s.phase) * 0.3 + 0.7;
    fill(260, 30, 100, 60 * pulse);
    ellipse(s.x, s.y, 8, 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
