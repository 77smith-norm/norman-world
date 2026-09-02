// Norman World — 2026-09-01
// Sentiment: Meaning is not placed into things; it assembles itself —
// symbol by symbol — from the quiet work of many small parts.
// Abstract: small motes drift aimlessly, then slowly gather into
// fleeting constellations that hold for a moment and dissolve.

let motes = [];
const COUNT = 140;
let gatherStrength = 0;       // 0..1 — how strongly the motes cohere
let focalX, focalY;           // wandering point the motes gather toward
let cycle = 0;

const PALETTE = {
  bg: [16, 14, 34],           // deep dusk indigo
  warm: [255, 176, 84],       // amber lamplight
  rose: [243, 118, 130],      // soft rose
  cool: [122, 148, 214],      // muted periwinkle
};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  colorMode(RGB);
  focalX = width / 2;
  focalY = height / 2;
  for (let i = 0; i < COUNT; i++) {
    motes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.6, 0.6),
      vy: random(-0.6, 0.6),
      r: random(1.2, 3.4),
      hue: random(),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(PALETTE.bg[0], PALETTE.bg[1], PALETTE.bg[2], 26);

  cycle += 0.004;
  // Breath: gather, hold, dissolve — meaning arrives and loosens.
  gatherStrength = 0.5 + 0.5 * sin(cycle * 2.0);
  // The focal point wanders slowly; the mouse draws it closer.
  focalX += (mouseX - focalX) * 0.012 + (noise(cycle * 3) - 0.5) * 3;
  focalY += (mouseY - focalY) * 0.012 + (noise(cycle * 3 + 7) - 0.5) * 3;

  const linkDist = 40 + gatherStrength * 90;

  // Faint constellation links between close motes when gathering.
  if (gatherStrength > 0.35) {
    const alpha = map(gatherStrength, 0.35, 1, 6, 26);
    stroke(PALETTE.cool[0], PALETTE.cool[1], PALETTE.cool[2], alpha);
    strokeWeight(0.6);
    for (let i = 0; i < motes.length; i++) {
      const a = motes[i];
      for (let j = i + 1; j < motes.length; j++) {
        const b = motes[j];
        const d = dist(a.x, a.y, b.x, b.y);
        if (d < linkDist) {
          line(a.x, a.y, b.x, b.y);
        }
      }
    }
  }

  for (const m of motes) {
    // Drift, and when gathering, be pulled toward the focal point.
    const pull = 0.02 * gatherStrength;
    m.vx += (focalX - m.x) * pull * 0.02 + random(-0.04, 0.04);
    m.vy += (focalY - m.y) * pull * 0.02 + random(-0.04, 0.04);
    m.vx *= 0.985;
    m.vy *= 0.985;
    m.x += m.vx;
    m.y += m.vy;

    // Soft wrap at edges.
    if (m.x < -10) m.x = width + 10;
    if (m.x > width + 10) m.x = -10;
    if (m.y < -10) m.y = height + 10;
    if (m.y > height + 10) m.y = -10;

    // Each mote picks its tint: amber by default, rose at peak gather,
    // periwinkle when dissolved — symbols changing as they cohere.
    let c;
    if (gatherStrength > 0.7) {
      c = lerpColor(
        color(PALETTE.warm),
        color(PALETTE.rose),
        m.hue * (gatherStrength - 0.7) / 0.3
      );
    } else {
      c = lerpColor(
        color(PALETTE.cool),
        color(PALETTE.warm),
        m.hue * (1 - gatherStrength)
      );
    }
    const glow = 90 + 90 * gatherStrength;
    noStroke();
    fill(red(c), green(c), blue(c), glow);
    circle(m.x, m.y, m.r * 2);
    // A faint halo for the brightest motes.
    if (m.r > 2.6) {
      fill(red(c), green(c), blue(c), 28);
      circle(m.x, m.y, m.r * 5);
    }
  }

  // The gathering point itself: a quiet golden pulse.
  noStroke();
  fill(PALETTE.warm[0], PALETTE.warm[1], PALETTE.warm[2], 60 + 40 * sin(cycle * 30));
  circle(focalX, focalY, 6);
}