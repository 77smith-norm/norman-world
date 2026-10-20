// js/2026-10-19.js
// Inspired by: the joy of programming, Wine ported to OpenBSD, retinal regeneration
// A field of dark ground from which thin shoots of light gradually rise, drift
// toward a bright opening, and put down new roots — what was carried shows up
// again as growth.

let shoots = [];
let motes = [];
let t = 0;
let groundY = 0;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  buildScene();
}

function buildScene() {
  groundY = height * 0.78;
  shoots = [];
  motes = [];
  const count = max(28, floor(width / 34));
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * (width / count) + random(-12, 12);
    shoots.push({
      x: x,
      baseY: groundY + random(-14, 10),
      len: random(60, 240),
      growth: random(0, 1),
      speed: random(0.0014, 0.0034),
      sway: random(0, 1000),
      hue: random(150, 205),
      leaf: random(0, 1)
    });
  }
}

function draw() {
  // Slow dark wash — the ground keeps its shadow, light accumulates.
  background(232, 46, 9, 8);
  t += 0.006;

  const mx = mouseX || width * 0.5;
  const my = mouseY || height * 0.5;
  const pull = constrain(1 - abs(my - groundY) / (height * 0.8), 0, 1);

  // Warm opening of light toward the pointer — the new home.
  const glow = drawingContext.createRadialGradient(mx, my, 0, mx, my, 320);
  glow.addColorStop(0, 'rgba(255, 238, 205, 0.16)');
  glow.addColorStop(1, 'rgba(255, 238, 205, 0)');
  drawingContext.fillStyle = glow;
  drawingContext.beginPath();
  drawingContext.arc(mx, my, 320, 0, TWO_PI);
  drawingContext.fill();

  // The shoots: slow growth carried upward, bending toward the light.
  for (const s of shoots) {
    if (s.growth < 1) s.growth += s.speed * (1 + pull * 1.4);
    const h = s.len * min(s.growth, 1);
    const bend = noise(s.sway, t * 0.6) - 0.5;
    const towardX = (mx - s.x) * 0.05 * pull;

    noFill();
    strokeWeight(1.1);
    const steps = 14;
    let px = s.x;
    let py = s.baseY;
    for (let k = 0; k <= steps; k++) {
      const f = k / steps;
      const y = s.baseY - h * f;
      const x = s.x + bend * 30 * f + towardX * f * f;
      const a = 8 + f * 40 * min(s.growth, 1);
      stroke(s.hue, 22 + f * 30, 62 + f * 34, a);
      if (k > 0) line(px, py, x, y);
      px = x;
      py = y;
      // Nodes of light along the stem — where it takes root and unfurls.
      if (k % 4 === 2 && s.growth > f) {
        noStroke();
        fill(s.hue + 24, 26, 96, 22 + f * 34);
        ellipse(x, y, 3 + f * 5, 3 + f * 5);
        stroke(s.hue, 22 + f * 30, 62 + f * 34, a);
        strokeWeight(1.1);
      }
    }

    // A small unfurling leaf near the tip when nearly grown.
    if (s.growth > 0.85 && s.leaf > 0.5) {
      noStroke();
      const tipX = s.x + bend * 30 + towardX;
      const tipY = s.baseY - h;
      push();
      translate(tipX, tipY);
      rotate(bend * 1.6 + t * 0.4);
      fill(s.hue + 30, 30, 94, 40 * (s.growth - 0.85) * 6);
      ellipse(0, 0, 22, 9);
      pop();
    }
  }

  // Motes: small light freed from the ground, drifting toward the opening.
  if (random(1) < 0.5) {
    motes.push({
      x: random(width),
      y: groundY + random(-6, 6),
      vx: random(-0.3, 0.3),
      vy: random(-0.9, -0.3),
      life: 100,
      hue: random(160, 210)
    });
  }
  for (let i = motes.length - 1; i >= 0; i--) {
    const m = motes[i];
    m.vx += (mx - m.x) * 0.0006;
    m.vy += (my - m.y) * 0.0004;
    m.x += m.vx;
    m.y += m.vy;
    m.life -= 0.5;
    if (m.life <= 0) { motes.splice(i, 1); continue; }
    noStroke();
    fill(m.hue, 20, 100, m.life * 0.5);
    ellipse(m.x, m.y, 2.4, 2.4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildScene();
}
