let stars = [];
let focus;
let pulsePhase = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  pixelDensity(1);

  // Generate scattered stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.7),
      size: random(1, 3.5),
      brightness: random(150, 255),
      twinkleSpeed: random(0.01, 0.04),
      twinkleOffset: random(TWO_PI)
    });
  }

  // Distant planet focus point
  focus = { x: width * 0.62, y: height * 0.22, radius: min(width, height) * 0.045 };
}

function draw() {
  // Deep night sky gradient
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let r = lerp(8, 25, t);
    let g = lerp(10, 35, t);
    let b = lerp(35, 55, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }

  // Soft horizon glow
  noStroke();
  for (let i = 0; i < 80; i++) {
    let t = i / 80;
    let a = (1 - t) * 18;
    fill(40, 50, 80, a);
    ellipse(width * 0.5, height, width * (1 + t * 0.8), height * 0.25 * (1 - t));
  }

  // Draw stars with twinkling
  noStroke();
  for (let s of stars) {
    let twinkle = sin(frameCount * s.twinkleSpeed + s.twinkleOffset);
    let alpha = map(twinkle, -1, 1, 100, s.brightness);
    fill(220, 230, 255, alpha);
    ellipse(s.x, s.y, s.size, s.size);
  }

  // Distant planet glow
  let pulse = sin(pulsePhase) * 0.15 + 1;
  pulsePhase += 0.008;

  for (let i = 6; i >= 0; i--) {
    let t = i / 6;
    let r = focus.radius * (1 + t * 2.5) * pulse;
    fill(120, 180, 255, 5 + t * 3);
    ellipse(focus.x, focus.y, r, r);
  }

  // Planet body
  fill(160, 200, 255, 200);
  ellipse(focus.x, focus.y, focus.radius * 2, focus.radius * 2);
  fill(140, 190, 255, 80);
  ellipse(focus.x - focus.radius * 0.3, focus.y - focus.radius * 0.2, focus.radius * 0.8, focus.radius * 0.8);

  // Ground silhouette
  noStroke();
  fill(18, 25, 40, 220);
  beginShape();
  vertex(0, height);
  vertex(0, height * 0.85);
  for (let x = 0; x <= width; x += 20) {
    let h = height * 0.85 + sin(x * 0.008 + 2) * 15 + sin(x * 0.02) * 5;
    vertex(x, h);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Grass tufts on the ridge
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let baseY = height * 0.85 + sin(x * 0.008 + 2) * 15 + sin(x * 0.02) * 5;
    let h = random(4, 12);
    let sway = sin(frameCount * 0.02 + x * 0.1) * 2;
    stroke(30, 55, 45, 120);
    strokeWeight(1);
    line(x, baseY, x + sway, baseY - h);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.7),
      size: random(1, 3.5),
      brightness: random(150, 255),
      twinkleSpeed: random(0.01, 0.04),
      twinkleOffset: random(TWO_PI)
    });
  }
  focus = { x: width * 0.62, y: height * 0.22, radius: min(width, height) * 0.045 };
}
