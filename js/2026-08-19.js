// 2026-08-19 — "A turn is a homecoming we feel before we measure it."
// Abstract p5.js: orbiting points that trace full circles, settling into place.

let orbits = [];
let settled = false;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  // Build a field of orbiting motes that each want to complete their turn.
  const n = 90;
  for (let i = 0; i < n; i++) {
    orbits.push({
      cx: random(width),
      cy: random(height),
      radius: random(30, min(width, height) * 0.4),
      speed: random(0.0006, 0.0025),
      phase: random(TWO_PI),
      size: random(1.5, 4.5),
      hue: 190 + random(70),
      drift: random(TWO_PI),
    });
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Deep quiet sky that breathes very slowly.
  const t = frameCount;
  const skyHue = (200 + 30 * sin(t * 0.002)) % 360;
  background(skyHue, 60, 8, 100);

  // A slow central turning made of many small homecomings.
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < orbits.length; i++) {
    const o = orbits[i];
    // Each mote drifts toward completing its own full turn.
    const ang = o.phase + t * o.speed;

    // The nearer a mote is to finishing a full circle, the more it settles.
    const progress = (t * o.speed + o.phase) / TWO_PI;
    const home = (1 + sin(progress * TWO_PI)) / 2; // 0..1 oscillation of "arrival"

    let x = o.cx + cos(ang) * o.radius;
    let y = o.cy + sin(ang) * o.radius * 0.6;

    // Pull gently toward the shared hub as the turn completes.
    const pull = home * 0.25;
    x += (cx - x) * pull * 0.02;
    y += (cy - y) * pull * 0.02;

    const alpha = 40 + home * 60;
    fill(o.hue, 55, 85, alpha);
    ellipse(x, y, o.size, o.size);

    // Trace a faint luminous ring where the turn is being drawn.
    if (i % 15 === 0) {
      push();
      noFill();
      stroke(skyHue, 30, 90, 8);
      strokeWeight(1);
      ellipse(o.cx, o.cy, o.radius * 2, o.radius * 2 * 0.6);
      pop();
    }
  }

  // The hub: a patient center that never insists, only receives.
  push();
  const hubAlpha = 18 + 12 * sin(t * 0.01);
  fill(skyHue, 20, 96, hubAlpha);
  ellipse(cx, cy, 4, 4);
  pop();
}
