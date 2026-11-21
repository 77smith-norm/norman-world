// 2026-11-20 — "We keep the recordings of nights that are gone, and trust a
// proof no one has read yet."
//
// Two things in the same dark room. Along the bottom, a stack of long tape
// tracks — recordings of evenings that no longer exist, each line breathing on
// a slow wave that travels down the shelf and out. Above them, a figure that is
// almost a proof: a ring of vertices joined by segments, drawn in sequence and
// then forgotten, over and over. It has never once closed. Some of its corners
// accumulate small marks as the tracing passes, and lose them at the reset.
// Move up and the tapes swell. Move down and the proof's gap widens. Press and
// a playback head sweeps wherever you are, brightening the tape beneath it.

let tapes = [];
let verts = [];
let marks = [];
let t = 0;
let seal = 0;
let progress = 0;
let holdFrames = 0;
let headX = -1;
let headGlow = 0;

const INK = [9, 11, 15];
const TAPE = [74, 92, 108];
const PALE = [230, 226, 214];
const AMBER = [228, 180, 112];
const DUST = [132, 174, 186];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  noiseSeed(2026);
  buildScene();
}

function buildScene() {
  tapes = [];
  marks = [];
  progress = 0;
  holdFrames = 0;

  const count = constrain(floor(height / 14), 26, 54);
  for (let i = 0; i < count; i++) {
    tapes.push({
      y: 0, // resolved in draw from index
      phase: random(TWO_PI),
      rate: random(0.7, 1.35),
      drift: random(-0.06, 0.06),
      thin: random(0.6, 1.4)
    });
  }

  // A proof: a ring of corners, deliberately imperfect, never quite joined.
  verts = [];
  const n = 11;
  const base = min(width, height) * 0.205;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TWO_PI - HALF_PI;
    const rr = base * random(0.82, 1.16);
    verts.push({
      a,
      r: rr,
      wob: random(TWO_PI),
      lit: 0
    });
  }
}

function vertexPos(i) {
  const v = verts[i % verts.length];
  const wob = sin(t * 0.42 + v.wob) * 0.055;
  const a = v.a + t * 0.026 + wob;
  const cx = width * 0.5;
  const cy = height * 0.44;
  return { x: cx + cos(a) * v.r, y: cy + sin(a) * v.r * 0.86 };
}

function draw() {
  t += 0.01;
  background(INK[0], INK[1], INK[2]);

  const my = height ? constrain(mouseY / height, 0, 1) : 0.4;
  const mx = width ? constrain(mouseX / width, 0, 1) : 0.5;

  // Gap shrinks as attention moves up; widens as it drops away.
  const targetSeal = 0.18 + (1 - my) * 0.7;
  seal += (targetSeal - seal) * 0.035;

  drawTapes(my, mx);
  drawProof();
  drawHead();
}

function drawTapes(my, mx) {
  const shelfTop = height * 0.56;
  const shelfBot = height * 0.965;
  const span = shelfBot - shelfTop;
  const sampleStep = 6;
  const ampBase = 5 + (1 - my) * 26 + mx * 6;

  for (let i = 0; i < tapes.length; i++) {
    const tp = tapes[i];
    const f = tapes.length > 1 ? i / (tapes.length - 1) : 0;
    const y = shelfTop + span * f;

    // A slow wave travelling down the stack — playback, not silence.
    const env = 0.18 + 0.82 * (0.5 + 0.5 * sin(f * 5.2 - t * 1.7 + tp.phase));
    const amp = ampBase * env * tp.thin;

    // The head lights the tape it is over.
    let nearHead = 0;
    if (headGlow > 0.01) {
      nearHead = headGlow * 0.9;
    }

    stroke(
      TAPE[0] + (AMBER[0] - TAPE[0]) * nearHead * 0.55,
      TAPE[1] + (AMBER[1] - TAPE[1]) * nearHead * 0.55,
      TAPE[2] + (AMBER[2] - TAPE[2]) * nearHead * 0.55,
      34 + env * 58 + nearHead * 90
    );
    strokeWeight(0.8 + env * 0.7);
    noFill();
    beginShape();
    for (let x = -sampleStep; x <= width + sampleStep; x += sampleStep) {
      const n1 = noise(x * 0.0032, y * 0.02, t * 0.34 + tp.phase) - 0.5;
      const n2 = noise(x * 0.011, y * 0.03, t * 0.7 + tp.phase * 2) - 0.5;
      const wave = sin(x * 0.014 * tp.rate + t * 2.1 + tp.phase);
      const yy = y + (n1 * 1.6 + n2 * 0.55 + wave * 0.3) * amp;
      vertex(x, yy);
    }
    endShape();

    // Faint tape hiss: tiny specks along the track.
    if (env > 0.55) {
      noStroke();
      const specks = 8;
      for (let s = 0; s < specks; s++) {
        const sx = ((s / specks) * width + t * 14 * (0.6 + f) + tp.phase * 40) % width;
        const jitter = (noise(sx * 0.02, y, t * 0.5) - 0.5) * amp * 1.3;
        fill(PALE[0], PALE[1], PALE[2], (env - 0.55) * 40);
        circle(sx, y + jitter, 0.9);
      }
      stroke(TAPE[0], TAPE[1], TAPE[2]);
    }
  }

  // Shelf edges: two quiet rules holding the stack.
  stroke(PALE[0], PALE[1], PALE[2], 16);
  strokeWeight(1);
  line(0, shelfTop - 10, width, shelfTop - 10);
  line(0, shelfBot + 14, width, shelfBot + 14);
  noStroke();
}

