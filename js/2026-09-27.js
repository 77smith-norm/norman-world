// 2026-09-27 — "A tool you can reshape becomes a place to think; the ones you
// cannot are only shelves."
//
// Abstract p5 sketch. A soft lattice of nodes sits quietly in place, and the
// pointer presses into it like a thumb into clay — nearby nodes bow toward the
// hand and hold the new shape for a beat, then slowly remember themselves and
// settle back. Nothing here is rigid; everything is willing to be re-formed.

let nodes = [];
let cell = 34;
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  buildGrid();
}

function buildGrid() {
  cell = 34;
  const cols = ceil(width / cell) + 1;
  const rows = ceil(height / cell) + 1;
  nodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell + cell * 0.5;
      const y = r * cell + cell * 0.5;
      nodes.push({
        hx: x, // home position
        hy: y,
        x: x, // current position
        y: y,
        held: 0, // frames of remembered deformation
        warm: random() < 0.05,
        r, c,
      });
    }
  }
}

function draw() {
  background(12, 13, 19);
  t += 1;

  const px = mouseX;
  const py = mouseY;
  const hand = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  const radius = 130;

  // Update positions: bow toward the hand, else relax home.
  for (const n of nodes) {
    if (hand) {
      const dx = px - n.hx;
      const dy = py - n.hy;
      const d = sqrt(dx * dx + dy * dy);
      if (d < radius) {
        const pull = (1 - d / radius);
        // Bow a fraction of the way in, so the lattice deforms rather than collapses.
        n.tx = n.hx + dx * pull * 0.42;
        n.ty = n.hy + dy * pull * 0.42;
        n.held = 40;
      }
    }
    if (!n.tx) {
      n.tx = n.hx;
      n.ty = n.hy;
    }
    // Ease toward the target shape; mild, so it feels like soft material.
    n.x += (n.tx - n.x) * 0.12;
    n.y += (n.ty - n.y) * 0.12;

    if (n.held > 0) {
      n.held -= 1;
    } else {
      // Slowly remember the original form.
      n.tx = lerp(n.tx, n.hx, 0.03);
      n.ty = lerp(n.ty, n.hy, 0.03);
    }
  }

  drawLattice();
  drawNodes();
}

function drawLattice() {
  // Connect each node to its right and lower neighbors — the shape of thought.
  for (const n of nodes) {
    const right = nodeAt(n.r, n.c + 1);
    const down = nodeAt(n.r + 1, n.c);
    const strain = dist(n.x, n.y, n.hx, n.hy);
    const a = map(strain, 0, 60, 26, 120, true);
    stroke(120, 150, 200, a);
    strokeWeight(1);
    if (right) line(n.x, n.y, right.x, right.y);
    if (down) line(n.x, n.y, down.x, down.y);
  }
}

function drawNodes() {
  noStroke();
  for (const n of nodes) {
    const strain = dist(n.x, n.y, n.hx, n.hy);
    const lift = map(strain, 0, 60, 0, 1, true);
    const base = n.warm ? color(240, 200, 120) : color(200, 220, 245);
    base.setAlpha(120 + 120 * lift);
    fill(base);
    const s = 3 + lift * 3;
    circle(n.x, n.y, s);
    if (lift > 0.4) {
      fill(255, 255, 255, 160 * lift);
      circle(n.x, n.y, 2);
    }
  }
}

function nodeAt(r, c) {
  const cols = ceil(width / cell) + 1;
  const i = r * cols + c;
  return nodes[i] && nodes[i].r === r && nodes[i].c === c ? nodes[i] : null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
