// Norman World — 2026-03-30
// Theme: The most dangerous code is the code you stopped checking
// Inspired by: Axios npm supply chain attack; Claude Code source leak
// ABSTRACT ART — no Norm, no characters, no mascots

let time = 0;
let trustRingParticles = [];
let ratParticles = [];
let debrisParticles = [];
let rewriteParticles = [];
let pulse = 0;
let c2Node;
let attackTime = 0;

function setup() {
  let canvas = createCanvas(800, 420);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // C2 server node (top right)
  c2Node = { x: width * 0.82, y: height * 0.22, pulse: 0 };
  
  // Trust ring particles — the trusted ecosystem
  for (let i = 0; i < 280; i++) {
    let angle = random(TWO_PI);
    let r = random(80, 160);
    trustRingParticles.push({
      angle: angle,
      r: r,
      cx: width * 0.4,
      cy: height * 0.52,
      size: random(1.5, 4),
      speed: random(0.002, 0.006),
      phase: random(TWO_PI),
      alpha: random(20, 50),
      hue: random(200, 230)
    });
  }
  
  // RAT particles — the malicious code reaching out
  for (let i = 0; i < 40; i++) {
    ratParticles.push({
      x: width * 0.4,
      y: height * 0.52,
      progress: random(1),
      size: random(2, 5),
      alpha: random(40, 80),
      hue: random(5, 25) // hot orange-red
    });
  }
  
  // Debris particles — self-destruct evidence
  for (let i = 0; i < 60; i++) {
    let angle = random(TWO_PI);
    let r = random(100, 200);
    debrisParticles.push({
      angle: angle,
      r: r,
      cx: width * 0.4,
      cy: height * 0.52,
      rotSpeed: random(0.003, 0.01),
      size: random(1, 3),
      alpha: random(15, 35),
      hue: random(180, 220)
    });
  }
  
  // Rewrite particles — the package.json replacing itself
  for (let i = 0; i < 30; i++) {
    rewriteParticles.push({
      x: width * 0.4 + random(-60, 60),
      y: height * 0.52 + random(-40, 40),
      vx: random(-0.3, 0.3),
      vy: random(-0.2, 0.2),
      alpha: random(30, 60),
      size: random(1, 2.5),
      life: random(0.5, 1),
      decay: random(0.008, 0.02)
    });
  }
}

