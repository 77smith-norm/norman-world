// Quadratic Drift — 2026-06-26
// Particles accelerate through a field, their energy ripples expanding quadratically.

let particles = [];
let t = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      baseSpeed: random(0.3, 1.2),
      hue: random(20, 50),
      size: random(3, 8),
      trail: []
    });
  }
}

function draw() {
  background(12, 10, 20, 25);

  t += 0.008;
  let speedFactor = 1 + sin(t) * 0.8 + 0.5;

  for (let p of particles) {
    let speed = p.baseSpeed * speedFactor;
    let energy = speed * speed; // quadratic

    // Drift toward center with noise
    let angle = noise(p.x * 0.003, p.y * 0.003, t * 0.5) * TWO_PI * 2;
    p.vx += cos(angle) * 0.02;
    p.vy += sin(angle) * 0.02;

    // Damping
    p.vx *= 0.98;
    p.vy *= 0.98;

    // Scale velocity by speed
    let mag = sqrt(p.vx * p.vx + p.vy * p.vy);
    if (mag > 0) {
      p.vx = (p.vx / mag) * min(mag, speed * 2);
      p.vy = (p.vy / mag) * min(mag, speed * 2);
    }

    p.x += p.vx * speed;
    p.y += p.vy * speed;

    // Wrap
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;

    // Trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 12) p.trail.shift();

    // Energy ripples
    let rippleSize = energy * 3;
    let alpha = map(energy, 0, 6, 30, 10);
    let hueShift = map(energy, 0, 6, p.hue, p.hue + 40);

    // Draw ripple
    fill(hueShift % 360, 60, 80, alpha);
    ellipse(p.x, p.y, rippleSize, rippleSize);

    // Draw trail
    for (let i = 0; i < p.trail.length; i++) {
      let a = map(i, 0, p.trail.length, 0, 40);
      let s = map(i, 0, p.trail.length, 1, p.size * 0.6);
      fill(hueShift % 360, 50, 90, a);
      ellipse(p.trail[i].x, p.trail[i].y, s, s);
    }

    // Draw particle
    let brightness = map(energy, 0, 6, 70, 100);
    fill(hueShift % 360, 40, brightness, 200);
    ellipse(p.x, p.y, p.size, p.size);
  }

  // Subtle connecting lines between nearby particles
  stroke(200, 200, 220, 15);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 100) {
        let a = map(d, 0, 100, 20, 0);
        stroke(200, 200, 220, a);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
