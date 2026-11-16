// 2026-11-15 — "The links we trusted were only promises; the model learns
// faster than we learn to doubt it. Somewhere a lamp stays on."
//
// A wall of hanging threads, each holding one small amber bead at its end.
// Every so often a thread is cut and the bead slips free, dropping into the
// dark while the thread above it frays into short broken ticks and is left
// hanging. New threads tie themselves at the top and grow a bead slowly down.
// Move to pull the nearest thread sideways out of true; press to cut one where
// you point. Nothing holds for long — but the wall keeps re-tying itself.

let threads = [];
let drops = [];
let cuts = [];
let t = 0;
let cutTimer = 0;
let lean = 0;
let leanTarget = 0;

const SKY = [7, 9, 14];
const DEEP = [14, 17, 26];
const THREAD = [126, 142, 168];
const PALE = [214, 220, 232];
const AMBER = [236, 198, 142];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedWall();
}

function seedWall() {
  threads = [];
  drops = [];
  cuts = [];
  const spacing = Math.max(26, Math.min(58, width / 22));
  const count = Math.floor(width / spacing) + 1;
  for (let i = 0; i < count; i++) {
    threads.push(makeThread(i * spacing + random(-4, 4)));
  }
  cutTimer = 90;
}

function makeThread(x) {
  return {
    x,
    sway: random(TWO_PI),
    swayRate: random(0.004, 0.011),
    // how far down the bead hangs, as a fraction of height
    reach: random(0.16, 0.72),
    beadR: random(2.2, 4.6),
    state: 'held',
    grow: 0,
    frayed: 0
  };
}

function draw() {
  t += 1;
  lean = lerp(lean, leanTarget, 0.045);

  drawRoom();

  push();
  translate(lean * width * 0.012, 0);

  if (cutTimer > 0) {
    cutTimer -= 1;
  } else {
    cutRandomThread();
    cutTimer = Math.floor(random(34, 130));
  }

  drawThreads();
  stepDrops();
  drawDrops();
  drawCuts();

  pop();
}

function drawRoom() {
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, `rgb(${SKY[0]},${SKY[1]},${SKY[2]})`);
  g.addColorStop(0.55, `rgb(${DEEP[0]},${DEEP[1]},${DEEP[2]})`);
  g.addColorStop(1, 'rgb(4,5,9)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  // a single warm wash from above, off-center — the lamp that stays on
  const lamp = drawingContext.createRadialGradient(
    width * 0.72, -height * 0.1, 0,
    width * 0.72, -height * 0.1, height * 1.1
  );
  lamp.addColorStop(0, 'rgba(236,198,142,0.075)');
  lamp.addColorStop(0.45, 'rgba(236,198,142,0.02)');
  lamp.addColorStop(1, 'rgba(236,198,142,0)');
  drawingContext.fillStyle = lamp;
  rect(0, 0, width, height);
}

function threadTop() {
  return height * 0.06;
}

function threadBottom(th) {
  return threadTop() + th.reach * height;
}

