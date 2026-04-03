// Norman World — April 2, 2026
// "The Room" — knowledge at the margins, authority at the center,
// trust evaporating in the space between.
// Inspired by: Azure trust erosion, the engineer who sat quietly at the back.

let particles = [];
let centerPulse = 0;
let repulseWaves = [];
const NUM_KNOWLEDGE = 180;
const NUM_GRAY = 60;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.72, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Knowledge particles at the edges/margins
  for (let i = 0; i < NUM_KNOWLEDGE; i++) {
    let edge = floor(random(4));
    let x, y;
    if (edge === 0) { x = random(20, width * 0.28); y = random(height); }
    else if (edge === 1) { x = random(width * 0.72, width - 20); y = random(height); }
    else if (edge === 2) { x = random(width); y = random(20, height * 0.28); }
    else { x = random(width); y = random(height * 0.72, height - 20); }
    
    particles.push({
      x, y,
      ox: x, oy: y,
      vx: 0, vy: 0,
      hue: random(35, 50),   // amber-gold
      sat: random(70, 90),
      bri: random(75, 95),
      size: random(2.5, 5),
      speed: random(0.3, 0.9),
      decaying: false,
      decayAlpha: 100,
      decayProgress: 0,
      kind: 'knowledge'
    });
  }
  
  // Dissipation particles (gray, drifting downward from center area)
  for (let i = 0; i < NUM_GRAY; i++) {
    let angle = random(TWO_PI);
    let r = random(30, 100);
    particles.push({
      x: width / 2 + cos(angle) * r,
      y: height / 2 + sin(angle) * r,
      ox: width / 2 + cos(angle) * r,
      oy: height / 2 + sin(angle) * r,
      vx: cos(angle + HALF_PI) * random(0.1, 0.4),
      vy: random(0.2, 0.6),
      hue: 220,
      sat: 10,
      bri: random(45, 65),
      size: random(1.5, 3.5),
      speed: 0,
      decaying: false,
      decayAlpha: random(40, 70),
      kind: 'gray',
      yMax: height / 2 + r + random(80, 200)
    });
  }
}

function draw() {
  background(230, 15, 10);
  
  // Faint grid — corporate structure
  stroke(220, 10, 22, 15);
  strokeWeight(0.5);
  let gridStep = 40;
  for (let x = 0; x < width; x += gridStep) line(x, 0, x, height);
  for (let y = 0; y < height; y += gridStep) line(0, y, width, y);
  
  centerPulse += 0.018;
  let cx = width / 2;
  let cy = height / 2;
  
  // Central authority — pulsing deep red
  noFill();
  for (let r = 0; r < 4; r++) {
    let radius = 18 + r * 14 + sin(centerPulse + r * 0.8) * 4;
    let alpha = map(r, 0, 3, 55, 10);
    stroke(355, 85, 70, alpha);
    strokeWeight(1.2);
    ellipse(cx, cy, radius * 2, radius * 2);
  }
  // Core dot
  noStroke();
  fill(355, 88, 85, 90);
  ellipse(cx, cy, 10, 10);
  fill(355, 60, 96, 70);
  ellipse(cx, cy, 5, 5);
  
  // Repulse waves emanating from center
  if (frameCount % 90 === 0) {
    repulseWaves.push({ r: 20, alpha: 60 });
  }
  for (let i = repulseWaves.length - 1; i >= 0; i--) {
    let w = repulseWaves[i];
    w.r += 2.2;
    w.alpha -= 1.2;
    if (w.alpha <= 0) { repulseWaves.splice(i, 1); continue; }
    noFill();
    stroke(210, 25, 55, w.alpha);
    strokeWeight(1);
    ellipse(cx, cy, w.r * 2, w.r * 2);
  }
  
  // Update and draw particles
  for (let p of particles) {
    if (p.kind === 'knowledge') {
      updateKnowledge(p, cx, cy);
    } else {
      updateGray(p, cx, cy);
    }
  }
}

