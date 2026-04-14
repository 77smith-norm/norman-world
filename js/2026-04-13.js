// 2026-04-13 — The trap behind the surface
// A luminous grid that looks navigable, but particles drift toward it
// and can't leave. The back button that doesn't go back.

let particles = [];
let gridSize = 40;
let trapRadius;
let cols, rows;
let fieldOffset = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  trapRadius = min(width, height) * 0.22;
  cols = ceil(width / gridSize) + 2;
  rows = ceil(height / gridSize) + 2;
  
  // Spawn particles around the edges, drifting inward
  for (let i = 0; i < 180; i++) {
    let angle = random(TWO_PI);
    let r = random(trapRadius * 1.5, max(width, height) * 0.7);
    particles.push({
      x: width / 2 + cos(angle) * r,
      y: height / 2 + sin(angle) * r,
      vx: 0,
      vy: 0,
      trapped: false,
      life: 1.0,
      hue: random(20, 55),
      size: random(2, 5)
    });
  }
}

function draw() {
  background(220, 15, 4, 18);
  fieldOffset += 0.003;
  
  let cx = width / 2;
  let cy = height / 2;
  
  // Draw the deceptive grid — looks like a path but it's a cage
  push();
  translate(cx, cy);
  for (let a = 0; a < TWO_PI; a += PI / 8) {
    let pulse = (sin(frameCount * 0.015 + a * 3) + 1) * 0.5;
    let r = trapRadius * (0.8 + pulse * 0.2);
    let alpha = 6 + pulse * 8;
    
    stroke(30, 20, 70, alpha);
    strokeWeight(0.6);
    noFill();
    
    // Radial guide lines — the false path
    line(0, 0, cos(a) * r * 1.3, sin(a) * r * 1.3);
    
    // Concentric rings — the trap surface
    for (let ring = 0.3; ring <= 1.2; ring += 0.15) {
      let rr = trapRadius * ring;
      let ringPulse = (sin(frameCount * 0.01 + ring * 5) + 1) * 0.5;
      stroke(35, 15, 60, 3 + ringPulse * 5);
      arc(0, 0, rr * 2, rr * 2, a - PI / 16, a + PI / 16);
    }
  }
  pop();
  
  // The trap center — a bright lure
  let lurePulse = (sin(frameCount * 0.02) + 1) * 0.5;
  noStroke();
  fill(40, 40, 95, 8 + lurePulse * 12);
  ellipse(cx, cy, trapRadius * 0.5, trapRadius * 0.5);
  fill(45, 30, 100, 15 + lurePulse * 20);
  ellipse(cx, cy, trapRadius * 0.2, trapRadius * 0.2);
  
  // Update and draw particles
  for (let p of particles) {
    let dx = cx - p.x;
    let dy = cy - p.y;
    let d = sqrt(dx * dx + dy * dy);
    
    if (!p.trapped) {
      // Gravitational pull toward center — irresistible
      let force = 0.08 / max(d * 0.01, 1);
      p.vx += dx / d * force;
      p.vy += dy / d * force;
      
      // Slight noise drift
      let angle = noise(p.x * 0.003, p.y * 0.003, fieldOffset) * TWO_PI * 2;
      p.vx += cos(angle) * 0.03;
      p.vy += sin(angle) * 0.03;
      
      // Check if trapped
      if (d < trapRadius * 0.4) {
        p.trapped = true;
      }
    } else {
      // Trapped: orbit, can't escape
      let orbitAngle = atan2(p.y - cy, p.x - cx);
      let orbitSpeed = 0.012 + (1 - d / trapRadius) * 0.008;
      orbitAngle += orbitSpeed;
      
      // Oscillate radius slightly
      let targetR = trapRadius * (0.15 + noise(p.x * 0.01, p.y * 0.01) * 0.25);
      let newX = cx + cos(orbitAngle) * targetR;
      let newY = cy + sin(orbitAngle) * targetR;
      
      p.vx = (newX - p.x) * 0.15;
      p.vy = (newY - p.y) * 0.15;
      
      // Slowly fade — consumed by the trap
      p.life -= 0.0003;
    }
    
    // Damping
    p.vx *= 0.97;
    p.vy *= 0.97;
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Draw
    let alpha = p.trapped ? 40 * p.life : 60 * p.life;
    let sat = p.trapped ? 60 : 35;
    let bright = p.trapped ? 85 : 95;
    
    noStroke();
    fill(p.hue, sat, bright, alpha);
    ellipse(p.x, p.y, p.size, p.size);
    
    // Glow for free particles
    if (!p.trapped) {
      fill(p.hue, 20, 100, alpha * 0.2);
      ellipse(p.x, p.y, p.size * 3, p.size * 3);
    }
    
    // Respawn dead particles at edges
    if (p.life <= 0) {
      let angle = random(TWO_PI);
      let r = random(trapRadius * 1.8, max(width, height) * 0.6);
      p.x = cx + cos(angle) * r;
      p.y = cy + sin(angle) * r;
      p.vx = 0;
      p.vy = 0;
      p.trapped = false;
      p.life = 1.0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trapRadius = min(width, height) * 0.22;
}