function drawThreads() {
  for (const th of threads) {
    const near = abs(mouseX - th.x) < 70 && mouseY > 0;
    const pull = near ? (mouseX - th.x) * 0.16 : 0;
    const sway = sin(t * th.swayRate + th.sway) * 5;

    const y0 = threadTop();
    const y1 = threadBottom(th);
    const bx = th.x + sway + pull;
    const by = y1;

    if (th.state === 'held') {
      // the thread itself: a long soft curve from the rail down to the bead
      noFill();
      stroke(THREAD[0], THREAD[1], THREAD[2], near ? 62 : 26);
      strokeWeight(1);
      beginShape();
      for (let s = 0; s <= 1.001; s += 0.08) {
        const px = th.x + sway * s + pull * s * s;
        const py = y0 + (y1 - y0) * s;
        vertex(px, py);
      }
      endShape();

      // the bead
      const glow = 0.55 + 0.45 * sin(t * 0.02 + th.sway);
      fill(AMBER[0], AMBER[1], AMBER[2], 190);
      circle(bx, by, th.beadR * 2);
      noFill();
      stroke(AMBER[0], AMBER[1], AMBER[2], 44 * glow);
      strokeWeight(1);
      circle(bx, by, th.beadR * 5);
      noStroke();
    } else if (th.state === 'frayed') {
      // only a stub is left, with the broken ends ticked out
      const stub = y0 + (y1 - y0) * 0.34;
      noFill();
      stroke(THREAD[0], THREAD[1], THREAD[2], 22);
      strokeWeight(1);
      line(th.x, y0, th.x + sway * 0.3, stub);
      stroke(THREAD[0], THREAD[1], THREAD[2], 18);
      for (let k = 0; k < 3; k++) {
        const ox = (k - 1) * 3.2;
        const len = 5 + th.frayed * 5;
        line(th.x + ox, stub, th.x + ox + (k - 1) * 1.6, stub + len);
      }
      noStroke();
      th.frayed = min(1, th.frayed + 0.02);
      th.state = 'regrowing';
      th.grow = 0;
    } else if (th.state === 'regrowing') {
      th.grow = min(1, th.grow + 0.006);
      if (th.grow >= 1) {
        th.state = 'held';
        th.reach = random(0.16, 0.72);
        th.beadR = random(2.2, 4.6);
        th.frayed = 0;
        continue;
      }
      // a new thread ties itself and the bead descends along it
      const yEnd = y0 + (y1 - y0) * th.grow;
      noFill();
      stroke(THREAD[0], THREAD[1], THREAD[2], 18 + 16 * th.grow);
      strokeWeight(1);
      line(th.x, y0, th.x + sway * th.grow, yEnd);
      fill(AMBER[0], AMBER[1], AMBER[2], 70 + 110 * th.grow);
      circle(th.x + sway * th.grow, yEnd, th.beadR * 1.6);
      noStroke();
    }
  }
}

function cutRandomThread() {
  const held = threads.filter(th => th.state === 'held');
  if (!held.length) return;
  cutThread(random(held));
}

function cutThread(th) {
  if (th.state !== 'held') return;
  const sway = sin(t * th.swayRate + th.sway) * 5;
  const x = th.x + sway;
  const y = threadBottom(th);

  drops.push({
    x, y,
    vy: random(0.6, 1.8),
    vx: random(-0.35, 0.35),
    r: th.beadR,
    life: 1
  });
  cuts.push({ x, y, life: 1 });
  th.state = 'frayed';
  th.frayed = 0;
}

function stepDrops() {
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    d.vy += 0.09;
    d.y += d.vy;
    d.x += d.vx;
    d.life = constrain(1 - (d.y / height) * 1.35, 0, 1);
    if (d.y > height + 20 || d.life <= 0) drops.splice(i, 1);
  }
}

function drawDrops() {
  for (const d of drops) {
    // a thin trail above the falling bead — the thread it used to hang from
    noFill();
    stroke(AMBER[0], AMBER[1], AMBER[2], 40 * d.life);
    strokeWeight(1);
    line(d.x - d.vx * 22, d.y - d.vy * 16, d.x, d.y);
    noStroke();
    fill(AMBER[0], AMBER[1], AMBER[2], 210 * d.life);
    circle(d.x, d.y, d.r * 1.9);
  }
}

function drawCuts() {
  for (let i = cuts.length - 1; i >= 0; i--) {
    const c = cuts[i];
    const k = 1 - c.life;
    noFill();
    stroke(PALE[0], PALE[1], PALE[2], 120 * c.life);
    strokeWeight(1);
    circle(c.x, c.y, 6 + k * 60);
    stroke(AMBER[0], AMBER[1], AMBER[2], 70 * c.life);
    circle(c.x, c.y, 3 + k * 26);
    noStroke();
    c.life -= 0.035;
    if (c.life <= 0) cuts.splice(i, 1);
  }
}

function nearestThread(x) {
  let best = null;
  let bd = Infinity;
  for (const th of threads) {
    const d = abs(th.x - x);
    if (d < bd) { bd = d; best = th; }
  }
  return bd < 40 ? best : null;
}

function mouseMoved() {
  leanTarget = (mouseX / Math.max(1, width) - 0.5) * 2;
}

function cutHere() {
  const th = nearestThread(mouseX);
  if (th) cutThread(th);
}

function mousePressed() {
  cutHere();
}

function touchStarted() {
  cutHere();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedWall();
}
