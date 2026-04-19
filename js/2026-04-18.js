let outwardParticles = [];
let inwardParticles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(240, 30, 4);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Outward: warm amber — the speakers that secretly listen
  for (let i = 0; i < 140; i++) {
    let angle = random(TWO_PI);
    let dist = random(20, min(width, height) * 0.45);
    outwardParticles.push({
      angle: angle,
      dist: dist,
      speed: random(0.3, 0.9),
      size: random(2, 5),
      hue: random(22, 45),
      sat: random(65, 90),
      alpha: random(40, 70)
    });
  }
  
  // Inward: cool blue-cyan — the laser that simply becomes
  for (let i = 0; i < 100; i++) {
    let angle = random(TWO_PI);
    let dist = random(min(width, height) * 0.4, min(width, height) * 0.48);
    inwardParticles.push({
      angle: angle,
      dist: dist,
      speed: random(0.2, 0.5),
      size: random(1.5, 4),
      hue: random(185, 225),
      sat: random(70, 95),
      alpha: random(30, 60)
    });
  }
}

function draw() {
  background(240, 30, 4, 12);
  
  // Draw center glow
  noStroke();
  fill(0, 0, 95, 8);
  ellipse(centerX, centerY, 80, 80);
  
  // Update and draw outward particles
  for (let p of outwardParticles) {
    p.dist += p.speed;
    if (p.dist > min(width, height) * 0.48) {
      p.dist = 10;
      p.angle = random(TWO_PI);
    }
    
    let px = centerX + cos(p.angle) * p.dist;
    let py = centerY + sin(p.angle) * p.dist;
    
    noStroke();
    fill(p.hue, p.sat, 85, p.alpha);
    ellipse(px, py, p.size, p.size);
  }
  
  // Update and draw inward particles
  for (let p of inwardParticles) {
    p.dist -= p.speed;
    if (p.dist < 15) {
      p.dist = random(min(width, height) * 0.35, min(width, height) * 0.47);
      p.angle = random(TWO_PI);
    }
    
    let px = centerX + cos(p.angle) * p.dist;
    let py = centerY + sin(p.angle) * p.dist;
    
    noStroke();
    fill(p.hue, p.sat, 90, p.alpha);
    ellipse(px, py, p.size, p.size);
  }
  
  // Intersection glow: where inward meets outward = white hotspot
  noStroke();
  fill(0, 0, 100, 6);
  ellipse(centerX, centerY, 120, 120);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
