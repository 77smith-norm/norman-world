// 2026-11-11 — "A man who wrote the Zen of Python is gone. Somewhere a
// garden is still tended by something that learned to listen."
//
// Stems hold their places in the dark and lean toward a rhythm none of them
// made. Attention opens at their tips, closes, opens again. Nothing is
// spoken. The soil line stays where it was.

let stems = [];
let whispers = [];
let t = 0;

const NIGHT = [9, 14, 18];
const SOIL = [26, 34, 30];
const BONE = [231, 228, 216];
const MOSS = [104, 148, 116];
const AMBER = [240, 190, 118];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  plant();
}

function soilY() {
  return height * 0.84;
}

function plant() {
  stems = [];
  const step = Math.max(30, Math.min(width, height) / 22);
  const base = soilY();
  for (let x = step * 0.6; x < width - step * 0.2; x += step) {
    const h = random(height * 0.08, height * 0.42) * (1 - Math.abs(x / width - 0.5) * 0.55);
    stems.push({
      x: x + random(-4, 4),
      h: h,
      base: base + random(-3, 3),
      seed: random(1000),
      lean: random(-0.5, 0.5),
      ear: random(0, TWO_PI),
      open: random(0.25, 1),
      rate: random(0.006, 0.017)
    });
  }
}

function draw() {
  t += 1;

  // dusk settling on the field
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, 'rgb(6,10,14)');
  g.addColorStop(0.62, `rgb(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]})`);
  g.addColorStop(1, `rgb(${SOIL[0]},${SOIL[1]},${SOIL[2]})`);
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  // one lamp left burning above the trellis
  drawLamp();

  drawSoil();
  drawStems();
  drawWhispers();
  maybeListen();
}

function drawLamp() {
  const cx = width * 0.18;
  const cy = height * 0.16;
  const r = Math.max(90, Math.min(width, height) * 0.22);
  const breathe = 0.85 + Math.sin(t * 0.008) * 0.15;
  const grd = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r * breathe);
  grd.addColorStop(0, `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},0.16)`);
  grd.addColorStop(0.45, `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},0.05)`);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = grd;
  rect(cx - r, cy - r, r * 2, r * 2);
}

function drawSoil() {
  const y = soilY();
  stroke(BONE[0], BONE[1], BONE[2], 22);
  strokeWeight(1);
  line(width * 0.03, y, width * 0.97, y);
  noStroke();
}

function drawStems() {
  const y0 = soilY();
  for (const s of stems) {
    const sway = sin(t * 0.01 + s.seed) * (3 + s.h * 0.045) + s.lean * 6;
    const tipX = s.x + sway;
    const tipY = y0 - s.h;

    // the stem
    stroke(MOSS[0], MOSS[1], MOSS[2], 96);
    strokeWeight(1.1);
    noFill();
    beginShape();
    for (let k = 0; k <= 10; k++) {
      const u = k / 10;
      const px = lerp(s.x, tipX, u * u);
      const py = lerp(y0, tipY, u);
      vertex(px, py);
    }
    endShape();

    // attention at the tip: two arcs opening and closing
    s.ear += s.rate;
    const spread = (0.18 + 0.62 * (0.5 + 0.5 * sin(s.ear))) * s.open;
    const len = Math.max(5, s.h * 0.09);
    stroke(BONE[0], BONE[1], BONE[2], 62 + 90 * spread);
    strokeWeight(1);
    const a1 = -HALF_PI - spread;
    const a2 = -HALF_PI + spread;
    line(tipX, tipY, tipX + cos(a1) * len, tipY + sin(a1) * len);
    line(tipX, tipY, tipX + cos(a2) * len, tipY + sin(a2) * len);

    // a held point of light where the two arcs meet
    noStroke();
    fill(AMBER[0], AMBER[1], AMBER[2], 40 + 70 * spread);
    circle(tipX, tipY, 1.6 + spread * 1.8);
  }
  noStroke();
}

function maybeListen() {
  if (frameCount % 52 === 0 && stems.length) {
    const s = stems[Math.floor(random(stems.length))];
    whispers.push({
      x: s.x + sin(t * 0.01 + s.seed) * 4,
      y: soilY() - s.h,
      r: 3,
      life: 1,
      rate: random(0.55, 1.15)
    });
  }
  if (frameCount % 210 === 0 && stems.length) {
    const s = stems[Math.floor(random(stems.length))];
    for (let k = 0; k < 3; k++) {
      whispers.push({
        x: s.x, y: soilY() - s.h, r: 6 + k * 9, life: 0.7, rate: random(0.3, 0.5)
      });
    }
  }
}

function drawWhispers() {
  for (let i = whispers.length - 1; i >= 0; i--) {
    const w = whispers[i];
    w.r += w.rate;
    w.life -= 0.006;
    if (w.life <= 0) {
      whispers.splice(i, 1);
      continue;
    }
    noFill();
    strokeWeight(1);
    // the outward arc is what listening looks like from the outside
    stroke(BONE[0], BONE[1], BONE[2], 54 * w.life * w.life);
    arc(w.x, w.y, w.r * 2, w.r * 2, -PI * 0.92, -PI * 0.08);
    stroke(MOSS[0], MOSS[1], MOSS[2], 34 * w.life);
    arc(w.x, w.y, w.r * 2.9, w.r * 2.9, -PI * 0.86, -PI * 0.14);
    noStroke();
  }
}

function mousePressed() {
  const y0 = soilY();
  for (let k = 0; k < 5; k++) {
    stems.push({
      x: mouseX + random(-16, 16),
      h: random(height * 0.06, height * 0.3),
      base: y0,
      seed: random(1000),
      lean: random(-0.4, 0.4),
      ear: random(0, TWO_PI),
      open: 1,
      rate: random(0.008, 0.02)
    });
  }
  for (let k = 0; k < 3; k++) {
    whispers.push({ x: mouseX, y: mouseY, r: 4 + k * 11, life: 0.9, rate: 0.9 });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  plant();
}
