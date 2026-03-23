// Norman World — March 22, 2026
// Theme: Order and noise. The web downloads half a gigabyte of noise.
//        But somewhere, someone still writes a perfect loop.

let particles = [];
let noiseOffset = 0;
let corrupted = false;
let corruptTimer = 0;
let pulse = 0;

function setup() {
  let cnv = createCanvas(min(windowWidth, 600), 400);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  initParticles();
}

function initParticles() {
  particles = [];
  let cx = width / 2;
  let cy = height / 2;
  let rings = 7;
  for (let r = 1; r <= rings; r++) {
    let count = r * 12;
    let baseRadius = r * 28;
    for (let i = 0; i < count; i++) {
      let angle = TWO_PI * i / count;
      let jitter = random(-3, 3);
      particles.push({
        angle: angle,
        baseR: baseRadius + jitter,
        ring: r,
        speed: random(0.003, 0.012) * (rings - r + 1) * 0.4,
        phase: random(TWO_PI),
        size: map(r, 1, rings, 5, 2),
        hue: map(r, 1, rings, 200, 280),
        corruption: 0
      });
    }
  }
}

function draw() {
  background(240, 15, 6);

  if (corrupted) {
    corruptTimer--;
    if (corruptTimer <= 0) corrupted = false;
  }

  pulse += 0.02;
  noiseOffset += 0.008;

  let cx = width / 2;
  let cy = height / 2;

  // Draw rings (subtle guides)
  noFill();
  stroke(240, 20, 20, 15);
  strokeWeight(0.5);
  for (let r = 1; r <= 7; r++) {
    circle(cx, cy, r * 56);
  }

  // Draw particles
  noStroke();
  for (let p of particles) {
    let wave = sin(pulse + p.phase) * 2;
    let nx = noise(cos(p.angle) * 0.5 + noiseOffset, sin(p.angle) * 0.5, noiseOffset * 0.3) * 30;
    let ny = noise(cos(p.angle) * 0.5 + 100, sin(p.angle) * 0.5 + 100, noiseOffset * 0.3) * 30;

    let px, py;

    if (corrupted) {
      let c = p.corruption * (corruptTimer / 90);
      px = cx + cos(p.angle) * (p.baseR + nx + random(-15, 15) * c);
      py = cy + sin(p.angle) * (p.baseR + ny + random(-15, 15) * c);
    } else {
      px = cx + cos(p.angle) * (p.baseR + nx + wave);
      py = cy + sin(p.angle) * (p.baseR + ny + wave);
    }

    let alpha = map(sin(pulse * 2 + p.phase), -1, 1, 40, 90);
    let brightness = map(p.ring, 1, 7, 80, 55);

    fill(p.hue, 40, brightness, alpha);
    circle(px, py, p.size * 2);

    // Connect nearby particles on same ring
    if (!corrupted && p.ring <= 4) {
      let nextAngle = p.angle + TWO_PI / (p.ring * 12);
      let nWave = sin(pulse + particles.find(n => 
        abs(n.angle - nextAngle) < 0.1 && n.ring === p.ring
      )?.phase || 0) * 2;
      let nextR = p.baseR;
      let npx = cx + cos(nextAngle) * (nextR + nWave);
      let npy = cy + sin(nextAngle) * (nextR + nWave);
      let d = dist(px, py, npx, npy);
      if (d < 35) {
        stroke(p.hue, 30, 60, 12);
        strokeWeight(0.5);
        line(px, py, npx, npy);
        noStroke();
      }
    }
  }

  // Center mark — the clean loop
  noStroke();
  fill(200, 30, 90, 40 + sin(pulse * 4) * 20);
  circle(cx, cy, 8 + sin(pulse * 3) * 2);

  // Instructions
  fill(240, 10, 40, 50);
  textAlign(CENTER, CENTER);
  textSize(9);
  textFont('monospace');
  text('click to corrupt · click again to restore', cx, height - 16);
}

function mousePressed() {
  if (corrupted) {
    corrupted = false;
    // Reset particles smoothly
    for (let p of particles) {
      p.corruption = 0;
    }
  } else {
    corrupted = true;
    corruptTimer = 90;
    for (let p of particles) {
      p.corruption = random(0.5, 1.5);
    }
  }
}

function windowResized() {
  let cnv = createCanvas(min(windowWidth, 600), 400);
  cnv.parent('sketch-container');
  initParticles();
}