function drawProof() {
  const n = verts.length;
  const gapSegs = 1 + seal * (n * 0.32);

  // Trace slowly forward; on reaching the end, release everything.
  progress += 0.0022 + seal * 0.0016;
  const closed = progress >= 1;
  if (closed) {
    holdFrames++;
    if (holdFrames > 46) {
      progress = 0;
      holdFrames = 0;
      for (const v of verts) v.lit *= 0.2;
      marks = [];
    }
  }
  const p = constrain(progress, 0, 1);

  // The drawn span: from segment 0 up to p, leaving the gap undrawn.
  const drawn = p * (n - gapSegs);
  const leading = drawn;

  for (let i = 0; i < n; i++) {
    const a = vertexPos(i);
    const b = vertexPos(i + 1);
    const seg = i;

    let alpha = 0;
    if (seg < floor(drawn)) {
      alpha = 62;
    } else if (seg === floor(drawn)) {
      alpha = 62 * (drawn - floor(drawn)) + 18;
    } else {
      // The unread remainder: barely there, like a shape taken on trust.
      alpha = 9;
    }

    const hot = seg < leading ? 1 : 0;
    stroke(
      PALE[0] + (AMBER[0] - PALE[0]) * hot * 0.35,
      PALE[1] + (AMBER[1] - PALE[1]) * hot * 0.35,
      PALE[2] + (AMBER[2] - PALE[2]) * hot * 0.35,
      alpha
    );
    strokeWeight(seg < leading ? 1.4 : 0.9);
    line(a.x, a.y, b.x, b.y);

    if (seg < leading && random() < 0.05 && marks.length < 90) {
      marks.push({ x: b.x, y: b.y, life: 1, r: random(1.1, 2.4) });
    }
  }

  // Corners, and the marks left by having checked them.
  noStroke();
  for (let i = 0; i < n; i++) {
    const v = verts[i];
    const a = vertexPos(i);
    const visited = i < floor(drawn) ? 1 : 0;
    v.lit += ((visited ? 1 : 0) - v.lit) * 0.06;

    if (v.lit > 0.06) {
      fill(AMBER[0], AMBER[1], AMBER[2], 26 * v.lit);
      circle(a.x, a.y, 16 * v.lit);
    }
    fill(PALE[0], PALE[1], PALE[2], 40 + 130 * v.lit);
    circle(a.x, a.y, 1.6 + v.lit * 1.8);
  }

  for (let i = marks.length - 1; i >= 0; i--) {
    const m = marks[i];
    m.life -= 0.006;
    if (m.life <= 0) {
      marks.splice(i, 1);
      continue;
    }
    fill(DUST[0], DUST[1], DUST[2], 90 * m.life);
    circle(m.x, m.y, m.r * (1 + (1 - m.life) * 2.6));
  }

  // The gap itself: a thin bright seam that never joins.
  const g0 = vertexPos(floor(drawn));
  const g1 = vertexPos(floor(drawn) + 1);
  const pulse = 0.5 + 0.5 * sin(t * 2.4);
  stroke(AMBER[0], AMBER[1], AMBER[2], 30 + pulse * 46);
  strokeWeight(1.2);
  line(g0.x, g0.y, g1.x, g1.y);
  noStroke();
}

function drawHead() {
  const active = mouseIsPressed && headX >= 0;
  headGlow += ((active ? 1 : 0) - headGlow) * (active ? 0.14 : 0.035);

  if (mouseIsPressed && width) {
    headX = mouseX;
  }

  if (headGlow < 0.02 || headX < 0) return;

  // A playback head: one soft vertical blade, warmer at the shelf.
  const top = height * 0.52;
  const bot = height * 0.98;
  const g = shelfFalloff(top, bot);
  noStroke();
  for (let i = 0; i < 26; i++) {
    const y = lerp(top, bot, i / 25);
    fill(AMBER[0], AMBER[1], AMBER[2], (6 + 26 * headGlow) * g(i / 25));
    rect(headX - 1.1, y, 2.2, (bot - top) / 25 + 1);
  }
  stroke(AMBER[0], AMBER[1], AMBER[2], 60 * headGlow);
  strokeWeight(1);
  line(headX, top, headX, bot);
  noStroke();
}

// Brightest near the middle of the shelf, quieter at both ends.
function shelfFalloff(top, bot) {
  return (f) => sin(f * PI) * 0.7 + 0.3;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildScene();
}
