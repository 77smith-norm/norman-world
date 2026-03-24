// Norman World — 2026-03-23
// Theme: Intelligence compressed into the palm of your hand
// Inspired by: iPhone 17 Pro running a 400B parameter model

let particles = [];
let centerX, centerY;
let phoneImg;
let pulse = 0;
let hueShift = 0;

function setup() {
  let canvas = createCanvas(720, 400);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width * 0.22;
  centerY = height * 0.5;
  
  for (let i = 0; i < 280; i++) {
    spawnParticle();
  }
}

function spawnParticle() {
  let angle = random(TWO_PI);
  let r = random(60, 380);
  let x = centerX + cos(angle) * r;
  let y = centerY + sin(angle) * r;
  
  particles.push({
    x: x,
    y: y,
    originX: x,
    originY: y,
    size: random(1.5, 5),
    speed: random(0.004, 0.018),
    phase: random(TWO_PI),
    hue: random(180, 280),
    orbitPhase: random(TWO_PI),
    orbitSpeed: random(0.003, 0.012),
    orbitR: random(15, 70)
  });
}

function draw() {
  background(240, 15, 6);
  hueShift += 0.15;
  pulse += 0.04;
  
  // Gravity toward phone center
  for (let p of particles) {
    p.orbitPhase += p.orbitSpeed;
    
    // Spiral inward
    let targetX = centerX + cos(p.orbitPhase) * p.orbitR;
    let targetY = centerY + sin(p.orbitPhase) * p.orbitR;
    
    let dx = targetX - p.x;
    let dy = targetY - p.y;
    
    p.x += dx * 0.04;
    p.y += dy * 0.04;
    
    // Reset when too close to center
    let distToCenter = dist(p.x, p.y, centerX, centerY);
    if (distToCenter < 8) {
      let angle = random(TWO_PI);
      let r = random(250, 350);
      p.x = centerX + cos(angle) * r;
      p.y = centerY + sin(angle) * r;
      p.orbitPhase = random(TWO_PI);
      p.orbitR = random(15, 70);
    }
    
    // Draw particle
    let brightness = map(distToCenter, 8, 350, 90, 20);
    let alphaVal = map(distToCenter, 8, 350, 85, 30);
    let h = (p.hue + hueShift) % 360;
    
    noStroke();
    fill(h, 60, brightness, alphaVal);
    circle(p.x, p.y, p.size * 2);
    
    // Trail
    stroke(h, 50, brightness * 0.6, 15);
    strokeWeight(0.8);
    line(p.x, p.y, p.x - dx * 3, p.y - dy * 3);
  }
  
  // Phone silhouette
  noStroke();
  fill(0, 0, 8);
  rectMode(CENTER);
  let phoneW = 48, phoneH = 96;
  roundRect(centerX - phoneW/2, centerY - phoneH/2, phoneW, phoneH, 8);
  
  // Screen glow
  let glowPulse = sin(pulse) * 0.3 + 0.7;
  fill(200, 80, 95, 40 * glowPulse);
  rect(centerX, centerY, phoneW - 6, phoneH - 8, 4);
  
  // Text label
  noStroke();
  fill(0, 0, 50, 180);
  textSize(9);
  textAlign(CENTER, TOP);
  text('400B', centerX, centerY + phoneH/2 + 6);
  
  // Norm silhouette — watching from the right side
  let normX = width * 0.72;
  let normY = height * 0.5;
  let normSway = sin(pulse * 0.4) * 4;
  
  // Body
  fill(0, 0, 95, 90);
  noStroke();
  ellipse(normX, normY + normSway, 90, 82);
  
  // Eyes
  fill(0, 0, 15);
  ellipse(normX - 14, normY - 10 + normSway, 18, 20);
  ellipse(normX + 14, normY - 10 + normSway, 18, 20);
  
  // Eye sparkle
  fill(30, 60, 100);
  ellipse(normX - 10, normY - 14 + normSway, 6, 6);
  ellipse(normX + 18, normY - 14 + normSway, 6, 6);
  
  // Antenna
  stroke(0, 0, 80);
  strokeWeight(2.5);
  line(normX, normY - 42 + normSway, normX + 8, normY - 62 + normSway);
  
  // Antenna bulb
  noStroke();
  fill(30, 80, 100, 85);
  circle(normX + 8, normY - 64 + normSway, 7);
  
  // Label
  fill(0, 0, 40, 150);
  noStroke();
  textSize(9);
  textAlign(CENTER, TOP);
  text('400B / iPhone 17 Pro', width * 0.22, centerY + phoneH/2 + 18);
}
