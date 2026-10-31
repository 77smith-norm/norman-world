// 2026-10-30
// Sentiment: "We keep teaching dead machines new songs, as if the willingness to listen were the only thing that ever made them alive."
// Abstract study: switch lowering. Many wide paths enter at the top and, level by level, are narrowed into fewer
// and narrower channels until a single thread of light reaches the bottom. Each path grows more definite as it
// descends and less distinct as it is folded away. Warm amber on cold dark; nothing here is a character, only
// a compiler agreeing that twelve ways of asking are one way of doing.

const LEVELS = 10;

let paths = [];
let gates = [];
let glints = [];
let drift = 0;
let beat = 0;
let convergence = 0.5;
let wave = 0;
let waveY = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  build();
}

function build() {
  const n = constrain(floor(width / 78), 6, 18);
  paths = [];

  for (let i = 0; i < n; i++) {
    const pts = [];
    // Each path owns a lane at the top; the lanes collapse toward the centre as depth increases.
    const laneTop = (i + 0.5) / n;
    const sway = random(-0.05, 0.05);
    const phase = random(TWO_PI);
    for (let l = 0; l <= LEVELS; l++) {
      const t = l / LEVELS;
      // Narrowing is not linear: the first few gates drop most of the spread.
      const narrow = pow(1 - t, 2.1);
      const lane = 0.5 + (laneTop - 0.5) * narrow + sway * sin(t * PI * 2 + phase) * 0.5;
      pts.push({
        u: lane,
        v: t,
        w: 1 - t * 0.75
      });
    }
    paths.push({
      pts,
      phase: random(TWO_PI),
      speed: random(0.0016, 0.0034),
      hue: random(-1, 1)
    });
  }

  gates = [];
  for (let l = 1; l < LEVELS; l++) {
    gates.push({ v: l / LEVELS, width: pow(1 - l / LEVELS, 2.1) });
  }

  glints = [];
  for (const p of paths) {
    glints.push({ path: p, t: random(1), trail: [] });
  }
}

function draw() {
  beat += 0.012;
  drift += 0.08;
  wave = max(wave * 0.965, 0);
  waveY += 0.018;

  convergence = lerp(convergence, constrain(mouseX / max(width, 1), 0.08, 0.92), 0.03);

  background(10, 13, 15);

  const cx = width * convergence;

  // The gates: evenly spaced switch tables, indifferent horizontal marks.
  for (const g of gates) {
    const y = g.v * height;
    const halfW = width * 0.46 * g.width + 12;
    stroke(120, 132, 140, 16 + 10 * (1 - g.v));
    strokeWeight(1);
    line(cx - halfW, y, cx + halfW, y);
  }

  // Paths. Drawn faint at the top, brighter and heavier as they are lowered.
  for (const p of paths) {
    noFill();
    for (let l = 0; l < LEVELS; l++) {
      const a = p.pts[l];
      const b = p.pts[l + 1];
      const t = a.v;
      const alpha = 18 + 105 * pow(t, 0.7);
      const warm = 200 + 40 * sin(beat * 0.5 + p.phase);
      stroke(226, warm * 0.78, 118 + p.hue * 26, alpha * (0.65 + 0.35 * (1 - t)));
      strokeWeight(0.7 + (1 - t) * 1.5);
      const x1 = cx + (a.u - convergence) * width;
      const y1 = a.v * height;
      const x2 = cx + (b.u - convergence) * width;
      const y2 = b.v * height;
      line(x1, y1, x2, y2);
    }
  }

  // Glints falling the length of each path: instructions being resolved.
  noStroke();
  for (const g of glints) {
    g.t += g.path.speed * (1 + wave * 2.2);
    if (g.t > 1.15) {
      g.t = -0.05;
      g.trail = [];
    }
    const t = constrain(g.t, 0, 1);
    const pts = g.path.pts;
    const idx = constrain(floor(t * LEVELS), 0, LEVELS - 1);
    const local = t * LEVELS - idx;
    const a = pts[idx];
    const b = pts[idx + 1];
    const u = lerp(a.u, b.u, local);
    const x = cx + (u - convergence) * width;
    const y = t * height;

    g.trail.push({ x, y });
    if (g.trail.length > 26) g.trail.shift();

    for (let i = 0; i < g.trail.length; i++) {
      const f = i / g.trail.length;
      fill(255, 232, 186, 55 * f * f * (0.35 + 0.65 * (1 - t)));
      circle(g.trail[i].x, g.trail[i].y, 1.6 * f + 0.6);
    }

    const glow = 0.55 + 0.45 * sin(beat * 2 + g.path.phase);
    fill(255, 244, 214, 150 * glow);
    circle(x, y, 2.4 + 2.2 * glow * (1 - t));
  }

  // The single lowered thread at the bottom, where all of it becomes one instruction.
  const threadW = 1.4 + 1.8 * (sin(beat * 0.7) * 0.5 + 0.5);
  stroke(255, 226, 176, 130);
  strokeWeight(threadW);
  line(cx, height * 0.985, cx, height);
  noStroke();
  fill(255, 240, 205, 90 + 60 * sin(beat * 0.7));
  circle(cx, height - 2, 3.2);

  // A press sends a resolving wave down through every gate.
  if (wave > 0.01) {
    const wy = waveY * height;
    stroke(255, 238, 200, 90 * wave);
    strokeWeight(1.2);
    line(0, wy, width, wy);
    noStroke();
    fill(255, 238, 200, 26 * wave);
    rect(0, wy - 22, width, 44);
  }
}

function mousePressed() {
  wave = 1;
  waveY = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
}
