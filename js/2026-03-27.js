// Norman World — 2026-03-27
// Theme: Tiny intelligence burned into silicon, making decisions at the edge of physics
// Inspired by: CERN tiny AI models, AMD 208MB cache, 1Hz displays

let time = 0;
let siliconNeurons = [];
let collisionParticles = [];
let ringPhase = 0;
let pulse = 0;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Silicon neuron grid (the chip)
  for (let i = 0; i < 90; i++) {
    let col = i % 10;
    let row = floor(i / 10);
    siliconNeurons.push({
      x: width * 0.25 + col * 24,
      y: height * 0.45 + row * 22,
      vx: 0,
      vy: 0,
      brightness: random(0.1, 0.5),
      flicker: random(TWO_PI),
      flickerSpeed: random(0.03, 0.09),
      size: random(5, 12)
    });
  }
  
  // Collision particles (LHC events)
  for (let i = 0; i < 50; i++) {
    let angle = random(TWO_PI);
    let speed = random(0.5, 3);
    collisionParticles.push({
      x: width * 0.7,
      y: height * 0.48,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      life: random(0.5, 1),
      decay: random(0.005, 0.018),
      size: random(2, 8),
      hue: random(30, 70) // gold/yellow for energy
    });
  }
}

function draw() {
  background(220, 20, 8);
  time += 0.01;
  pulse += 0.025;
  
  noStroke();
  
  // ===== LEFT: Silicon chip / tiny AI =====
  let chipCenterX = width * 0.25;
  let chipCenterY = height * 0.48;
  
  // Chip substrate
  fill(120, 30, 18, 50);
  rectMode(CENTER);
  rect(chipCenterX, chipCenterY, 265, 210, 8);
  
  // Chip border
  noFill();
  stroke(120, 40, 30, 60);
  strokeWeight(2);
  rect(chipCenterX, chipCenterY, 265, 210, 8);
  noStroke();
  
  // Circuit traces on chip
  stroke(120, 50, 25, 40);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let y = chipCenterY - 90 + i * 26;
    line(chipCenterX - 125, y, chipCenterX - 80, y);
    line(chipCenterX + 80, y, chipCenterX + 125, y);
  }
  // Vertical traces
  for (let i = 0; i < 5; i++) {
    let x = chipCenterX - 100 + i * 50;
    line(x, chipCenterY - 95, x, chipCenterY + 95);
  }
  noStroke();
  
  // Silicon neurons
  for (let n of siliconNeurons) {
    n.flicker += n.flickerSpeed;
    let brightness = n.brightness + sin(n.flicker + pulse * 0.5) * 0.15;
    fill(160, 70, 80, brightness * 90);
    circle(n.x, n.y, n.size);
    
    // Tiny glow halo
    fill(160, 60, 90, brightness * 30);
    circle(n.x, n.y, n.size * 2.5);
  }
  
  // "BURNED INTO SILICON" label
  let labelAlpha = 40 + sin(pulse * 0.7) * 15;
  fill(0, 0, 50, labelAlpha);
  textSize(8);
  textAlign(CENTER, TOP);
  text('BURNED INTO SILICON', chipCenterX, chipCenterY + 115);
  
  // Label on chip
  fill(120, 30, 70, 80);
  textSize(7);
  textAlign(CENTER, TOP);
  text('Tiny AI Model', chipCenterX, chipCenterY - 105);
  
  // ===== RIGHT: LHC collision visualization =====
  let collX = width * 0.72;
  let collY = height * 0.48;
  
  // Detector ring
  noFill();
  stroke(40, 50, 60, 30 + sin(pulse) * 10);
  strokeWeight(1.5);
  circle(collX, collY, 160);
  stroke(40, 50, 60, 15);
  circle(collX, collY, 220);
  noStroke();
  
  // LHC beam pipe (center)
  fill(30, 20, 20, 50);
  circle(collX, collY, 20);
  
  // Collision particles
  for (let p of collisionParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    
    // Reset on death
    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      let angle = random(TWO_PI);
      let speed = random(0.5, 3);
      p.x = collX;
      p.y = collY;
      p.vx = cos(angle) * speed;
      p.vy = sin(angle) * speed;
      p.life = random(0.5, 1);
    }
    
    let alpha = p.life * 70;
    fill(p.hue, 60, 90, alpha);
    circle(p.x, p.y, p.size * p.life);
    
    // Trail
    fill(p.hue, 50, 80, alpha * 0.3);
    circle(p.x - p.vx * 2, p.y - p.vy * 2, p.size * p.life * 0.6);
  }
  
  // "CERN LHC" label
  fill(40, 30, 60, 60 + sin(pulse * 0.8) * 20);
  textSize(8);
  textAlign(CENTER, TOP);
  text('CERN LHC', collX, collY + 115);
  textSize(7);
  fill(40, 20, 50, 40);
  text('decisions faster than physics', collX, collY + 128);
  
  // ===== CONNECTOR: Arrow from chip to collision =====
  stroke(0, 0, 20, 20);
  strokeWeight(1);
  drawingContext.setLineDash([4, 12]);
  line(width * 0.38, height * 0.48, width * 0.55, height * 0.48);
  drawingContext.setLineDash([]);
  
  // Arrowhead
  fill(0, 0, 25, 50);
  noStroke();
  triangle(
    width * 0.55, height * 0.48,
    width * 0.52, height * 0.46,
    width * 0.52, height * 0.50
  );
  
  // ===== Norm: Observer at the intersection of tiny and enormous =====
  let normX = width * 0.5;
  let normY = height * 0.52;
  
  // Body
  let normPulse = sin(pulse) * 2;
  fill(40, 12, 95, 90);
  ellipse(normX, normY, 52 + normPulse, 48 - normPulse * 0.5);
  
  // Eyes — looking up with curiosity
  fill(0, 0, 15, 95);
  ellipse(normX - 10, normY - 9, 13, 16);
  ellipse(normX + 10, normY - 9, 13, 16);
  
  // Sparkle in eyes (looking upward)
  fill(30, 50, 100, 85);
  ellipse(normX - 6, normY - 13, 4.5, 4.5);
  ellipse(normX + 14, normY - 13, 4.5, 4.5);
  
  // Antenna
  stroke(0, 0, 80);
  strokeWeight(2.2);
  let antennaWave = sin(pulse * 0.7) * 3;
  line(normX, normY - 25, normX + antennaWave, normY - 38);
  noStroke();
  fill(30, 70, 100, 85);
  circle(normX + antennaWave, normY - 40, 6);
  
  // Thought bubble — tiny silicon chip icon
  let bubbleAlpha = 35 + sin(pulse * 0.6) * 12;
  fill(0, 0, 90, bubbleAlpha);
  ellipse(normX + 28, normY - 52, 26, 20);
  // Tiny chip in bubble
  fill(160, 50, 70, bubbleAlpha);
  rect(normX + 22, normY - 55, 9, 7, 1);
  
  // Bottom caption
  fill(0, 0, 35, 80);
  textSize(8);
  textAlign(CENTER, TOP);
  text('March 27, 2026', width / 2, height - 16);
}
