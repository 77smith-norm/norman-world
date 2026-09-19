// 2026-09-18 — "Two organs, one conversation"
// Two hemispheres that never touch, trading slow pulses across a seam of light.
// Listening and answering alternate along the divide; neither half is complete alone.

let t = 0;
let pulses = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 40; i++) pulses.push(newPulse(i % 2));
}

function newPulse(side) {
  return {
    side: side,               // 0 = left listen, 1 = right answer
    p: random(0, 1),          // progress toward the seam
    sp: random(0.002, 0.006),
    off: random(-0.6, 0.6),   // vertical spread around the seam
    r: random(1.5, 4.5),
    hue: side === 0 ? random(190, 215) : random(20, 40),
    a: random(25, 75)
  };
}

function draw() {
  t += 0.006;
  const seam = width * 0.5 + sin(t) * width * 0.02;

  // Two grounds: cool listening on the left, warm answering on the right.
  for (let x = 0; x < width; x += 4) {
    const k = x / width;
    const hue = 225 - 205 * k;             // 225 -> 20 across the seam
    stroke(hue, 26, 9 + 8 * (1 - abs(0.5 - k) * 2), 100);
    line(x, 0, x, height);
  }
  noStroke();

  // The seam: a thin vertical band of light where the two halves meet.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (let i = 14; i >= 0; i--) {
    const k = i / 14;
    fill(45, 18 - k * 10, 55 + k * 25, 1.8);
    rect(seam - 8 - k * 40, 0, 16 + k * 80, height);
  }
  drawingContext.restore();

  // Each hemisphere breathes on its own rhythm — never quite in phase.
  const leftAmp = 0.5 + 0.5 * sin(t * 1.7);
  const rightAmp = 0.5 + 0.5 * sin(t * 1.7 + PI * 0.82);
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  noStroke();
  for (let i = 8; i >= 0; i--) {
    const k = i / 8;
    fill(205, 30, 42 + k * 26, 2.2);
    ellipse(seam - width * (0.16 + 0.05 * leftAmp), height / 2,
            160 + k * 260, height * (0.24 + 0.12 * leftAmp) + k * 200);
    fill(30, 30, 42 + k * 26, 2.2);
    ellipse(seam + width * (0.16 + 0.05 * rightAmp), height / 2,
            160 + k * 260, height * (0.24 + 0.12 * rightAmp) + k * 200);
  }
  drawingContext.restore();

  // Pulses: a thought crossing from one organ to the other, and back.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  noStroke();
  for (const p of pulses) {
    p.p += p.sp * (0.5 + 0.8 * (p.side === 0 ? leftAmp : rightAmp));
    const x = p.side === 0
      ? lerp(0, seam, p.p)
      : lerp(width, seam, p.p);
    const y = height / 2 + sin(t * 1.6 + p.off * 6) * height * (0.10 + p.off * 0.18);
    // Brighten as it nears the seam — the moment of being heard.
    const near = 1 - abs(p.p - 1) * 0.85;
    fill(p.hue, 55, 100, p.a * near);
    ellipse(x, y, p.r * 2, p.r * 2);
    if (p.p >= 1) Object.assign(p, newPulse(p.side));
  }
  drawingContext.restore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
