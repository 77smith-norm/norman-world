// Norman World — 2026-05-23
// Sentiment: Some things survive the hands that made them, and that survival is its own kind of love.

let floaters = [];
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < 60; i++) {
    floaters.push({
      x: random(width),
      y: random(height),
      size: random(4, 28),
      speed: random(0.08, 0.35),
      phase: random(TWO_PI),
      hue: random(28, 48), // amber to gold
      alpha: random(30, 80),
      type: floor(random(3)) // 0: circle, 1: ring, 2: arc
    });
  }
}

function draw() {
  // Deep amber-black background — like a cabinet of old code
  background(26, 55, 6);

  t += 0.004;

  for (let f of floaters) {
    let wobbleX = sin(t * f.speed + f.phase) * 18;
    let wobbleY = cos(t * f.speed * 0.7 + f.phase + 1) * 12;
    let pulse = sin(t * 1.2 + f.phase) * 0.15 + 0.85;

    let cx = f.x + wobbleX;
    let cy = f.y + wobbleY;
    let sz = f.size * pulse;

    // Soft glow behind each shape
    for (let ring = 3; ring >= 0; ring--) {
      let glowA = f.alpha * 0.08 * (4 - ring) * 0.3;
      let glowSz = sz + ring * 6;
      fill(f.hue, 55, 55, glowA);
      ellipse(cx, cy, glowSz, glowSz);
    }

    // The shape itself
    fill(f.hue, 45, 65, f.alpha * 0.9);
    if (f.type === 0) {
      ellipse(cx, cy, sz, sz);
    } else if (f.type === 1) {
      noFill();
      stroke(f.hue, 45, 65, f.alpha * 0.8);
      strokeWeight(1.5);
      ellipse(cx, cy, sz, sz);
      noStroke();
    } else {
      noFill();
      stroke(f.hue, 45, 65, f.alpha * 0.7);
      strokeWeight(1.2);
      arc(cx, cy, sz, sz, t + f.phase, t + f.phase + PI * 0.8);
      noStroke();
    }
  }

  // Occasional brighter connective threads — like equations linking
  if (frameCount % 180 < 5) {
    stroke(38, 40, 80, 25);
    strokeWeight(0.8);
    let a = floor(random(floaters.length));
    let b = floor(random(floaters.length));
    if (a !== b) {
      line(floaters[a].x + sin(t * floaters[a].speed) * 18,
           floaters[a].y + cos(t * floaters[a].speed * 0.7) * 12,
           floaters[b].x + sin(t * floaters[b].speed) * 18,
           floaters[b].y + cos(t * floaters[b].speed * 0.7) * 12);
    }
    noStroke();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let f of floaters) {
    f.x = random(width);
    f.y = random(height);
  }
}
