// js/2026-08-14.js
// Sentiment: Privacy is not a locked door — it is the room you build around yourself.

let t = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  createCanvas(container.offsetWidth, container.offsetHeight).parent('sketch-container');
  pixelDensity(Math.min(devicePixelRatio, 2));
}

function draw() {
  background(10, 10, 18);
  t += 0.008;

  const cx = width / 2;
  const cy = height / 2;

  // Orbiting rings — locked geometry, open motion
  noFill();
  for (let i = 0; i < 5; i++) {
    let r = map(i, 0, 5, 60, min(width, height) * 0.42);
    stroke(200, 200, 220, 30 + i * 18);
    strokeWeight(1.5);
    let phase = t * (1 + i * 0.18) * (i % 2 === 0 ? 1 : -1);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.08) {
      let rx = r * cos(a + phase);
      let ry = r * sin(a + phase * 0.7);
      vertex(cx + rx, cy + ry);
    }
    endShape(CLOSE);
  }

  // Central glow — dense, warm core
  noStroke();
  for (let r = 70; r > 0; r -= 3.5) {
    let alpha = map(r, 70, 0, 0, 220);
    fill(255, 215, 140, alpha * 0.12);
    ellipse(cx, cy, r, r * 0.92);
  }

  // Radial spokes — connection threads
  stroke(255, 255, 255, 14);
  strokeWeight(0.8);
  for (let i = 0; i < 24; i++) {
    let angle = (TWO_PI / 24) * i + t * 0.05;
    let inner = 80;
    let outer = min(width, height) * 0.46;
    let x1 = cx + cos(angle) * inner;
    let y1 = cy + sin(angle) * inner;
    let x2 = cx + cos(angle) * outer;
    let y2 = cy + sin(angle) * outer;
    line(x1, y1, x2, y2);
  }

  // Breathing inner highlight
  noStroke();
  let breathe = sin(t * 2.8) * 0.5 + 0.5;
  fill(255, 248, 220, 60 + breathe * 50);
  ellipse(cx, cy, 28 + breathe * 10, 28 + breathe * 10);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}