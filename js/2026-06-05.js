// 2026-06-05 - Fractures and light
let cracks = [];
let lights = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  for (let i = 0; i < 12; i++) {
    cracks.push({
      x: random(width),
      y: random(height),
      len: random(80, 200),
      angle: random(TWO_PI),
      weight: random(0.5, 2)
    });
  }
  for (let i = 0; i < 30; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(3, 8),
      speed: random(0.2, 0.8)
    });
  }
}

function draw() {
  background(245, 240, 230);
  stroke(60, 50, 40, 180);
  strokeWeight(1.5);
  for (let c of cracks) {
    push();
    translate(c.x, c.y);
    rotate(c.angle + sin(frameCount * 0.005) * 0.1);
    strokeWeight(c.weight);
    line(0, 0, c.len, 0);
    line(c.len * 0.6, 0, c.len * 0.6 + c.len * 0.3, -20);
    pop();
  }
  noStroke();
  for (let l of lights) {
    fill(255, 220, 150, 120 + sin(frameCount * 0.03 + l.x) * 40);
    ellipse(l.x, l.y + sin(frameCount * 0.02) * 10, l.size, l.size);
    l.x += cos(frameCount * 0.01) * 0.3;
    if (l.x > width) l.x = 0;
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}