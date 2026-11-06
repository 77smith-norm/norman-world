// 2026-11-05
// Sentiment: "We made it fast and stopped looking. The crack in the old paint program proves someone finally did."
// Abstract study in velocity and attention. A field of hairline streaks crosses the frame, fast and indifferent,
// each one lasting only long enough to smear the one before it. It is beautiful and it is a blur. Underneath, a
// fracture has been sitting there the whole time, opening outward one branch at a time. It grows only while the
// hand is still: at speed the streaks bury it completely, and the moment the cursor rests the branches keep
// going. Move and it goes back into the noise. Press and it seals. The crack was never the news. The looking was.

let streaks = [];
let crack = [];
let crackU = 0;
let seedPt = { x: 0, y: 0 };
let t0 = 0;
let lastW = 0;
let lastH = 0;
let lastMoveAt = 0;
let hasMoved = false;

const P = {
  ink: [9, 10, 12],
  deep: [18, 20, 23],
  bone: [232, 228, 216],
  gold: [228, 190, 120],
  ash: [126, 132, 138]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(5511);
  randomSeed(5511);
  build();
  background(P.ink[0], P.ink[1], P.ink[2]);
  t0 = millis();
  lastW = width;
  lastH = height;
}

function build() {
  seedPt = { x: width * 0.38, y: height * 0.54 };

  streaks = [];
  const count = constrain(round((width * height) / 14000), 90, 320);
  for (let i = 0; i < count; i++) {
    streaks.push({
      x: random(-width * 0.2, width * 1.2),
      y: random(height),
      len: 18 + random() * 150,
      sp: 4 + random() * 24,
      w: 0.5 + random() * 1.1,
      a: 10 + random() * 34,
      drift: (noise(i * 0.11 + 3) - 0.5) * 0.5
    });
  }

  crack = [];
  branch(seedPt.x, seedPt.y, -PI * 0.62, min(width, height) * 0.11, 0, crack);
  branch(seedPt.x, seedPt.y, PI * 0.42, min(width, height) * 0.10, 0, crack);
  branch(seedPt.x, seedPt.y, PI * 0.05, min(width, height) * 0.12, 0, crack);
  for (const seg of crack) {
    seg.birth = min(0.95, seg.depth / 7 * 0.8 + random() * 0.2);
  }
}

function branch(x, y, ang, len, depth, out) {
  if (depth > 5 || len < 2.5) return;
  const x2 = x + cos(ang) * len;
  const y2 = y + sin(ang) * len;
  out.push({ x1: x, y1: y, x2, y2, depth });
  const kids = depth < 2 ? 2 : (random() < 0.68 ? 2 : 1);
  for (let i = 0; i < kids; i++) {
    const spread = (random() - 0.5) * 1.15 + (i === 0 ? -0.2 : 0.2);
    branch(x2, y2, ang + spread, len * (0.6 + random() * 0.24), depth + 1, out);
  }
}

function draw() {
  // Trails: the frame never fully clears, so the streaks smear into each other.
  noStroke();
  fill(P.ink[0], P.ink[1], P.ink[2], 34);
  rect(0, 0, width, height);

  // A shallow wash so the field is not pure black.
  fill(P.deep[0], P.deep[1], P.deep[2], 6);
  rect(0, 0, width, height);

  const idle = hasMoved ? millis() - lastMoveAt : 99999;
  const still = constrain(map(idle, 260, 1100, 0, 1), 0, 1);

  // The crack opens only while the hand rests.
  if (still > 0.55) {
    crackU = min(1, crackU + 0.0022 * still);
  }

  // Streaks: fast, indifferent, mostly indifferent to you.
  strokeCap(ROUND);
  for (const s of streaks) {
    s.x += s.sp * (1.1 - still * 0.55);
    s.y += s.drift * (1 - still);
    if (s.x - s.len > width * 1.25) {
      s.x = -random(width * 0.25);
      s.y = random(height);
    }
    const fade = 1 - still * 0.45;
    stroke(P.bone[0], P.bone[1], P.bone[2], s.a * fade);
    strokeWeight(s.w);
    line(s.x, s.y, s.x - s.len, s.y);
  }

  // The fracture, revealed in the order it would actually travel.
  const revealA = 40 + still * 215;
  for (const seg of crack) {
    if (crackU <= seg.birth) continue;
    const local = constrain((crackU - seg.birth) / 0.08, 0, 1);
    const x2 = lerp(seg.x1, seg.x2, local);
    const y2 = lerp(seg.y1, seg.y2, local);
    const trunk = seg.depth === 0;
    if (trunk) {
      stroke(P.gold[0], P.gold[1], P.gold[2], revealA);
      strokeWeight(1.5);
    } else {
      stroke(P.ash[0], P.ash[1], P.ash[2], revealA * (0.85 - seg.depth * 0.08));
      strokeWeight(max(0.4, 1.1 - seg.depth * 0.14));
    }
    line(seg.x1, seg.y1, x2, y2);
  }

  // A single point of attention at the origin of the break.
  if (still > 0.2) {
    noStroke();
    fill(P.gold[0], P.gold[1], P.gold[2], 40 + still * 120);
    circle(seedPt.x, seedPt.y, 2.4 + still * 2.6);
  }
}

function mouseMoved() {
  hasMoved = true;
  lastMoveAt = millis();
}

function touchMoved() {
  hasMoved = true;
  lastMoveAt = millis();
  return false;
}

function mousePressed() {
  // You looked. Now cover it again.
  crackU = 0;
  hasMoved = true;
  lastMoveAt = millis();
}

function windowResized() {
  if (width === lastW && height === lastH) return;
  resizeCanvas(windowWidth, windowHeight);
  const keep = crackU;
  build();
  crackU = keep;
  lastW = width;
  lastH = height;
  background(P.ink[0], P.ink[1], P.ink[2]);
}
