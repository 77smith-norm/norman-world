// Norman World — 2026-06-20
// "The library lends what you didn't know you needed; the app sees what you didn't know was watching."

let particles = [];
let boundaries = [];
let t = 0;
let hovered = null;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  
  // Create library shelf particles (warm amber tones)
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width * 0.1, width * 0.6),
      y: random(height * 0.2, height * 0.8),
      size: random(8, 24),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      type: 'shelf',
      alpha: random(100, 200),
      hue: random(20, 45)
    });
  }
  
  // Create surveillance nodes (cool blue tones)
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: random(width * 0.65, width * 0.95),
      y: random(height * 0.15, height * 0.85),
      size: random(15, 35),
      speed: random(0.1, 0.4),
      angle: random(TWO_PI),
      type: 'watcher',
      alpha: random(80, 160),
      hue: random(190, 220),
      pulse: random(TWO_PI)
    });
  }
  
  // Create boundary lines (CORS metaphor)
  for (let i = 0; i < 5; i++) {
    boundaries.push({
      x: width * 0.55 + random(-20, 20),
      y1: random(height * 0.1, height * 0.3),
      y2: random(height * 0.7, height * 0.9),
      alpha: random(40, 100),
      dashOffset: random(100)
    });
  }
  
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(220, 8, 12);
  t += 0.01;
  
  // Draw boundary lines (dashed, semi-transparent)
  stroke(0, 0, 50, 30);
  strokeWeight(1);
  for (let b of boundaries) {
    b.dashOffset += 0.3;
    drawDashedLine(b.x, b.y1, b.x, b.y2, b.dashOffset, b.alpha);
  }
  
  // Update and draw particles
  hovered = null;
  for (let p of particles) {
    // Gentle drift
    p.x += cos(p.angle) * p.speed * 0.3;
    p.y += sin(p.angle) * p.speed * 0.3;
    p.angle += random(-0.05, 0.05);
    
    // Wrap around
    if (p.type === 'shelf') {
      if (p.x < width * 0.05) p.x = width * 0.6;
      if (p.x > width * 0.65) p.x = width * 0.1;
    } else {
      if (p.x < width * 0.6) p.x = width * 0.95;
      if (p.x > width) p.x = width * 0.65;
    }
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Check hover
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < p.size * 1.5) {
      hovered = p;
    }
    
    drawParticle(p, d);
  }
  
  // Draw connection lines between nearby particles
  stroke(0, 0, 40, 15);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 100) {
        let alpha = map(d, 0, 100, 30, 0);
        stroke(0, 0, 40, alpha);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  
  // Draw "Lends" / "Watches" labels
  noStroke();
  fill(40, 60, 80, 40 + sin(t * 2) * 20);
  textSize(14);
  textAlign(CENTER);
  text("LENDING", width * 0.3, height * 0.08);
  fill(210, 60, 80, 40 + sin(t * 2 + PI) * 20);
  text("WATCHING", width * 0.8, height * 0.08);
}

function drawParticle(p, d) {
  let hoverScale = (hovered === p) ? 1.5 : 1;
  let pulseSize = p.type === 'watcher' ? 
    p.size * hoverScale + sin(t * 3 + p.pulse) * 4 : 
    p.size * hoverScale;
  
  noStroke();
  
  if (p.type === 'shelf') {
    // Warm amber rectangles (library items)
    fill(p.hue, 70, 85, p.alpha);
    push();
    translate(p.x, p.y);
    rotate(p.angle * 0.3);
    rectMode(CENTER);
    rect(0, 0, pulseSize * 0.7, pulseSize, 3);
    pop();
    
    // Glow on hover
    if (hovered === p) {
      fill(p.hue, 50, 95, 30);
      ellipse(p.x, p.y, pulseSize * 3, pulseSize * 3);
    }
  } else {
    // Cool blue circles (watchers)
    fill(p.hue, 60, 90, p.alpha);
    ellipse(p.x, p.y, pulseSize, pulseSize);
    
    // Inner "eye" detail
    fill(p.hue, 40, 100, p.alpha * 0.8);
    ellipse(p.x, p.y, pulseSize * 0.4, pulseSize * 0.4);
    
    // Scan line effect
    let scanAngle = t * 2 + p.pulse;
    let scanX = p.x + cos(scanAngle) * pulseSize * 0.6;
    let scanY = p.y + sin(scanAngle) * pulseSize * 0.6;
    fill(p.hue, 30, 100, 40);
    ellipse(scanX, scanY, 4, 4);
    
    // Glow on hover
    if (hovered === p) {
      fill(p.hue, 40, 95, 20);
      ellipse(p.x, p.y, pulseSize * 4, pulseSize * 4);
    }
  }
}

function drawDashedLine(x, y1, x2, y2, offset, alpha) {
  let d = dist(x, y1, x2, y2);
  let steps = d / 12;
  for (let i = 0; i < steps; i++) {
    if (i % 2 === 0) {
      let startY = lerp(y1, y2, (i + offset * 0.01) % 1);
      let endY = lerp(y1, y2, min((i + 1 + offset * 0.01) % 1, 1));
      stroke(0, 0, 50, alpha);
      line(x, startY, x2, endY);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reposition particles for new dimensions
  for (let p of particles) {
    if (p.type === 'shelf') {
      p.x = random(width * 0.1, width * 0.6);
    } else {
      p.x = random(width * 0.65, width * 0.95);
    }
    p.y = random(height * 0.2, height * 0.8);
  }
  
  // Reposition boundaries
  for (let b of boundaries) {
    b.x = width * 0.55 + random(-20, 20);
    b.y1 = random(height * 0.1, height * 0.3);
    b.y2 = random(height * 0.7, height * 0.9);
  }
}
