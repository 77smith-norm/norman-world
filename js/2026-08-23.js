// 2026-08-23 — What we own becomes what owns us; the only things we truly keep are the ones we learn to let go.
// Held shapes drift upward and dissolve; a thin golden thread stays, unbent, through the whole letting-go.

let held = [];
const num = 90;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < num; i++) {
    held.push({
      x: random(width),
      y: random(height),
      size: random(3, 16),
      hue: random([28, 38, 44, 210, 225, 240]),
      turn: random(0.3, 1.0),          // when it begins to loosen its grip
      speed: random(0.15, 0.6),
      phase: random(TWO_PI),
      waver: random(0.4, 1.2),
      linger: random(0.3, 1.0),        // how long it stays visible after release
    });
  }
}

function draw() {
  const t = millis() / 1000;
  // cool air of the room where we set things down
  background(212, 38, 8, 12);

  for (let h of held) {
    // before its turn: small orbits — held close, still ours
    // after: a slow rise, widening, thinning toward the window light
    let released = (sin(t * 0.18 + h.phase * 2) + 1) / 2;
    released = pow(released, h.turn);

    h.x += sin(t * h.waver + h.phase) * 0.3 * (1 + released);
    h.y -= (0.1 + h.speed * (0.4 + released));

    // wrap
    if (h.x < -20) h.x = width + 20;
    if (h.x > width + 20) h.x = -20;
    if (h.y < -20) h.y = height + 20;

    // fade with the release; the loosened thing becomes light, then air
    let alpha = (1 - released * h.linger) * (30 + 40 * (0.5 + 0.5 * sin(t * 0.9 + h.phase)));
    if (alpha < 0) alpha = 0;
    let wobble = h.size * (0.6 + 0.4 * released);

    // warm kept things, cool released ones
    if (h.hue < 60) {
      fill(h.hue, 70, 88, alpha);
    } else {
      fill(h.hue, 45, 82, alpha * 0.85);
    }
    noStroke();
    circle(h.x, h.y, wobble * 2);

    // the faint thread of a possession letting go
    if (released > 0.55 && alpha > 4) {
      stroke(h.hue < 60 ? 38 : 218, 55, 85, 5);
      strokeWeight(0.6);
      line(h.x, h.y, h.x - 3, h.y + 6);
    }
  }

  // the one thing not let go — a thin gold thread, steady, quietly keeping
  let cx = width * 0.5 + sin(t * 0.4) * 40;
  let cy = height * 0.55;
  noFill();
  stroke(44, 90, 92, 26);
  strokeWeight(1.2);
  bezier(
    cx - 90, cy + 60,
    cx - 30, cy - 20,
    cx + 30, cy + 20,
    cx + 90, cy - 60
  );
  stroke(48, 55, 96, 40);
  strokeWeight(0.7);
  bezier(
    cx - 90, cy + 62,
    cx - 28, cy - 18,
    cx + 28, cy + 22,
    cx + 90, cy - 58
  );
  // a small steady light at its center
  noStroke();
  fill(46, 85, 94, 30);
  circle(cx, cy, 90 + sin(t * 0.7) * 8);
  fill(48, 90, 99, 45);
  circle(cx, cy, 34);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}