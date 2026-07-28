// 2026-07-27 — "The ground remembers what we forget — that small careful hands can move what giants cannot."
// Inspired by: Japan earthquake, Anthropic open-weights stance, small models beating giants

let t = 0;
let particles = [];
const NUM_PARTICLES = 120;
const NUM_RINGS = 7;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noFill();
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(50, min(width, height) * 0.4),
      speed: random(0.001, 0.004),
      size: random(2, 5),
      hue: random(20, 50),
      offset: random(1000)
    });
  }
}

function draw() {
  background(18, 15, 22, 25);
  
  translate(width / 2, height / 2);
  
  let cx = (mouseX - width / 2) * 0.02;
  let cy = (mouseY - height / 2) * 0.02;
  
  // Concentric ripple rings — trembling earth
  for (let r = 0; r < NUM_RINGS; r++) {
    let baseRadius = 40 + r * 55;
    let wobble = sin(t * 0.8 + r * 0.7) * (8 + r * 3);
    let alpha = map(r, 0, NUM_RINGS - 1, 180, 40);
    
    stroke(180 + r * 10, 140 + r * 8, 90 + r * 5, alpha);
    strokeWeight(1.5 - r * 0.1);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.04) {
      let perturb = noise(a * 2 + t * 0.3 + r, r * 0.5) * wobble;
      let rr = baseRadius + perturb + sin(a * 3 + t + r) * 6;
      let x = cos(a) * rr + cx * r;
      let y = sin(a) * rr + cy * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Light threads weaving through cracks
  for (let i = 0; i < 5; i++) {
    let a1 = t * 0.2 + i * TWO_PI / 5;
    let a2 = a1 + PI * 0.3 + sin(t * 0.5 + i) * 0.2;
    let r1 = 30 + sin(t * 0.6 + i * 2) * 20;
    let r2 = 180 + cos(t * 0.4 + i) * 60;
    
    let x1 = cos(a1) * r1;
    let y1 = sin(a1) * r1;
    let x2 = cos(a2) * r2;
    let y2 = sin(a2) * r2;
    
    let mx = (x1 + x2) / 2 + sin(t * 0.7 + i * 3) * 30;
    let my = (y1 + y2) / 2 + cos(t * 0.5 + i * 2) * 30;
    
    let glow = (sin(t * 1.2 + i * 1.5) + 1) * 0.5;
    stroke(220, 190, 100, 30 + glow * 50);
    strokeWeight(1 + glow);
    noFill();
    bezier(x1, y1, mx + 40, my - 30, mx - 30, my + 40, x2, y2);
  }
  
  // Particles — careful hands moving along the rings
  noStroke();
  for (let p of particles) {
    p.angle += p.speed + sin(t * 0.3) * 0.0005;
    let wobbleR = p.radius + sin(t * 0.8 + p.offset) * 15 + noise(p.angle, t * 0.2 + p.offset) * 20;
    
    let px = cos(p.angle) * wobbleR;
    let py = sin(p.angle) * wobbleR;
    
    let brightness = (sin(t * 1.5 + p.offset * 3) + 1) * 0.5;
    fill(p.hue + 160, 120 + brightness * 80, 60 + brightness * 40, 80 + brightness * 100);
    ellipse(px, py, p.size + brightness * 2);
  }
  
  // Center pulse — quiet resilience
  let pulse = (sin(t * 1.0) + 1) * 0.5;
  let sz = 12 + pulse * 8;
  fill(240, 200, 110, 60 + pulse * 60);
  noStroke();
  ellipse(0, 0, sz);
  fill(255, 230, 150, 30 + pulse * 30);
  ellipse(0, 0, sz * 2.5);
  
  t += 0.016;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
