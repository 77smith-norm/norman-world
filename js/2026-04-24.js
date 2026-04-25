let time = 0;
let warmParticles = [];
let coolParticles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  background(240, 20, 5);
  
  // Warm particles — the raw material, before self-observation
  for (let i = 0; i < 90; i++) {
    warmParticles.push({
      angle: random(TWO_PI),
      radius: random(min(width, height) * 0.08, min(width, height) * 0.38),
      speed: random(0.003, 0.009),
      size: random(2, 8),
      hue: random(28, 52),  // warm ambers and golds
      alpha: random(35, 75),
      orbitPhase: random(TWO_PI),
      orbitSpeed: random(0.001, 0.003)
    });
  }
  
  // Cool particles — the observing layer, watching and recording
  for (let i = 0; i < 35; i++) {
    coolParticles.push({
      angle: random(TWO_PI),
      radius: random(min(width, height) * 0.28, min(width, height) * 0.48),
      speed: random(-0.002, 0.004),
      size: random(1.5, 4),
      hue: random(185, 225),  // teal to blue
      alpha: random(20, 50),
      orbitPhase: random(TWO_PI),
      orbitSpeed: random(0.0003, 0.001)
    });
  }
}

function draw() {
  // Soft fade — creates the accumulated long-tail
  background(240, 20, 5, 10);
  time += 0.003;
  
  // Draw warm particles
  for (let p of warmParticles) {
    p.orbitPhase += p.orbitSpeed;
    let wobble = sin(p.orbitPhase * 6) * 15;
    let effectiveRadius = p.radius + wobble;
    
    let x = centerX + cos(p.angle) * effectiveRadius;
    let y = centerY + sin(p.angle) * effectiveRadius;
    
    // Ghost trail
    noStroke();
    for (let t = 1; t <= 5; t++) {
      let prevAngle = p.angle - p.speed * t * 2;
      let prevX = centerX + cos(prevAngle) * effectiveRadius;
      let prevY = centerY + sin(prevAngle) * effectiveRadius;
      let trailAlpha = p.alpha * (1 - t / 5) * 0.25;
      fill(p.hue, 25, 60, trailAlpha);
      let trailSize = p.size * (1 - t / 5);
      ellipse(prevX, prevY, trailSize, trailSize);
    }
    
    // Main dot
    noStroke();
    fill(p.hue, 35, 72, p.alpha);
    ellipse(x, y, p.size, p.size);
    
    p.angle += p.speed;
  }
  
  // Draw cool observing particles — wider, slower, steadier
  for (let p of coolParticles) {
    p.orbitPhase += p.orbitSpeed;
    let wobble = sin(p.orbitPhase * 4) * 8;
    let effectiveRadius = p.radius + wobble;
    
    let x = centerX + cos(p.angle) * effectiveRadius;
    let y = centerY + sin(p.angle) * effectiveRadius;
    
    // Thin ring suggesting the observing boundary
    noFill();
    stroke(p.hue, 40, 55, p.alpha * 0.4);
    strokeWeight(0.5);
    ellipse(x, y, p.size * 4, p.size * 4);
    
    // Core dot
    noStroke();
    fill(p.hue, 45, 65, p.alpha);
    ellipse(x, y, p.size, p.size);
    
    p.angle += p.speed;
  }
  
  // Center: the self that watches — warm but dimmer, because observation costs something
  noStroke();
  let coreAlpha = 18 + sin(time * 30) * 5;
  fill(38, 20, 80, coreAlpha);
  ellipse(centerX, centerY, 32, 32);
  
  fill(45, 30, 90, 25);
  ellipse(centerX, centerY, 16, 16);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  let scale = min(width, height) * 0.42;
  for (let p of warmParticles) {
    if (p.radius > scale * 0.7) p.radius = random(scale * 0.18, scale);
  }
  for (let p of coolParticles) {
    if (p.radius < scale * 0.5) p.radius = random(scale * 0.6, scale * 1.1);
  }
}
