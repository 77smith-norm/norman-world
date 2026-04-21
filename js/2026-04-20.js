let state = 'locked'; // locked -> recovering -> open
let stateTimer = 0;
let rings = [];
let particles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(240, 30, 4);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Rings: hexagonal outlines
  for (let i = 0; i < 6; i++) {
    rings.push({
      sides: 6,
      radius: 80 + i * 55,
      rotation: i * (PI / 18),
      rotationSpeed: 0.003 + i * 0.001,
      alpha: 25 + i * 8,
      locked: true
    });
  }
  
  // Particles: hovering just outside
  for (let i = 0; i < 120; i++) {
    particles.push({
      angle: random(TWO_PI),
      dist: random(70, min(width, height) * 0.46),
      speed: random(0.05, 0.2),
      size: random(1.5, 4),
      hue: random(0, 25),
      sat: random(50, 75),
      alpha: random(25, 55),
      waiting: true
    });
  }
}

function draw() {
  background(240, 30, 4, 8);
  
  // State machine: locked -> recovering -> open
  stateTimer++;
  if (state === 'locked' && frameCount > 90) state = 'recovering';
  if (state === 'recovering' && stateTimer > 180) state = 'open';
  
  // Draw rings
  for (let r of rings) {
    r.rotation += r.rotationSpeed * (state === 'locked' ? 0.3 : state === 'recovering' ? 0.7 : 2.5);
    
    let rAlpha = r.alpha;
    if (state === 'locked') rAlpha = r.alpha * 0.35;
    if (state === 'recovering') rAlpha = r.alpha * (0.4 + sin(frameCount * 0.08) * 0.2);
    
    push();
    translate(centerX, centerY);
    rotate(r.rotation);
    noFill();
    stroke(200, 30, 75, rAlpha);
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i < r.sides; i++) {
      let angle = (TWO_PI / r.sides) * i;
      vertex(cos(angle) * r.radius, sin(angle) * r.radius);
    }
    endShape(CLOSE);
    pop();
  }
  
  // Draw particles
  for (let p of particles) {
    p.dist += p.speed;
    if (p.dist > min(width, height) * 0.47) {
      p.dist = 70;
      p.angle = random(TWO_PI);
    }
    
    // Pull inward when open
    if (state === 'open') {
      p.dist -= p.speed * 1.8;
    }
    
    let px = centerX + cos(p.angle) * p.dist;
    let py = centerY + sin(p.angle) * p.dist;
    
    let pAlpha = p.alpha;
    if (state === 'locked') pAlpha = p.alpha * 0.3;
    if (state === 'recovering') pAlpha = p.alpha * (0.5 + sin(frameCount * 0.1 + p.angle) * 0.3);
    
    noStroke();
    fill(p.hue, p.sat, 82, pAlpha);
    ellipse(px, py, p.size, p.size);
  }
  
  // Center: shifts color with state
  noStroke();
  if (state === 'locked') fill(0, 60, 40, 20);
  if (state === 'recovering') fill(45, 80, 90, 15);
  if (state === 'open') fill(140, 60, 95, 12);
  ellipse(centerX, centerY, 80, 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
