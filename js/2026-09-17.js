// 2026-09-17 — "Nothing was hidden"
// Tunnels that were always open: slow corridors of light opening through stone,
// small warm motes drifting along invisible currents, a passage revealed only by patience.

let motes = [];
let drift = 0;
let veins = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 90; i++) motes.push(newMote(true));
  for (let i = 0; i < 7; i++) veins.push({ off: random(1000), amp: random(20, 70), w: random(0.4, 1.4) });
}

function newMote(seed) {
  return {
    x: seed ? random(width) : -20,
    y: random(height),
    r: random(1.2, 4.5),
    sp: random(0.25, 1.1),
    hue: random(28, 46),
    a: random(20, 70),
    ph: random(TWO_PI)
  };
}

function draw() {
  drift += 0.004;
  // Deep stone ground, warming toward the open passage.
  for (let y = 0; y < height; y += 4) {
    const t = y / height;
    stroke(232 - 12 * t, 34, 9 + 10 * t, 100);
    line(0, y, width, y);
  }
  noStroke();

  // The corridor of light — always there, gradually opening.
  const open = 0.5 + 0.5 * sin(drift * 2.2);
  const cx = width * 0.5 + sin(drift) * width * 0.08;
  const ch = height * (0.30 + 0.22 * open);
  const cw = width * (0.06 + 0.05 * open);
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (let i = 12; i >= 0; i--) {
    const k = i / 12;
    fill(40, 45 - k * 20, 40 + k * 30, 2.4);
    ellipse(cx + sin(drift + k * 3) * 14, height / 2, cw * (1 + k * 3), ch * (1 + k * 0.6));
  }
  drawingContext.restore();

  // Invisible currents: thin veins of light that only patience reveals.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  noFill();
  for (const v of veins) {
    stroke(42, 30, 55, 14);
    strokeWeight(v.w);
    beginShape();
    for (let x = -20; x <= width + 20; x += 22) {
      const y = height * 0.5 + sin(x * 0.006 + drift * 1.6 + v.off) * v.amp * (0.4 + 0.6 * open);
      vertex(x, y);
    }
    endShape();
  }
  drawingContext.restore();
  noStroke();

  // Motes drifting outward along the current, never hidden, just unnoticed.
  drawingContext.save();
  drawingContext.globalCompositeOperation = "lighter";
  for (const m of motes) {
    m.x += m.sp * (0.6 + open);
    m.y += sin(drift * 3 + m.ph) * 0.4;
    if (m.x > width + 20) { Object.assign(m, newMote(false)); }
    fill(m.hue, 60, 100, m.a);
    ellipse(m.x, m.y, m.r * 2, m.r * 2);
  }
  drawingContext.restore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
