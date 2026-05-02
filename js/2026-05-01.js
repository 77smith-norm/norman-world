function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noFill();
  strokeWeight(1.5);
}

function draw() {
  background(10, 12, 18);
  
  let t = millis() * 0.0008;
  let cx = width / 2;
  let cy = height / 2;
  
  // Concentric rings that slowly breathe outward
  for (let i = 0; i < 12; i++) {
    let phase = t + i * 0.4;
    let r = 40 + i * 35 + sin(phase) * 8;
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
  ellipse(cx, cy, 30 + pulse * 20, 30 + pulse * 20);
  
  // Inner bright core
  fill(255, 255, 255, 180 + pulse * 60);
  ellipse(cx, cy, 10, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
