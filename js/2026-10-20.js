// js/2026-10-20.js
// Inspired by: SimCity made of permits, good type against all odds, Four Years with Decker
// A surveyed grid lays itself down one plot at a time — every cell a small rule kept.
// Slow letterform arcs drift over it, and warm light gathers where a maker stays.

let plots = [];
let arcs = [];
let t = 0;
let cell;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  buildScene();
}

function buildScene() {
  cell = max(32, floor(min(width, height) / 15));
  const cols = ceil(width / cell) + 1;
  const rows = ceil(height / cell) + 1;
  plots = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      plots.push({
        x: i * cell,
        y: j * cell,
        g: -random(0, 0.7),
        speed: random(0.0035, 0.011),
        filled: random(1) < 0.6,
        hue: random(22, 48),
        seed: random(1000)
      });
    }
  }
  arcs = [];
  for (let i = 0; i < 5; i++) {
    arcs.push({
      y: random(height),
      amp: random(28, 120),
      speed: random(0.06, 0.2),
      phase: random(1000),
      hue: random(198, 248),
      w: random(0.7, 1.7)
    });
  }
}

function draw() {
  background(238, 60, 8, 7);
  t += 0.008;

  const mx = mouseX || width * 0.5;
  const my = mouseY || height * 0.5;

  // Warm workshop lamp follows the pointer — where attention stays.
  const lamp = drawingContext.createRadialGradient(mx, my, 0, mx, my, 260);
  lamp.addColorStop(0, 'rgba(255, 226, 178, 0.14)');
  lamp.addColorStop(1, 'rgba(255, 226, 178, 0)');
  drawingContext.fillStyle = lamp;
  drawingContext.beginPath();
  drawingContext.arc(mx, my, 260, 0, TWO_PI);
  drawingContext.fill();

  // Survey lines: the rules already on the ground.
  stroke(34, 30, 52, 8);
  strokeWeight(0.6);
  for (const p of plots) {
    line(p.x, 0, p.x, height);
    line(0, p.y, width, p.y);
  }
  noStroke();

  // Plots appear one by one, hastened where the maker leans in.
  for (const p of plots) {
    const d = dist(mx, my, p.x + cell / 2, p.y + cell / 2);
    const pull = constrain(1 - d / (min(width, height) * 0.7), 0, 1);
    if (p.g < 1) p.g = min(1, p.g + p.speed * (1 + pull * 2.4));
    if (p.g <= 0) continue;
    const e = p.g * p.g * (3 - 2 * p.g);

    // The kept outline.
    noFill();
    stroke(p.hue, 24, 60, 6 + e * 20);
    strokeWeight(0.7);
    rect(p.x + 1.5, p.y + 1.5, cell - 3, cell - 3, 2);

    // A little built light inside some cells.
    if (p.filled) {
      const flick = 0.75 + 0.25 * noise(p.seed, t * 1.6);
      noStroke();
      fill(p.hue, 30, 92, e * 26 * flick);
      ellipse(p.x + cell / 2, p.y + cell / 2, (cell - 14) * e, (cell - 14) * e);
    }
  }

  // Letterform arcs: slow strokes drawn against the odds, drifting across.
  for (const a of arcs) {
    noFill();
    for (let k = 0; k < 2; k++) {
      stroke(a.hue + k * 12, 26, 88, 14 - k * 5);
      strokeWeight(a.w + k * 0.6);
      beginShape();
      for (let x = -20; x <= width + 20; x += 14) {
        const n = noise(x * 0.004 + a.phase, t * a.speed + k * 3);
        const y = a.y + (n - 0.5) * 2 * a.amp + sin(x * 0.01 + t) * 10;
        vertex(x, y);
      }
      endShape();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildScene();
}
