// 2026-11-19 — "We taught the smallest things to speak; the noise arrived
// long before the meaning did."
//
// A single vertical seam of light in an otherwise dark field. Everything drifts
// toward it: hundreds of small cold motes converging on a gap that is only a
// few pixels wide. Some slip through and vanish. Most do not — they crowd the
// threshold, brighten with the pressure of waiting, and slide along the seam.
// Every few seconds a slow ring leaves the middle of the seam and travels
// outward; the motes it crosses turn warm for a moment, then cool again. Move
// toward the seam and the opening widens. Press and it nearly closes; the
// threshold fills with embers.

let motes = [];
let rings = [];
let flashes = [];
let t = 0;
let aperture = 0.16;
let nextRing = 0;

const VOID = [7, 9, 12];
const NOISE = [96, 118, 140];
const PALE = [226, 224, 214];
const GOLD = [232, 190, 118];
const EMBER = [196, 104, 86];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  noiseSeed(1911);
  seedMotes();
  nextRing = 60;
}

function seedMotes() {
  motes = [];
  rings = [];
  flashes = [];
  const count = constrain(floor((width * height) / 2200), 220, 820);
  for (let i = 0; i < count; i++) motes.push(newMote(true));
}

function newMote(scatter) {
  const side = random() < 0.5 ? -1 : 1;
  const cx = width * 0.5;
  const spread = scatter ? random(width * 0.46) : random(14, 46);
  return {
    side,
    x: cx + side * spread,
    y: random(height),
    vy: random(-0.22, 0.22),
    r: random(0.7, 1.8),
    phase: random(TWO_PI),
    glow: 0,
    cong: 0,
    rate: random(0.6, 1.4)
  };
}

function draw() {
  t += 0.01;
  background(VOID[0], VOID[1], VOID[2]);

  const cx = width * 0.5;
  const mx = mouseX || cx;
  const near = constrain(1 - Math.abs(mx - cx) / (width * 0.45), 0, 1);
  const target = mouseIsPressed ? 0.035 : 0.1 + near * 0.55;
  aperture += (target - aperture) * 0.045;
  const half = 4 + aperture * 76;

  // The seam itself: two thin edges and a faint interior of light.
  fill(EMBER[0], EMBER[1], EMBER[2], 5 + aperture * 14);
  rect(cx - half, 0, half * 2, height);
  stroke(EMBER[0], EMBER[1], EMBER[2], 18 + aperture * 46);
  strokeWeight(1);
  line(cx - half, 0, cx - half, height);
  line(cx + half, 0, cx + half, height);
  noStroke();

  // A slow ring of meaning, born at the middle of the seam.
  if (frameCount > nextRing) {
    rings.push({ x: cx, y: height * 0.5, r: 2, life: 1 });
    nextRing = frameCount + floor(random(240, 420));
  }

  // Motes: converge, queue, occasionally pass.
  for (const m of motes) {
    const inner = cx + m.side * half;
    const gapDist = Math.abs(m.x - inner);
    const cong = constrain(1 - gapDist / 110, 0, 1) * (1 - aperture);
    m.cong = cong;

    m.vy += (noise(m.x * 0.003, m.y * 0.004, t * 0.2) - 0.5) * 0.06;
    m.vy *= 0.97;
    m.y += m.vy;
    if (m.y < -8) m.y = height + 8;
    if (m.y > height + 8) m.y = -8;

    const speed = 0.2 * m.rate * (1 - cong * 0.88);
    m.x += -m.side * speed;

    if (gapDist < 2.5) {
      if (random() < aperture * 0.55) {
        // Through the gap: a brief pale mark where it went.
        flashes.push({ x: inner, y: m.y, life: 1 });
        if (flashes.length > 40) flashes.shift();
        const fresh = newMote(false);
        fresh.side = m.side;
        fresh.x = cx + m.side * random(width * 0.4, width * 0.52);
        m.x = fresh.x;
        m.y = fresh.y;
        m.glow = 0;
      } else {
        m.x = inner - m.side * 0.6;
        m.y += random(-0.5, 0.5);
      }
    }

    m.glow *= 0.965;
  }

  // Rings sweep outward; motes they cross warm for a moment.
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    ring.r += 1.15;
    ring.life -= 0.0022;
    if (ring.life <= 0) {
      rings.splice(i, 1);
      continue;
    }
    for (const m of motes) {
      const d = Math.abs(dist(m.x, m.y, ring.x, ring.y) - ring.r);
      if (d < 16) {
        const lit = (1 - d / 16) * ring.life;
        if (lit > m.glow) m.glow = lit;
      }
    }
    noFill();
    stroke(GOLD[0], GOLD[1], GOLD[2], 26 * ring.life);
    strokeWeight(1);
    circle(ring.x, ring.y, ring.r * 2);
    noStroke();
  }

  // Motes.
  for (const m of motes) {
    const lit = m.glow;
    const r = NOISE[0] + (GOLD[0] - NOISE[0]) * lit;
    const g = NOISE[1] + (GOLD[1] - NOISE[1]) * lit;
    const b = NOISE[2] + (GOLD[2] - NOISE[2]) * lit;
    const a = 26 + lit * 150 + m.cong * 74;
    fill(r, g, b, a);
    circle(m.x, m.y, m.r + lit * 1.6 + m.cong * 0.8);
  }

  // Marks left by what passed through.
  for (let i = flashes.length - 1; i >= 0; i--) {
    const f = flashes[i];
    f.life -= 0.018;
    if (f.life <= 0) {
      flashes.splice(i, 1);
      continue;
    }
    fill(PALE[0], PALE[1], PALE[2], 60 * f.life);
    circle(f.x, f.y, 1.6 + f.life * 2.4);
  }

  // The pile at a nearly shut door.
  const pile = (1 - aperture) * 120;
  if (pile > 6) {
    fill(EMBER[0], EMBER[1], EMBER[2], pile * 0.32);
    rect(cx - half - 5, 0, 5, height);
    rect(cx + half, 0, 5, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedMotes();
}
