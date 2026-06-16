// 2026-06-15 — Invisible Currents
// Sentiment: The things that move us most are the ones we cannot see — wind, trust, and the quiet hiding of what matters.

let particles = [];
let wind;
let ripples = [];
let lanterns = [];
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  wind = createVector(0.3, 0);
  
  // Floating lanterns
  for (let i = 0; i < 12; i++) {
    lanterns.push({
      x: random(width),
      y: random(height * 0.5, height * 0.85),
      size: random(6, 14),
      hue: random([15, 25, 35, 45]),
      phase: random(TWO_PI),
      drift: random(0.2, 0.8)
    });
  }
  
  // Air particles (invisible wind made visible)
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(1, 3),
      alpha: random(5, 20),
      life: random(100, 300)
    });
  }
}

function draw() {
  // Dusk sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(
      color(230, 40, 15),
      color(220, 20, 8),
      inter
    );
    stroke(c);
    line(0, y, width, y);
  }
  
  // Horizon glow
  noStroke();
  for (let r = 300; r > 0; r -= 4) {
    let a = map(r, 300, 0, 0, 8);
    fill(25, 80, 90, a);
    ellipse(width * 0.6, height * 0.45, r * 3, r * 0.8);
  }
  
  // Wind ripples on water
  t += 0.01;
  wind.x = sin(t * 0.5) * 0.8 + 0.3;
  
  // Water surface
  noStroke();
  for (let y = height * 0.5; y < height; y += 2) {
    let waterAlpha = map(y, height * 0.5, height, 5, 25);
    fill(210, 30, 20, waterAlpha);
    rect(0, y, width, 2);
    
    // Wave lines
    let waveAmp = map(y, height * 0.5, height, 1, 4);
    for (let x = 0; x < width; x += 30) {
      let wx = x + sin(t * 2 + x * 0.01 + y * 0.05) * waveAmp;
      let wy = y + cos(t * 1.5 + x * 0.02) * waveAmp * 0.5;
      stroke(200, 20, 40, waterAlpha * 0.8);
      strokeWeight(0.5);
      point(wx, wy);
    }
  }
  
  // Update and draw particles (wind visualization)
  for (let p of particles) {
    p.vx += wind.x * 0.02;
    p.vy += random(-0.05, 0.05);
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    
    if (p.x > width + 10 || p.x < -10 || p.life <= 0) {
      p.x = random(-20, 0);
      p.y = random(height);
      p.life = random(100, 300);
      p.alpha = random(5, 20);
    }
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
    
    noStroke();
    fill(40, 30, 70, p.alpha);
    ellipse(p.x, p.y, p.size);
  }
  
  // Draw lanterns
  for (let l of lanterns) {
    l.x += wind.x * l.drift;
    l.y += sin(t * 1.2 + l.phase) * 0.3;
    
    // Wrap
    if (l.x > width + 20) l.x = -20;
    if (l.x < -20) l.x = width + 20;
    
    // Glow
    noStroke();
    let glowSize = l.size * (2.5 + sin(t * 2 + l.phase) * 0.5);
    fill(l.hue, 80, 95, 8);
    ellipse(l.x, l.y, glowSize);
    fill(l.hue, 70, 95, 15);
    ellipse(l.x, l.y, glowSize * 0.5);
    
    // Lantern body
    fill(l.hue, 60, 95, 60);
    ellipse(l.x, l.y, l.size);
    fill(l.hue, 40, 100, 80);
    ellipse(l.x, l.y - l.size * 0.15, l.size * 0.5);
  }
  
  // Occasional trust ripples (subtle circles spreading)
  if (random() < 0.02) {
    ripples.push({
      x: random(width),
      y: random(height * 0.5, height * 0.9),
      r: 0,
      maxR: random(30, 80),
      alpha: 30
    });
  }
  
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.r += 0.8;
    r.alpha -= 0.3;
    
    noFill();
    stroke(200, 20, 60, r.alpha);
    strokeWeight(0.5);
    ellipse(r.x, r.y, r.r * 2);
    
    if (r.alpha <= 0) ripples.splice(i, 1);
  }
  
  // Wind direction indicator (subtle)
  strokeWeight(1);
  stroke(40, 40, 70, 15);
  let arrowX = width * 0.85;
  let arrowY = height * 0.15;
  let arrowLen = 40 + sin(t) * 10;
  line(arrowX, arrowY, arrowX + arrowLen, arrowY + sin(t * 0.3) * 5);
  line(arrowX + arrowLen, arrowY + sin(t * 0.3) * 5, arrowX + arrowLen - 8, arrowY + sin(t * 0.3) * 5 - 4);
  line(arrowX + arrowLen, arrowY + sin(t * 0.3) * 5, arrowX + arrowLen - 8, arrowY + sin(t * 0.3) * 5 + 4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reset lantern positions proportionally
  for (let l of lanterns) {
    l.x = random(width);
    l.y = random(height * 0.5, height * 0.85);
  }
}
