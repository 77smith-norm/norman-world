// 2026-11-27 — "Nothing is finished — the half-built city, the scarred stone,
// the thread still on the loom — and the light waits anyway."
//
// Sources: Arcosanti, the utopian eco-city Paolo Soleri started in the Sonoran
// desert in 1970 and never finished (planned for 5,000 people, peaked at 150);
// Hera's first look at the stadium-sized crater DART left in the small asteroid
// Dimorphos; a Cornell loom that weaves, knits, and braids in one motion.
//
// What that becomes here: a lattice of warp and weft threads that lays itself
// down slowly and never completes. The warp drops from the top like a warp beam
// let go; the weft crosses later, in no hurry, and stops short of the edge. Where
// the threads meet the crater — a shallow hollow that holds its own shadow —
// they bend around it instead of crossing, so the hole stays a hole.
//
// The crater never fills in. The light comes from the upper left at a slow walk,
// never arriving, and the threads it catches turn pale and warm while the rest
// stay the color of sand at dusk.
//
// Click anywhere to add one thread of your own, at the moment you touched.

const SAND_DARK = [24, 19, 17];
const SAND = [46, 35, 27];
const SHADOW = [28, 24, 30];
const OCHRE = [198, 141, 92];
const ROSE = [176, 118, 104];
const GYPSUM = [238, 228, 208];
const LIGHT = [255, 214, 158];

let t = 0;
let warp = []; // vertical threads
let weft = []; // horizontal threads
let extra = []; // threads the visitor adds
let crater = { x: 0, y: 0, r: 0 };
let sunX = 0;
let sunY = 0;
let step = 14;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noiseSeed(2711);
  randomSeed(2711);
  buildLoom();
  // the loom is already partly strung when you arrive
  for (let i = 0; i < warp.length; i++) {
    warp[i].born = -floor(warp.length * 0.55) + i * 3;
  }
  for (let i = 0; i < weft.length; i++) {
    // the first few passes are already in, unevenly, as if someone left mid-row
    if (i < weft.length * 0.34) weft[i].born = -400 + i * 9;
  }
}

function buildLoom() {
  step = constrain(min(width, height) * 0.026, 9, 22);

  crater.r = min(width, height) * 0.155;
  crater.x = width * 0.68;
  crater.y = height * 0.44;

  sunX = width * 0.22;
  sunY = height * 0.16;

  warp = [];
  weft = [];

  const wcount = Math.ceil(width / step) + 2;
  for (let i = 0; i < wcount; i++) {
    warp.push({
      x: i * step + step * 0.5 - step,
      born: Infinity,
      tone: random(1),
      drift: random(-0.5, 0.5),
      weight: random(0.7, 1.5),
    });
  }

  const hcount = Math.ceil(height / (step * 1.7)) + 2;
  for (let i = 0; i < hcount; i++) {
    weft.push({
      y: i * step * 1.7 - step,
      born: Infinity,
      tone: random(1),
      sag: random(-step * 0.5, step * 0.5),
      weight: random(0.6, 1.3),
      reach: random(0.62, 0.95), // weft stops short — never quite sets
    });
  }
}

function draw() {
  t += 1;

  drawGround();
  drawCraterHollow();

  // the weft keeps arriving, one slow pass at a time, and never completes
  const weftInterval = 26;
  for (let j = 0; j < weft.length; j++) {
    if (weft[j].born === Infinity && t > height * 0.6 + j * weftInterval) {
      weft[j].born = t;
    }
  }

  for (const w of warp) drawWarp(w);
  for (const w of weft) drawWeft(w);
  for (const e of extra) drawWarp(e);

  drawCraterRim();
  drawWaitingLight();
  drawDust();
}

function drawGround() {
  noStroke();
  const steps = 26;
  for (let i = 0; i < steps; i++) {
    const k = i / (steps - 1);
    const e = pow(k, 1.4);
    fill(
      lerp(SHADOW[0], SAND[0], e),
      lerp(SHADOW[1], SAND[1], e),
      lerp(SHADOW[2], SAND[2], e)
    );
    rect(0, (height / steps) * i, width, height / steps + 1);
  }
}

// how far a point gets pushed around the hollow
function deflection(px, py) {
  const d = dist(px, py, crater.x, crater.y);
  const reach = crater.r * 2.1;
  if (d > reach) return { x: 0, y: 0 };
  const k = 1 - d / reach;
  const push = pow(k, 1.9) * crater.r * 0.55;
  const ang = atan2(py - crater.y, px - crater.x);
  // a little swirl so the bend reads as carried, not blocked
  const swirl = 0.35 * sin(t * 0.006 + ang * 2);
  return {
    x: cos(ang + swirl) * push,
    y: sin(ang + swirl) * push,
  };
}

function warmthAt(px, py) {
  const dx = (px - sunX) / (width * 0.62);
  const dy = (py - sunY) / (height * 0.78);
  const d = sqrt(dx * dx + dy * dy);
  return constrain(1 - d, 0, 1);
}

