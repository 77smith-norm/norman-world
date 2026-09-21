// 2026-09-20 — "Some things we save only to prove we saw them"
// Scanlines drift across a dark field; bright traces persist, decay, and never
// fully erase. A slow read head wakes what was almost forgotten.

let t = 0;
let lines = [];
let traces = [];
let head;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 180; i++) lines.push(newLine(i));
  for (let i = 0; i < 7; i++) traces.push(newTrace());
  head = { y: 0.2, sp: 0.0007 };
}

function newLine(i) {
  return {
    y: (i + 0.5) / 180,
    ph: random(TWO_PI),
    sp: random(0.0004, 0.0013),
    w: random(0.4, 1.3)
  };
}

function newTrace() {
  return {
    y: random(0.15, 0.85),
    seed: random(1000),
    life: random(0.3, 1),
    hue: random([120, 96, 42]) // phosphor green, teal, amber
  };
}

function draw() {
  t += 0.004;

  // Dark glass: vertical falloff, near-black at the edges.
  for (let y = 0; y < height; y += 4) {
    const k = y / height;
    const edge = abs(k - 0.5) * 2;
    stroke(210, 30, 3 + 4 * (1 - edge), 100);
    line(0, y, width, y);
  }
  noStroke();

  // The read head: a slow luminous sweep that wakes the field as it passes.
  head.y += head.sp;
  if (head.y > 1.05) { head.y = -0.05; }
  const hy = head.y * height;

  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";

  // Persistent traces — faded memories of lines that were once bright.
  for (const tr of traces) {
    tr.life -= 0.0009;
    if (tr.life <= 0) Object.assign(tr, newTrace());
    const wob = sin(t * 1.1 + tr.seed) * 0.02;
    const yy = (tr.y + wob) * height;
    const prox = max(0, 1 - abs(yy - hy) / (height * 0.28));
    const a = (6 + tr.life * 26) + prox * 34;
    fill(tr.hue, 46, 70, a);
    const len = width * (0.3 + 0.5 * tr.life);
    const x0 = width * 0.5 - len / 2 + sin(t * 0.6 + tr.seed) * width * 0.04;
    rect(x0, yy - 1.2, len, 2.4);
    fill(tr.hue, 34, 60, a * 0.22);
    rect(x0 - 12, yy - 4, len + 24, 8);
  }
  drawingContext.restore();
  noStroke();

  // The scanlines themselves — the texture of a remembered screen.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (const l of lines) {
    l.y += l.sp * 0.0006;
    if (l.y > 1) l.y -= 1;
    const yy = l.y * height;
    const prox = max(0, 1 - abs(yy - hy) / (height * 0.18));
    const flick = 0.6 + 0.4 * sin(t * 7 + l.ph);
    const a = (2 + prox * 30) * flick;
    stroke(150, 24, 72, a);
    strokeWeight(l.w);
    line(0, yy, width, yy);
  }
  drawingContext.restore();
  noStroke();

  // The sweep head — a soft band of light with a faint read cursor.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (let i = 8; i >= 0; i--) {
    const k = i / 8;
    fill(140, 18, 40 + k * 26, 3.2 * (1 - k) + 1);
    rect(0, hy - k * 40 - 20, width, 44);
  }
  const cxr = width * (0.5 + sin(t * 0.5) * 0.12);
  fill(42, 60, 88, 46);
  ellipse(cxr, hy, 10, 6);
  fill(42, 40, 92, 22);
  ellipse(cxr, hy, 46, 20);
  drawingContext.restore();

  // Mouse presence: the field brightens where attention rests.
  if (mouseX > 0 && mouseY > 0) {
    drawingContext.save();
    drawingContext.globalCompositeOperation = "lighter";
    for (let i = 6; i >= 0; i--) {
      const k = i / 6;
      fill(150, 20, 60, 1.6);
      ellipse(mouseX, mouseY, 40 + k * 160, 20 + k * 90);
    }
    drawingContext.restore();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
