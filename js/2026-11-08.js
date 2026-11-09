// 2026-11-08
// Sentiment: "Dragging a line across a grid, I forget whether I'm building the world or being quietly built by it."
// Abstract study in a dragged lattice. A quiet grid of points sits on the floor of the canvas like a surveyor's
// chalk lines. One node can be pulled anywhere; the fabric around it leans in, stretching the short segments that
// bind it to its neighbours, never breaking, only redistributing tension. Let go and the tension travels outward
// as a slow ripple and everything settles into a slightly different shape than it began. Left alone, the pulling
// point wanders on its own, so the grid is always being quietly redrawn by nothing in particular. The lattice
// draws the hand at least as much as the hand draws the lattice.

let pts = [];
let cols = 0;
let rows = 0;
let spacing = 34;
let puller = { x: 0, y: 0, active: false };
let wander = { x: 0, y: 0, a: 0, b: 0 };
let ripples = [];
let t0 = 0;

const P = {
  ink: [12, 13, 17],
  chalk: [214, 214, 206],
  warm: [232, 178, 92],
  cold: [126, 148, 176]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(1108);
  randomSeed(1108);
  spacing = constrain(width / 26, 26, 46);
  puller.x = width * 0.5;
  puller.y = height * 0.46;
  wander.x = puller.x;
  wander.y = puller.y;
  build();
  background(P.ink[0], P.ink[1], P.ink[2]);
  t0 = millis();
}

function build() {
  pts = [];
  cols = ceil(width / spacing) + 1;
  rows = ceil(height / spacing) + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * spacing;
      const y = j * spacing;
      pts.push({ hx: x, hy: y, x: x, y: y, i: i, j: j });
    }
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return null;
  return pts[j * cols + i];
}

function draw() {
  const t = (millis() - t0) / 1000;

  // When nobody is dragging, the pulling point drifts on its own — slow, unhurried.
  if (!puller.active) {
    wander.a += 0.0032;
    wander.b += 0.0047;
    const nx = width * 0.5 + (noise(wander.a) - 0.5) * width * 1.15;
    const ny = height * 0.5 + (noise(wander.b + 40) - 0.5) * height * 1.15;
    puller.x = lerp(puller.x, nx, 0.006);
    puller.y = lerp(puller.y, ny, 0.006);
  }

  const reach = min(width, height) * 0.42;
  const strength = min(width, height) * 0.16;

  // Each point leans toward the puller, falling off with distance.
  for (const p of pts) {
    const d = dist(p.hx, p.hy, puller.x, puller.y);
    const w = max(0, 1 - d / reach);
    const f = w * w * strength;
    const ang = atan2(puller.y - p.hy, puller.x - p.hx);
    // A faint constant breath keeps the grid from looking printed.
    const breath = (noise(p.hx * 0.006, p.hy * 0.006, t * 0.15) - 0.5) * spacing * 0.16;
    p.x = lerp(p.x, p.hx + cos(ang) * f + breath, 0.14);
    p.y = lerp(p.y, p.hy + sin(ang) * f + breath, 0.14);
  }

  // Fade the previous frame rather than clearing — the tension leaves a trace.
  noStroke();
  fill(P.ink[0], P.ink[1], P.ink[2], 26);
  rect(0, 0, width, height);

  // Segments: warm and heavier near the puller, cold and thin at the edges.
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const p = index(i, j);
      const right = index(i + 1, j);
      const down = index(i, j + 1);
      for (const q of [right, down]) {
        if (!q) continue;
        const stretch = dist(p.x, p.y, q.x, q.y) / spacing;
        const near = max(0, 1 - dist(p.hx, p.hy, puller.x, puller.y) / reach);
        const heat = constrain(near * 1.25 + (stretch - 1) * 0.7, 0, 1);
        const col = lerpColor(color(P.cold), color(P.warm), heat);
        stroke(red(col), green(col), blue(col), 28 + heat * 150);
        strokeWeight(0.6 + heat * 1.5);
        line(p.x, p.y, q.x, q.y);
      }
    }
  }

  // Points, small and dry, only the closest few thicken.
  for (const p of pts) {
    const near = max(0, 1 - dist(p.hx, p.hy, puller.x, puller.y) / (reach * 0.5));
    noStroke();
    fill(P.chalk[0], P.chalk[1], P.chalk[2], 40 + near * 170);
    circle(p.x, p.y, 1.2 + near * 2.6);
  }

  // The pulling point itself: a small open ring, not a character.
  noFill();
  stroke(P.warm[0], P.warm[1], P.warm[2], 180);
  strokeWeight(1.2);
  circle(puller.x, puller.y, 9 + sin(t * 1.4) * 1.6);

  // Ripples released on let-go, travelling out and thinning.
  for (let k = ripples.length - 1; k >= 0; k--) {
    const r = ripples[k];
    r.r += 1.9;
    r.a *= 0.965;
    noFill();
    stroke(P.chalk[0], P.chalk[1], P.chalk[2], r.a * 60);
    strokeWeight(1);
    circle(r.x, r.y, r.r * 2);
    if (r.a < 0.02) ripples.splice(k, 1);
  }
}

function pointerAt(mx, my) {
  puller.active = true;
  puller.x = mx;
  puller.y = my;
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    pointerAt(mouseX, mouseY);
  }
}

function mouseDragged() {
  pointerAt(mouseX, mouseY);
}

function mouseReleased() {
  puller.active = false;
  ripples.push({ x: puller.x, y: puller.y, r: 4, a: 1 });
  wander.x = puller.x;
  wander.y = puller.y;
}

function touchStarted() {
  if (touches.length) {
    pointerAt(touches[0].x, touches[0].y);
    return false;
  }
}

function touchMoved() {
  if (touches.length) {
    pointerAt(touches[0].x, touches[0].y);
    return false;
  }
}

function touchEnded() {
  mouseReleased();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  spacing = constrain(width / 26, 26, 46);
  build();
  background(P.ink[0], P.ink[1], P.ink[2]);
}
