// Norman World — 2026-08-28
// Sentiment: "Even the last of a slow, old thing still moves —
// and moving deliberately is its own kind of grace."
//
// A dusk procession of lantern-light crosses the canvas at walking pace,
// leaving slow exhales of smoke behind it. Press / touch to slow the world
// further — deliberation as an act of grace.

let puffs = [];
let timeScale = 1;
const train = { x: -140, y: 0, cars: 9, speed: 0.55 };

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  train.y = height * 0.62;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  drawDusk();

  // gentle arc — the line drifts low, never hurries
  const targetY = height * 0.62 + sin(frameCount * 0.005) * height * 0.07;
  train.y += (targetY - train.y) * 0.015;
  train.x += train.speed * timeScale;
  if (train.x > width + 240) train.x = -240;

  // the engine exhales
  if (frameCount % 6 === 0 && timeScale > 0.04) {
    puffs.push({
      x: train.x + 26,
      y: train.y - 24,
      vx: random(-0.15, 0.3),
      vy: -random(0.25, 0.6),
      r: random(5, 13),
      life: 255,
    });
  }

  // smoke drifts upward
  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i];
    p.x += p.vx * timeScale;
    p.y += p.vy * timeScale;
    p.r += 0.22 * timeScale;
    p.life -= 1.05 * timeScale;
    if (p.life <= 0) { puffs.splice(i, 1); continue; }
    fill(232, 226, 218, p.life * 0.30);
    circle(p.x, p.y, p.r * 2);
  }
  if (puffs.length > 240) puffs.splice(0, puffs.length - 240);

  drawTrain();
  drawGround();
  timeScale += (1 - timeScale) * 0.02;
}

function drawDusk() {
  noStroke();
  for (let i = 0; i <= height; i += 4) {
    const t = i / height;
    const c = lerpColor(
      color(20, 16, 42),   // deep indigo
      color(216, 112, 88), // ember horizon
      pow(t, 1.7)
    );
    fill(c);
    rect(0, i, width, 4);
  }
}

function drawTrain() {
  const spacing = 48;
  const count = train.cars;
  for (let i = count; i >= 0; i--) {
    const cx = train.x - i * spacing;
    if (cx < -90 || cx > width + 90) continue;
    const bob = sin(frameCount * 0.028 + i * 1.7) * 3;
    const cy = train.y + bob;
    // lantern halo
    fill(255, 190, 110, 55);
    circle(cx, cy, 56);
    fill(255, 214, 150, 85);
    circle(cx, cy, 36);
    // carriage body
    fill(40, 32, 28, 210);
    rect(cx - 20, cy - 13, 40, 26, 9);
    // glowing windows
    fill(255, 200, 130, 200);
    rect(cx - 13, cy - 8, 11, 8, 3);
    rect(cx + 2, cy - 8, 11, 8, 3);
    // engine headlamp
    if (i === count) {
      fill(255, 238, 195, 170);
      circle(cx + 13, cy - 4, 6);
    }
  }
}

function drawGround() {
  fill(12, 10, 20, 90);
  const span = train.cars * 48;
  ellipse(train.x - span / 2, height * 0.86, span * 0.9, 12);
}

function mousePressed() { timeScale = 0.16; }
function touchStarted() { timeScale = 0.16; return false; }