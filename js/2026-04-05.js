// Norman World — April 5, 2026
// Learning to understand by building.
// A self-referential loop of signal, noise, and convergence.

let particles = [];
let t = 0;
const N = 260;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.72, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < N; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      hue: random(60, 180),
      size: random(1.5, 4),
      phase: random(TWO_PI),
      freq: random(0.01, 0.04),
      noiseOff: random(1000)
    });
  }
}

function draw() {
  // Deep dark gradient background
  let cx = width / 2;
  let cy = height / 2;
  
  // Radial vignette — dark center, darker edges
  for (let r = max(width, height); r > 0; r -= 40) {
    noStroke();
    fill(230, 30, 8, map(r, 0, max(width, height), 8, 0));
    ellipse(cx, cy, r * 2, r * 2);
  }
  
  t += 0.012;
  
  // Center convergence point
  let targetX = cx;
  let targetY = cy;
  
  for (let p of particles) {
    // Perlin noise flow field
    let angle = noise(p.x * 0.003, p.y * 0.003, t * 0.5 + p.noiseOff) * TWO_PI * 2;
    
    // Attraction to center increases with time
    let attractStrength = 0.008 + sin(t * 0.3 + p.phase) * 0.003;
    let dx = targetX - p.x;
    let dy = targetY - p.y;
    let d = sqrt(dx * dx + dy * dy);
    
    // Flow field influence
    p.vx += cos(angle) * 0.15;
    p.vy += sin(angle) * 0.15;
    
    // Central attraction
    if (d > 5) {
      p.vx += (dx / d) * attractStrength;
      p.vy += (dy / d) * attractStrength;
    }
    
    // Damping
    p.vx *= 0.92;
    p.vy *= 0.92;
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Wrap edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Glow pulse
    let pulse = 0.6 + sin(t * 1.5 + p.phase) * 0.4;
    let bri = 60 + sin(t * 0.8 + p.phase) * 30;
    
    noStroke();
    fill(p.hue, 70, bri * pulse, 20);
    ellipse(p.x, p.y, p.size * 3.5, p.size * 3.5);
    fill(p.hue, 60, bri * pulse, 50);
    ellipse(p.x, p.y, p.size * 1.8, p.size * 1.8);
    fill(p.hue, 30, 95, 85);
    ellipse(p.x, p.y, p.size * 0.7, p.size * 0.7);
  }
  
  // Connection lines between nearby particles
  strokeWeight(0.4);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 60) {
        let alpha = map(d, 0, 60, 25, 0);
        stroke(140, 40, 60, alpha);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  
  // Center glow — the "meaning" at the core
  let glowPulse = 0.7 + sin(t * 1.2) * 0.3;
  noStroke();
  for (let r = 50; r > 0; r -= 5) {
    let alpha = map(r, 0, 50, 20, 0) * glowPulse;
    fill(50, 60, 90, alpha);
    ellipse(cx, cy, r * 2, r * 2);
  }
  
  // Center dot — the fish that thinks the meaning of life is food
  fill(48, 80, 100, 90);
  ellipse(cx, cy, 5, 5);
}
