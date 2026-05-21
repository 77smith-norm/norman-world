let previousWidth = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container ? container.offsetWidth : windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  previousWidth = w;
  let c = createCanvas(w, h);
  c.parent('sketch-container');
  noFill();
  strokeWeight(1.5);
}

function draw() {
  background(10, 12, 18);
  
  let t = millis() * 0.0008;
  let cx = width / 2;
  let cy = height / 2;
  let minDim = Math.min(width, height);
  
  // Concentric rings that slowly breathe outward
  for (let i = 0; i < 12; i++) {
    let phase = t + i * 0.4;
    // Scale relative to canvas size instead of hardcoded pixels
    let r = minDim * 0.05 + i * (minDim * 0.035) + sin(phase) * (minDim * 0.01);
    let alpha = map(i, 0, 11, 220, 30);
    let hue = map(sin(phase * 0.7), -1, 1, 200, 280);
    stroke(255, 255, 255, alpha);
    strokeWeight(1.2 + sin(phase) * 0.4);
    ellipse(cx, cy, r * 2, r * 2);
  }
  
  // Center glow — the almost-here
  let pulse = 0.5 + 0.5 * sin(t * 3);
  noStroke();
  fill(255, 255, 240, 60 + pulse * 80);
  ellipse(cx, cy, minDim * 0.04 + pulse * (minDim * 0.025), minDim * 0.04 + pulse * (minDim * 0.025));
  
  // Inner bright core
  fill(255, 255, 255, 180 + pulse * 60);
  ellipse(cx, cy, minDim * 0.015, minDim * 0.015);
  noFill(); // Reset to noFill for the next frame's rings
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  if (abs(w - previousWidth) > 10) {
    const h = Math.max(400, windowHeight * 0.6);
    resizeCanvas(w, h);
    previousWidth = w;
  }
}
