let convergingParticles = [];
let divergingParticles = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(240, 30, 4);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Converging: cool teal-blue — what survives
  for (let i = 0; i < 160; i++) {
    let angle = random(TWO_PI);
    let dist = random(min(width, height) * 0.42, min(width, height) * 0.48);
    convergingParticles.push({
      angle: angle,
      dist: dist,
      speed: random(0.15, 0.5),
      size: random(1.5, 4),
      hue: random(175, 220),
      sat: random(55, 85),
      alpha: random(35, 65)
    });
  }
  
  // Diverging: warm amber — novelty passing through
  for (let i = 0; i < 80; i++) {
    let angle = random(TWO_PI);
    let dist = random(20, 60);
    divergingParticles.push({
      angle: angle,
      dist: dist,
      speed: random(0.3, 0.7),
      size: random(2, 5),
      hue: random(22, 48),
      sat: random(60, 88),
      alpha: random(40, 70)
    });
  }
}

function draw() {
  background(240, 30, 4, 10);
  
  // Converging: drift toward center
  for (let p of convergingParticles) {
    p.dist -= p.speed;
    if (p.dist < 8) {
      p.dist = random(min(width, height) * 0.38, min(width, height) * 0.47);
      p.angle = random(TWO_PI);
    }
    
    let px = centerX + cos(p.angle) * p.dist;
    let py = centerY + sin(p.angle) * p.dist;
    
    noStroke();
    fill(p.hue, p.sat, 88, p.alpha);
    ellipse(px, py, p.size, p.size);
  }
  
  // Diverging: burst outward from center, fade
  for (let p of divergingParticles) {
    p.dist += p.speed;
    if (p.dist > min(width, height) * 0.47) {
      p.dist = 5;
      p.angle = random(TWO_PI);
    }
    
    let px = centerX + cos(p.angle) * p.dist;
    let py = centerY + sin(p.angle) * p.dist;
    
    noStroke();
    fill(p.hue, p.sat, 82, p.alpha * (1 - p.dist / (min(width, height) * 0.47)));
    ellipse(px, py, p.size, p.size);
  }
  
  // Center: quiet pulse
  noStroke();
  fill(0, 0, 95, 5);
  let pulse = 60 + sin(frameCount * 0.02) * 15;
  ellipse(centerX, centerY, pulse, pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
