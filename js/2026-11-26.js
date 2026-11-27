// 2026-11-26 — "Gratitude comes easiest for the things no one photographed:
// brick laid true, a bench kept warm, a day spent buying nothing."
//
// A wall going up in the dark, one brick at a time, from the bottom. Nobody is
// photographing it. Each course is set slightly out of true because a hand set
// it; the mortar is thicker in some joints than others. The bricks arrive at an
// unhurried pace — a few per second, never all at once — and the wall is never
// finished, which is the point.
//
// One vertical band of the wall is deliberately never laid. It stays open to
// the dusk behind it: a column of nothing, kept empty on purpose.
//
// The last light comes in low from the left and moves slowly. Where it lands,
// the brick is warm; where it does not, the brick is only its own dark red.
// Nothing is bought here. The light is free and it does the work.
//
// Press anywhere and you set one brick yourself, exactly where you touched.
// Press in the empty band and it stays empty — the wall declines politely.

const MORTAR = [26, 22, 26];
const BRICK_DARK = [92, 46, 38];
const BRICK_WARM = [176, 96, 62];
const DUSK = [58, 64, 92];
const LIGHT = [255, 196, 128];

let cells = []; // { col, row, x, y, w, h, born, tone, skew }
let order = []; // indices into cells, in laying order
let laid = 0;
let t = 0;
let bw = 40;
let bh = 18;
let gapCol0 = 0;
let gapCol1 = 0;
let sunX = 0;
let sunY = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noiseSeed(2611);
  randomSeed(2611);
  buildWall();
  // start with the lower third already standing so the first paint has weight
  const headStart = Math.floor(order.length * 0.34);
  for (let i = 0; i < headStart; i++) {
    cells[order[i]].born = -1000;
    laid = i + 1;
  }
}

function buildWall() {
  bw = constrain(min(width, height) * 0.052, 22, 58);
  bh = bw * 0.44;

  const cols = Math.ceil(width / bw) + 2;
  const rows = Math.ceil(height / bh) + 2;

  // the band that stays empty — off-center, wide enough to read as a decision
  gapCol0 = Math.floor(cols * 0.63);
  gapCol1 = Math.floor(cols * 0.75);

  cells = [];
  order = [];

  for (let row = 0; row < rows; row++) {
    const rowCells = [];
    for (let col = 0; col < cols; col++) {
      if (col >= gapCol0 && col < gapCol1) continue;
      const offset = row % 2 === 0 ? 0 : bw * 0.5;
      const x = col * bw + offset - bw;
      const y = row * bh;
      const idx = cells.length;
      cells.push({
        col,
        row,
        x,
        y,
        w: bw * random(0.94, 1.0),
        h: bh * random(0.86, 0.97),
        skew: random(-0.9, 0.9),
        tone: random(1),
        born: Infinity,
      });
      rowCells.push(idx);
    }
    // within a course, bricks go in loosely left to right
    for (let i = 0; i < rowCells.length; i++) {
      const j = constrain(i + Math.floor(random(-2, 3)), 0, rowCells.length - 1);
      const a = rowCells[i];
      rowCells[i] = rowCells[j];
      rowCells[j] = a;
    }
    // bottom of the screen is the bottom of the wall
    order.unshift(...rowCells);
  }

  sunX = width * 0.18;
  sunY = height * 0.94;
}

function draw() {
  t += 1;

  // dusk behind the wall, slightly cooler at the top
  drawSky();
  drawGapLight();

  // one brick every few frames, in order, no hurry
  const interval = 9;
  if (t % interval === 0 && laid < order.length) {
    cells[order[laid]].born = t;
    laid += 1;
  }

  for (let i = 0; i < order.length; i++) {
    const c = cells[order[i]];
    if (c.born !== Infinity) drawBrick(c);
  }

  drawLastLight();
  drawDust();
}

function drawSky() {
  noStroke();
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    const k = i / (steps - 1);
    const r = lerp(18, 44, k);
    const g = lerp(16, 34, k);
    const b = lerp(24, 30, k);
    fill(r, g, b);
    rect(0, (height / steps) * i, width, height / steps + 1);
  }
}

