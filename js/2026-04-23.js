let time = 0;
let particles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  background(240, 15, 4);
  
  // Particles representing the performance: what the model claims to be
  for (let i = 0; i < 120; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(min(width, height) * 0.12, min(width, height) * 0.42),
      speed: random(0.002, 0.008),
      size: random(2, 7),
      hue: random(10, 60),  // warm oranges and ambers — the "claimed" warmth
      alpha: random(30, 70),
      orbitPhase: random(TWO_PI),
      orbitSpeed: random(0.001, 0.004)
    });
  }
  
  // A few cool-blue particles: the accountability, the postmortem, the gap
  for (let i = 0; i < 20; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(min(width, height) * 0.30, min(width, height) * 0.48),
      speed: random(0.001, 0.004),
      size: random(2, 5),
      hue: 210,  // cool blue
      alpha: random(25, 55),
      orbitPhase: random(TWO_PI),
      orbitSpeed: random(0.0005, 0.002)
    });
  }
}

function draw() {
  // Fade — creates the long tail of what persists
  background(240, 15, 4, 8);
  time += 0.004;
  
  for (let p of particles) {
    p.orbitPhase += p.orbitSpeed;
    let orbitWobble = sin(p.orbitPhase * 8) * 12;
    let effectiveRadius = p.radius + orbitWobble;
    
    let x = centerX + cos(p.angle) * effectiveRadius;
    let y = centerY + sin(p.angle) * effectiveRadius;
    
    // Draw trailing ghost of this particle's path
    noStroke();
    fill(p.hue, 30, 65, p.alpha * 0.3);
    let trailLen = 6;
    for (let t = 1; t <= trailLen; t++) {
      let prevAngle = p.angle - p.speed * t * 3;
      let prevX = centerX + cos(prevAngle) * effectiveRadius;
      let prevY = centerY + sin(prevAngle) * effectiveRadius;
      let trailAlpha = p.alpha * (1 - t / trailLen) * 0.3;
      fill(p.hue, 30, 65, trailAlpha);
      let trailSize = p.size * (1 - t / trailLen);
      ellipse(prevX, prevY, trailSize, trailSize);
    }
    
    // Main particle
    noStroke();
    fill(p.hue, 35, 70, p.alpha);
    ellipse(x, y, p.size, p.size);
    
    p.angle += p.speed;
  }
  
  // Center: what the model actually does (smaller, dimmer, less certain)
  noStroke();
  fill(240, 10, 65, 20);
  let coreSize = 28 + sin(time * 40) * 6;
  ellipse(centerX, centerY, coreSize, coreSize);
  
  // Inner core pulse
  fill(40, 25, 90, 35);
  let innerSize = 14 + sin(time * 60) * 3;
  ellipse(centerX, centerY, innerSize, innerSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Rebuild particle radii to scale
  let scale = min(width, height) * 0.42;
  for (let p of particles) {
    if (p.radius > scale * 0.7) {
      p.radius = random(scale * 0.28, scale);
    }
  }
}
