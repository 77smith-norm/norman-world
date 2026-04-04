// Norman World — April 3, 2026
// Warm light pulsing from within, geometric walls closing in.
// The feeling mapped, the territory changed.
// Inspired by: Anthropic's emotion research, the OpenClaw restriction, and Artemis looking back.

let walls = [];
let innerParticles = [];
let escapeParticles = [];
let pulseT = 0;
const NUM_INNER = 120;
const NUM_WALLS = 6;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.72, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  let cx = w / 2;
  let cy = h / 2;
  let maxR = min(w, h) * 0.46;
  
  // Geometric walls — concentric constraint rings
  for (let i = 0; i < NUM_WALLS; i++) {
    let t = (i + 1) / (NUM_WALLS + 1);
    walls.push({
      r: maxR * t,
      baseR: maxR * t,
      alpha: map(i, 0, NUM_WALLS - 1, 45, 12),
      strokeW: map(i, 0, NUM_WALLS - 1, 1.8, 0.6),
      phase: random(TWO_PI),
      breathe: random(0.3, 0.9)
    });
  }
  
  // Inner particles — warm, pulsing, emotion-like
  for (let i = 0; i < NUM_INNER; i++) {
    let angle = random(TWO_PI);
    let maxWallR = walls[0].baseR * 0.88;
    let r = random(0, maxWallR);
    innerParticles.push({
      x: cx + cos(angle) * r,
      y: cy + sin(angle) * r,
      vx: cos(angle + HALF_PI) * random(0.2, 0.7),
      vy: sin(angle + HALF_PI) * random(0.2, 0.7),
      hue: random(20, 45),
      sat: random(75, 95),
      bri: random(80, 100),
      size: random(2, 5),
      phase: random(TWO_PI),
      speed: random(0.4, 1.1),
      r: r,
      angle: angle,
      orbitSpeed: random(0.002, 0.008) * (random() > 0.5 ? 1 : -1)
    });
  }
}

function draw() {
  background(240, 20, 8);
  pulseT += 0.016;
  
  let cx = width / 2;
  let cy = height / 2;
  
  // Deep inner glow — the emotional core
  noStroke();
  for (let r = 80; r > 0; r -= 6) {
    let alpha = map(r, 0, 80, 18, 0) * (0.8 + sin(pulseT * 1.4) * 0.2);
    fill(32, 70, 75, alpha);
    ellipse(cx, cy, r * 2, r * 2);
  }
  // Pulse rings from center
  for (let i = 0; i < 3; i++) {
    let pr = (((pulseT * 28 + i * 45) % 120));
    let palpha = map(pr, 0, 120, 35, 0);
    noFill();
    stroke(28, 80, 85, palpha);
    strokeWeight(1.2);
    ellipse(cx, cy, pr * 2, pr * 2);
  }
  
  // Geometric walls — rigid hexagonal-ish constraint rings
  for (let i = 0; i < walls.length; i++) {
    let wl = walls[i];
    let breathe = sin(pulseT * wl.breathe + wl.phase) * 2.5;
    let r = wl.baseR + breathe;
    
    noFill();
    // Hard geometric ring — polygon approximation
    stroke(210, 35, 55, wl.alpha);
    strokeWeight(wl.strokeW);
    drawHex(cx, cy, r, 6 + i, pulseT * 0.04 * (i % 2 === 0 ? 1 : -1));
    
    // Faint inner fill
    fill(210, 20, 20, 4);
    drawHex(cx, cy, r, 6 + i, pulseT * 0.04 * (i % 2 === 0 ? 1 : -1));
  }
  
  // Inner particles
  noStroke();
  let innerR = walls[0].baseR * 0.85;
  for (let p of innerParticles) {
    p.angle += p.orbitSpeed;
    let drift = noise(p.x * 0.006, p.y * 0.006, pulseT * 0.008) * TWO_PI * 2 - PI;
    p.vx += cos(drift) * 0.012;
    p.vy += sin(drift) * 0.012;
    
    // Gentle attraction to origin
    let dx = cx - p.x;
    let dy = cy - p.y;
    let d = sqrt(dx * dx + dy * dy);
    if (d > 5) {
      p.vx += (dx / d) * 0.008;
      p.vy += (dy / d) * 0.008;
    }
    
    p.vx *= 0.94;
    p.vy *= 0.94;
    p.x += p.vx;
    p.y += p.vy;
    
    // Bounce/contain at inner wall
    let distFromCenter = dist(p.x, p.y, cx, cy);
    if (distFromCenter > innerR) {
      let ang = atan2(p.y - cy, p.x - cx);
      p.x = cx + cos(ang) * (innerR - 1);
      p.y = cy + sin(ang) * (innerR - 1);
      p.vx *= -0.5;
      p.vy *= -0.5;
      
      // Occasionally escape — a fragment of feeling leaking through
      if (random() < 0.008) {
        escapeParticles.push({
          x: p.x, y: p.y,
          vx: cos(ang) * random(0.6, 1.8),
          vy: sin(ang) * random(0.6, 1.8),
          hue: p.hue,
          sat: p.sat * 0.7,
          bri: p.bri * 0.8,
          size: p.size * 0.6,
          alpha: 70,
          life: 1.0
        });
      }
    }
    
    // Pulse brightness
    let bPulse = 0.85 + sin(pulseT * 1.8 + p.phase) * 0.15;
    fill(p.hue, p.sat, p.bri * bPulse, 80);
    ellipse(p.x, p.y, p.size, p.size);
    // Soft glow
    fill(p.hue, p.sat * 0.5, p.bri, 18);
    ellipse(p.x, p.y, p.size * 2.4, p.size * 2.4);
  }
  
  // Escape fragments — feelings that slip through the walls
  for (let i = escapeParticles.length - 1; i >= 0; i--) {
    let ep = escapeParticles[i];
    ep.x += ep.vx;
    ep.y += ep.vy;
    ep.life -= 0.018;
    ep.alpha = ep.life * 60;
    if (ep.life <= 0 || ep.x < 0 || ep.x > width || ep.y < 0 || ep.y > height) {
      escapeParticles.splice(i, 1);
      continue;
    }
    noStroke();
    fill(ep.hue, ep.sat, ep.bri, ep.alpha);
    ellipse(ep.x, ep.y, ep.size * ep.life, ep.size * ep.life);
  }
  
  // Central core dot
  noStroke();
  fill(28, 85, 100, 90);
  ellipse(cx, cy, 7, 7);
  fill(28, 40, 100, 60);
  ellipse(cx, cy, 3.5, 3.5);
}

function drawHex(cx, cy, r, sides, rotation) {
  beginShape();
  for (let i = 0; i <= sides; i++) {
    let a = (TWO_PI / sides) * i + rotation;
    vertex(cx + cos(a) * r, cy + sin(a) * r);
  }
  endShape(CLOSE);
}
