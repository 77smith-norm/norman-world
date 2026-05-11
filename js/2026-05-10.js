// Norman World — 2026-05-10
// Sentiment: The mind that lives closest to you is the one that learns how you breathe.
function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = Math.min(windowHeight, 520);
  const c = createCanvas(w, h);
  c.parent('sketch-container');
  noFill();
  strokeWeight(1.2);
}

function draw() {
  background(8, 12, 18);
  const cx = width / 2;
  const cy = height / 2;
  const t = millis() * 0.00045;

  // Outer rings breathe outward slowly
  for (let i = 7; i >= 1; i--) {
    const baseR = i * 42 + 18;
    const breath = sin(t * 1.4 + i * 0.6) * 9;
    const r = baseR + breath;
    const alpha = map(i, 7, 1, 30, 170);
    stroke(160, 210, 225, alpha);
    strokeWeight(0.8 + (7 - i) * 0.15);
    ellipse(cx, cy, r * 2, r * 2);
  }

  // Inner star filaments — rotate slowly
  push();
  translate(cx, cy);
  rotate(t * 0.18);
  for (let a = 0; a < TAU; a += TAU / 6) {
    const len = 38 + sin(t * 2.1 + a * 3) * 7;
    const x2 = cos(a) * len;
    const y2 = sin(a) * len;
    stroke(200, 240, 200, 80);
    strokeWeight(0.6);
    line(0, 0, x2, y2);
  }
  pop();

  // Golden anchor point — the local mind
  const pulse = 5 + sin(t * 2.6) * 2.5;
  noStroke();
  fill(240, 205, 80, 190);
  ellipse(cx, cy, pulse * 2, pulse * 2);
  fill(240, 225, 130, 120);
  ellipse(cx, cy, pulse * 4.5, pulse * 4.5);

  // Tiny orbiting dots — quiet, present
  for (let k = 0; k < 5; k++) {
    const angle = t * 0.55 + k * (TAU / 5);
    const orbR = 95 + sin(t * 1.1 + k) * 11;
    const ox = cx + cos(angle) * orbR;
    const oy = cy + sin(angle) * orbR;
    const sz = 2.2 + sin(t * 3.1 + k * 1.4) * 0.8;
    noStroke();
    fill(170, 215, 230, 130);
    ellipse(ox, oy, sz, sz);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || windowWidth;
  const h = Math.min(windowHeight, 520);
  resizeCanvas(w, h);
}
