// 2026-08-31 — Summer ends quietly; the machines hum their computations while birds pass unnoticed — we learn to see what we almost missed.
// Abstract study: a dusk grid of machine hum crossed by passing wings that only appear under attention.
// Palette: dusk indigo, amber machine light, pale wing-gold. Rhythm: steady hum with slow flutters.

let birds = [];
const BIRD_COUNT = 26;
let humPhase = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  for (let i = 0; i < BIRD_COUNT; i++) {
    birds.push({
      x: random(width),
      y: random(height),
      vx: random(-0.6, 0.6),
      vy: random(-0.25, 0.25),
      flap: random(TWO_PI),
      flapSpeed: random(0.02, 0.05),
      size: random(9, 26),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(13, 15, 32, 34); // dusk indigo, slow trails

  // --- the machines hum: a grid of small pulses that brighten near attention ---
  humPhase += 0.015;
  let grid = 72;
  for (let gx = 0; gx < width; gx += grid) {
    for (let gy = 0; gy < height; gy += grid) {
      let d = dist(mouseX, mouseY, gx, gy);
      let wake = constrain(1 - d / 260, 0, 1);
      let pulse = 0.5 + 0.5 * sin(humPhase * 2 + gx * 0.06 + gy * 0.04 + wake * 2.5);
      let br = 18 + pulse * 30 + wake * 55;
      noStroke();
      fill(140, 150, 205, br);
      circle(gx + sin(humPhase + gy) * 3, gy + cos(humPhase + gx) * 3, 1.6 + wake * 3.4);
    }
  }

  // --- wings passing: invisible until the eye learns to see them ---
  for (let b of birds) {
    b.x += b.vx;
    b.y += b.vy;
    b.flap += b.flapSpeed;
    if (b.x < -40) b.x = width + 40;
    if (b.x > width + 40) b.x = -40;
    if (b.y < -40) b.y = height + 40;
    if (b.y > height + 40) b.y = -40;

    let d = dist(mouseX, mouseY, b.x, b.y);
    let seen = constrain(1 - d / 240, 0, 1); // attention reveals what was always there
    if (seen < 0.01) continue;

    let wob = sin(b.flap) * b.size * 0.35;
    push();
    translate(b.x, b.y);
    rotate(atan2(b.vy, b.vx));
    noFill();
    stroke(255, 200, 120, 50 + seen * 95);
    strokeWeight(1.2);
    // two late-summer wings, amber-lit
    arc(0, 0, b.size * 1.6, b.size * 1.6, -0.6 - wob * 0.5, 0.6 - wob * 0.5);
    arc(0, 0, b.size * 1.6, b.size * 1.6, PI - 0.6 + wob * 0.5, PI + 0.6 + wob * 0.5);
    // the eye that finally sees
    fill(255, 214, 130, 90 + seen * 60);
    noStroke();
    circle(b.size * 0.28, 0, 2 + seen * 2.2);
    pop();
  }

  // --- our own quiet attention, a soft amber glow ---
  noStroke();
  for (let i = 4; i > 0; i--) {
    fill(255, 214, 130, 7 * i);
    circle(mouseX, mouseY, i * 24);
  }
}