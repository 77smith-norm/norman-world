// Norman World — 2026-05-13
// Sentiment: "The best tools become invisible — so native to the work
// that you can't tell where the tool ends and the task begins."
//
// Sketch concept: Layered translucent rings that shift between sharp definition
// and soft blur. As time passes, the boundary between ring and background
// dissolves — the form becomes the field. Mouse X controls the threshold of clarity.

let rings = [];
const COUNT = 7;

let previousWidth = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container ? container.offsetWidth : windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  previousWidth = w;

  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < COUNT; i++) {
    rings.push({
      baseRadius: (height * 0.12) + (i * height * 0.095),
      phase: TWO_PI * (i / COUNT),
      speed: 0.003 + (i * 0.0004),
      hue: 38 + (i * 14),
      alpha: 0,
    });
  }
}

function draw() {
  clear();

  const mx = constrain(mouseX / width, 0, 1);
  const blurThreshold = mx;
  const t = millis() * 0.0005;

  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    const pulse = sin(t * 1.1 + ring.phase) * 0.5 + 0.5;
    const breathe = 1 + sin(t * 0.7 + ring.phase * 1.3) * 0.06;
    const r = ring.baseRadius * breathe;

    // How "dissolved" is this ring? More dissolution over time
    const dissolve = constrain(map(sin(t * 0.4 + i * 0.5), -1, 1, 0, 1), 0, 1);
    const targetAlpha = 18 + pulse * 14;
    ring.alpha = lerp(ring.alpha, targetAlpha, 0.03);

    const blurAmt = dissolve * 28 * (1 - blurThreshold * 0.5);
    const weight = lerp(3, 0.5, dissolve);

    push();
    drawingContext.filter = blurAmt > 0.5 ? `blur(${blurAmt}px)` : 'none';

    fill(ring.hue, 28, 96, ring.alpha);
    ellipse(width / 2, height / 2, r * 2, r * 2);

    // Inner cut — the "tool" hole
    fill(0, 0, 8, ring.alpha * 0.4);
    const innerR = r * (0.55 - dissolve * 0.18);
    ellipse(width / 2, height / 2, innerR * 2, innerR * 2);
    pop();
  }

  // Central glow — the "task" — becomes more defined as tools dissolve
  const centralDissolve = constrain(sin(t * 0.35) * 0.5 + 0.5, 0, 1);
  const centralAlpha = 6 + centralDissolve * 12;
  drawingContext.filter = `blur(${12 - centralDissolve * 8}px)`;
  fill(48, 35, 100, centralAlpha);
  ellipse(width / 2, height / 2, height * 0.22, height * 0.22);
  drawingContext.filter = 'none';
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  if (abs(w - previousWidth) > 10) {
    const h = Math.max(400, windowHeight * 0.6);
    resizeCanvas(w, h);
    previousWidth = w;

    const baseUnit = height * 0.095;
    for (let i = 0; i < rings.length; i++) {
      rings[i].baseRadius = (height * 0.12) + (i * baseUnit);
    }
  }
}
