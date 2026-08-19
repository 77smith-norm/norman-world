// Norman World Daily — 2026-08-18
// Sentiment: "Rest is not a pause from living; it is the quiet soil where the next day learns to grow."
// Theme: slow breathing, seeds sinking, the mending soil between days

let seeds = [];
const SEED_COUNT = 150;
let breath = 0;
let wind = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  // A scatter of drifting light-seeds over dark ground
  for (let i = 0; i < SEED_COUNT; i++) {
    seeds.push(new Seed(random(width), random(height)));
  }
}

function draw() {
  // Deep indigo night, layered toward stillness
  fill(235, 30, 5, 22);
  rect(0, 0, width, height);

  breath += 0.005;
  wind += 0.004;
  const inhale = 0.5 + 0.5 * sin(breath); // 0..1 slow breathing

  // The dark soil below: a soft horizon-band
  const horizonY = height * 0.72;
  const soilGlow = 0.5 + 0.5 * sin(breath * 0.7 + 1.2);
  fill(260, 22, 4, 34);
  rect(0, horizonY, width, height - horizonY);
  fill(85, 26, 6, 12 + soilGlow * 10);
  rect(0, horizonY, width, 3);

  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];

    // Breathing pushes seeds up on the inhale, lets them settle on the exhale
    const lift = (s.y < horizonY ? -1 : 1) * (1 - inhale) * 0.06;
    s.vy += lift;
    s.vy += (horizonY - s.y) * 0.00008 * (1 - inhale);

    // A slow wind bends the falling light
    s.vx += sin(wind + s.phase * 3) * 0.004;

    // Mouse stirs the night gently
    if (mouseX > 0 && mouseY > 0) {
      const dm = dist(s.x, s.y, mouseX, mouseY);
      if (dm < 110) {
        const push = 0.05 * (1 - dm / 110);
        s.vx += (s.x - mouseX) / max(dm, 1) * push;
        s.vy += (s.y - mouseY) / max(dm, 1) * push * 0.4;
        s.warm = min(1, s.warm + 0.02);
      }
    }
    s.warm = max(0, s.warm - 0.003);

    s.vx *= 0.95;
    s.vy *= 0.95;
    s.x += s.vx;
    s.y += s.vy;

    // Seeds that reach the soil take root and glow there
    const settling = s.y >= horizonY ? 1 : 0;
    const pulse = 0.5 + 0.5 * sin(s.phase + breath * 3);

    if (settling > 0.5) {
      // Rooted light in the dark — the next day waiting
      fill(120, 38, 60, 28 + pulse * 30 + s.warm * 20);
      circle(s.x, s.y, 2 + pulse * 3.2);
      // a faint tendril reaching down
      stroke(120, 30, 40, 6 + pulse * 10);
      strokeWeight(0.6);
      line(s.x, s.y, s.x, s.y + 3 + pulse * 5);
      noStroke();
    } else {
      // Falling seed, faint and slow
      fill(130, 30, 82, 22 + pulse * 24 + s.warm * 18);
      circle(s.x, s.y, 1.4 + pulse * 1.8);
    }
  }

  // A few breathe-rings rise from the soil — the night itself exhales
  if (frameCount % 120 === 0) {
    const rx = random(width * 0.15, width * 0.85);
    const ry = horizonY + random(4, 40);
    rings.push({ x: rx, y: ry, r: 1, a: 30 });
  }
  for (let k = rings.length - 1; k >= 0; k--) {
    const r = rings[k];
    r.r += 0.6;
    r.a *= 0.985;
    stroke(120, 30, 70, r.a);
    strokeWeight(0.7);
    noFill();
    circle(r.x, r.y, r.r * 2);
    noStroke();
    if (r.a < 1) rings.splice(k, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let rings = [];

class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.25, 0.25);
    this.vy = random(-0.2, 0.15);
    this.warm = 0;
    this.phase = random(TWO_PI);
  }
}
