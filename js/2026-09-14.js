// Norman World — 2026-09-14
// Sentiment: What survives is never the thing itself, but the reach —
// a color, an arm, a thought, still arriving somewhere far.
// Abstract: a dark field of long arcs strung between far-flung anchor points,
// each arc carrying a slow pulse of pigment-light toward a distance it will
// never quite close. The pulses travel at different speeds, so arrival is
// always staggered — a color that outlasted its painter, a signal still on the
// way. Move the pointer and the nearest anchors brighten and their pulses
// hurry; press and every pulse lands at once, the field blooming briefly with
// ochre, malachite and Egyptian blue, then settling back into patient travel.

const PIGMENT = {
  bg: [10, 11, 18],
  ochre: [214, 168, 96],
  malachite: [94, 158, 116],
  blue: [68, 108, 174],
  stone: [222, 214, 196]
};

const PALETTE = [PIGMENT.ochre, PIGMENT.malachite, PIGMENT.blue, PIGMENT.stone];

let anchors = [];
let arcs = [];
let t = 0;
let px = -1;
let py = -1;
let flood = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  build();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
}

function build() {
  anchors = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const left = i % 2 === 0;
    anchors.push({
      x: left ? random(0.03, 0.16) * width : random(0.84, 0.97) * width,
      y: random(0.12, 0.88) * height,
      warm: 0,
      col: PALETTE[i % PALETTE.length]
    });
  }

  arcs = [];
  for (let i = 0; i < anchors.length; i++) {
    for (let j = i + 1; j < anchors.length; j++) {
      // only connect anchors on opposite sides — the reach across the gap
      if ((anchors[i].x < width * 0.5) === (anchors[j].x < width * 0.5)) continue;
      arcs.push({
        a: i,
        b: j,
        // control point pulled toward a drifting median, giving each arc its bow
        bow: random(-0.32, 0.32),
        u: random(),
        speed: random(0.0018, 0.0046),
        col: PALETTE[floor(random(PALETTE.length))],
        bloom: 0
      });
    }
  }
}

function nodeFor(a) {
  return anchors[a];
}

function draw() {
  background(PIGMENT.bg[0], PIGMENT.bg[1], PIGMENT.bg[2], 30);
  noFill();

  const mx = px < 0 ? -1e5 : px;
  const my = py < 0 ? -1e5 : py;

  // anchor glow follows pointer proximity
  for (const a of anchors) {
    const d2 = sq(a.x - mx) + sq(a.y - my);
    const near = exp(-d2 / (width * width * 0.05));
    a.warm += (near - a.warm) * 0.08;
    stroke(a.col[0], a.col[1], a.col[2], 30 + a.warm * 130);
    strokeWeight(0.8 + a.warm * 1.4);
    circle(a.x, a.y, 6 + a.warm * 10);
  }

  for (const arc of arcs) {
    const A = nodeFor(arc.a);
    const B = nodeFor(arc.b);
    // the bow settles toward a slow global drift
    const cx = (A.x + B.x) * 0.5 + sin(t * 0.01 + arc.bow * 9) * width * 0.06;
    const cy = (A.y + B.y) * 0.5 + arc.bow * height * 0.6;

    // the arc itself, faint — the reach that was made
    const segs = 30;
    let prev = null;
    for (let k = 0; k <= segs; k++) {
      const u = k / segs;
      const p = bezPoint(u, A, B, cx, cy);
      if (prev) {
        stroke(arc.col[0], arc.col[1], arc.col[2], 16);
        strokeWeight(0.6);
        line(prev.x, prev.y, p.x, p.y);
      }
      prev = p;
    }

    // the traveling pulse: a signal still arriving
    const hurry = flood > 0.02 ? 4 : 1;
    arc.u += arc.speed * (1 + A.warm + B.warm) * hurry;
    if (arc.u >= 1) {
      arc.u = 0;
      arc.bloom = 1;
    }
    arc.bloom *= 0.94;

    const p = bezPoint(arc.u, A, B, cx, cy);
    const head = bezPoint(min(1, arc.u + 0.06), A, B, cx, cy);
    stroke(arc.col[0], arc.col[1], arc.col[2], 150);
    strokeWeight(1.6);
    line(p.x, p.y, head.x, head.y);

    // arrival bloom at the far end
    const bp = bezPoint(1, A, B, cx, cy);
    if (arc.bloom > 0.02) {
      stroke(arc.col[0], arc.col[1], arc.col[2], arc.bloom * 180);
      strokeWeight(1);
      circle(bp.x, bp.y, 10 + (1 - arc.bloom) * 34);
    }
    stroke(arc.col[0], arc.col[1], arc.col[2], 40);
    strokeWeight(1.2);
    circle(p.x, p.y, 4.5);
  }

  // pointer: an eye that opens where you look, receiving what has arrived
  if (px >= 0) {
    stroke(PIGMENT.stone[0], PIGMENT.stone[1], PIGMENT.stone[2], 26);
    strokeWeight(1);
    circle(px, py, 40 + sin(t * 0.05) * 6);
    circle(px, py, 12);
  }

  t += 1;
  flood *= 0.94;
}

function bezPoint(u, A, B, cx, cy) {
  const v = 1 - u;
  return {
    x: v * v * A.x + 2 * v * u * cx + u * u * B.x,
    y: v * v * A.y + 2 * v * u * cy + u * u * B.y
  };
}

function mouseMoved() { px = mouseX; py = mouseY; }
function mouseDragged() { px = mouseX; py = mouseY; }
function mousePressed() { flood = 1; }
function touchStarted() { flood = 1; }
