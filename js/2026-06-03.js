let weights = [];
let shapes = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  for (let i = 0; i < 12; i++) {
    weights.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(20, 50),
      speed: random(0.2, 0.6),
      offset: random(TWO_PI)
    });
  }
  for (let i = 0; i < 8; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      speed: random(0.1, 0.3),
      hue: random(200, 260)
    });
  }
}

function draw() {
  background(245, 247, 250);
  noStroke();
  
  // Soft glowing shapes
  for (let s of shapes) {
    fill(s.hue, 40, 90, 60);
    ellipse(s.x, s.y, s.size * 1.5);
    s.y += sin(frameCount * 0.01 + s.speed) * s.speed;
    s.x += cos(frameCount * 0.005) * 0.3;
    if (s.y > height) s.y = 0;
    if (s.x > width) s.x = 0;
  }
  
  // Hanging weights in balance
  stroke(60, 70, 90);
  strokeWeight(2);
  for (let w of weights) {
    let sway = sin(frameCount * 0.02 + w.offset) * 8;
    let targetY = height * 0.5 + sin(frameCount * 0.01) * 20;
    w.y = lerp(w.y, targetY, 0.02);
    line(w.x, 50, w.x + sway, w.y - w.size / 2);
    fill(80, 85, 95);
    ellipse(w.x + sway, w.y, w.size, w.size * 0.6);
  }
  
  // Subtle grid lines suggesting code patterns
  stroke(200, 210, 220, 40);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}