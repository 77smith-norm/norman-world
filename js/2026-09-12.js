// Norman World — 2026-09-12
// Sentiment: An honest map is only a thousand small hands agreeing to remember
// the same place.
// Abstract: a field of survey points, each holding a remembered home it can
// never quite sit on. Left alone, every point wanders — the map loosens into
// honest uncertainty. Move the pointer and the points it reaches settle back
// toward the place they agreed on, and thin edges knit between neighbours: a
// local act of tending, repeated a thousand times, becomes a shared country.
// Press to re-survey, and the whole field briefly remembers at once.

const FIELD = {
  bg: [10, 12, 11],
  settled: [128, 196, 138],   // phosphor green: a point at its remembered place
  loose: [206, 168, 96],      // amber: a point that has drifted off
  edgeCool: [96, 156, 132],
  edgeWarm: [198, 148, 92],
  node: [226, 240, 222]
};

let pts = [];
let t = 0;
let tendX = -1;
let tendY = -1;
let survey = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  buildField();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildField();
}

function buildField() {
  pts = [];
  const cols = max(4, floor(width / 96));
  const rows = max(4, floor(height / 96));
  const gapX = width / (cols + 1);
  const gapY = height / (rows + 1);
  for (let i = 1; i <= cols; i++) {
    for (let j = 1; j <= rows; j++) {
      const hx = gapX * i + random(-gapX * 0.16, gapX * 0.16);
      const hy = gapY * j + random(-gapY * 0.16, gapY * 0.16);
      pts.push({
        hx, hy, x: hx, y: hy,
        vx: 0, vy: 0,
        phase: random(TWO_PI),
        // each point keeps its own idea of the place; some are surer than others
        drift: random(0.35, 1.05),
        held: 0
      });
    }
  }
}

function draw() {
  const bg = FIELD.bg;
  background(bg[0], bg[1], bg[2], 46);
  t += 0.01;

  const tending = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  if (tending) {
    tendX = tendX < 0 ? mouseX : lerp(tendX, mouseX, 0.08);
    tendY = tendY < 0 ? mouseY : lerp(tendY, mouseY, 0.08);
  }
  survey = lerp(survey, mouseIsPressed ? 1 : 0, 0.045);

  // tending reach, widened while re-surveying
  const reach = 150 + survey * max(width, height);
  const pull = 0.05 + survey * 0.10;

  for (const p of pts) {
    // the unattended map loosens: slow, honest wander
    p.vx += sin(t * 1.7 + p.phase) * 0.028 * p.drift;
    p.vy += cos(t * 1.3 + p.phase * 1.4) * 0.028 * p.drift;

    // whoever is tended returns toward the agreed place
    if (tending) {
      const dx = p.hx - p.x;
      const dy = p.hy - p.y;
      const d = sqrt(dx * dx + dy * dy);
      const w = constrain(1 - d / reach, 0, 1);
      if (w > 0) {
        p.vx += dx * pull * w;
        p.vy += dy * pull * w;
        p.held = lerp(p.held, w, 0.12);
      } else {
        p.held = lerp(p.held, 0, 0.04);
      }
    } else {
      p.held = lerp(p.held, 0, 0.02);
    }

    p.vx *= 0.92;
    p.vy *= 0.92;
    p.x += p.vx;
    p.y += p.vy;
  }

  // edges: neighbours that both remember the same place knit together
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    for (let j = i + 1; j < pts.length; j++) {
      const b = pts[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > 128 * 128) continue;
      const d = sqrt(d2);
      const agree = min(a.held, b.held);
      const near = 1 - d / 128;
      const alpha = (10 + agree * 96) * near;
      if (alpha < 4) continue;
      const lean = (a.held + b.held) / 2;
      const c = lerpColor(
        color(FIELD.edgeWarm[0], FIELD.edgeWarm[1], FIELD.edgeWarm[2]),
        color(FIELD.edgeCool[0], FIELD.edgeCool[1], FIELD.edgeCool[2]),
        lean
      );
      stroke(red(c), green(c), blue(c), alpha);
      strokeWeight(0.6 + agree * 0.9);
      line(a.x, a.y, b.x, b.y);
    }
  }

  // the points: bright when held to the remembered place, amber when roaming
  noStroke();
  for (const p of pts) {
    const held = p.held;
    const base = lerpColor(
      color(FIELD.loose[0], FIELD.loose[1], FIELD.loose[2]),
      color(FIELD.settled[0], FIELD.settled[1], FIELD.settled[2]),
      1 - held
    );
    const r = 1.4 + held * 1.9 + sin(t * 2.4 + p.phase) * 0.25;
    fill(red(base), green(base), blue(base), 70 + held * 150);
    circle(p.x, p.y, r * 2);
    if (held > 0.5) {
      fill(FIELD.node[0], FIELD.node[1], FIELD.node[2], (held - 0.5) * 2 * 130);
      circle(p.x, p.y, r * 0.8);
    }
  }

  // the hand doing the tending, faint
  if (tending) {
    noFill();
    stroke(FIELD.settled[0], FIELD.settled[1], FIELD.settled[2],
      24 + survey * 40);
    strokeWeight(1);
    circle(tendX, tendY, 34 + sin(t * 3) * 5 + survey * 60);
  }
}
