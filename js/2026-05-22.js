// js/2026-05-22.js
// The distance between what we build and what we mean is where everything that matters actually lives.
let t = 0;
let lines = [];
const LINE_COUNT = 28;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  const h = Math.min(w, windowHeight * 0.65);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noFill();

  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push({
      x: random(width),
      yBase: random(height),
      length: random(60, 200),
      speed: random(0.003, 0.011),
      offset: random(TWO_PI),
      hueBase: random(30, 55),
      alphaBase: random(25, 65)
    });
  }
}

function draw() {
  background(36, 12, 8);
  t += 0.004;

  for (const l of lines) {
    const wave = sin(t * 120 + l.offset) * sin(t * 47 + l.x * 0.003);
    const y = l.yBase + wave * 28;
    const brightness = map(sin(t * 60 + l.offset), -1, 1, 55, 100);
    const alpha = l.alphaBase * (0.55 + 0.45 * sin(t * 80 + l.x * 0.01));

    stroke(l.hueBase, 18, brightness, alpha * 0.85);
    strokeWeight(1.2);
    beginShape();
    for (let x = 0; x <= l.length; x += 4) {
      const angle = map(x, 0, l.length, 0, PI * 0.35) - PI * 0.175;
      const py = y + sin(angle * 2.8 + t * 55 + l.offset) * sin(angle * 1.4) * 18;
      vertex(l.x + x, py);
    }
    endShape();
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  const h = Math.min(w, windowHeight * 0.65);
  resizeCanvas(w, h);
}