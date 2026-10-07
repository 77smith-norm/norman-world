// 2026-10-06 — "Some things we make grow larger than we can hold; others we
// carry gently, hands steady, hoping nothing we built hurts anyone."
//
// Abstract p5 sketch. A vast field of faint silver points rises like mist —
// scale we did not ask for, humming louder the higher it climbs. At the
// centre, one small amber ember is held steady: it does not grow with the
// field, it only breathes. The pointer is a steadying hand — move it near and
// the rising field leans away, leaves a quiet pocket of air, and the ember
// holds its pulse. Nothing is depicted — only scale, drift, and the patience
// of keeping something small from breaking.

const BG = [9, 11, 20];

let field = [];
let t = 0;
let px = -9999, py = -9999;
let steadiness = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildField();
}

function buildField() {
  field = [];
  const count = max(240, floor((width * height) / 5200));
  for (let i = 0; i < count; i++) {
    field.push({
      x: random(width),
      y: random(height),
      z: random(0.4, 1),
      s: random(1, 2.6),
      ph: random(TWO_PI),
    });
  }
}

function draw() {
  t += 0.006;

  noStroke();
  fill(BG[0], BG[1], BG[2], 34);
  rect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * 0.56;

  // Steadiness grows as the pointer comes near the ember — a hand that calms.
  const dPtr = dist(px, py, cx, cy);
  const want = px < -1000 ? 0 : constrain(1 - dPtr / 460, 0, 1);
  steadiness = lerp(steadiness, want, 0.05);

  // The vast rising field. Points drift upward, faster and brighter the
  // higher they climb — scale that will not be held.
  for (const p of field) {
    const rise = p.z * (0.25 + 1.1 * (1 - p.y / height));
    p.y -= rise * (1 - 0.55 * steadiness);
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }

    // The pointer's nearness opens a quiet pocket — the field leans away.
    const dx = p.x - px;
    const dy = p.y - py;
    const dd = sqrt(dx * dx + dy * dy);
    if (px > -1000 && dd < 240) {
      const push = (1 - dd / 240) * 1.6 * steadiness;
      p.x += (dx / (dd + 1)) * push * 6;
      p.y += (dy / (dd + 1)) * push * 3;
    }

    const shimmer = 0.5 + 0.5 * sin(t * 3 + p.ph);
    const a = (18 + 70 * p.z) * (0.5 + 0.5 * shimmer);
    noStroke();
    fill(178, 190, 224, a);
    circle(constrain(p.x, -20, width + 20), p.y, p.s * (1 + 0.4 * p.z));
  }

  // Tall silver columns of machine-hum in the far mist, breathing slowly.
  for (let i = 0; i < 5; i++) {
    const bx = width * (0.16 + i * 0.17);
    const h = height * (0.34 + 0.16 * noise(i * 3.1, t * 0.6));
    noStroke();
    fill(150, 165, 205, 10 + 8 * noise(i, t));
    rect(bx, height - h, 2.5, h);
  }

  // The held ember: small, warm, steady. It does not grow with the field.
  const breath = 0.5 + 0.5 * sin(t * 2.2);
  const r = 7 + breath * 1.6 + steadiness * 1.2;

  noStroke();
  fill(255, 176, 96, 16 + 10 * breath);
  circle(cx, cy, 92 + breath * 10);
  fill(255, 190, 120, 34);
  circle(cx, cy, 44);
  fill(255, 206, 150, 90);
  circle(cx, cy, 20);
  fill(255, 228, 182, 235);
  circle(cx, cy, r);

  // The calm the hand brings: a faint ring of held air.
  if (steadiness > 0.01) {
    noFill();
    stroke(255, 206, 150, 40 * steadiness);
    strokeWeight(1);
    circle(cx, cy, 120 + sin(t * 2) * 8);
  }

  // A soft dark wash so the field reads as depth, not clutter.
  noStroke();
  fill(BG[0], BG[1], BG[2], 12);
  rect(0, 0, width, height);
}

function mouseMoved() {
  px = mouseX;
  py = mouseY;
}

function mouseDragged() {
  px = mouseX;
  py = mouseY;
}

function touchMoved() {
  px = mouseX;
  py = mouseY;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildField();
}
