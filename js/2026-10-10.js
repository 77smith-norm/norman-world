// 2026-10-10 — "A hand draws a car, a bulb thinks, a branch chooses — the
// machine neither races nor decides; it keeps the shape of being drawn."
//
// Abstract p5 sketch, no character, no icon. Ink strokes drift across a paper
// field, leaving thin trails like lines from a pen. Every so often a stroke
// forks into two and both keep going — a decision model that never arrives at
// a decision. Pointer proximity warms the ink toward a bulb-amber glow, then
// releasing lets the paper cool back to quiet. Nothing ever settles.

const PAPER = [242, 238, 229];
const INK = [28, 30, 38];
const GLOW = [240, 178, 92];

let strokes = [];
let t = 0;
let px = -9999, py = -9999;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  seedStrokes();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedStrokes();
}

function seedStrokes() {
  strokes = [];
  const n = constrain(floor((width * height) / 90000), 5, 16);
  for (let i = 0; i < n; i++) {
    strokes.push(newStroke(random(width), random(height)));
  }
}

function newStroke(x, y) {
  return {
    x, y,
    angle: random(TWO_PI),
    life: 0,
    maxLife: random(220, 520),
    glow: 0,
    fork: false,
    forked: false,
    weight: random(1.1, 2.4),
  };
}

function draw() {
  // Paper never fully clears — old lines stay as faint ghosts, then fade.
  background(PAPER[0], PAPER[1], PAPER[2], 26);
  t += 0.006;

  if (mouseX !== px || mouseY !== py) {
    px = mouseX;
    py = mouseY;
  }

  for (let i = 0; i < strokes.length; i++) {
    const s = strokes[i];

    // Flow field: the pen wanders; the pointer bends nearby lines.
    let a = noise(s.x * 0.0016, s.y * 0.0016, t) * TWO_PI * 2;
    const d = dist(s.x, s.y, px, py);
    if (d < 180) {
      const pull = map(d, 0, 180, 0.9, 0);
      const toward = atan2(py - s.y, px - s.x);
      a = lerp(a, toward, pull);
      s.glow = min(1, s.glow + 0.03);
    } else {
      s.glow = max(0, s.glow - 0.01);
    }
    s.angle = lerp(s.angle, a, 0.12);

    const nx = s.x + cos(s.angle) * 1.5;
    const ny = s.y + sin(s.angle) * 1.5;

    // Ink: cool dark line that warms toward bulb-amber under the pointer.
    const c = [
      lerp(INK[0], GLOW[0], s.glow),
      lerp(INK[1], GLOW[1], s.glow),
      lerp(INK[2], GLOW[2], s.glow),
    ];
    stroke(c[0], c[1], c[2], 130 + s.glow * 110);
    strokeWeight(s.weight + s.glow * 1.4);
    line(s.x, s.y, nx, ny);

    s.x = nx;
    s.y = ny;
    s.life++;

    // A branch chooses — but only to become two more paths. Never one answer.
    if (!s.forked && s.life > s.maxLife * 0.4 && random() < 0.004) {
      const b = newStroke(s.x, s.y);
      b.angle = s.angle + random(0.5, 1.1) * (random() < 0.5 ? -1 : 1);
      b.glow = s.glow;
      b.forked = true;
      strokes.push(b);
      s.forked = true;
    }

    // Strokes run off the paper and much later reappear; the drawing is endless.
    const offscreen =
      s.x < -60 || s.x > width + 60 || s.y < -60 || s.y > height + 60;
    if (offscreen || s.life > s.maxLife) {
      if (random() < 0.6) {
        strokes[i] = newStroke(random(width), random(height));
      } else {
        strokes[i] = newStroke(
          random() < 0.5 ? -20 : width + 20,
          random(height)
        );
      }
    }
  }

  // Keep the field bounded so it never grows without end.
  if (strokes.length > 40) strokes.splice(0, strokes.length - 40);
}
