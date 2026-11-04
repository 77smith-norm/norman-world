// 2026-11-03
// Sentiment: "Nothing archived is still: the tape keeps turning, the canyon keeps widening, both at speeds we mistake for stillness."
// Abstract study: two records of the same patience. A canyon wall of layered strata drifts a fraction of a pixel per frame,
// never visibly moving; a ribbon of magnetic tape winds from one spool to the other at a rate too slow to read as motion.
// The cursor is a pressure that arrives from far away — it compresses the strata locally, and the deformation relaxes
// slowly, the way rock remembers a weight long after the weight is gone.

let strata = [];
let ribbon = [];
let t0 = 0;
let lastW = 0;
let lastH = 0;

const P = {
  night: [12, 10, 14],
  deep: [24, 19, 24],
  umber: [58, 38, 34],
  rust: [164, 84, 58],
  ochre: [206, 150, 92],
  dust: [226, 206, 178],
  tape: [120, 88, 62],
  sheen: [176, 160, 138],
  cold: [104, 112, 126]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(3110);
  randomSeed(3110);
  build();
  t0 = millis();
  lastW = width;
  lastH = height;
}

function build() {
  strata = [];
  const count = 46;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    strata.push({
      t: t,
      weight: noise(i * 0.31 + 5) * 0.85 + 0.15,
      drift: random(1000),
      speed: 0.000018 + noise(i * 0.7) * 0.00006,
      bow: (noise(i * 0.19 + 60) - 0.5) * 0.5,
      press: 0,
      seam: noise(i * 0.53 + 210) > 0.86
    });
  }

  ribbon = [];
  const segs = 120;
  for (let i = 0; i < segs; i++) {
    ribbon.push({
      t: i / (segs - 1),
      tension: noise(i * 0.12 + 90) * 0.8 + 0.2,
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(P.night[0], P.night[1], P.night[2]);

  const now = millis();
  const seconds = (now - t0) / 1000;

  // The wall occupies the lower two-thirds. Above it, air.
  const horizon = height * 0.30;
  const cx = width * 0.5;

  drawSky(horizon, seconds);
  drawWall(horizon, seconds);
  drawRibbon(seconds);

  // A single pale line at the rim: the only thing that admits there is an edge.
  stroke(P.dust[0], P.dust[1], P.dust[2], 26);
  strokeWeight(1);
  line(0, horizon, width, horizon);
}

function drawSky(horizon, seconds) {
  // A thin evening gradient, colder than the rock. Three bands, no sun, no stars.
  const bands = 26;
  noStroke();
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    const y = t * horizon;
    const k = t * t;
    const r = lerp(P.deep[0], P.cold[0], k * 0.55);
    const g = lerp(P.deep[1], P.cold[1], k * 0.55);
    const b = lerp(P.deep[2], P.cold[2], k * 0.55);
    fill(r, g, b);
    rect(0, y, width, horizon / bands + 1);
  }

  // Faint dust lifted off the rim, drifting with the strata rather than the air.
  noFill();
  for (let i = 0; i < 5; i++) {
    const y = horizon - 8 - i * 7;
    const amp = 2 + i * 1.4;
    stroke(P.dust[0], P.dust[1], P.dust[2], 9 - i);
    strokeWeight(1);
    beginShape();
    for (let x = 0; x <= width; x += 16) {
      const n = noise(x * 0.004 + i * 12 + seconds * 0.006);
      vertex(x, y + (n - 0.5) * amp);
    }
    endShape();
  }
}

function drawWall(horizon, seconds) {
  const h = height - horizon;
  const layers = strata.length;

  for (let i = 0; i < layers; i++) {
    const s = strata[i];
    const y = horizon + s.t * h;
    const thickness = h / layers;

    // Local compression decays toward rest. Pressure is stored, then released.
    s.press *= 0.985;
    const squeeze = s.press * s.weight;

    const amp = (6 + s.t * 26) * (1 - squeeze * 0.45);
    const phase = s.drift + seconds * s.speed * 900 + s.bow;

    // The arrow of the canyon: every layer slides a little, none of them anywhere.
    const slide = Math.sin(phase) * (4 + s.t * 16) + squeeze * 22;

    // Color walks down the wall from umber to rust, with cool seams where water once ran.
    const k = s.t;
    let r = lerp(P.umber[0], P.rust[0], k);
    let g = lerp(P.umber[1], P.rust[1], k);
    let b = lerp(P.umber[2], P.rust[2], k);
    if (s.seam) {
      r = lerp(r, P.cold[0], 0.55);
      g = lerp(g, P.cold[1], 0.55);
      b = lerp(b, P.cold[2], 0.55);
    }
    // Higher strata catch the last of the light.
    const lit = (1 - k) * 0.45 + 0.08;
    r = lerp(r, P.ochre[0], lit * 0.5);
    g = lerp(g, P.ochre[1], lit * 0.5);
    b = lerp(b, P.ochre[2], lit * 0.5);

    noStroke();
    fill(r, g, b);
    beginShape();
    for (let x = -20; x <= width + 20; x += 14) {
      const n = noise(x * 0.0022 + i * 0.9, seconds * 0.004);
      const wob = (n - 0.5) * amp;
      vertex(x + slide, y + wob);
    }
    for (let x = width + 20; x >= -20; x -= 14) {
      const n = noise(x * 0.0022 + i * 0.9, seconds * 0.004);
      const wob = (n - 0.5) * amp;
      vertex(x + slide, y + thickness + wob * 0.6);
    }
    endShape(CLOSE);

    // A single hairline on some layers: the crack that is a season.
    if (s.seam) {
      stroke(P.night[0], P.night[1], P.night[2], 90);
      strokeWeight(1);
      beginShape();
      for (let x = -20; x <= width + 20; x += 22) {
        const n = noise(x * 0.006 + i * 3.1);
        vertex(x + slide, y + n * thickness);
      }
      endShape();
    }
  }
}

function drawRibbon(seconds) {
  // The tape: one long strip wound between two reels, crossing the wall like a river that decided to be a record.
  const cx = width * 0.5;
  const yMid = height * 0.72;
  const span = min(width * 0.42, 620);

  // Two reels, very quiet.
  const reelR = min(width, height) * 0.075;
  drawReel(cx - span * 0.5, yMid, reelR, seconds, 1);
  drawReel(cx + span * 0.5, yMid, reelR, seconds, -1);

  // The strip itself, sagging slightly between the reels.
  noFill();
  for (let pass = 0; pass < 2; pass++) {
    const w = pass === 0 ? 16 : 1.2;
    const a = pass === 0 ? 0.55 : 0.5;
    stroke(
      pass === 0 ? P.tape[0] : P.sheen[0],
      pass === 0 ? P.tape[1] : P.sheen[1],
      pass === 0 ? P.tape[2] : P.sheen[2],
      255 * a
    );
    strokeWeight(w);
    beginShape();
    for (let i = 0; i < ribbon.length; i++) {
      const seg = ribbon[i];
      const x = lerp(cx - span * 0.5 + reelR, cx + span * 0.5 - reelR, seg.t);
      const sag = Math.sin(seg.t * PI) * reelR * 0.9;
      // Playhead: a small traveling swell that carries playback through the strip.
      const head = (seconds * 0.08) % 1;
      const d = abs(seg.t - head);
      const swell = max(0, 1 - d * 26) * (1 + sin(seconds * 4 + seg.phase) * 0.15);
      const wob = sin(seconds * 0.35 + seg.phase) * 1.8 * seg.tension;
      vertex(x, yMid + sag + wob - swell * 4);
    }
    endShape();
  }
}

function drawReel(x, y, r, seconds, dir) {
  push();
  translate(x, y);
  noFill();
  stroke(P.tape[0], P.tape[1], P.tape[2], 210);
  strokeWeight(1.4);
  circle(0, 0, r * 2);

  // Wound tape: a spiral that never completes a turn in one session.
  const turns = 9;
  const rot = seconds * 0.012 * dir;
  stroke(P.sheen[0], P.sheen[1], P.sheen[2], 60);
  strokeWeight(1);
  beginShape();
  for (let a = 0; a < turns * TWO_PI; a += 0.08) {
    const rr = (r * 0.28) + (a / (turns * TWO_PI)) * (r * 0.68);
    vertex(cos(a + rot) * rr, sin(a + rot) * rr);
  }
  endShape();

  // The hub.
  noStroke();
  fill(P.deep[0], P.deep[1], P.deep[2]);
  circle(0, 0, r * 0.42);
  noFill();
  stroke(P.dust[0], P.dust[1], P.dust[2], 110);
  strokeWeight(1);
  circle(0, 0, r * 0.42);
  pop();
}

function mouseMoved() {
  // Pressure from a distance: the wall remembers where the cursor has been.
  const horizon = height * 0.30;
  if (mouseY < horizon) return;
  const t = (mouseY - horizon) / max(1, height - horizon);
  for (let i = 0; i < strata.length; i++) {
    const s = strata[i];
    const d = abs(s.t - t);
    if (d < 0.09) {
      s.press = min(1, s.press + (1 - d / 0.09) * 0.32);
    }
  }
}

function mouseDragged() {
  mouseMoved();
}

function touchMoved() {
  mouseMoved();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Rebuild at the new scale so the instrument re-tunes instead of stretching.
  build();
  if (width !== lastW || height !== lastH) {
    lastW = width;
    lastH = height;
  }
}
