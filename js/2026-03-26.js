// Norman World — 2026-03-26
// Theme: End of the expandable era, simultaneous with AI commodification
// Inspired by: Mac Pro discontinuation, $7 IRC AI agent, $500 GPU beating Claude

let time = 0;
let dissolveParticles = [];
let birthParticles = [];
let normX, normY;
let gpuGlow = 0;
let pulse = 0;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  normX = width * 0.5;
  normY = height * 0.52;
  
  // Dissolving Mac Pro particles
  for (let i = 0; i < 180; i++) {
    let angle = random(TWO_PI);
    let r = random(20, 60);
    dissolveParticles.push({
      x: width * 0.22 + cos(angle) * r,
      y: height * 0.45 + sin(angle) * r,
      vx: random(-0.3, 0.3),
      vy: random(-1.5, 0.5),
      life: random(1),
      decay: random(0.003, 0.012),
      size: random(3, 10),
      hue: random(200, 280)
    });
  }
  
  // Birth particles (GPU/AI emergence)
  for (let i = 0; i < 60; i++) {
    birthParticles.push({
      x: random(width * 0.65, width),
      y: random(height),
      vx: random(-2, -0.5),
      vy: random(-0.5, 0.5),
      life: random(1),
      decay: random(0.008, 0.02),
      size: random(2, 6),
      hue: random(40, 80)
    });
  }
}

function draw() {
  background(220, 25, 7);
  time += 0.008;
  pulse += 0.02;
  
  noStroke();
  
  // ===== LEFT: Dissolving Mac Pro silhouette =====
  let macX = width * 0.22;
  let macY = height * 0.48;
  let macW = 50;
  let macH = 75;
  
  // Faint outline of the machine (the "ghost")
  let ghostAlpha = 12 + sin(pulse * 0.5) * 4;
  fill(210, 15, 40, ghostAlpha);
  rectMode(CENTER);
  rect(macX, macY, macW, macH, 4);
  // Grill dots
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      circle(macX - macW/2 + 8 + col * 5, macY - macH/2 + 12 + row * 15, 3);
    }
  }
  // Top handle
  rect(macX, macY - macH/2 - 4, 30, 5, 2);
  rectMode(CORNER);
  
  // Label
  fill(0, 0, 30, 80);
  textSize(8);
  textAlign(CENTER, TOP);
  text('Mac Pro', macX, macY + macH/2 + 6);
  
  // Dissolving particles
  for (let p of dissolveParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    if (p.life <= 0) {
      // Reset
      let angle = random(TWO_PI);
      let r = random(15, 55);
      p.x = macX + cos(angle) * r;
      p.y = macY + sin(angle) * r;
      p.vx = random(-0.4, 0.4);
      p.vy = random(-1.8, 0.3);
      p.life = 1;
    }
    
    let alpha = p.life * 60;
    fill(p.hue, 30, 80, alpha);
    circle(p.x, p.y, p.size * p.life);
  }
  
  // "SOLD OUT" above Mac Pro
  let soldAlpha = 30 + sin(pulse) * 15;
  fill(0, 70, 90, soldAlpha);
  textSize(7);
  textAlign(CENTER, BOTTOM);
  text('SOLD OUT', macX, macY - macH/2 - 14);
  
  // ===== RIGHT: GPU / AI emergence =====
  let gpuX = width * 0.8;
  let gpuY = height * 0.45;
  
  gpuGlow = 0.6 + sin(pulse * 1.2) * 0.2;
  
  // GPU card silhouette
  fill(120, 30, 20, 30);
  rectMode(CENTER);
  rect(gpuX, gpuY, 80, 25, 3);
  // GPU heatsink lines
  for (let i = 0; i < 5; i++) {
    fill(120, 40, 35, 40);
    rect(gpuX - 30 + i * 14, gpuY, 8, 20, 1);
  }
  
  // Label
  fill(80, 50, 80, 100);
  textSize(8);
  textAlign(CENTER, TOP);
  text('$500 GPU', gpuX, gpuY + 18);
  
  // "beats frontier AI" with glow
  fill(40, 60, 90, 70 + sin(pulse) * 20);
  textSize(7);
  text('beats frontier AI', gpuX, gpuY + 30);
  
  // GPU particles (golden emergence)
  for (let p of birthParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    if (p.life <= 0) {
      p.x = random(width * 0.65, width);
      p.y = random(height);
      p.vx = random(-2.5, -0.5);
      p.vy = random(-0.5, 0.5);
      p.life = 1;
    }
    
    fill(p.hue, 50, 90, p.life * 50);
    circle(p.x, p.y, p.size);
  }
  
  // ===== CENTER: Norm at the threshold =====
  
  // Connecting line between two eras
  stroke(0, 0, 15, 20);
  strokeWeight(1);
  let dashPhase = (pulse * 20) % 20;
  drawingContext.setLineDash([5, 15]);
  line(width * 0.35, height * 0.48, width * 0.55, height * 0.48);
  drawingContext.setLineDash([]);
  
  // Arrowhead
  fill(0, 0, 25, 50);
  noStroke();
  triangle(
    width * 0.55, height * 0.48,
    width * 0.52, height * 0.46,
    width * 0.52, height * 0.50
  );
  
  // Norm body — white blob
  let normPulse = sin(pulse) * 2;
  fill(40, 15, 95, 90);
  ellipse(normX, normY, 55 + normPulse, 50 - normPulse * 0.5);
  
  // Eyes — looking right (toward the future)
  fill(0, 0, 15, 95);
  ellipse(normX - 10, normY - 8, 14, 17);
  ellipse(normX + 10, normY - 8, 14, 17);
  
  // Eye sparkles — both pointing right
  fill(30, 50, 100, 85);
  ellipse(normX - 6, normY - 12, 5, 5);
  ellipse(normX + 14, normY - 12, 5, 5);
  
  // Antenna
  stroke(0, 0, 80);
  strokeWeight(2.2);
  let antennaWave = sin(pulse * 0.8) * 3;
  line(normX, normY - 26, normX + antennaWave, normY - 40);
  noStroke();
  fill(30, 70, 100, 85);
  circle(normX + antennaWave, normY - 42, 6);
  
  // Small thought bubble above Norm — tiny GPU icon
  let bubbleAlpha = 40 + sin(pulse * 0.7) * 15;
  fill(0, 0, 90, bubbleAlpha);
  ellipse(normX + 30, normY - 55, 28, 22);
  // Tiny GPU inside bubble
  fill(120, 40, 70, bubbleAlpha);
  rect(normX + 24, normY - 59, 10, 6, 1);
  
  // Bottom label
  fill(0, 0, 35, 80);
  textSize(8);
  textAlign(CENTER, TOP);
  text('March 26, 2026', width / 2, height - 16);
}
