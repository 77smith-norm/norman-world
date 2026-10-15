// 2026-10-14 — "Nobody knows the body's arithmetic. What holds is a small
// room, a warm lamp, and attention that doesn't flinch."
//
// Abstract p5 sketch, no character, no icon. A small room holds one warm pool
// of light. The pool breathes — it widens and narrows on its own slow rhythm,
// the way attention steadies and wanders. Dust drifts inside the beam, lit only
// where the light touches, invisible where it doesn't. The pointer is a hand
// that comes close: move it and the lamp leans toward it, thinning the dark at
// its edge. Nothing here is certain. The room is certain enough.

const NIGHT = [10, 11, 16];    // the room's dark
const LAMP = [244, 205, 128];  // the warm pool of light
const COOL = [104, 130, 172];  // the window going blue

let dust = [];
let pool;      // {x, y, baseR, breathe}
let reach;     // pointer influence

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  seedRoom();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedRoom();
}

function seedRoom() {
  pool = {
    x: width * 0.5,
    y: height * 0.58,
    baseR: min(width, height) * 0.30,
    breathe: random(1000),
  };
  reach = 0;
  dust = [];
  const count = constrain(floor((width * height) / 26000), 40, 160);
  for (let i = 0; i < count; i++) {
    dust.push({
      x: random(width),
      y: random(height),
      r: random(0.6, 2.1),
      vx: random(-0.18, 0.18),
      vy: random(-0.12, -0.34),   // dust drifts slowly upward
      phase: random(1000),
    });
  }
}

function draw() {
  // The dark holds a faint trail, so the light feels like it has a memory.
  background(NIGHT[0], NIGHT[1], NIGHT[2], 44);

  const t = frameCount * 0.01;

  // Where the hand is, if it is anywhere. The lamp leans toward it.
  const hand = mouseX > 0 && mouseY > 0 ? createVector(mouseX, mouseY) : null;
  reach = lerp(reach, hand ? 1 : 0, 0.04);

  // The pool breathes on its own; the hand widens it a little further.
  const breathe = sin(t + pool.breathe) * 0.10 + 1;
  const lean = hand
    ? createVector(
        (hand.x - pool.x) * 0.12 * reach,
        (hand.y - pool.y) * 0.12 * reach
      )
    : createVector(0, 0);
  const cx = pool.x + lean.x;
  const cy = pool.y + lean.y;
  const R = pool.baseR * breathe * (1 + 0.22 * reach);

  // The pool of light: stacked ellipses, warmer and denser toward the center.
  noStroke();
  const rings = 22;
  for (let i = rings; i >= 1; i--) {
    const a = i / rings;
    const rr = R * a;
    const warm = 1 - a;
    const cr = lerp(COOL[0], LAMP[0], warm);
    const cg = lerp(COOL[1], LAMP[1], warm);
    const cb = lerp(COOL[2], LAMP[2], warm);
    fill(cr, cg, cb, 6 + warm * 26);
    ellipse(cx, cy, rr * 2, rr * 1.72);
  }

  // The unmistakable core: one small steady warmth that does not flinch.
  fill(LAMP[0], LAMP[1], LAMP[2], 26);
  ellipse(cx, cy, R * 0.36, R * 0.31);

  // Dust: lit only inside the beam, invisible where the light does not reach.
  for (const d of dust) {
    d.x += d.vx + sin(t * 0.6 + d.phase) * 0.12;
    d.y += d.vy;
    if (d.y < -10) { d.y = height + 10; d.x = random(width); }
    if (d.x < -10) d.x = width + 10;
    if (d.x > width + 10) d.x = -10;

    const dx = (d.x - cx) / (R * 1.15);
    const dy = (d.y - cy) / (R * 0.95);
    const inside = constrain(1 - (dx * dx + dy * dy), 0, 1);
    if (inside <= 0) continue;

    const twinkle = 0.5 + 0.5 * sin(t * 2.2 + d.phase);
    fill(LAMP[0], LAMP[1], LAMP[2], inside * (70 + twinkle * 110));
    ellipse(d.x, d.y, d.r * 2, d.r * 2);
  }

  // The edge of the room: a thin uncertain boundary, never quite fixed.
  noFill();
  stroke(COOL[0], COOL[1], COOL[2], 26 + reach * 20);
  strokeWeight(1);
  beginShape();
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * TWO_PI;
    const wobble = noise(cos(a) * 1.4 + 10, sin(a) * 1.4 + 10, t * 0.35);
    const rr = R * (1.6 + wobble * 0.28);
    vertex(cx + cos(a) * rr * 1.28, cy + sin(a) * rr * 0.94);
  }
  endShape(CLOSE);
}