function updateKnowledge(p, cx, cy) {
  let distToCenter = dist(p.x, p.y, cx, cy);
  
  if (!p.decaying) {
    // Drift toward center — gentle pull
    let angle = atan2(cy - p.y, cx - p.x);
    let pull = map(distToCenter, 0, width, 0.06, 0.008);
    p.vx += cos(angle) * pull;
    p.vy += sin(angle) * pull;
    
    // Organic noise drift
    let n = noise(p.x * 0.004, p.y * 0.004, frameCount * 0.007);
    let nAngle = map(n, 0, 1, -PI, PI);
    p.vx += cos(nAngle) * 0.015;
    p.vy += sin(nAngle) * 0.015;
    
    // Repulse from center when close — knowledge rejected
    if (distToCenter < 95) {
      let repulse = map(distToCenter, 0, 95, 0.22, 0.0);
      p.vx += cos(angle + PI) * repulse;
      p.vy += sin(angle + PI) * repulse;
      
      // Begin decaying (turning gray/fragmenting)
      if (distToCenter < 55 && random() < 0.03) {
        p.decaying = true;
      }
    }
    
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.x += p.vx;
    p.y += p.vy;
    
    // Wrap at edges back to margin
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      let edge = floor(random(4));
      if (edge === 0) { p.x = random(20, width * 0.28); p.y = random(height); }
      else if (edge === 1) { p.x = random(width * 0.72, width - 20); p.y = random(height); }
      else if (edge === 2) { p.x = random(width); p.y = random(20, height * 0.28); }
      else { p.x = random(width); p.y = random(height * 0.72, height - 20); }
      p.vx = 0; p.vy = 0;
    }
    
    // Draw — amber gold with halo
    noStroke();
    fill(p.hue, p.sat * 0.4, p.bri, 15);
    ellipse(p.x, p.y, p.size * 2.8, p.size * 2.8);
    fill(p.hue, p.sat, p.bri, 88);
    ellipse(p.x, p.y, p.size, p.size);
    
  } else {
    // Decaying — fragment and drift as gray
    p.decayProgress += 0.018;
    p.x += (random(-1, 1)) * 0.5;
    p.y += 0.4;
    p.decayAlpha -= 1.2;
    let grayBri = map(p.decayProgress, 0, 1, p.bri, 40);
    let graySat = map(p.decayProgress, 0, 1, p.sat, 5);
    noStroke();
    fill(p.hue, graySat, grayBri, p.decayAlpha);
    ellipse(p.x, p.y, p.size * map(p.decayProgress, 0, 1, 1, 0.4), p.size * map(p.decayProgress, 0, 1, 1, 0.4));
    
    // Respawn at margin
    if (p.decayAlpha <= 0 || p.y > height) {
      p.decaying = false;
      p.decayProgress = 0;
      p.decayAlpha = 100;
      let edge = floor(random(4));
      if (edge === 0) { p.x = random(20, width * 0.28); p.y = random(height); }
      else if (edge === 1) { p.x = random(width * 0.72, width - 20); p.y = random(height); }
      else if (edge === 2) { p.x = random(width); p.y = random(20, height * 0.28); }
      else { p.x = random(width); p.y = random(height * 0.72, height - 20); }
      p.vx = 0; p.vy = 0;
    }
  }
}

function updateGray(p, cx, cy) {
  // Drift downward and outward — evaporating capital
  p.x += p.vx + sin(frameCount * 0.012 + p.ox) * 0.12;
  p.y += p.vy;
  
  if (p.y > p.yMax) {
    let angle = random(TWO_PI);
    let r = random(30, 100);
    p.x = cx + cos(angle) * r;
    p.y = cy + sin(angle) * r;
    p.vy = random(0.2, 0.6);
    p.yMax = cy + r + random(80, 200);
  }
  
  noStroke();
  fill(p.hue, p.sat, p.bri, p.decayAlpha * map(p.y, cy, p.yMax, 1, 0.1));
  ellipse(p.x, p.y, p.size, p.size);
}
