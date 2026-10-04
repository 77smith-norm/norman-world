// 2026-10-03 — "Resilience is not one strong thing but many small ones, each
// carrying a little, none allowed to fail at once."
//
// Abstract p5 sketch. A scatter of small nodes holds a dark field together;
// each one carries only a faint light of its own, and the links between them
// brighten and dim as the whole settles. Nothing is depicted — only the
// geometry of a system that stays up because no single part is doing all the
// work. The pointer is a disturbance: move it through the field and nearby
// nodes surge and lean toward it, then the grid quietly re-knits itself once
// the hand is gone. No node is ever the centre; the resilience lives between
// them.

const BG = [7, 10, 12];

let nodes = [];
let links;
let t = 0;
let px, py;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  links = createGraphics(windowWidth, windowHeight);
  links.pixelDensity(1);
  links.background(BG[0], BG[1], BG[2]);
  buildNodes();
  px = -9999;
  py = -9999;
}

function buildNodes() {
  nodes = [];
  const cols = max(4, floor(width / 150));
  const rows = max(3, floor(height / 150));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      nodes.push({
        bx: (i + 0.5) * (width / cols),
        by: (j + 0.5) * (height / rows),
        r: random(2.0, 4.5),
        a: random(60, 150),
        ph: random(TWO_PI),
        charge: 0,
      });
    }
  }
}

// Distributed warmth: a low amber core with a cooler teal only where a node is
// being pushed by the hand. The colour belongs to the connection, not the node.
function nodeColor(charge, a) {
  const warm = [232, 168, 96];
  const cool = [96, 196, 190];
  const k = constrain(charge, 0, 1);
  const r = lerp(warm[0], cool[0], k);
  const g = lerp(warm[1], cool[1], k);
  const b = lerp(warm[2], cool[2], k);
  return [r, g, b, a];
}

function draw() {
  t += 0.01;
  const bg = color(BG[0], BG[1], BG[2], 26);
  noStroke();
  fill(bg);
  rect(0, 0, width, height);

  links.blendMode(ADD);
  links.noStroke();
  links.fill(BG[0], BG[1], BG[2], 10);
  links.rect(0, 0, links.width, links.height);

  // Settle each node toward its resting place, then let the pointer charge it.
  for (const n of nodes) {
    const drift = noise(n.bx * 0.004, n.by * 0.004, t * 0.6);
    n.x = n.bx + cos(n.ph + t) * 6 + (drift - 0.5) * 10;
    n.y = n.by + sin(n.ph * 1.3 + t * 0.8) * 6 + (drift - 0.5) * 10;

    const d = dist(px, py, n.x, n.y);
    const near = d < 190 ? 1 - d / 190 : 0;
    n.charge = lerp(n.charge, near, 0.08);
  }

  // Draw the web. Closer pairs carry a brighter thread.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d > 210) continue;
      const base = (1 - d / 210) * 34;
      const c = nodeColor((a.charge + b.charge) * 0.5, base);
      links.stroke(c[0], c[1], c[2], base);
      links.strokeWeight(0.6 + (a.charge + b.charge) * 1.4);
      links.line(a.x, a.y, b.x, b.y);
    }
  }
  links.blendMode(BLEND);
  image(links, 0, 0);

  // The nodes themselves: small, equal, none dominant.
  for (const n of nodes) {
    const c = nodeColor(n.charge, n.a + n.charge * 90);
    noStroke();
    fill(c[0], c[1], c[2], (c[3]) * 0.16);
    circle(n.x, n.y, n.r * (5 + n.charge * 6));
    fill(c[0], c[1], c[2], c[3]);
    circle(n.x, n.y, n.r + n.charge * 2.5);
  }
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
  links = createGraphics(windowWidth, windowHeight);
  links.pixelDensity(1);
  links.background(BG[0], BG[1], BG[2]);
  buildNodes();
}