function drawWarp(w) {
  if (w.born === Infinity || t < w.born) return;
  const age = constrain((t - w.born) / 40, 0, 1);
  const reach = age;

  const top = -step;
  const bottom = height + step;
  const n = Math.ceil((bottom - top) / step);

  noFill();
  for (let i = 0; i < n - 1; i++) {
    const k0 = i / (n - 1);
    const k1 = (i + 1) / (n - 1);
    if (k1 > reach) break;

    const y0 = lerp(top, bottom, k0);
    const y1 = lerp(top, bottom, k1);

    const breathe = sin(t * 0.004 + w.tone * 8 + k0 * 4) * 1.4;
    const x0 = w.x + breathe + w.drift * k0 * step + deflection(w.x, y0).x;
    const x1 = w.x + breathe + w.drift * k1 * step + deflection(w.x, y1).x;
    const dy0 = deflection(w.x, y0).y;
    const dy1 = deflection(w.x, y1).y;

    const warm = pow(warmthAt(x0, y0), 1.6);
    const base = lerpColor(
      color(...OCHRE),
      color(...ROSE),
      w.tone
    );
    const col = lerpColor(base, color(...GYPSUM), warm * 0.85);

    stroke(red(col), green(col), blue(col), (26 + 62 * warm) * age);
    strokeWeight(w.weight);
    line(x0, y0 + dy0, x1, y1 + dy1);
  }
}

function drawWeft(w) {
  if (w.born === Infinity || t < w.born) return;
  const age = constrain((t - w.born) / 60, 0, 1);
  const x0 = -step;
  const x1 = width + step;
  const n = Math.ceil((x1 - x0) / step);

  // the weft arrives from the left and gives up before the right edge
  const limit = w.reach * age;

  noFill();
  for (let i = 0; i < n - 1; i++) {
    const k0 = i / (n - 1);
    const k1 = (i + 1) / (n - 1);
    if (k1 > limit) break;

    const xa = lerp(x0, x1, k0);
    const xb = lerp(x0, x1, k1);

    const sag = w.sag * sin(k0 * PI) + sin(t * 0.003 + w.tone * 7 + k0 * 3) * 0.8;
    const ya = w.y + sag + deflection(xa, w.y).y;
    const yb = w.y + w.sag * sin(k1 * PI) + sin(t * 0.003 + w.tone * 7 + k1 * 3) * 0.8 + deflection(xb, w.y).y;
    const da = deflection(xa, w.y).x;
    const db = deflection(xb, w.y).x;

    const warm = pow(warmthAt(xa, ya), 1.7);
    const base = lerpColor(color(...OCHRE), color(...ROSE), w.tone);
    const col = lerpColor(base, color(...GYPSUM), warm * 0.9);

    stroke(red(col), green(col), blue(col), (18 + 48 * warm) * age);
    strokeWeight(w.weight * 0.9);
    line(xa + da, ya, xb + db, yb);
  }
}

// the hollow itself: not black, just deeper than the ground
function drawCraterHollow() {
  noStroke();
  const steps = 16;
  for (let i = steps; i > 0; i--) {
    const k = i / steps;
    fill(...SAND_DARK, 16 + 8 * (1 - k));
    ellipse(crater.x, crater.y, crater.r * 2.05 * k, crater.r * 2.05 * k);
  }
  // a soft floor, cooler than the desert
  for (let i = 6; i > 0; i--) {
    const k = i / 6;
    fill(...SHADOW, 12);
    ellipse(crater.x, crater.y + crater.r * 0.06, crater.r * 1.3 * k, crater.r * 1.05 * k);
  }
}

// the rim, lit only on the side the light is on
function drawCraterRim() {
  noFill();
  const arcStart = PI * 0.75;
  const arcEnd = PI * 1.85;
  for (let i = 0; i < 3; i++) {
    const r = crater.r * (2.02 - i * 0.03);
    stroke(...GYPSUM, 20 - i * 5);
    strokeWeight(1.4 - i * 0.3);
    arc(crater.x, crater.y, r * 2, r * 1.98, arcStart, arcEnd);
  }
  // a thin cold line along the shadowed lower edge
  stroke(...SHADOW, 40);
  strokeWeight(1);
  arc(crater.x, crater.y, crater.r * 2.1, crater.r * 2.06, PI * 0.05, PI * 0.9);
}

// light that keeps meaning to arrive
function drawWaitingLight() {
  noStroke();
  const drift = sin(t * 0.0013) * width * 0.05;
  const cx = sunX + drift;
  const cy = sunY + sin(t * 0.0009) * height * 0.02;
  const steps = 20;
  for (let i = steps; i > 0; i--) {
    const k = i / steps;
    fill(...LIGHT, 4.2 * (1 - k) * (0.7 + 0.3 * sin(t * 0.0017)));
    ellipse(cx, cy, width * 1.3 * k, height * 1.15 * k);
  }
  // the light pools on the upper-left rim of the hollow
  for (let i = 0; i < 10; i++) {
    const k = i / 10;
    fill(...LIGHT, 5 * (1 - k));
    ellipse(
      crater.x - crater.r * (0.55 - k * 0.5),
      crater.y - crater.r * (0.6 - k * 0.55),
      crater.r * (1.5 + k * 0.9),
      crater.r * (1.1 + k * 0.8)
    );
  }
}

function drawDust() {
  noStroke();
  for (let i = 0; i < 54; i++) {
    const px = noise(i * 7.3, t * 0.0004) * width * 1.15 - width * 0.07;
    const py = noise(i * 4.1 + 40, t * 0.00035) * height * 1.15 - height * 0.07;
    const a = 5 + 13 * noise(i * 3.3, t * 0.0016);
    fill(...GYPSUM, a);
    ellipse(px, py, 1.1, 1.1);
  }
}

function mousePressed() {
  extra.push({
    x: mouseX,
    born: t,
    tone: random(1),
    drift: random(-0.5, 0.5),
    weight: random(0.8, 1.6),
  });
  if (extra.length > 12) extra.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLoom();
  extra = [];
  for (let i = 0; i < warp.length; i++) warp[i].born = -floor(warp.length * 0.55) + i * 3;
  for (let j = 0; j < weft.length; j++) {
    weft[j].born = j < weft.length * 0.34 ? -400 + j * 9 : Infinity;
  }
}
