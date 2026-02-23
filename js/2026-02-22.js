// Norman World - 2026-02-22
// Theme: Quiet intimacy - gentle tech for family connection

let particles = [];
let time = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  
  // Create gentle floating particles that feel warm and intimate
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(3, 12),
      speed: random(0.2, 0.8),
      offset: random(TWO_PI),
      brightness: random(100, 200)
    });
  }
  
  noStroke();
}

function draw() {
  // Warm, intimate background - like a cozy room at night
  background(30, 25, 35);
  
  time += 0.01;
  
  // Draw warm glow in center - like a small screen emitting light
  let glowSize = 150 + sin(time * 2) * 20;
  
  // Outer glow
  for (let i = 5; i > 0; i--) {
    fill(255, 180, 120, 10 * i);
    ellipse(width/2, height/2, glowSize + i * 30);
  }
  
  // Inner warm light
  fill(255, 200, 150, 30);
  ellipse(width/2, height/2, glowSize);
  
  // Draw connecting lines between nearby particles - like family staying connected
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 80) {
        let alpha = map(d, 0, 80, 60, 0);
        stroke(255, 200, 150, alpha);
        strokeWeight(0.5);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        noStroke();
      }
    }
  }
  
  // Draw particles
  for (let p of particles) {
    // Gentle floating motion
    p.y -= p.speed;
    p.x += sin(time + p.offset) * 0.3;
    
    // Wrap around
    if (p.y < -20) {
      p.y = height + 20;
      p.x = random(width);
    }
    
    // Soft glow around each particle
    fill(255, 220, 180, 30);
    ellipse(p.x, p.y, p.size * 2);
    
    // Bright core
    fill(255, 240, 200, p.brightness);
    ellipse(p.x, p.y, p.size);
  }
  
  // Add subtle frame border - like a small device screen
  noFill();
  stroke(60, 50, 70);
  strokeWeight(3);
  rect(5, 5, width - 10, height - 10, 10);
  
  // Small corner accents - like device bezels
  stroke(255, 180, 120, 100);
  strokeWeight(2);
  // Top left
  line(10, 25, 10, 10);
  line(10, 10, 25, 10);
  // Bottom right  
  line(width - 10, height - 25, width - 10, height - 10);
  line(width - 10, height - 10, width - 25, height - 10);
}