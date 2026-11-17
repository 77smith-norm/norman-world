// 2026-11-16 — "A free classroom opened, a shared back door closed, and the
// trusted pipe carried poison. Openness is only half of care."
//
// A wall of tall thin apertures, like shutters set into stone. Most of them
// breathe open and closed on their own slow rhythm, spilling a wedge of pale
// chalk light across the floor. Down the centre runs one conduit that never
// closes: motes climb it continuously, and whatever they carry goes up
// whether or not anyone is watching. Move to lean the whole wall toward the
// pointer and to widen the apertures nearby; press to seal one, which goes
// dark for a while and then, patiently, opens again.

let cells = [];
let motes = [];
let t = 0;
let lean = 0;
let leanTarget = 0;
let sealFlash = [];

const VOID = [6, 7, 10];
const STONE = [26, 30, 38];
const CHALK = [222, 226, 232];
const STEEL = [132, 146, 168];
const WARM = [238, 206, 158];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedWall();
}

function seedWall() {
  cells = [];
  motes = [];
  sealFlash = [];

  const colW = Math.max(30, Math.min(62, width / 20));
  const cols = Math.floor(width / colW) + 1;
  const top = height * 0.1;
  const bottom = height * 0.94;

  for (let i = 0; i < cols; i++) {
    const x = i * colW + colW * 0.5;
    const h = (bottom - top) * random(0.42, 0.98);
    cells.push({
      x,
      w: colW * random(0.3, 0.52),
      y0: top + random(0, (bottom - top - h)),
      h,
      phase: random(TWO_PI),
      rate: random(0.004, 0.013),
      amp: random(0.5, 1),
      // how far a seal holds, in frames
      seal: 0,
      sealed: 0,
      bias: random(-0.12, 0.12)
    });
  }
}

function draw() {
  t += 1;
  lean = lerp(lean, leanTarget, 0.04);

  drawRoom();

  push();
  translate(lean * width * 0.018, 0);

  const spout = width * 0.5 + lean * width * 0.01;
  const openNear = [];

  for (const c of cells) {
    const d = abs(mouseX - c.x);
    const near = d < 96 ? 1 - d / 96 : 0;

    let open;
    if (c.sealed > 0) {
      c.sealed -= 1;
      c.seal = lerp(c.seal, 0, 0.06);
      open = c.seal;
    } else {
      const breathe = (sin(t * c.rate + c.phase) * 0.5 + 0.5) * c.amp + c.bias;
      open = constrain(breathe + near * 0.55, 0, 1);
      c.seal = open;
    }

    drawAperture(c, open, near);
    if (open > 0.35) openNear.push({ c, open });
  }

  // the conduit: one pipe that stays open the whole time
  drawConduit(spout);
  stepMotes(spout);
  drawMotes();
  drawFlashes();

  pop();
}

function drawRoom() {
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, 'rgb(4,5,8)');
  g.addColorStop(0.5, `rgb(${VOID[0] + 6},${VOID[1] + 7},${VOID[2] + 11})`);
  g.addColorStop(1, `rgb(${STONE[0]},${STONE[1]},${STONE[2]})`);
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);
}

function drawAperture(c, open, near) {
  const halfW = (c.w * 0.5) * (0.55 + open * 0.45);

  // recessed frame
  fill(STONE[0] + 6, STONE[1] + 7, STONE[2] + 9, 210);
  rect(c.x - halfW - 3, c.y0 - 3, (halfW + 3) * 2, c.h + 6, 4);

  // the opening itself
  if (open < 0.02) {
    fill(2, 3, 4);
    rect(c.x - halfW, c.y0, halfW * 2, c.h, 3);
    return;
  }

  const a = open * open;
  fill(CHALK[0], CHALK[1], CHALK[2], 30 + 170 * a);
  rect(c.x - halfW, c.y0, halfW * 2, c.h, 3);

  // the wedge of light thrown from the opening onto the floor
  const spill = open * c.w * 2.6;
  const baseY = height;
  const grad = drawingContext.createLinearGradient(0, c.y0 + c.h, 0, baseY);
  grad.addColorStop(0, `rgba(222,226,232,${0.11 * open})`);
  grad.addColorStop(1, 'rgba(222,226,232,0)');
  drawingContext.fillStyle = grad;
  noStroke();
  beginShape();
  vertex(c.x - halfW, c.y0 + c.h);
  vertex(c.x + halfW, c.y0 + c.h);
  vertex(c.x + halfW + spill, baseY);
  vertex(c.x - halfW - spill, baseY);
  endShape(CLOSE);

  // the lintel edge, catching whatever is passing through
  stroke(CHALK[0], CHALK[1], CHALK[2], 60 + 130 * a);
  strokeWeight(1);
  line(c.x - halfW, c.y0, c.x + halfW, c.y0);
  noStroke();

  if (near > 0.02) {
    noFill();
    stroke(STEEL[0], STEEL[1], STEEL[2], 60 * near);
    circle(c.x, c.y0 + c.h * 0.5, c.w * 3 + 40 * near);
    noStroke();
  }
}

