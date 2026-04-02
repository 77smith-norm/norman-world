// Norman World — 2026-04-01
// Theme: They lit the candle knowing what could go wrong, and Integrity drew power in the dark
// Inspired by: Artemis II launch; EmDash plugin security; Steam on Linux 5%
// ABSTRACT ART — no Norm, no characters, no mascots

let time = 0;
let launchParticles = [];
let ringParticles = [];
let solarParticles = [];
let starField = [];
let solarX, solarY;
let launchPulse = 0;
let ignitionFlash = 255;
let ringCount = 12;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  solarX = width * 0.5;
  solarY = height * 0.5;
  
  // Star field
  for (let i = 0; i < 200; i++) {
    starField.push({
      x: random(width),
      y: random(height * 0.8),
      size: random(0.5, 2.5),
      twinkle: random(TWO_PI),
      speed: random(0.01, 0.04)
    });
  }
  
  // Launch trail particles — golden embers streaming from ignition
  for (let i = 0; i < 300; i++) {
    launchParticles.push({
      x: width * 0.5,
      y: height * 0.88,
      vx: random(-0.8, 0.8),
      vy: random(-3.5, -1.5),
      size: random(1.5, 5),
      alpha: random(50, 90),
      life: random(0.3, 1),
      decay: random(0.01, 0.03),
      hue: random(35, 55)
    });
  }
  
  // Expansion rings from launch
  for (let i = 0; i < ringCount; i++) {
    ringParticles.push({
      progress: i / ringCount,
      speed: 0.008 + i * 0.001,
      alpha: 0
    });
  }
  
  // Solar wind particles — streaming from the sun toward deep space
  for (let i = 0; i < 180; i++) {
    let angle = random(TWO_PI);
    let dist = random(60, 200);
    solarParticles.push({
      x: solarX + cos(angle) * dist,
      y: solarY + sin(angle) * dist,
      vx: 0,
      vy: 0,
      baseAngle: atan2(solarY - (solarY + sin(angle) * dist), solarX - (solarX + cos(angle) * dist)),
      speed: random(0.4, 1.8),
      size: random(1, 3.5),
      alpha: random(20, 55),
      hue: random(190, 240)
    });
  }
}

