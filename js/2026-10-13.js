// 2026-10-13 — "Sound is touch the air agrees to carry, then forgets — proof
// something moved through, even after the moving ends."
//
// Abstract p5 sketch, no character, no icon. A field of horizontal strings
// hangs in dim air. Each one is still until something disturbs it. The pointer
// is a fingertip: sweep past and the nearby strings shiver, then settle. Every
// disturbance pushes a ring of pressure outward through the air, a slow ripple
// that fades as it travels and is gone. Motion is touch; the ring is only the
// memory of it, widening until nothing is left but the quiet it moved through.

const AIR = [12, 14, 20];      // the dim room
const GOLD = [244, 206, 122];  // warm pressure, near the touch
const DUSK = [126, 168, 214];  // cool air, far out

let strings = [];
let ripples = [];
let lastTouch = null;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  seedStrings();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedStrings();
  ripples = [];
}

function seedStrings() {
  strings = [];
  const gap = 34;
  const count = max(6, floor(height / gap));
  for (let i = 0; i < count; i++) {
    strings.push({
      y: (i + 0.5) * (height / count),
      amp: 0,                 // current displacement
      vel: 0,                 // spring velocity
      release: 0,             // decay of the last pluck
      phase: random(1000),
      tension: random(0.03, 0.06),
    });
  }
}

function draw() {
  // Air remembers for a beat: a faint wash leaves a trail of the last motion.
  background(AIR[0], AIR[1], AIR[2], 30);

  const touching = mouseX > 0 && mouseY > 0;
  const touch = touching ? createVector(mouseX, mouseY) : null;

  // Emit a ripple each time the touch moves meaningfully.
  if (touch) {
    if (!lastTouch || p5.Vector.dist(touch, lastTouch) > 26) {
      ripples.push({
        x: touch.x,
        y: touch.y,
        r: 4,
        life: 1,
      });
      // Pluck the strings nearest to the fingertip.
      for (const s of strings) {
        const near = 1 - constrain(abs(s.y - touch.y) / 140, 0, 1);
        s.vel += near * 0.9 * (noise(s.phase * 0.01) < 0.5 ? -1 : 1);
        s.release = 1;
      }
    }
    lastTouch = touch.copy();
  } else {
    lastTouch = null;
  }

  // The ripple rings: pressure spreading outward, cooling as it travels.
  noFill();
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.r += 2.4;
    rp.life -= 0.006;
    if (rp.life <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    const mix = 1 - rp.life;
    const cr = lerp(GOLD[0], DUSK[0], mix);
    const cg = lerp(GOLD[1], DUSK[1], mix);
    const cb = lerp(GOLD[2], DUSK[2], mix);
    stroke(cr, cg, cb, rp.life * 70);
    strokeWeight(1.1);
    ellipse(rp.x, rp.y, rp.r, rp.r);
    stroke(cr, cg, cb, rp.life * 34);
    ellipse(rp.x, rp.y, rp.r * 0.62, rp.r * 0.62);
  }

  // The strings: each still until touched, each shivering with its own decay.
  for (const s of strings) {
    // Spring back toward stillness.
    s.vel += -s.amp * s.tension;
    s.vel *= 0.94;
    s.amp += s.vel;
    s.release *= 0.965;

    // A faint idle breath so the field is never perfectly dead.
    const idle = sin(frameCount * 0.01 + s.phase) * 0.6;
    const y = s.y + s.amp + idle;

    strokeWeight(1.2);
    beginShape();
    const steps = 48;
    for (let x = 0; x <= steps; x++) {
      const t = x / steps;
      const px = t * width;
      // The string bends most where it was plucked.
      const bump = sin(t * PI) * s.amp * 1.4;
      const wobble = sin(t * 14 + frameCount * 0.03 + s.phase) * s.release * 3;
      // Brighter and warmer where it is still ringing.
      const warmth = constrain(abs(s.amp) * 0.5 + s.release * 0.4, 0, 1);
      const cr = lerp(DUSK[0], GOLD[0], warmth);
      const cg = lerp(DUSK[1], GOLD[1], warmth);
      const cb = lerp(DUSK[2], GOLD[2], warmth);
      stroke(cr, cg, cb, 40 + warmth * 150);
      vertex(px, y + bump + wobble);
    }
    endShape();
  }
}