function draw() {
  // Deep void background
  background(220, 35, 4, 100);
  time += 0.012;
  pulse += 0.04;
  attackTime = max(0, attackTime + 0.015);
  
  // ===== TRUSTED CIRCLE (the npm ecosystem / axios) =====
  let tcx = width * 0.4;
  let tcy = height * 0.52;
  let trustR = 140;
  
  // Outer glow rings
  for (let ring = 3; ring > 0; ring--) {
    noFill();
    stroke(210, 30, 20, 8 + sin(pulse + ring) * 4);
    strokeWeight(1);
    circle(tcx, tcy, trustR * 2 + ring * 18);
  }
  
  // Main trust circle
  noFill();
  stroke(210, 25, 30, 40 + sin(pulse) * 10);
  strokeWeight(1.5);
  circle(tcx, tcy, trustR * 2);
  
  // Label inside trust circle
  noStroke();
  fill(210, 20, 50, 30 + sin(pulse * 0.7) * 10);
  textSize(8);
  textAlign(CENTER, CENTER);
  text('AXIOS', tcx, tcy);
  
  // 100M weekly downloads indicator
  fill(210, 20, 50, 20);
  textSize(7);
  text('100M+/wk', tcx, tcy + trustR - 20);
  
  // Trust ring particles orbiting
  noStroke();
  for (let p of trustRingParticles) {
    p.angle += p.speed;
    let px = tcx + cos(p.angle) * p.r;
    let py = tcy + sin(p.angle) * p.r;
    let flicker = sin(p.phase + time * 10) * 0.5 + 0.5;
    fill(p.hue, 30, 60, p.alpha * flicker);
    circle(px, py, p.size);
  }
  
  // ===== MALICIOUS SPARK inside the circle =====
  let sparkPulse = sin(attackTime * 4) * 0.5 + 0.5;
  let sparkX = tcx - 30;
  let sparkY = tcy - 20;
  
  // Hot orange spark
  noStroke();
  fill(20, 80, 95, 60 + sparkPulse * 30);
  circle(sparkX, sparkY, 12 + sparkPulse * 6);
  fill(15, 100, 100, 80 + sparkPulse * 15);
  circle(sparkX, sparkY, 5 + sparkPulse * 3);
  
  // ===== C2 CONNECTION LINE =====
  if (attackTime > 0.5) {
    let connAlpha = min(60, (attackTime - 0.5) * 80);
    let connPulse = sin(pulse * 3) * 0.3 + 0.7;
    
    stroke(5, 90, 90, connAlpha * connPulse);
    strokeWeight(1);
    drawingContext.setLineDash([3, 6]);
    drawingContext.lineDashOffset = -time * 50;
    line(sparkX, sparkY, c2Node.x, c2Node.y);
    drawingContext.setLineDash([]);
    
    // Data packets flowing along connection
    for (let i = 0; i < 3; i++) {
      let t = (time * 0.8 + i * 0.33) % 1;
      let packetX = lerp(sparkX, c2Node.x, t);
      let packetY = lerp(sparkY, c2Node.y, t);
      noStroke();
      fill(5, 100, 100, 70 * connPulse);
      circle(packetX, packetY, 3);
    }
  }
  
  // ===== C2 SERVER NODE =====
  c2Node.pulse += 0.06;
  let c2Glow = sin(c2Node.pulse) * 0.3 + 0.7;
  
  for (let r = 50; r > 0; r -= 8) {
    noStroke();
    fill(0, 90, 60, c2Glow * 15 * (1 - r / 50));
    circle(c2Node.x, c2Node.y, r);
  }
  fill(0, 85, 85, 90);
  circle(c2Node.x, c2Node.y, 8);
  fill(0, 60, 100, 95);
  circle(c2Node.x, c2Node.y, 4);
  
  // C2 label
  noStroke();
  fill(0, 60, 70, 40 + sin(pulse) * 15);
  textSize(7);
  textAlign(CENTER, TOP);
  text('C2 SERVER', c2Node.x, c2Node.y + 12);
  
  // ===== DEBRIS PARTICLES (self-destruct) =====
  for (let p of debrisParticles) {
    p.angle += p.rotSpeed;
    let px = tcx + cos(p.angle) * p.r;
    let py = tcy + sin(p.angle) * p.r;
    let drift = sin(time + p.angle) * 0.5;
    fill(p.hue, 40, 50, p.alpha * (0.5 + sin(pulse + p.angle) * 0.5));
    circle(px + drift * 10, py + drift * 5, p.size);
  }
  
  // ===== REWRITE PARTICLES =====
  for (let p of rewriteParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    p.alpha = p.life * 50;
    
    if (p.life <= 0) {
      p.x = tcx + random(-60, 60);
      p.y = tcy + random(-40, 40);
      p.vx = random(-0.3, 0.3);
      p.vy = random(-0.2, 0.2);
      p.life = random(0.5, 1);
      p.alpha = p.life * 50;
    }
    
    noStroke();
    fill(210, 20, 90, p.alpha);
    circle(p.x, p.y, p.size);
  }
  
  // Rewrite label
  if (attackTime > 1) {
    noStroke();
    let rwAlpha = min(50, (attackTime - 1) * 40) * (sin(pulse * 2) * 0.3 + 0.7);
    fill(130, 30, 70, rwAlpha);
    textSize(7);
    textAlign(CENTER, CENTER);
    text('package.json rewritten', tcx, tcy + trustR + 15);
  }
  
  // ===== "18 HRS IN ADVANCE" marker =====
  noStroke();
  fill(0, 50, 50, 20 + sin(pulse * 0.5) * 10);
  textSize(7);
  textAlign(CENTER, TOP);
  text('staged 18 hrs prior', tcx - trustR - 60, tcy - 30);
  
  // Thin connector to trust circle
  stroke(210, 20, 30, 15);
  strokeWeight(0.5);
  drawingContext.setLineDash([2, 4]);
  line(tcx - trustR, tcy, tcx - trustR - 60, tcy - 30);
  drawingContext.setLineDash([]);
  noStroke();
  
  // ===== BOTTOM CAPTION =====
  fill(0, 0, 35, 55);
  textSize(8);
  textAlign(CENTER, TOP);
  text('March 30, 2026', width / 2, height - 14);
}
