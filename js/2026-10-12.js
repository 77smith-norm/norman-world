// 2026-10-12 — "A single cell swims toward sweetness it cannot name, and wants
// nothing more — maybe wanting is the whole of knowing."
//
// Abstract p5 sketch, no character, no icon. A drifting tide of tiny agents
// swims through a dark current. None of them can see the warm glow they are
// drawn to — they only feel its gradient and lean into it, tumbling when the
// signal fades, straightening when it grows. The glow itself wanders, so the
// tide is always chasing something just out of reach. The pointer is another
// source of sweetness: hold it still and watch the field curve toward you.

const VOID = [9, 12, 15];      // deep water
const AMBER = [247, 190, 108]; // the unnamed sweetness
const TEAL = [126, 214, 199];  // the swimmers
let agents = [];
let sweet;      // wandering attractant
let sweetV;     // its slow drift
let phase = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  sweet = createVector(width * 0.5, height * 0.5);
  sweetV = createVector(0.35, 0.18);
  seedField();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sweet.x = constrain(sweet.x, 0, width);
  sweet.y = constrain(sweet.y, 0, height);
  // Keep the population, but re-park agents inside the new frame.
  for (const a of agents) {
    a.p.x = constrain(a.p.x, 0, width);
    a.p.y = constrain(a.p.y, 0, height);
  }
}

function seedField() {
  agents = [];
  const n = constrain(floor((width * height) / 9000), 120, 520);
  for (let i = 0; i < n; i++) {
    agents.push({
      p: createVector(random(width), random(height)),
      v: p5.Vector.random2D().mult(random(0.2, 0.9)),
      t: random(1000),        // tumble phase, desynchronized
      tRate: random(0.02, 0.06),
      hue: random(0.15, 0.5), // some lean amber, most stay teal
    });
  }
}

function draw() {
  // Dark water; the faint wash leaves the memory of moving trails behind.
  background(VOID[0], VOID[1], VOID[2], 28);

  // The attractant drifts like a slow current, bouncing off the edges.
  sweet.add(sweetV);
  if (sweet.x < width * 0.12 || sweet.x > width * 0.88) sweetV.x *= -1;
  if (sweet.y < height * 0.12 || sweet.y > height * 0.88) sweetV.y *= -1;
  sweetV.rotate(noise(phase * 0.01) - 0.5);
  phase += 0.01;

  const pointer = mouseX > 0 && mouseY > 0 ?
    createVector(mouseX, mouseY) : null;

  // Paint the glow itself: wide halo, tight core — a warmth with no name.
  noStroke();
  for (let r = 5; r >= 1; r--) {
    const rad = r * 46;
    fill(AMBER[0], AMBER[1], AMBER[2], 8 + (5 - r) * 4);
    ellipse(sweet.x, sweet.y, rad, rad);
  }
  fill(255, 244, 226, 42);
  ellipse(sweet.x, sweet.y, 26, 26);

  for (const a of agents) {
    // Gradient-seeking: each agent feels only the direction of the glow.
    const toSweet = p5.Vector.sub(sweet, a.p);
    const d = max(toSweet.mag(), 1);
    toSweet.div(d);                 // unit vector toward the warmth
    const pull = 0.055 * (1 - constrain(d / (min(width, height) * 0.9), 0, 1));
    a.v.add(toSweet.mult(pull + 0.006));

    // The pointer is a nearer, stronger sweetness when present.
    if (pointer) {
      const toP = p5.Vector.sub(pointer, a.p);
      const pd = max(toP.mag(), 1);
      toP.div(pd);
      const pPull = 0.09 * (1 - constrain(pd / 420, 0, 1));
      a.v.add(toP.mult(pPull));
    }

    // Tumble: when the signal is faint it wiggles and veers; noise keeps the
    // motion alive so the field is never a straight line.
    a.t += a.tRate;
    const tumble = (noise(a.t) - 0.5) * 1.6;
    a.v.rotate(tumble);
    a.v.add(p5.Vector.random2D().mult(0.04));

    // Swim, but no faster than the current allows.
    a.v.limit(1.7);
    a.p.add(a.v);

    // Wrap around the frame so the tide never empties.
    if (a.p.x < -4) a.p.x = width + 4;
    if (a.p.x > width + 4) a.p.x = -4;
    if (a.p.y < -4) a.p.y = height + 4;
    if (a.p.y > height + 4) a.p.y = -4;

    // Draw: agents closer to the glow lean warmer and brighter.
    const near = 1 - constrain(d / (min(width, height) * 0.75), 0, 1);
    const mix = constrain(a.hue + near * 0.6, 0, 1);
    const r = lerp(TEAL[0], AMBER[0], mix);
    const g = lerp(TEAL[1], AMBER[1], mix);
    const b = lerp(TEAL[2], AMBER[2], mix);
    const size = 1.3 + near * 2.4;
    fill(r, g, b, 60 + near * 150);
    ellipse(a.p.x, a.p.y, size, size);
  }
}
