// 2026-11-09
// Sentiment: "A beep in the wall outlives every explanation, and the line on a map outlives the garden it divides."
// Abstract study in a sound without a source and a boundary without a reason to be there. A smoke-alarm chirp
// somewhere behind the plaster repeats on its own patient clock; each one leaves the wall as a wobbling ring that
// crosses the room and thins out, whether or not anybody is listening. Underneath it, a handful of closed contours
// drift and breathe — survey lines drawn over a garden that will outlast the survey. Move the pointer and you become
// the listener: rings brighten as they pass you, and the boundaries near you sharpen into something almost legible
// before fading back into the general haze. Click anywhere to start a new tone from that spot. Nothing here resolves
// into an answer. The pulse simply keeps its schedule and the lines keep dividing.

let t0 = 0;
let pulses = [];
let flashes = [];
let loops = [];
let listener = { x: 0, y: 0, active: false };
let source = { x: 0, y: 0 };
let nextPulse = 0;
let drift = { a: 0, b: 0 };

const P = {
  ink: [11, 12, 17],
  chalk: [208, 210, 206],
  amber: [231, 176, 96],
  steel: [122, 146, 162]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(1109);
  randomSeed(1109);
  source.x = width * 0.62;
  source.y = height * 0.38;
  listener.x = width * 0.34;
  listener.y = height * 0.58;
  buildLoops();
  background(P.ink[0], P.ink[1], P.ink[2]);
  t0 = millis();
}

function buildLoops() {
  loops = [];
  const base = min(width, height);
  const count = 5;
  for (let k = 0; k < count; k++) {
    loops.push({
      n: 128,
      seed: k * 37.4 + 11,
      phase: random(TWO_PI),
      spin: (k % 2 === 0 ? 1 : -1) * (0.006 + k * 0.0022),
      r: base * (0.16 + k * 0.115),
      squash: 0.72 + k * 0.02,
      weight: 0.55 + k * 0.12
    });
  }
}

// The field of contours drifts on a slow lissajous, so the lines never sit still
// but never appear to be going anywhere either.
function centerOfField(t) {
  drift.a += 0.0;
  const cx = width * 0.5 + (noise(t * 0.021, 3.1) - 0.5) * width * 0.42;
  const cy = height * 0.52 + (noise(t * 0.017, 9.4) - 0.5) * height * 0.36;
  return { cx, cy };
}

function contourPoint(loop, i, t, cx, cy) {
  const a = (i / loop.n) * TWO_PI + loop.phase + t * loop.spin;
  const wob = (noise(loop.seed + i * 0.07, t * 0.05) - 0.5) * 0.46;
  const r = loop.r * (1 + wob);
  return {
    x: cx + cos(a) * r * 1.18,
    y: cy + sin(a) * r * loop.squash
  };
}

function spawnPulse(x, y) {
  pulses.push({ x, y, r: 6, life: 1, born: millis() });
  flashes.push({ x, y, life: 1 });
}

function wallRing(px, py, radius, t) {
  // A ring that has been through plaster: uneven, a little flattened, still travelling.
  const pts = [];
  const n = 96;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TWO_PI;
    const wob = (noise(px * 0.01 + cos(a) * 1.6, py * 0.01 + sin(a) * 1.6, t * 0.12) - 0.5) * 0.14;
    const r = radius * (1 + wob);
    pts.push({ x: px + cos(a) * r, y: py + sin(a) * r * 0.92 });
  }
  return pts;
}

