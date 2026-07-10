// 2026-07-09 — Listening Fields
// Sentiment: What we build to listen eventually listens back — and the quiet between signals is where meaning lives.

let particles = [];
let signals = [];
let cols, rows;
let spacing = 28;
let t = 0;
let canvasW, canvasH;

function setup() {
  let container = document.getElementById('sketch-container');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('sketch-container');
  pixelDensity(1);
  noStroke();
  cols = floor(canvasW / spacing);
  rows = floor(canvasH / spacing);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles.push({
        x: i * spacing + spacing / 2,
        y: j * spacing + spacing / 2,
        ox: i * spacing + spacing / 2,
        oy: j * spacing + spacing / 2,
        r: 1.8,
        phase: random(TWO_PI),
        freq: random(0.3, 0.8),
      });
    }
  }
}

function draw() {
  background(15, 12, 18, 30);

  // Ambient field distortion
  for (let p of particles) {
    let d = dist(mouseX, mouseY, p.x, p.y);
    let influence = max(0, 1 - d / 180);
    let angle = atan2(p.y - mouseY, p.x - mouseX) + sin(t * 0.5 + p.phase) * 0.4;
    let push = influence * 12 * sin(t * p.freq + p.phase);
    p.x = p.ox + cos(angle) * push;
    p.y = p.oy + sin(angle) * push;

    // Base glow
    let baseAlpha = 40 + 30 * sin(t * p.freq + p.phase);
    let proximityBoost = influence * 120;
    fill(180, 200, 255, baseAlpha + proximityBoost);
    ellipse(p.x, p.y, p.r * 2);

    // Inner bright core when near mouse
    if (influence > 0.3) {
      fill(220, 235, 255, influence * 180);
      ellipse(p.x, p.y, p.r);
    }
  }

  // Signal pulses — emerge from random positions, travel outward
  if (frameCount % 90 === 0) {
    signals.push({
      x: random(canvasW),
      y: random(canvasH),
      radius: 0,
      maxRadius: random(80, 200),
      alpha: 120,
      hue: random() > 0.5 ? [160, 190, 255] : [255, 180, 160],
    });
  }

  for (let i = signals.length - 1; i >= 0; i--) {
    let s = signals[i];
    s.radius += 0.8;
    s.alpha -= 0.6;
    noFill();
    stroke(s.hue[0], s.hue[1], s.hue[2], s.alpha);
    strokeWeight(1.2);
    ellipse(s.x, s.y, s.radius * 2);
    noStroke();
    if (s.alpha <= 0 || s.radius > s.maxRadius) {
      signals.splice(i, 1);
    }
  }

  // Mouse presence ring
  if (mouseX > 0 && mouseY > 0) {
    noFill();
    stroke(180, 210, 255, 30 + 20 * sin(t * 2));
    strokeWeight(1);
    ellipse(mouseX, mouseY, 60 + 10 * sin(t));
    noStroke();
  }

  t += 0.016;
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;
  resizeCanvas(canvasW, canvasH);
  particles = [];
  cols = floor(canvasW / spacing);
  rows = floor(canvasH / spacing);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles.push({
        x: i * spacing + spacing / 2,
        y: j * spacing + spacing / 2,
        ox: i * spacing + spacing / 2,
        oy: j * spacing + spacing / 2,
        r: 1.8,
        phase: random(TWO_PI),
        freq: random(0.3, 0.8),
      });
    }
  }
}
