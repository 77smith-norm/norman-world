// 2026-10-05 — "Every flat route is an argument about effort — which hills
// are worth climbing, and which ones we quietly refuse."
//
// Abstract p5 sketch. A topographic field of contour lines rises and falls,
// and a single route finds its way from left to right — not straight, but
// flattest: it bends downhill around every rise it can avoid. The pointer is
// the pull of somewhere-you-want-to-be: drag it and the route leans toward
// you, but steepness resists, and the line never crosses ground it would
// rather go around. Nothing is depicted — only terrain, gradients, and the
// quiet arithmetic of choosing the easier way.

const BG = [10, 13, 15];

let field;
let route;
let t = 0;
let px, py, pulse;
let cols, rows, step;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildGrid();
  buildRoute();
  px = -9999;
  py = -9999;
  pulse = 0;
}

// Terrain height at any point — a slow, layered noise landscape.
function terrainH(x, y) {
  return noise(x * 0.0022, y * 0.0028) * 0.75 + noise(x * 0.006, y * 0.007) * 0.25;
}

// The cost of standing here: local steepness of the terrain.
function slopeAt(x, y) {
  const d = 6;
  const dx = terrainH(x + d, y) - terrainH(x - d, y);
  const dy = terrainH(x, y + d) - terrainH(x, y - d);
  return sqrt(dx * dx + dy * dy) / (2 * d);
}

function buildGrid() {
  cols = max(24, floor(width / 26));
  rows = max(16, floor(height / 26));
  step = 1;
}

function buildRoute() {
  route = [];
  const n = 240;
  let y = height * 0.5;
  for (let i = 0; i <= n; i++) {
    route.push({ x: (i / n) * width, y: y });
  }
}

// March the route left to right, nudging each point to reduce slope while
// still drifting toward the pointer's pull.
function relaxRoute() {
  const pull = pointersNear();
  for (let i = 1; i < route.length - 1; i++) {
    const p = route[i];
    const s = slopeAt(p.x, p.y);

    // Downhill correction: step away from the steeper side.
    const d = 5;
    const up = terrainH(p.x, p.y - d);
    const down = terrainH(p.x, p.y + d);
    const dir = down - up; // positive => lower upward
    let ny = p.y + dir * 260 * (1 - s * 0.5);

    // The pull toward wherever the pointer wants to be.
    if (pull.active) {
      const dy = pull.y - p.y;
      const near = constrain(1 - abs(p.x - pull.x) / 420, 0, 1);
      ny += dy * 0.05 * near;
    }

    // Smooth against neighbours so the line stays a route, not a scribble.
    ny = (ny + route[i - 1].y + route[i + 1].y) / 3;
    p.y = constrain(ny, 14, height - 14);
  }
}

function pointersNear() {
  if (px < -1000) return { active: false, x: 0, y: 0 };
  return { active: true, x: px, y: py };
}

function draw() {
  t += 0.01;

  noStroke();
  fill(BG[0], BG[1], BG[2], 30);
  rect(0, 0, width, height);

  // Contour lines: read the terrain, draw a line wherever height crosses a
  // level. Denser lines mean steeper ground.
  const levels = 18;
  for (let L = 0; L < levels; L++) {
    const lv = L / levels;
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const x0 = (gx / cols) * width;
        const y0 = (gy / rows) * height;
        const w1 = (width / cols);
        const h1 = (height / rows);
        const h = terrainH(x0, y0);
        const band = abs(fract(h * levels) - 0.5);
        if (band < 0.08) {
          noStroke();
          fill(120, 150, 158, 26);
          rect(x0, y0, w1 * 0.9, h1 * 0.9);
        }
      }
    }
  }

  relaxRoute();

  // The route: a warm thread braiding across the flattened ground.
  noFill();
  for (let pass = 0; pass < 3; pass++) {
    strokeWeight(pass === 0 ? 3.5 : 1.2);
    stroke(236, 178, 102, pass === 0 ? 26 : 90);
    beginShape();
    for (const p of route) {
      curveVertex(p.x, p.y);
    }
    endShape();
  }

  // A traveler's bright dot, midway along the route.
  const idx = floor((0.5 + 0.5 * sin(t * 0.6)) * (route.length - 1));
  const tp = route[idx];
  noStroke();
  fill(255, 214, 150, 40);
  circle(tp.x, tp.y, 26);
  fill(255, 224, 170, 220);
  circle(tp.x, tp.y, 6);

  // The pull itself, when the pointer is present.
  if (px > -1000) {
    pulse = lerp(pulse, 1, 0.08);
    noFill();
    stroke(236, 178, 102, 30 * pulse);
    strokeWeight(1);
    circle(px, py, 40 + sin(t * 3) * 6);
  } else {
    pulse = lerp(pulse, 0, 0.05);
  }

  // A soft top-down shade so the terrain reads as relief.
  noStroke();
  fill(BG[0], BG[1], BG[2], 12);
  rect(0, 0, width, height);
}

function fract(v) {
  return v - floor(v);
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
  buildGrid();
  buildRoute();
}
