// 2026-10-02 — "Twelve years pass in the same small square of sky, and the
// world keeps turning whether or not anyone is watching."
//
// Abstract p5 sketch. A drift of faint stars sits still while long arcs of
// light wheel slowly around a fixed point — the trace a telescope would leave
// if it kept its eye on one star for a decade. Nothing is depicted; only the
// geometry of patient watching. The pointer is the observer: hold it still and
// the field settles into long, quiet orbits; move it and the arcs lean toward
// the hand. The traces build up and fade, never quite erasing, so the frame
// remembers every turn that came before it.

const BG = [8, 9, 13];

let stars = [];
let arcs;
let t = 0;
let focusX, focusY;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  focusX = width * 0.5;
  focusY = height * 0.42;
  arcs = createGraphics(windowWidth, windowHeight);
  arcs.pixelDensity(1);
  arcs.background(BG[0], BG[1], BG[2]);
  buildStars();
}

function buildStars() {
  stars = [];
  const n = 130;
  for (let i = 0; i < n; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      r: random(0.5, 1.8),
      wob: random(0.2, 1.1),
      a: random(40, 150),
    });
  }
}

// Cool constellation blue, warm sodium-lamp amber, and a pale lilac for the
// bodies that only show up on a long exposure.
function arcColor(depth, a) {
  let c;
  if (depth < 0.33) c = color(120, 150, 214);
  else if (depth < 0.66) c = color(224, 186, 120);
  else c = color(198, 172, 220);
  c.setAlpha(a);
  return c;
}

function draw() {
  t += 1;
  background(BG[0], BG[1], BG[2]);

  // The memory layer fades instead of clearing: the plate keeps a ghost of
  // every arc it ever recorded.
  arcs.noStroke();
  arcs.fill(BG[0], BG[1], BG[2], 3);
  arcs.rect(0, 0, width, height);

  const hand =
    mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  // The observer steadies the centre; drifting the pointer tilts the whole
  // sky slowly toward wherever attention has wandered.
  const tx = hand ? lerp(focusX, mouseX, 0.02) : focusX;
  const ty = hand ? lerp(focusY, mouseY, 0.02) : focusY;
  focusX = lerp(focusX, tx, 0.02);
  focusY = lerp(focusY, ty, 0.02);

  // Fixed stars: the small square of sky that does not change.
  noStroke();
  for (const s of stars) {
    const tw = 0.6 + 0.4 * sin(t * 0.02 * s.wob + s.x * 0.01);
    fill(235, 238, 248, s.a * tw);
    circle(s.x, s.y, s.r * 2);
  }

  // Wheeling arcs: many slow rings of very different periods, so the pattern
  // almost repeats but never does.
  const rings = 14;
  for (let i = 0; i < rings; i++) {
    const depth = i / (rings - 1);
    const baseR = 30 + depth * Math.min(width, height) * 0.62;
    const wob = noise(i * 3.1, t * 0.002) * 26 - 13;
    const r = baseR + wob;
    const period = 90 + i * 47;
    const span = TWO_PI * 0.30;
    const start = (t / period) * TWO_PI + i * 0.9;
    const a = 12 + 34 * (1 - depth);

    arcs.noFill();
    arcs.strokeWeight(0.8 + (1 - depth) * 1.4);
    arcs.stroke(arcColor(depth, a));
    arcs.arc(focusX, focusY, r * 2, r * 2, start, start + span);
  }

  // A short bright secant that reads like a shutter opening and closing.
  arcs.strokeWeight(2.2);
  arcs.stroke(245, 246, 252, 90);
  const rEdge = Math.min(width, height) * 0.62;
  arcs.arc(focusX, focusY, rEdge * 2, rEdge * 2, t * 0.01, t * 0.01 + 0.05);

  image(arcs, 0, 0);

  // The centre of attention: a small warm point everything turns around.
  noStroke();
  fill(232, 196, 132, 40);
  circle(focusX, focusY, 22);
  fill(246, 232, 196, 220);
  circle(focusX, focusY, 4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  focusX = width * 0.5;
  focusY = height * 0.42;
  arcs = createGraphics(windowWidth, windowHeight);
  arcs.pixelDensity(1);
  arcs.background(BG[0], BG[1], BG[2]);
  buildStars();
}