function draw() {
  const t = (millis() - t0) / 1000;
  const { cx, cy } = centerOfField(t);

  // Fade rather than clear. Every tone leaves a wall behind it.
  noStroke();
  fill(P.ink[0], P.ink[1], P.ink[2], 22);
  rect(0, 0, width, height);

  // The tone keeps its own schedule, indifferent to attention.
  if (millis() > nextPulse) {
    spawnPulse(source.x, source.y);
    nextPulse = millis() + 2100;
  }
  // The source itself creeps along the wall, just enough to keep you guessing.
  source.x = lerp(source.x, width * 0.5 + (noise(t * 0.03, 1.7) - 0.5) * width * 0.7, 0.004);
  source.y = lerp(source.y, height * 0.4 + (noise(t * 0.026, 7.3) - 0.5) * height * 0.5, 0.004);

  if (!listener.active) {
    listener.x = lerp(listener.x, width * 0.5 + (noise(t * 0.018, 21.4) - 0.5) * width * 0.6, 0.006);
    listener.y = lerp(listener.y, height * 0.56 + (noise(t * 0.015, 41.2) - 0.5) * height * 0.44, 0.006);
  }

  // Rings travelling out from the source.
  for (let k = pulses.length - 1; k >= 0; k--) {
    const p = pulses[k];
    p.r += 1.55;
    p.life = max(0, 1 - p.r / (max(width, height) * 1.1));
    if (p.life <= 0.001) {
      pulses.splice(k, 1);
      continue;
    }

    const ring = wallRing(p.x, p.y, p.r, t);
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      const mid = { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
      const near = max(0, 1 - dist(mid.x, mid.y, listener.x, listener.y) / 90);
      const alpha = 20 + p.life * 130 + near * 110;
      stroke(P.chalk[0], P.chalk[1], P.chalk[2], alpha);
      strokeWeight(0.7 + p.life * 1.1 + near * 0.8);
      line(a.x, a.y, b.x, b.y);
    }

    // Passing the listener registers: not comprehension, just contact.
    const dToListener = dist(p.x, p.y, listener.x, listener.y);
    if (Math.abs(p.r - dToListener) < 2.2 && p.life > 0.25) {
      flashes.push({ x: listener.x, y: listener.y, life: 1, soft: true });
    }
  }

  // Boundary lines: official, arbitrary, and slow to admit it.
  for (const loop of loops) {
    let prev = null;
    for (let i = 0; i <= loop.n; i++) {
      const pt = contourPoint(loop, i % loop.n, t, cx, cy);
      if (prev) {
        const near = max(0, 1 - dist(pt.x, pt.y, listener.x, listener.y) / 150);
        const edge = 0.5 + 0.5 * sin((i / loop.n) * TWO_PI * 3 + t * 0.2);
        stroke(P.steel[0], P.steel[1], P.steel[2], 30 + near * 120 + edge * 14);
        strokeWeight(loop.weight + near * 0.9);
        line(prev.x, prev.y, pt.x, pt.y);
      }
      prev = pt;
    }
  }

  // Small survey ticks along one of the contours — the map's claim to precision.
  const tickLoop = loops[2];
  for (let i = 0; i < tickLoop.n; i += 9) {
    const p0 = contourPoint(tickLoop, i, t, cx, cy);
    const p1 = contourPoint(tickLoop, i + 1, t, cx, cy);
    const ang = atan2(p1.y - p0.y, p1.x - p0.x) + HALF_PI;
    const near = max(0, 1 - dist(p0.x, p0.y, listener.x, listener.y) / 170);
    stroke(P.amber[0], P.amber[1], P.amber[2], 30 + near * 120);
    strokeWeight(0.8);
    line(p0.x - cos(ang) * 4, p0.y - sin(ang) * 4, p0.x + cos(ang) * 4, p0.y + sin(ang) * 4);
  }

  // Contact flashes, thinning out.
  for (let k = flashes.length - 1; k >= 0; k--) {
    const f = flashes[k];
    f.life *= 0.955;
    noFill();
    stroke(P.amber[0], P.amber[1], P.amber[2], f.life * (f.soft ? 150 : 200));
    strokeWeight(1.1);
    circle(f.x, f.y, 6 + (1 - f.life) * (f.soft ? 22 : 30));
    noStroke();
    fill(P.amber[0], P.amber[1], P.amber[2], f.life * 90);
    circle(f.x, f.y, 2);
    if (f.life < 0.02) flashes.splice(k, 1);
  }

  // The listener: an open ring, no character, no face — just a place where hearing happens.
  noFill();
  stroke(P.chalk[0], P.chalk[1], P.chalk[2], 110);
  strokeWeight(0.9);
  circle(listener.x, listener.y, 14 + sin(t * 1.1) * 1.5);
  stroke(P.steel[0], P.steel[1], P.steel[2], 70);
  circle(listener.x, listener.y, 30);

  // The source: a small fixed mark from which everything else is measured.
  noStroke();
  fill(P.chalk[0], P.chalk[1], P.chalk[2], 70);
  circle(source.x, source.y, 2.4);
}

function pointerAt(mx, my) {
  listener.active = true;
  listener.x = mx;
  listener.y = my;
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    pointerAt(mouseX, mouseY);
    spawnPulse(mouseX, mouseY);
  }
}

function mouseDragged() {
  pointerAt(mouseX, mouseY);
}

function mouseReleased() {
  listener.active = false;
}

function touchStarted() {
  if (touches.length) {
    pointerAt(touches[0].x, touches[0].y);
    spawnPulse(touches[0].x, touches[0].y);
    return false;
  }
}

function touchMoved() {
  if (touches.length) {
    pointerAt(touches[0].x, touches[0].y);
    return false;
  }
}

function touchEnded() {
  listener.active = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLoops();
  background(P.ink[0], P.ink[1], P.ink[2]);
}
