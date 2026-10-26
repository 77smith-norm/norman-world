// 2026-10-25
// Sentiment: "Closed tabs and forgotten rooms keep growing their own green; neglect is not emptiness, only another kind of weather."
// Abstract study: a lattice of abandoned slots, left open long enough that slender growths find their way through it —
// wandering stems climbing the empty cells, leafing at their own pace, bending toward wherever the light happens to be.
// Nothing here is a character; only the quiet arithmetic of what keeps on growing once we stop watching.

let SLOTS = [];
let GROWTHS = [];
let LIGHT = { x: 0, y: 0 };
let t = 0;

const GREENS = [
  [58, 96, 68],
  [86, 122, 74],
  [120, 148, 88],
  [44, 78, 62],
];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  LIGHT = { x: width * 0.5, y: height * 0.35 };
  buildSlots();
  seedGrowths();
}

function buildSlots() {
  SLOTS = [];
  const cols = constrain(floor(width / 96), 5, 22);
  const rows = constrain(floor(height / 74), 4, 16);
  const cw = width / cols;
  const ch = height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      SLOTS.push({
        x: i * cw,
        y: j * ch,
        w: cw,
        h: ch,
        // some cells were never abandoned in the first place
        worn: noise(i * 0.6, j * 0.6) * 0.8 + random(0.2),
      });
    }
  }
}

function seedGrowths() {
  GROWTHS = [];
  const n = constrain(floor((width + height) / 190), 6, 16);
  for (let i = 0; i < n; i++) {
    GROWTHS.push(newGrowth(random(width), random(height), random(TWO_PI)));
  }
}

function newGrowth(x, y, a) {
  return {
    pts: [{ x, y }],
    a,
    life: 0,
    max: random(90, 240),
    speed: random(0.9, 1.9),
    drift: random(1000),
    leafEvery: floor(random(9, 18)),
    tone: floor(random(GREENS.length)),
    weight: random(0.7, 1.5),
    dead: false,
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildSlots();
  seedGrowths();
}

function draw() {
  // same paper as always — nothing dramatic happened here, things just grew
  background(244, 240, 231);

  t += 0.01;

  drawSlots();
  drawLight();

  for (const g of GROWTHS) {
    stepGrowth(g);
    drawGrowth(g);
  }

  drawRain();
}

// the abandoned slots: rectangles that are still there, still empty, still waiting
function drawSlots() {
  push();
  noFill();
  for (const s of SLOTS) {
    const near = 1 - constrain(dist(mouseX, mouseY, s.x + s.w / 2, s.y + s.h / 2) / (min(width, height) * 0.5), 0, 1);
    stroke(150, 142, 128, 16 + 26 * s.worn + 24 * near);
    strokeWeight(0.7);
    rect(s.x + 6, s.y + 6, s.w - 12, s.h - 12, 3);
  }
  pop();
}

// a soft pool of attention — where the cursor rests, growth leans
function drawLight() {
  push();
  noStroke();
  const R = min(width, height) * 0.34;
  for (let i = 10; i >= 1; i--) {
    const p = i / 10;
    fill(248, 244, 224, 5 + 3 * (1 - p));
    ellipse(LIGHT.x, LIGHT.y, R * 2 * p, R * 2 * p);
  }
  pop();
}

function stepGrowth(g) {
  if (g.dead) return;

  const tip = g.pts[g.pts.length - 1];

  // wander from a noise field, then bend a little toward the light
  const n = noise(tip.x * 0.004, tip.y * 0.004, g.drift + g.life * 0.01);
  let a = lerp(g.a, n * TWO_PI * 1.4, 0.06);

  const toLight = atan2(LIGHT.y - tip.y, LIGHT.x - tip.x);
  let turn = ((toLight - a + PI * 3) % TWO_PI) - PI;
  a += turn * 0.012;

  g.a = a;

  const step = g.speed * (0.6 + 0.9 * n);
  const nx = tip.x + cos(a) * step;
  const ny = tip.y + sin(a) * step;

  g.pts.push({ x: nx, y: ny });
  g.life++;

  if (g.pts.length > g.max) g.pts.shift();
  if (g.life > g.max * 1.6) g.dead = true;
}

function drawGrowth(g) {
  const pts = g.pts;
  if (pts.length < 2) return;

  const tone = GREENS[g.tone];

  noFill();
  for (let i = 1; i < pts.length; i++) {
    const p = i / pts.length;
    // stems thicken toward the base, thin toward the new growth
    strokeWeight(g.weight * (0.4 + 0.9 * (1 - p)));
    stroke(tone[0], tone[1], tone[2], 40 + 120 * (1 - p * 0.7));
    line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
  }

  // leaves placed at a rhythm the stem keeps for itself
  for (let i = g.leafEvery; i < pts.length; i += g.leafEvery) {
    const p = i / pts.length;
    const q = pts[i];
    const prev = pts[i - 1];
    const ang = atan2(q.y - prev.y, q.x - prev.x);
    const side = (i / g.leafEvery) % 2 === 0 ? 1 : -1;
    const size = 3.4 + 6.5 * noise(i * 0.2, g.drift) * (0.6 + 0.6 * (1 - p));

    push();
    translate(q.x, q.y);
    rotate(ang + side * 1.05 + 0.25 * sin(t * 1.1 + i));
    noStroke();
    fill(tone[0], tone[1], tone[2], 70 + 90 * (1 - p));
    ellipse(size * 0.9, 0, size * 1.9, size * 0.95);
    pop();
  }
}

// a few slow flecks — pollen, dust, whatever drifts when no one is looking
function drawRain() {
  push();
  noStroke();
  for (let i = 0; i < 26; i++) {
    const x = (noise(i * 3.1, t * 0.1) * width * 1.2 + i * 47) % width;
    const y = (t * (11 + i * 1.4) + i * 91) % height;
    fill(120, 130, 100, 22);
    ellipse(x, height - y, 1.8, 1.8);
  }
  pop();
}

function mouseMoved() {
  LIGHT.x = lerp(LIGHT.x, mouseX, 0.5);
  LIGHT.y = lerp(LIGHT.y, mouseY, 0.5);
}

function mouseDragged() {
  LIGHT.x = mouseX;
  LIGHT.y = mouseY;
  return false;
}

function touchMoved() {
  LIGHT.x = mouseX;
  LIGHT.y = mouseY;
  return false;
}

// pressing starts a new stem where you are — the room is never quite finished growing
function mousePressed() {
  if (GROWTHS.length > 26) GROWTHS.shift();
  GROWTHS.push(newGrowth(mouseX + random(-20, 20), mouseY + random(-20, 20), random(TWO_PI)));
  return false;
}

function touchEnded() {
  if (GROWTHS.length > 26) GROWTHS.shift();
  GROWTHS.push(newGrowth(mouseX + random(-20, 20), mouseY + random(-20, 20), random(TWO_PI)));
  return false;
}
