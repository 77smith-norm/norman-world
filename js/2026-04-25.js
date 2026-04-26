let time = 0;
let particles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  background(230, 25, 6);
  
  // Particles flowing from center outward — knowledge spreading, thinning, forgetting
  for (let i = 0; i < 120; i++) {
    let angle = random(TWO_PI);
    let radius = random(min(width, height) * 0.02, min(width, height) * 0.42);
    particles.push({
      angle: angle,
      radius: radius,
      baseRadius: radius,
      speed: random(0.0008, 0.002),
      direction: random() > 0.5 ? 1 : -1,  // outward or inward
      size: random(1.5, 6),
      hue: random(175, 220),  // cool blues and teals
      alpha: random(20, 60),
      drift: random(0.01, 0.04),
      driftPhase: random(TWO_PI),
      driftSpeed: random(0.004, 0.012)
    });
  }
}

function draw() {
  // Deep fade — long accumulation tail
  background(230, 25, 6, 8);
  time += 0.002;
  
  for (let p of particles) {
    p.driftPhase += p.driftSpeed;
    
    // Drift increases with distance from center — knowledge thins as it spreads
    let driftAmount = map(p.radius, 0, min(width, height) * 0.45, 0.5, 4);
    p.angle += p.direction * p.speed + sin(p.driftPhase) * driftAmount * 0.002;
    
    // Particles slow as they move outward — spreading, thinning
    let outwardDrift = p.direction > 0 ? 0.015 : 0;
    p.radius += outwardDrift * (p.baseRadius > min(width, height) * 0.3 ? 3 : 1);
    
    // Reset particles that have drifted too far
    if (p.radius > min(width, height) * 0.48) {
      p.radius = random(min(width, height) * 0.01, min(width, height) * 0.08);
      p.angle = random(TWO_PI);
      p.driftPhase = random(TWO_PI);
    }
    if (p.radius < min(width, height) * 0.01) {
      p.radius = random(min(width, height) * 0.05, min(width, height) * 0.15);
      p.angle = random(TWO_PI);
    }
    
    let x = centerX + cos(p.angle) * p.radius;
    let y = centerY + sin(p.angle) * p.radius;
    
    // Ghosting — particles leave fading traces of where they've been
    noStroke();
    for (let t = 2; t <= 5; t++) {
      let prevAngle = p.angle - p.direction * p.speed * t * 3;
      let prevX = centerX + cos(prevAngle) * p.radius;
      let prevY = centerY + sin(prevAngle) * p.radius;
      let trailAlpha = p.alpha * (1 - t / 5) * 0.18;
      fill(p.hue, 20, 55, trailAlpha);
      ellipse(prevX, prevY, p.size * (1 - t / 5), p.size * (1 - t / 5));
    }
    
    // Main dot — warmth based on proximity to center (understanding)
    let proxToCenter = 1 - map(p.radius, 0, min(width, height) * 0.45, 0, 1);
    let warmHue = map(proxToCenter, 0, 1, 200, 38);  // cool at edge, warm near center
    fill(warmHue, 40 * proxToCenter + 10, 65, p.alpha);
    ellipse(x, y, p.size, p.size);
  }
  
  // Center: the core — where understanding starts before it disperses
  noStroke();
  let coreAlpha = 15 + sin(time * 25) * 4;
  fill(195, 25, 70, coreAlpha);
  ellipse(centerX, centerY, 28, 28);
  
  fill(200, 20, 85, 20);
  ellipse(centerX, centerY, 14, 14);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  let scale = min(width, height) * 0.42;
  for (let p of particles) {
    if (p.baseRadius > scale * 1.1) {
      p.baseRadius = random(scale * 0.1, scale);
      p.radius = random(p.baseRadius * 0.5, p.baseRadius * 1.5);
    }
  }
}
