// Norman World — 2026-08-01
// Sentiment: The tools we build to think for us eventually become the shape of what we think.
// Inspiration: teenage inventor's workshop, blue monitor glow, brass gears as constellations

let particles = [];
const PALETTE = ['#E8D5B7', '#C9A84C', '#7A9EC9', '#2D3A4A', '#F5EFE0'];
const NUM = 60;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(4, 18),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      hue: random(30, 60), // gold-warm
      phase: random(TWO_PI),
    });
  }
}

function draw() {
  background(220, 30, 10, 8);
  noStroke();

  // Monitor blue glow gradient — top quadrant
  for (let y = 0; y < height * 0.4; y++) {
    const t = y / (height * 0.4);
    fill(210, 60, 15 + t * 20, 30 * (1 - t));
    rect(0, y, width, 1);
  }

  // Gears — ellipses with tooth-like arcs
  push();
  translate(width * 0.5, height * 0.55);
  rotate(frameCount * 0.003);
  drawGear(0, 0, 80, 12, 0.4);
  pop();

  push();
  translate(width * 0.22, height * 0.38);
  rotate(-frameCount * 0.005);
  drawGear(0, 0, 45, 8, 0.3);
  pop();

  push();
  translate(width * 0.78, height * 0.42);
  rotate(frameCount * 0.004);
  drawGear(0, 0, 55, 10, 0.35);
  pop();

  // Floating particles — gear-dust constellation
  for (let p of particles) {
    p.angle += p.speed;
    p.x += cos(p.angle) * 0.4;
    p.y += sin(p.angle * 0.7) * 0.25;
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;

    const twinkle = sin(frameCount * 0.04 + p.phase);
    const alpha = map(twinkle, -1, 1, 20, 70);
    fill(p.hue, 40, 90, alpha);
    ellipse(p.x, p.y, p.r, p.r);
    // Tiny star highlight
    fill(40, 10, 100, alpha * 0.6);
    ellipse(p.x - p.r * 0.15, p.y - p.r * 0.15, p.r * 0.25, p.r * 0.25);
  }
}

function drawGear(cx, cy, r, teeth, toothH) {
  const steps = teeth * 2;
  fill(30, 25, 75, 70);
  for (let i = 0; i < steps; i++) {
    const a1 = (i / steps) * TWO_PI;
    const a2 = ((i + 0.5) / steps) * TWO_PI;
    const a3 = ((i + 1) / steps) * TWO_PI;
    beginShape();
    vertex(cx + cos(a1) * r, cy + sin(a1) * r);
    vertex(cx + cos(a2) * (r + toothH * 8), cy + sin(a2) * (r + toothH * 8));
    vertex(cx + cos(a3) * r, cy + sin(a3) * r);
    endShape(CLOSE);
  }
  // Inner hole
  fill(220, 30, 10, 0);
  ellipse(cx, cy, r * 0.35, r * 0.35);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}