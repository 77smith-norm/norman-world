// 2026-06-11 — "The most valuable work is the disaster that quietly didn't happen."
// Invisible forces steering particles away from collision — prevention as motion

let particles = [];
let faults = [];
let prevented = 0;
const PARTICLE_COUNT = 120;
const FAULT_COUNT = 5;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      r: random(3, 6),
      hue: random(200, 260),
      trail: []
    });
  }

  for (let i = 0; i < FAULT_COUNT; i++) {
    faults.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8),
      r: random(40, 80),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(220, 30, 8, 100);

  // Draw faults — the disasters that never happened
  for (let f of faults) {
    f.pulse += 0.015;
    let glow = sin(f.pulse) * 0.3 + 0.4;
    let rr = f.r + sin(f.pulse * 1.3) * 8;

    // Danger zone — barely visible
    fill(0, 60, 30, glow * 12);
    ellipse(f.x, f.y, rr * 3, rr * 3);

    // Core
    fill(0, 50, 20, glow * 25);
    ellipse(f.x, f.y, rr, rr);
  }

  // Update and draw particles
  for (let p of particles) {
    // Store trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 8) p.trail.shift();

    // Invisible steering — prevent collisions with faults
    for (let f of faults) {
      let dx = p.x - f.x;
      let dy = p.y - f.y;
      let dist = sqrt(dx * dx + dy * dy);
      let avoidR = f.r * 2.5;

      if (dist < avoidR && dist > 0) {
        let force = (avoidR - dist) / avoidR * 0.4;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        prevented++;
      }
    }

    // Gentle drift
    p.vx += random(-0.02, 0.02);
    p.vy += random(-0.02, 0.02);

    // Damping
    p.vx *= 0.98;
    p.vy *= 0.98;

    // Speed limit
    let spd = sqrt(p.vx * p.vx + p.vy * p.vy);
    if (spd > 2) {
      p.vx = (p.vx / spd) * 2;
      p.vy = (p.vy / spd) * 2;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap edges
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    // Draw trail
    for (let i = 0; i < p.trail.length; i++) {
      let alpha = map(i, 0, p.trail.length, 2, 15);
      let sz = map(i, 0, p.trail.length, 1, p.r * 0.6);
      fill(p.hue, 50, 80, alpha);
      ellipse(p.trail[i].x, p.trail[i].y, sz, sz);
    }

    // Draw particle
    fill(p.hue, 40, 95, 60);
    ellipse(p.x, p.y, p.r, p.r);

    // Bright core
    fill(p.hue, 20, 100, 80);
    ellipse(p.x, p.y, p.r * 0.4, p.r * 0.4);
  }

  // Subtle counter — how many disasters were quietly prevented
  fill(220, 10, 70, 20);
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  text(prevented.toLocaleString() + ' quiet rescues', width - 16, height - 16);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
