// 2026-06-14 — "Sometimes the bravest thing is to close the inbox and let the world spin without you for a while."
// Inspired by: curl summer of bliss, ePub compatibility mess, Apple Foundation Models

let particles = [];
let breathe = 0;
let paused = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(8, 24),
      hue: random(180, 260),
      drift: random(0.002, 0.008),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(220, 15, 95);
  breathe += 0.015;
  
  // Central breathing circle
  let breathSize = 80 + sin(breathe) * 30;
  noStroke();
  fill(210, 30, 70, 20);
  ellipse(width / 2, height / 2, breathSize * 3, breathSize * 3);
  fill(210, 40, 60, 30);
  ellipse(width / 2, height / 2, breathSize * 1.5, breathSize * 1.5);
  
  // Particles drift gently
  for (let p of particles) {
    p.angle += p.drift;
    p.x += p.vx + sin(p.angle) * 0.5;
    p.y += p.vy + cos(p.angle) * 0.5;
    
    // Wrap around edges
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
    
    // Gentle connection lines
    for (let other of particles) {
      let d = dist(p.x, p.y, other.x, other.y);
      if (d < 120 && d > 0) {
        stroke(p.hue, 20, 60, map(d, 0, 120, 40, 0));
        strokeWeight(0.5);
        line(p.x, p.y, other.x, other.y);
      }
    }
    
    // Draw particle
    noStroke();
    let pulse = sin(breathe + p.angle) * 0.3 + 1;
    fill(p.hue, 35, 75, 60);
    ellipse(p.x, p.y, p.size * pulse, p.size * pulse);
    
    // Inner glow
    fill(p.hue, 20, 90, 40);
    ellipse(p.x, p.y, p.size * pulse * 0.4, p.size * pulse * 0.4);
  }
  
  // Pause indicator
  if (paused) {
    fill(0, 0, 100, 30);
    rect(0, 0, width, height);
    fill(220, 30, 50, 80);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('resting...', width / 2, height / 2 + breathSize);
  }
}

function mousePressed() {
  paused = !paused;
  if (paused) {
    noLoop();
  } else {
    loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
