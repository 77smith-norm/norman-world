// 2026-07-15 — "Every creation begins with the universe"
// Inspired by lost music piracy and building buttons from scratch

let particles = [];
let buttonGlow = 0;
let buttonPhase = 0;
let fft;
let mic;
let usingMic = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  
  // Create floating track-listing shapes
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(8, 32),
      opacity: random(40, 150),
      type: floor(random(3)), // 0=rect, 1=line, 2=diamond
      rotation: random(TWO_PI),
      rotSpeed: random(-0.01, 0.01),
      hue: random(180, 320)
    });
  }
  
  colorMode(HSB, 360, 100, 100, 255);
}

function draw() {
  background(230, 15, 8);
  
  // Draw floating geometric shapes (track listings)
  for (let p of particles) {
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    
    let breathe = sin(frameCount * 0.02 + p.x * 0.01) * 0.3 + 1;
    let s = p.size * breathe;
    
    noStroke();
    fill(p.hue, 60, 70, p.opacity);
    
    if (p.type === 0) {
      // Rectangular track block
      rectMode(CENTER);
      rect(0, 0, s * 2.5, s * 0.6, 2);
      // Subtle line inside (track duration vibe)
      stroke(p.hue, 40, 90, p.opacity * 0.5);
      strokeWeight(1);
      line(-s * 0.8, 0, s * 0.8, 0);
    } else if (p.type === 1) {
      // Thin horizontal line (progress bar / waveform)
      stroke(p.hue, 50, 80, p.opacity);
      strokeWeight(1.5);
      let lineLen = s * 2;
      line(-lineLen / 2, 0, lineLen / 2, 0);
      // Small dot at random position
      noStroke();
      fill(p.hue, 70, 90, p.opacity);
      let dotX = map(sin(frameCount * 0.03 + p.rotation), -1, 1, -lineLen / 2, lineLen / 2);
      circle(dotX, 0, 3);
    } else {
      // Diamond / play button
      beginShape();
      vertex(0, -s * 0.7);
      vertex(s * 0.5, 0);
      vertex(0, s * 0.7);
      vertex(-s * 0.5, 0);
      endShape(CLOSE);
    }
    
    // Movement
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    
    // Wrap around
    if (p.y < -50) {
      p.y = height + 50;
      p.x = random(width);
    }
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    
    pop();
  }
  
  // Central glowing button
  buttonPhase += 0.02;
  buttonGlow = sin(buttonPhase) * 0.4 + 0.6;
  
  let bx = width / 2;
  let by = height / 2;
  let bSize = 40 + sin(buttonPhase * 1.3) * 5;
  
  // Outer glow
  noStroke();
  for (let r = bSize * 3; r > bSize; r -= 4) {
    let a = map(r, bSize, bSize * 3, 80 * buttonGlow, 0);
    fill(200, 80, 90, a);
    ellipse(bx, by, r * 2, r * 2);
  }
  
  // Button body
  fill(200, 70, 95, 220);
  ellipse(bx, by, bSize * 2, bSize * 2);
  
  // Inner highlight
  fill(200, 30, 100, 120);
  ellipse(bx - bSize * 0.2, by - bSize * 0.2, bSize * 0.8, bSize * 0.8);
  
  // Subtle pulse ring
  noFill();
  stroke(200, 60, 90, 100 * buttonGlow);
  strokeWeight(1.5);
  let ringSize = bSize * 2 + sin(buttonPhase * 0.7) * 15;
  ellipse(bx, by, ringSize, ringSize);
  
  // Mouse interaction: particles drift toward cursor
  if (mouseIsPressed) {
    for (let p of particles) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < 200) {
        let angle = atan2(mouseY - p.y, mouseX - p.x);
        p.vx += cos(angle) * 0.1;
        p.vy += sin(angle) * 0.1;
      }
    }
  }
  
  // Gentle velocity damping
  for (let p of particles) {
    p.vx *= 0.99;
    p.vy *= 0.99;
    // Restore gentle upward drift
    p.vy += (-0.05 - p.vy) * 0.01;
    p.vx += (random(-0.01, 0.01)) * 0.5;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
