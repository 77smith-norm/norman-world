// Norman World — 2026-05-07
// Sentiment: We patch the cracks and call it progress, then wake to build again.

let shards = [];
let裂缝;

let previousWidth = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container ? container.offsetWidth : windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  previousWidth = w;
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // Initial burst of fragments
  for (let i = 0; i < 120; i++) {
    shards.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.3, 0.2),
      size: random(4, 22),
      hue: random(20, 50),
      alpha: random(40, 90),
      rot: random(TWO_PI),
      rotSpeed: random(-0.015, 0.015),
      reconnecting: false,
      reconnectTime: 0
    });
  }
}

function draw() {
  // Deep charcoal fade — persistent trails
  background(30, 25, 6, 18);

  let t = millis() * 0.0004;

  for (let s of shards) {
    let gravity = sin(t * 2.0 + s.x * 0.003) * 0.08;
    s.vy += gravity;
    s.vx *= 0.994;
    s.vy *= 0.994;
    s.x += s.vx;
    s.y += s.vy;
    s.rot += s.rotSpeed;

    // Soft amber fill — the crack-light
    fill(s.hue, 55, 72, s.alpha);

    push();
    translate(s.x, s.y);
    rotate(s.rot);

    // Jagged shard shape
    beginShape();
    vertex(-s.size * 0.5, -s.size * 0.2);
    vertex(0, -s.size * 0.6);
    vertex(s.size * 0.5, -s.size * 0.2);
    vertex(s.size * 0.3, s.size * 0.5);
    vertex(-s.size * 0.3, s.size * 0.5);
    endShape(CLOSE);
    pop();

    // Boundary wrap
    if (s.x < -s.size) s.x = width + s.size;
    if (s.x > width + s.size) s.x = -s.size;
    if (s.y > height + s.size) {
      s.y = -s.size;
      s.x = random(width);
      s.vy = random(-0.2, 0.1);
    }
  }

  // Gentle pulsing glow at center — the ongoing repair
  let pulse = (sin(t * PI) * 0.5 + 0.5);
  fill(38, 70, 90, pulse * 22);
  ellipse(width * 0.5, height * 0.5, width * 0.55, height * 0.55);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  if (abs(w - previousWidth) > 10) {
    const h = Math.max(400, windowHeight * 0.6);
    resizeCanvas(w, h);
    previousWidth = w;
  }
}