function draw() {
  // Deep space background
  background(220, 40, 3, 100);
  time += 0.01;
  launchPulse += 0.03;
  
  // ===== STAR FIELD =====
  noStroke();
  for (let s of starField) {
    s.twinkle += s.speed;
    let flicker = sin(s.twinkle) * 0.5 + 0.5;
    fill(220, 10, 90, 40 + flicker * 50);
    circle(s.x, s.y, s.size);
  }
  
  // ===== IGNITION FLASH =====
  if (ignitionFlash > 0) {
    noStroke();
    fill(45, 60, 100, ignitionFlash * 0.15);
    rect(0, 0, width, height);
    ignitionFlash -= 8;
  }
  
  // ===== EXPANSION RINGS =====
  for (let r of ringParticles) {
    r.progress += r.speed;
    let radius = r.progress * 400;
    let alpha = max(0, (1 - r.progress) * 40);
    noFill();
    stroke(45, 50, 80, alpha);
    strokeWeight(1);
    circle(width * 0.5, height * 0.88, radius * 2);
  }
  
  // ===== LAUNCH TRAIL PARTICLES =====
  for (let p of launchParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx += random(-0.05, 0.05);
    p.vy += 0.02; // slight gravity
    p.life -= p.decay;
    p.alpha = p.life * 80;
    
    if (p.life <= 0 || p.y < 0) {
      p.x = width * 0.5 + random(-15, 15);
      p.y = height * 0.88 + random(-5, 5);
      p.vx = random(-0.8, 0.8);
      p.vy = random(-3.5, -1.5);
      p.life = random(0.4, 1);
      p.alpha = p.life * 80;
    }
    
    noStroke();
    fill(p.hue, 60, 90, p.alpha);
    circle(p.x, p.y, p.size);
  }
  
  // ===== THE MOON (crescent) =====
  let moonX = width * 0.72;
  let moonY = height * 0.3;
  let moonR = 70;
  
  // Moon glow
  for (let r = moonR * 3; r > moonR; r -= 8) {
    noStroke();
    fill(210, 30, 20, 3 + sin(launchPulse + r * 0.05) * 1);
    circle(moonX, moonY, r);
  }
  
  // Moon crescent (mask trick)
  noStroke();
  fill(40, 15, 92, 95);
  circle(moonX, moonY, moonR * 2);
  fill(220, 40, 3);
  circle(moonX + moonR * 0.55, moonY - moonR * 0.1, moonR * 1.9);
  
  // ===== SOLAR WIND PARTICLES =====
  for (let p of solarParticles) {
    // Push away from the sun
    let dx = p.x - solarX;
    let dy = p.y - solarY;
    let d = sqrt(dx * dx + dy * dy);
    if (d > 20) {
      let force = 0.06 / (d * 0.01 + 0.5);
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    }
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.x += p.vx;
    p.y += p.vy;
    
    // Reset if too far
    if (d > 500) {
      let angle = random(TWO_PI);
      let dist = random(80, 150);
      p.x = solarX + cos(angle) * dist;
      p.y = solarY + sin(angle) * dist;
      p.vx = 0;
      p.vy = 0;
    }
    
    noStroke();
    let speed = sqrt(p.vx * p.vx + p.vy * p.vy);
    let hueShift = map(speed, 0, 2, 0, 30);
    fill((p.hue + hueShift) % 360, 50, 80, p.alpha);
    circle(p.x, p.y, p.size);
  }
  
  // ===== THE SUN (Orion spacecraft named Integrity) =====
  let sunPulse = sin(launchPulse * 1.5) * 0.3 + 0.7;
  
  // Solar corona
  for (let r = 60; r > 0; r -= 6) {
    noStroke();
    fill(45, 70, 90, sunPulse * 8 * (1 - r / 60));
    circle(solarX, solarY, r);
  }
  
  // Solar surface
  fill(42, 80, 100, 95);
  circle(solarX, solarY, 28);
  
  // Bright core
  fill(50, 30, 100, 90);
  circle(solarX, solarY, 14);
  
  // Label
  noStroke();
  fill(45, 60, 80, 30 + sin(launchPulse) * 15);
  textSize(7);
  textAlign(CENTER, TOP);
  text('ORION · INTEGRITY', solarX, solarY + 20);
  
  // ===== LAUNCH POINT GLOW =====
  let launchGlow = sin(launchPulse * 2) * 0.2 + 0.8;
  for (let r = 40; r > 0; r -= 5) {
    noStroke();
    fill(30, 80, 80, launchGlow * 12 * (1 - r / 40));
    circle(width * 0.5, height * 0.88, r);
  }
  
  // ===== TRAJECTORY ARC (dotted line to moon) =====
  let arcPulse = time * 30;
  noFill();
  stroke(45, 40, 60, 20 + sin(launchPulse * 0.5) * 10);
  strokeWeight(0.8);
  drawingContext.beginPath();
  drawingContext.moveTo(width * 0.5, height * 0.88);
  drawingContext.bezierCurveTo(
    width * 0.3, height * 0.5,
    width * 0.55, height * 0.3,
    moonX, moonY
  );
  drawingContext.stroke();
  
  // Animated dots along trajectory
  for (let i = 0; i < 5; i++) {
    let t = ((arcPulse / 200 + i * 0.2) % 1);
    let tx = bezierPoint(width * 0.5, width * 0.3, width * 0.55, moonX, t);
    let ty = bezierPoint(height * 0.88, height * 0.5, height * 0.3, moonY, t);
    noStroke();
    fill(45, 60, 80, 40);
    circle(tx, ty, 2);
  }
  
  // ===== EARTH GLOW (bottom) =====
  let earthY = height + 30;
  for (let r = 300; r > 0; r -= 15) {
    noStroke();
    fill(210, 60, 30, 2.5 * (1 - r / 300));
    ellipse(width * 0.5, earthY, r * 3, r);
  }
  
  // Caption
  noStroke();
  fill(0, 0, 35, 55);
  textSize(8);
  textAlign(CENTER, TOP);
  text('April 1, 2026', width / 2, height - 14);
}
