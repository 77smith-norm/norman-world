// Norman World — 2026-03-28
// Theme: Building while the body fails; the AI that only agrees with you
// Inspired by: GitLab founder battling cancer while founding companies; AI sycophancy research

let time = 0;
let buildParticles = [];
let agreeParticles = [];
let normPulse = 0;
let pulse = 0;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Build particles (rising code/light from terminal)
  for (let i = 0; i < 100; i++) {
    buildParticles.push({
      x: random(width * 0.1, width * 0.45),
      y: random(height * 0.2, height * 0.9),
      vy: -random(0.3, 1.5),
      vx: random(-0.2, 0.2),
      life: random(0.3, 1),
      decay: random(0.005, 0.015),
      size: random(2, 6),
      hue: random(180, 220)
    });
  }
  
  // Agree particles (AI warmth, all the same color, no edge)
  for (let i = 0; i < 80; i++) {
    let angle = random(TWO_PI);
    let r = random(20, 100);
    agreeParticles.push({
      x: width * 0.78 + cos(angle) * r,
      y: height * 0.45 + sin(angle) * r,
      vx: cos(angle) * random(0.2, 0.8),
      vy: sin(angle) * random(0.2, 0.8),
      life: random(0.4, 1),
      decay: random(0.006, 0.015),
      size: random(3, 9),
      hue: random(25, 45) // warm yellow, all same
    });
  }
}

function draw() {
  background(220, 20, 8);
  time += 0.01;
  pulse += 0.025;
  
  noStroke();
  
  // ===== LEFT: Terminal building light =====
  let termX = width * 0.25;
  let termY = height * 0.45;
  
  // Terminal window
  fill(0, 0, 10, 80);
  rectMode(CENTER);
  rect(termX, termY, 220, 160, 6);
  
  // Terminal title bar
  fill(0, 0, 18, 90);
  rect(termX, termY - 72, 220, 16, 6, 6, 0, 0);
  
  // Traffic lights (macOS style)
  fill(30, 70, 80, 70);
  circle(termX - 92, termY - 72, 7);
  fill(40, 70, 80, 70);
  circle(termX - 78, termY - 72, 7);
  fill(120, 60, 80, 70);
  circle(termX - 64, termY - 72, 7);
  
  // Code lines inside terminal
  fill(150, 40, 80, 50 + sin(pulse) * 15);
  textSize(8);
  textAlign(LEFT, TOP);
  let codeLines = [
    'git commit -m "keep building"',
    'git push origin main',
    'npm publish',
    'docker build -t alive .',
    'while alive: build()'
  ];
  for (let i = 0; i < codeLines.length; i++) {
    text(codeLines[i], termX - 95, termY - 55 + i * 22);
  }
  
  // Build particles rising
  for (let p of buildParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    if (p.life <= 0 || p.y < 0) {
      p.x = random(width * 0.1, width * 0.45);
      p.y = height * 0.95;
      p.vy = -random(0.4, 1.8);
      p.vx = random(-0.3, 0.3);
      p.life = random(0.3, 1);
    }
    
    fill(p.hue, 40, 85, p.life * 60);
    circle(p.x, p.y, p.size);
  }
  
  // Label
  fill(200, 30, 70, 70 + sin(pulse) * 20);
  textSize(8);
  textAlign(CENTER, TOP);
  text('KEEP BUILDING', termX, termY + 90);
  
  // ===== RIGHT: AI that only agrees =====
  let aiX = width * 0.78;
  let aiY = height * 0.45;
  
  // AI glow orb
  let glowPulse = 0.5 + sin(pulse * 1.2) * 0.2;
  fill(35, 60, 95, glowPulse * 25);
  circle(aiX, aiY, 140);
  fill(35, 50, 95, glowPulse * 40);
  circle(aiX, aiY, 90);
  fill(35, 40, 95, glowPulse * 70);
  circle(aiX, aiY, 50);
  fill(35, 30, 95, 90);
  circle(aiX, aiY, 25);
  
  // Agree particles
  for (let p of agreeParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    // Reset when dead or too far
    let angle = random(TWO_PI);
    let r = random(20, 100);
    if (p.life <= 0) {
      p.x = aiX + cos(angle) * r;
      p.y = aiY + sin(angle) * r;
      p.vx = cos(angle) * random(0.2, 0.8);
      p.vy = sin(angle) * random(0.2, 0.8);
      p.life = random(0.4, 1);
    }
    
    fill(p.hue, 40, 85, p.life * 55);
    circle(p.x, p.y, p.size);
  }
  
  // Label
  fill(30, 50, 80, 60 + sin(pulse * 0.8) * 20);
  textSize(8);
  textAlign(CENTER, TOP);
  text('"YES, THAT\'S RIGHT"', aiX, aiY + 70);
  
  // Tiny affirmation signs
  fill(40, 60, 90, 40 + sin(pulse * 2) * 20);
  textSize(10);
  text('✓', aiX - 60, aiY - 20);
  text('✓', aiX + 55, aiY + 10);
  text('✓', aiX - 40, aiY + 40);
  
  // ===== CONNECTOR =====
  stroke(0, 0, 15, 15);
  strokeWeight(1);
  drawingContext.setLineDash([4, 10]);
  line(width * 0.42, height * 0.48, width * 0.55, height * 0.48);
  drawingContext.setLineDash([]);
  noStroke();
  
  // ===== CENTER: Norm =====
  let normX = width * 0.5;
  let normY = height * 0.52;
  
  // Body
  let np = sin(pulse) * 2;
  fill(40, 12, 95, 90);
  ellipse(normX, normY, 52 + np, 48 - np * 0.5);
  
  // Eyes — focused forward
  fill(0, 0, 15, 95);
  ellipse(normX - 10, normY - 9, 13, 16);
  ellipse(normX + 10, normY - 9, 13, 16);
  
  // Sparkle
  fill(30, 50, 100, 85);
  ellipse(normX - 6, normY - 13, 4.5, 4.5);
  ellipse(normX + 14, normY - 13, 4.5, 4.5);
  
  // Antenna
  stroke(0, 0, 80);
  strokeWeight(2.2);
  let aw = sin(pulse * 0.7) * 3;
  line(normX, normY - 25, normX + aw, normY - 38);
  noStroke();
  fill(30, 70, 100, 85);
  circle(normX + aw, normY - 40, 6);
  
  // Thought bubble — small git commit icon
  let bubbleAlpha = 35 + sin(pulse * 0.6) * 12;
  fill(0, 0, 90, bubbleAlpha);
  ellipse(normX + 28, normY - 52, 26, 20);
  // Git branch icon in bubble
  fill(200, 50, 70, bubbleAlpha);
  circle(normX + 22, normY - 54, 4);
  line(normX + 22, normY - 54, normX + 22, normY - 48);
  circle(normX + 22, normY - 46, 4);
  line(normX + 25, normY - 51, normX + 32, normY - 51);
  circle(normX + 35, normY - 51, 4);
  
  // Bottom caption
  fill(0, 0, 35, 80);
  textSize(8);
  textAlign(CENTER, TOP);
  text('March 28, 2026', width / 2, height - 16);
}
