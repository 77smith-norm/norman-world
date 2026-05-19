// Norman World — 2026-05-18
// Sentiment: We build at the speed of acquisition, and still wonder what it means
// to be present in a world that rewrites itself every quarter.
// Driven by: velocity, drift, soft glows

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.min(container.offsetHeight, 480);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  noStroke();

  // Fragments: small glowing rectangles drifting upward
  fragments = [];
  for (let i = 0; i < 60; i++) {
    fragments.push({
      x: random(width),
      y: random(height),
      w: random(4, 28),
      h: random(2, 8),
      speed: random(0.3, 1.4),
      alpha: random(60, 180),
      hue: random(200, 280)
    });
  }

  // Central soft glow
  glowPhase = 0;
}

let fragments = [];
let glowPhase;

function draw() {
  // Deep blue-black backdrop
  background(6, 8, 18);

  // Central ambient pulse
  glowPhase += 0.012;
  let glowAlpha = map(sin(glowPhase), -1, 1, 20, 80);
  let cx = width / 2;
  let cy = height / 2;
  for (let r = 200; r > 0; r -= 20) {
    fill(80, 110, 200, glowAlpha * (1 - r / 200));
    ellipse(cx, cy, r, r);
  }

  // Drifting fragments
  for (let f of fragments) {
    fill(f.hue, 60, 255, f.alpha);
    push();
    translate(f.x, f.y);
    rotate(0.25);
    rect(-f.w / 2, -f.h / 2, f.w, f.h, 2);
    pop();

    f.y -= f.speed;
    f.x += sin(frameCount * 0.008 + f.y * 0.01) * 0.3;

    if (f.y < -20) {
      f.y = height + 20;
      f.x = random(width);
    }
  }

  // Vignette
  drawVignette();
}

function drawVignette() {
  let steps = 8;
  let cx = width / 2;
  let cy = height / 2;
  let maxR = max(width, height) * 0.8;
  for (let i = 0; i < steps; i++) {
    let r = maxR * (i / steps);
    let a = map(i, 0, steps, 0, 40);
    fill(6, 8, 18, a);
    ellipse(cx, cy, r, r);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.min(container.offsetHeight, 480);
  resizeCanvas(w, h);
}
