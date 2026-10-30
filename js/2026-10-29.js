// 2026-10-29
// Sentiment: "A world model on a wrist; a planetarium in a terminal; the biggest minds given away free — everything vast is learning to be small."
// Abstract study: nested skies. One rectangle of stars holds a slightly smaller rectangle of stars, and so on
// down past the point where the box should have run out of room to be infinite. Each level is dimmer and denser
// than its parent. The whole thing breathes a fraction of a pixel per beat, which is enough to notice if you wait.
// No character lives here; only a sky agreeing to be folded.

const MAX_DEPTH = () => constrain(floor(min(width, height) / 58), 7, 16);
const OUTER_STARS = () => constrain(floor((width * height) / 5200), 90, 420);

let depthLevels = [];
let outerStars = [];
let drift = 0;
let pulse = 0;
let hover = 0;
let beatClock = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  build();
}

function build() {
  outerStars = [];
  for (let i = 0; i < OUTER_STARS(); i++) {
    outerStars.push({
      x: random(width),
      y: random(height),
      r: random(0.4, 1.5),
      a: random(40, 130),
      s: random(0.2, 1.1),
      ph: random(TWO_PI)
    });
  }

  // Each level: a box, inset from its parent, with its own little sky inside.
  depthLevels = [];
  let w = width * 0.62;
  let h = height * 0.52;
  let cx = width * 0.5;
  let cy = height * 0.52;
  const levels = MAX_DEPTH();

  for (let d = 0; d < levels; d++) {
    const stars = [];
    const count = floor(constrain((w * h) / 1500, 6, 190));
    for (let i = 0; i < count; i++) {
      stars.push({
        u: random(1),
        v: random(1),
        r: random(0.5, 1.9) * (1 - d * 0.03),
        a: random(55, 210),
        ph: random(TWO_PI),
        sp: random(0.4, 1.6)
      });
    }
    depthLevels.push({ cx, cy, w, h, stars, d });
    w *= 0.68;
    h *= 0.68;
    cx += w * 0.06;
    cy -= h * 0.05;
  }
}

function draw() {
  const breathe = sin(beatClock * 0.32) * 0.5 + 0.5;
  beatClock += 0.01 + hover * 0.02;

  hover = lerp(hover, constrain(map(mouseX + mouseY, 0, width + height, 0, 1), 0, 1), 0.04);
  pulse = max(pulse * 0.94, 0);

  background(9, 11, 24);

  // The sky outside the boxes: sparse, slow, indifferent.
  drift += 0.16;
  noStroke();
  for (const s of outerStars) {
    const y = (s.y + drift * s.s) % (height + 40) - 20;
    const tw = 0.6 + 0.4 * sin(beatClock * s.ph + s.ph);
    fill(214, 222, 255, s.a * tw * (0.55 + hover * 0.35));
    circle(s.x + sin(beatClock * 0.4 + s.ph) * 6, y, s.r * 2);
  }

  // Nested skies, drawn innermost-first so each frame's veil sits over the one behind.
  for (let k = depthLevels.length - 1; k >= 0; k--) {
    const L = depthLevels[k];
    const grow = pulse * (L.d * 0.5) - hover * (1 - L.d / depthLevels.length) * 2.5;
    const w = max(6, L.w + grow);
    const h = max(4, L.h + grow);
    const x = L.cx - w / 2;
    const y = L.cy - h / 2;

    // The box itself: a held breath, not a window.
    noFill();
    stroke(120, 150, 220, 26 + 22 * (1 - L.d / depthLevels.length));
    strokeWeight(1);
    rect(x, y, w, h, min(w, h) * 0.03);

    // A thin lit edge on the top-left, the way light falls on a bevel.
    stroke(232, 238, 255, 30 + 20 * breathe);
    line(x, y, x + w, y);

    for (const s of L.stars) {
      const sx = x + s.u * w;
      const sy = y + s.v * h;
      const tw = 0.55 + 0.45 * sin(beatClock * s.sp + s.ph);
      noStroke();
      fill(230, 236, 255, s.a * tw);
      circle(sx, sy, max(0.6, s.r * 1.6));
    }
  }

  // The innermost point still has room to hold something smaller than itself.
  const innermost = depthLevels[depthLevels.length - 1];
  noStroke();
  fill(255, 249, 232, 120 + 90 * breathe);
  circle(innermost.cx, innermost.cy, 2.6 + 1.6 * breathe);
}

function mousePressed() {
  pulse = 1;
  beatClock += 0.4;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
}
