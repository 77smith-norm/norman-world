// 2026-08-29 — "We grow blind to what we know by heart,
// while quiet inventions chill the world without a sound."
//
// Dust motes drift in lamplight. The longer the eye rests on
// one, the more it fades into the familiar dark — until a fresh
// glance (the cursor) makes the world vivid again. The silent
// ring in the corner is a machine with no moving parts: it only
// shows itself when you actually look at it.

let motes = [];
let ringAngle = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  const count = Math.min(150, Math.floor((windowWidth * windowHeight) / 8500));
  for (let i = 0; i < count; i++) {
    motes.push(new Mote(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // warm lamplight ground
  background(17, 13, 9);

  // the lamp: a soft amber bloom in the upper left
  for (let i = 0; i < 4; i++) {
    fill(255, 194, 96, 7);
    circle(width * 0.22, height * 0.16, width * (1.0 - i * 0.24));
  }

  // the silent machine: a ring of points that only appears
  // when the eye (cursor) approaches
  ringAngle += 0.0015;
  const rx = width * 0.14;
  const ry = height * 0.10;
  const cx = width * 0.82;
  const cy = height * 0.78;
  const n = 64;
  for (let i = 0; i < n; i++) {
    const a = ringAngle + (TWO_PI * i) / n;
    const px = cx + cos(a) * rx;
    const py = cy + sin(a) * ry * 0.55;
    const d = dist(mouseX, mouseY, px, py);
    const glow = d < 110 ? map(d, 0, 110, 180, 0) : 0;
    if (glow > 2) {
      fill(255, 205, 130, glow * 0.5);
      circle(px, py, 2.4);
    }
  }

  // dust motes
  for (const m of motes) {
    m.update();
    m.show();
  }
}

class Mote {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.14, 0.14);
    this.vy = random(-0.32, -0.06);
    this.r = random(0.5, 2.4);
    this.seen = 0;            // how long the eye has rested on it
    this.tw = random(TWO_PI); // drift phase
  }

  update() {
    this.x += this.vx + sin(frameCount * 0.012 + this.tw) * 0.10;
    this.y += this.vy;
    if (this.y < -12) { this.y = height + 12; this.x = random(width); }
    if (this.x < -12) this.x = width + 12;
    if (this.x > width + 12) this.x = -12;

    // familiarity: attention keeps a mote vivid; neglect fades it
    const d = dist(mouseX, mouseY, this.x, this.y);
    this.seen = d < 90 ? max(0, this.seen - 1.4) : this.seen + 0.16;
  }

  show() {
    const a = 225 * exp(-this.seen / 240) + 8;
    fill(255, 216, 152, constrain(a, 4, 255));
    circle(this.x, this.y, this.r * 2);
  }
}