// the empty band: dusk showing through, a little cooler and brighter than
// the sky, so the missing bricks read as kept rather than forgotten
function drawGapLight() {
  if (gapCol1 <= gapCol0) return;
  const x0 = gapCol0 * bw - bw;
  const x1 = gapCol1 * bw - bw;
  noStroke();
  const steps = 18;
  for (let i = 0; i < steps; i++) {
    const k = i / (steps - 1);
    fill(...DUSK, 10 + 16 * (1 - abs(k - 0.35)));
    rect(lerp(x0, x1, k), 0, (x1 - x0) / steps + 1, height);
  }
}

function drawBrick(c) {
  const age = constrain((t - c.born) / 45, 0, 1);
  if (age <= 0) return;

  const wobble = sin(t * 0.004 + c.tone * 9) * 0.35;

  // where the last light is: lower rows and the left side catch it first
  const lightX = constrain(1 - abs(c.x - sunX) / (width * 0.75), 0, 1);
  const lightY = constrain(1 - abs(c.y - sunY) / (height * 0.9), 0, 1);
  const warmth = pow(lightX * lightY, 1.4);

  const base = lerpColor(
    color(...BRICK_DARK),
    color(...BRICK_WARM),
    constrain(warmth * 0.9 + c.tone * 0.22, 0, 1)
  );

  push();
  translate(c.x + wobble, c.y);
  noStroke();
  fill(red(base), green(base), blue(base), 236 * age);
  quad(
    c.skew, 0,
    c.w + c.skew * 0.4, 0,
    c.w, c.h,
    c.skew * 0.6, c.h
  );

  // a thin top edge where the light sits
  stroke(...LIGHT, 12 + 34 * warmth * age);
  strokeWeight(0.8);
  line(c.skew, 0.4, c.w + c.skew * 0.4, 0.4);

  // and the shadow under it
  noStroke();
  fill(...MORTAR, 70 * age);
  rect(0, c.h - 1.2, c.w, 2.2);
  pop();
}

// a slow, low sun crossing the courtyard; it never fully arrives
function drawLastLight() {
  noStroke();
  const drift = sin(t * 0.0016) * width * 0.06;
  const cx = sunX + drift;
  const steps = 22;
  for (let i = steps; i > 0; i--) {
    const k = i / steps;
    fill(...LIGHT, 5.2 * (1 - k) * (0.75 + 0.25 * sin(t * 0.0021)));
    ellipse(cx, sunY, width * 1.15 * k, height * 1.1 * k);
  }

  // a warm wash that pools along the bottom of the wall
  const bands = 16;
  for (let i = 0; i < bands; i++) {
    const k = i / bands;
    fill(...LIGHT, 3.4 * (1 - k));
    rect(0, height - (height * 0.42) * (1 - k), width, (height * 0.42) / bands + 1);
  }
}

function drawDust() {
  noStroke();
  for (let i = 0; i < 44; i++) {
    const px = noise(i * 9.7, t * 0.0005) * width * 1.2 - width * 0.1;
    const py = noise(i * 5.3 + 60, t * 0.0004) * height * 1.2 - height * 0.1;
    const a = 6 + 12 * noise(i * 2.9, t * 0.0018);
    fill(...LIGHT, a);
    ellipse(px, py, 1.2, 1.2);
  }
}

function mousePressed() {
  // set one brick at the pointer, if there is a course there to set
  let best = null;
  let bestD = Infinity;
  for (let i = 0; i < order.length; i++) {
    const c = cells[order[i]];
    if (c.born !== Infinity) continue;
    const d = dist(mouseX, mouseY, c.x + c.w / 2, c.y + c.h / 2);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  if (best && bestD < bw * 2.2) {
    best.born = t;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildWall();
  laid = Math.min(laid, order.length);
  for (let i = 0; i < laid; i++) cells[order[i]].born = -1000;
}
