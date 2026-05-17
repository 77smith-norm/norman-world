// Norman World — 2026-05-16
// Sentiment: "We build instruments to measure what we cannot hold, and call the signal we find there truth."

let t = 0;
let waves = [];

function setup() {
  const cnv = createCanvas(600, 400);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noFill();

  // Three layered signal waves
  for (let i = 0; i < 3; i++) {
    waves.push({
      phase: i * TWO_PI / 3,
      speed: 0.008 + i * 0.003,
      amp: 60 - i * 15,
      freq: 2 + i * 0.5,
      hue: 200 + i * 20,
      alpha: 70 - i * 15
    });
  }
}

function draw() {
  background(240, 10, 10, 100);

  // Draw layered signal waves
  for (let w of waves) {
    stroke(w.hue, 40, 90, w.alpha);
    strokeWeight(1.5);
    beginShape();
    for (let x = 0; x <= width; x += 2) {
      let y = height / 2;
      y += sin((x * w.freq * 0.01) + t * w.speed * 60 + w.phase) * w.amp;
      y += sin((x * w.freq * 0.02) + t * w.speed * 30) * w.amp * 0.4;
      y += sin((x * w.freq * 0.005) + t * 0.5) * w.amp * 0.2;
      vertex(x, y);
    }
    endShape();
  }

  // Floating measurement markers — small ticks that drift
  stroke(180, 20, 100, 40);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let x = (width / 8) * i + 20;
    let y = height / 2 + sin(t * 0.3 + i) * 120;
    let len = 6 + sin(t * 0.5 + i * 0.7) * 4;
    line(x, y - len / 2, x, y + len / 2);
  }

  // Subtle center pulse
  let pulse = abs(sin(t * 0.8)) * 4 + 1;
  noStroke();
  fill(200, 30, 100, 20);
  circle(width / 2, height / 2, pulse * 8);

  t += 1;
}

function windowResized() {
  resizeCanvas(600, 400);
}