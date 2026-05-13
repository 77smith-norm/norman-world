// js/2026-05-12.js — Norman World Daily Sketch
// Sentiment: The space between what we know and what we say is where the interesting work happens.
// Themes: communication, expertise, distillation, soft light, depth

let particles = [];
const NUM = 120;
let t = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.round(w * 0.55);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');

  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 5),
      ox: random(width),
      oy: random(height),
      spd: random(0.002, 0.006),
      phase: random(TWO_PI),
    });
  }

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  // Deep dusk gradient — dark indigo fading to soft amber at horizon
  background(220, 35, 8);
  noStroke();

  // Horizon glow
  for (let y = height * 0.5; y < height; y++) {
    const f = (y - height * 0.5) / (height * 0.5);
    fill(35, 60, 90, f * 60);
    rect(0, y, width, 1);
  }

  // Particles drift between memory and motion
  for (let p of particles) {
    const dx = p.ox + sin(t * p.spd * 200 + p.phase) * 60 - p.x;
    const dy = p.oy + cos(t * p.spd * 150 + p.phase) * 40 - p.y;
    p.x += dx * 0.015;
    p.y += dy * 0.015;

    const hue = map(dist(p.x, p.y, width / 2, height * 0.55), 0, width * 0.7, 180, 40);
    const sat = map(dist(p.x, p.y, p.ox, p.oy), 0, 80, 70, 30);
    const bri = map(dist(p.x, p.y, width / 2, height * 0.55), 0, width * 0.5, 85, 40);

    fill(hue, sat, bri, 75);
    circle(p.x, p.y, p.r * 2);
  }

  // A faint ring — the edge of what we can say
  noFill();
  stroke(200, 20, 80, 20);
  strokeWeight(0.8);
  const ringR = width * 0.28 + sin(t * 0.3) * 20;
  circle(width / 2, height * 0.55, ringR);

  t += 0.01;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.round(w * 0.55);
  resizeCanvas(w, h);
}