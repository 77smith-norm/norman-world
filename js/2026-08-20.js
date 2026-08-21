// 2026-08-20 — Sometimes the old and plain is enough.
// Sentiment drives a slow, warm drift of simple shapes — old dust or
// embers held in the air — that gather toward a quiet glowing center.

let glow = [];
const num = 90;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < num; i++) {
    glow.push({
      x: random(width),
      y: random(height),
      r: random(2, 8),
      hue: random(30, 50),
      drift: random(0.2, 0.8),
      phase: random(TWO_PI),
    });
  }
}

function draw() {
  const t = millis() / 1000;
  // warm fading dusk
  background(35, 40, 12, 8);

  // a soft golden center that everything leans toward
  let cx = width * 0.5 + sin(t * 0.1) * width * 0.03;
  let cy = height * 0.5 + cos(t * 0.13) * height * 0.03;

  for (let g of glow) {
    // lean gently toward center, slow and honest
    let towardX = cx - g.x;
    let towardY = cy - g.y;
    g.x += towardX * 0.0006 * g.drift;
    g.y += towardY * 0.0006 * g.drift;
    // light circulation, like dust in a beam
    g.x += sin(t * 0.5 + g.phase) * 0.3;
    g.y += cos(t * 0.4 + g.phase) * 0.3;

    let d = dist(g.x, g.y, cx, cy);
    let a = map(d, 0, max(width, height) * 0.7, 55, 15);
    noStroke();
    fill(g.hue, 60, 80, a);
    circle(g.x, g.y, g.r * 2);

    // faint connection to the center when close
    if (d < 140) {
      stroke(g.hue, 55, 85, map(d, 0, 140, 18, 3));
      strokeWeight(0.6);
      line(g.x, g.y, cx, cy);
    }
  }

  // the quiet glow itself
  noStroke();
  fill(48, 90, 95, 18);
  circle(cx, cy, 120 + sin(t * 1.2) * 8);
  fill(48, 95, 100, 40);
  circle(cx, cy, 46);
  fill(50, 30, 100, 70);
  circle(cx, cy, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
