// 2026-10-08 — "Smaller and louder at once — a model in your pocket, a coffee
// machine that never stops talking — yet we draw the house by hand."
//
// Abstract p5 sketch. Everywhere, tiny cool ticks of chatter multiply and
// drift outward: the machines around us, measurably louder with every second
// that passes, whether or not anyone is listening. Against that noise, the
// pointer is a hand. Move it slowly and it leaves a warm ink line that stays —
// a mark made on purpose, and kept. Move fast and it leaves nothing; hold
// still and it presses a single deliberate dot. Nothing is depicted — only
// the growing loudness, and the difference between haste and care.

const BG = [9, 11, 15];

let chatter = [];   // the talking machine: multiplying ticks that never settle
let ink = [];       // marks left by a slow hand; these do not fade
let t = 0;
let px, py;
let lastPx = -9999, lastPy = -9999;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  px = width / 2;
  py = height / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(BG[0], BG[1], BG[2]);
  t += 0.01;

  // ---- the machine: louder with every second -----------------------------
  // Target volume climbs steadily, so the field thickens as the piece runs.
  const target = floor(90 + frameCount * 0.35 + 40 * sin(t * 0.4));
  const want = min(target, 900);
  while (chatter.length < want) chatter.push(spawnChatter());
  while (chatter.length > want) chatter.pop();

  noStroke();
  for (const c of chatter) {
    c.x += c.vx;
    c.y += c.vy;
    c.vx += random(-0.02, 0.02);
    c.vy += random(-0.02, 0.02);
    c.vx = constrain(c.vx, -0.9, 0.9);
    c.vy = constrain(c.vy, -0.9, 0.9);
    c.life -= 0.004;
    if (c.life <= 0 || c.x < -20 || c.x > width + 20 || c.y < -20 || c.y > height + 20) {
      Object.assign(c, spawnChatter());
      continue;
    }
    const a = c.a * c.life;
    push();
    translate(c.x, c.y);
    rotate(c.ang);
    stroke(120, 150, 185, a);
    strokeWeight(1);
    line(-c.len / 2, 0, c.len / 2, 0);
    pop();
  }

  // ---- the hand: slow movement leaves warm ink that stays ---------------
  const d = dist(mouseX, mouseY, lastPx, lastPy);
  const onCanvas = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  lastPx = mouseX;
  lastPy = mouseY;
  px = lerp(px, mouseX, 0.14);
  py = lerp(py, mouseY, 0.14);

  if (onCanvas) {
    if (d < 0.4) {
      // held still — press one deliberate dot
      if (frameCount % 10 === 0) ink.push({ x: px, y: py, w: 1.0, r: 3.2 });
    } else if (d < 7) {
      // moving with care — the line lives
      ink.push({ x: px, y: py, w: 1.0, r: 2.4 });
    }
    // moving fast: nothing is left behind
  }

  if (ink.length > 900) ink.splice(0, ink.length - 900);

  // Draw the ink as a warm, unbroken trace; gaps mean the hand hurried.
  noFill();
  for (let i = 1; i < ink.length; i++) {
    const a = ink[i - 1];
    const b = ink[i];
    const gap = dist(a.x, a.y, b.x, b.y);
    if (gap < 9) {
      stroke(240, 186, 120, 120);
      strokeWeight(1.6);
      line(a.x, a.y, b.x, b.y);
    }
  }
  noStroke();
  for (const m of ink) {
    fill(255, 210, 150, 70 * m.w);
    circle(m.x, m.y, m.r * 3.2);
    fill(255, 226, 176, 150 * m.w);
    circle(m.x, m.y, m.r);
  }

  // A faint pulse where the hand currently rests.
  if (onCanvas && d < 7) {
    noFill();
    stroke(255, 214, 160, 70);
    strokeWeight(1);
    circle(px, py, 30 + 6 * sin(t * 3));
    noStroke();
  }
}

function spawnChatter() {
  // Prefer to appear near the hand: the machine is loudest where we stand.
  let x, y;
  if (random() < 0.55 && mouseX > 0 && mouseX < width) {
    x = mouseX + random(-140, 140);
    y = mouseY + random(-140, 140);
  } else {
    x = random(width);
    y = random(height);
  }
  return {
    x, y,
    vx: random(-0.6, 0.6),
    vy: random(-0.35, 0.35),
    len: random(3, 9),
    ang: random(TWO_PI),
    a: random(30, 90),
    life: random(0.4, 1.0),
  };
}
