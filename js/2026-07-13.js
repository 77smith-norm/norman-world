// 2026-07-13 — "What the world discards still holds everything it once was."
// Particles rising from spent forms — the quiet physics of reclamation

let particles = [];
let shells = [];
let palette;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  palette = [
    color(35, 80, 95, 70),   // warm amber
    color(25, 70, 90, 60),   // soft orange
    color(45, 60, 100, 50),  // pale gold
    color(15, 50, 85, 40),   // dusty copper
    color(50, 30, 100, 30),  // cream light
  ];

  // Create spent shell shapes at bottom
  for (let i = 0; i < 12; i++) {
    shells.push({
      x: random(width * 0.15, width * 0.85),
      y: height - random(30, 120),
      w: random(20, 50),
      h: random(15, 35),
      rotation: random(TWO_PI),
      rotSpeed: random(-0.002, 0.002),
      alpha: random(15, 35),
    });
  }

  // Seed particles
  for (let i = 0; i < 60; i++) {
    spawnParticle();
  }
}

function spawnParticle() {
  let source = random(shells);
  particles.push({
    x: source.x + random(-source.w / 2, source.w / 2),
    y: source.y,
    vx: random(-0.3, 0.3),
    vy: random(-0.8, -0.2),
    size: random(3, 10),
    life: random(150, 400),
    maxLife: 400,
    col: random(palette),
    wobblePhase: random(TWO_PI),
    wobbleSpeed: random(0.01, 0.04),
    wobbleAmp: random(0.3, 1.2),
  });
}

function draw() {
  background(220, 15, 12); // deep muted blue-grey

  // Draw spent shells
  for (let s of shells) {
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    fill(220, 10, 25, s.alpha);
    rectMode(CENTER);
    rect(0, 0, s.w, s.h, 4);
    // Inner detail line
    stroke(220, 8, 35, s.alpha * 0.5);
    strokeWeight(1);
    line(-s.w * 0.3, 0, s.w * 0.3, 0);
    noStroke();
    s.rotation += s.rotSpeed;
    pop();
  }

  // Draw and update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.life--;
    p.wobblePhase += p.wobbleSpeed;
    p.x += p.vx + sin(p.wobblePhase) * p.wobbleAmp;
    p.y += p.vy;
    p.vy *= 0.998; // slow deceleration

    let lifeRatio = p.life / p.maxLife;
    let alpha = lifeRatio * 80;
    let sz = p.size * (0.5 + lifeRatio * 0.5);

    // Glow
    let glowCol = color(
      hue(p.col),
      saturation(p.col) * 0.5,
      brightness(p.col),
      alpha * 0.3
    );
    fill(glowCol);
    ellipse(p.x, p.y, sz * 2.5, sz * 2.5);

    // Core
    let coreCol = color(
      hue(p.col),
      saturation(p.col),
      brightness(p.col),
      alpha
    );
    fill(coreCol);
    ellipse(p.x, p.y, sz, sz);

    if (p.life <= 0 || p.y < -20) {
      particles.splice(i, 1);
      spawnParticle();
    }
  }

  // Subtle connecting lines between nearby particles
  stroke(40, 30, 90, 8);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 80) {
        let alpha = map(d, 0, 80, 15, 0);
        stroke(40, 30, 90, alpha);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Redistribute shells
  for (let s of shells) {
    s.x = random(width * 0.15, width * 0.85);
    s.y = height - random(30, 120);
  }
}
