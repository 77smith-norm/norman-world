// 2026-08-25 — Every new sensor promises to reveal us to ourselves, but the deepest signals were already there — waiting to be noticed.
// A dusky room of quiet signals: one warm sensor pulse breathes a slow heartbeat, and dormant points along the dark wake as its light passes over them.

let signals = [];
const numSignals = 150;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < numSignals; i++) {
    signals.push({
      x: random(width),
      y: random(height * 0.92),
      base: random(1.2, 3.6),      // resting size — the signal was always there
      phase: random(TWO_PI),
      drift: random(0.2, 1.1),
      hue: (random() < 0.8) ? random(208, 244) : random(36, 52), // cool dusk, few warm
    });
  }
}

function draw() {
  const t = millis() / 1000;

  // deep dusk, held still
  background(228, 52, 7);

  // the sensor pulse — a heartbeat: two quick beats per cycle
  const beat = (sin(t * 1.7) + 0.6 * sin(t * 3.4) + 1.6) / 3.2; // 0..1
  const pulse = beat * beat;
  const px = mouseX || width * 0.5;
  const py = mouseY || height * 0.42;
  const glowR = 50 + pulse * 280;

  // soft glow field the sensor casts across the dark
  for (let ring = 0; ring < 3; ring++) {
    const rr = glowR * (0.5 + ring * 0.32);
    noFill();
    stroke(48, 88, 92, (60 - ring * 18) * (0.4 + pulse * 0.5));
    strokeWeight(1.1 + ring * 0.9);
    circle(px, py, rr * 2);
  }

  // dormant signals — most stay quiet; a few wake as the light passes
  for (const s of signals) {
    const d = dist(px, py, s.x, s.y);
    const wake = constrain(1 - d / (glowR * 1.7), 0, 1);
    const tw = 0.6 + 0.4 * sin(t * s.drift + s.phase);
    const size = s.base * (1 + wake * 2.4 * tw);
    const alpha = 14 + wake * 72;
    fill(s.hue, 68, 38 + wake * 58, alpha);
    noStroke();
    circle(s.x + sin(t * 0.4 + s.phase) * 9, s.y + cos(t * 0.31 + s.phase) * 6, size);
  }

  // the heartbeat trace — a wavering line recording what was always there
  noFill();
  stroke(44, 60, 90, 26);
  strokeWeight(1);
  beginShape();
  for (let x = 0; x <= width; x += 14) {
    const wob = sin(x * 0.012 + t * 0.7) * 0.5 + sin(x * 0.031 - t * 0.9) * 0.5;
    const spike = pow(max(0, sin(x * 0.02 - t * 1.1)), 7) * 26 * pulse;
    vertex(x, height * 0.86 + wob * 12 + spike);
  }
  endShape();

  // the first stars above — signals needing no instrument
  for (let i = 0; i < 26; i++) {
    const sx = (i * 97.3) % width;
    const sy = 12 + (i * 53.7) % (height * 0.24);
    const tw = 0.5 + 0.5 * sin(t * (0.5 + i * 0.03) + i * 2.1);
    fill(210, 12, 96, 20 + tw * 50);
    circle(sx, sy, 1 + tw * 1.8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}