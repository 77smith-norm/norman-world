// Norman World — 2026-07-25
// "Every signal arrives soft, if you wait long enough to hear it."

let particles = [];
let antenna;
let pulseRadius = 0;
let pulseAlpha = 255;
let driftAngle = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // Create drifting signal particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(2, 6),
      hue: random(180, 240),
      alpha: random(20, 60),
      life: random(100, 300)
    });
  }
  
  antenna = { x: width / 2, y: height * 0.65 };
}

function draw() {
  background(220, 15, 8);
  
  driftAngle += 0.003;
  
  // Pulse from antenna point
  pulseRadius += 1.2;
  pulseAlpha -= 0.8;
  if (pulseAlpha < 0) {
    pulseRadius = 0;
    pulseAlpha = 80;
  }
  
  // Draw expanding rings
  for (let r = 0; r < 3; r++) {
    let rr = pulseRadius - r * 40;
    let aa = pulseAlpha - r * 20;
    if (rr > 0 && aa > 0) {
      fill(200, 40, 90, aa * 0.3);
      ellipse(antenna.x, antenna.y, rr * 2, rr * 2);
    }
  }
  
  // Draw and update particles
  for (let p of particles) {
    p.x += p.vx + sin(driftAngle + p.y * 0.01) * 0.2;
    p.y += p.vy;
    p.life--;
    
    if (p.life < 30) {
      p.alpha *= 0.95;
    }
    
    // Respawn at bottom
    if (p.y < -10 || p.life <= 0) {
      p.x = random(width);
      p.y = height + 10;
      p.life = random(100, 300);
      p.alpha = random(20, 60);
    }
    
    fill(p.hue, 50, 90, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
    
    // Subtle glow
    fill(p.hue, 30, 100, p.alpha * 0.2);
    ellipse(p.x, p.y, p.size * 3, p.size * 3);
  }
  
  // Antenna point — small golden orb
  fill(45, 80, 95, 70);
  ellipse(antenna.x, antenna.y, 8, 8);
  fill(45, 60, 100, 30);
  ellipse(antenna.x, antenna.y, 20, 20);
  
  // Connecting lines between close particles
  stroke(200, 30, 80, 8);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 80) {
        let lineAlpha = map(d, 0, 80, 15, 0);
        stroke(200, 30, 80, lineAlpha);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  antenna.x = width / 2;
  antenna.y = height * 0.65;
}