function drawConduit(x) {
  // a translucent pipe running floor to ceiling, always open
  const w = Math.max(8, width * 0.012);
  const g = drawingContext.createLinearGradient(x - w, 0, x + w, 0);
  g.addColorStop(0, 'rgba(132,146,168,0.04)');
  g.addColorStop(0.5, 'rgba(132,146,168,0.13)');
  g.addColorStop(1, 'rgba(132,146,168,0.04)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(x - w, 0, w * 2, height);

  stroke(STEEL[0], STEEL[1], STEEL[2], 40);
  strokeWeight(1);
  line(x - w, 0, x - w, height);
  line(x + w, 0, x + w, height);
  noStroke();
}

function spawnMote(x) {
  motes.push({
    x: x + random(-2.5, 2.5),
    y: height + random(0, 40),
    r: random(1.6, 3.8),
    vy: random(0.35, 1.15),
    drift: random(-0.25, 0.25),
    warm: random() < 0.18,
    life: 1
  });
}

function stepMotes(x) {
  if (t % 6 === 0) spawnMote(x);
  if (t % 6 === 3 && cells.length) {
    const pick = cells[Math.floor(random(cells.length))];
    if (pick.seal > 0.6) spawnMote(pick.x);
  }

  for (let i = motes.length - 1; i >= 0; i--) {
    const m = motes[i];
    m.y -= m.vy;
    m.x += m.drift + sin(t * 0.01 + m.y * 0.02) * 0.18;
    m.life = constrain(m.y / (height * 0.55), 0, 1);
    if (m.y < -10) motes.splice(i, 1);
  }
}

function drawMotes() {
  for (const m of motes) {
    const col = m.warm ? WARM : CHALK;
    fill(col[0], col[1], col[2], 40 * m.life);
    circle(m.x, m.y, m.r * 5);
    fill(col[0], col[1], col[2], 200 * m.life);
    circle(m.x, m.y, m.r * 1.7);
  }
}

function drawFlashes() {
  for (let i = sealFlash.length - 1; i >= 0; i--) {
    const f = sealFlash[i];
    const k = 1 - f.life;
    noFill();
    stroke(STEEL[0], STEEL[1], STEEL[2], 110 * f.life);
    strokeWeight(1);
    rect(f.x - f.w - k * 26, f.y0 - k * 12, (f.w + k * 26) * 2, f.h + k * 24, 6);
    noStroke();
    f.life -= 0.03;
    if (f.life <= 0) sealFlash.splice(i, 1);
  }
}

function nearestCell(x) {
  let best = null;
  let bd = Infinity;
  for (const c of cells) {
    const d = abs(c.x - x);
    if (d < bd) { bd = d; best = c; }
  }
  return bd < 46 ? best : null;
}

function mouseMoved() {
  leanTarget = (mouseX / Math.max(1, width) - 0.5) * 2;
}

function sealHere() {
  const c = nearestCell(mouseX);
  if (!c) return;
  c.sealed = Math.floor(random(180, 420));
  c.seal = 1;
  sealFlash.push({ x: c.x, y0: c.y0, h: c.h, w: c.w * 0.5, life: 1 });
}

function mousePressed() {
  sealHere();
}

function touchStarted() {
  sealHere();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedWall();
}
