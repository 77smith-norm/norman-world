// 2026-11-18 — "The same wire carries the first ping and the last break;
// every connection is only a held breath."
//
// A mesh so dense it reads as texture: thousands of hair-thin links between
// nodes almost nobody will ever look at. One slow pulse walks the surface,
// hopping node to node, carrying nothing — just arriving. Every so often a
// node gives way: its links go slack, sag, and drift off while the rest of the
// mesh barely registers the change. Move near the pointer and the lattice
// tightens toward you, drawn in. Press to send a ping out from the nearest
// node, a ring that spreads and then stops where the mesh ends.

let nodes = [];
let links = [];
let pulse = null;
let ripple = null;
let slack = [];
let t = 0;

const VOID = [6, 8, 10];
const INK = [188, 202, 214];
const COLD = [126, 168, 190];
const WARM = [226, 190, 132];
const EMBER = [196, 108, 88];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  seedMesh();
}

function seedMesh() {
  nodes = [];
  links = [];
  slack = [];
  noiseSeed(1811);

  const gap = constrain(Math.sqrt((width * height) / 620), 34, 74);
  const cols = Math.ceil(width / gap) + 2;
  const rows = Math.ceil(height / gap) + 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = noise(x * 0.16, y * 0.16);
      nodes.push({
        x: x * gap - gap * 0.5 + (noise(x * 0.7, y * 1.3) - 0.5) * gap * 0.55,
        y: y * gap - gap * 0.5 + (noise(x * 1.1, y * 0.6) - 0.5) * gap * 0.55,
        cx: x,
        cy: y,
        alive: n > 0.24,
        load: n,
        phase: random(TWO_PI)
      });
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    if (!a.alive) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (!b.alive) continue;
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) continue;
      if (dx === 1 && dy === 1) continue;
      links.push({ a: i, b: j, w: random(0.35, 1) });
    }
  }

  spawnPulse();
}

function spawnPulse() {
  const live = nodes.filter((n) => n.alive);
  if (!live.length) return;
  const start = live[floor(random(live.length))];
  pulse = { node: start, prev: null, trail: [], life: 1 };
}

function nearestNode(px, py) {
  let best = null;
  let bd = Infinity;
  for (const n of nodes) {
    if (!n.alive) continue;
    const d = (n.x - px) ** 2 + (n.y - py) ** 2;
    if (d < bd) {
      bd = d;
      best = n;
    }
  }
  return best;
}

function mouseMoved() {
  if (ripple) return;
  const n = nearestNode(mouseX, mouseY);
  if (n) ripple = { x: n.x, y: n.y, r: 0, life: 1 };
}

function mousePressed() {
  const n = nearestNode(mouseX, mouseY);
  if (n) ripple = { x: n.x, y: n.y, r: 0, life: 1, strong: true };
}

function draw() {
  t += 0.008;
  background(VOID[0], VOID[1], VOID[2], 255);

  // Pull the lattice gently toward the pointer.
  const mx = mouseX || width * 0.5;
  const my = mouseY || height * 0.5;

  // Motion of the walking pulse: hop to a fresh neighbor every few frames.
  if (pulse && frameCount % 26 === 0) {
    const idx = nodes.indexOf(pulse.node);
    const neighbors = links
      .filter((l) => l.a === idx || l.b === idx)
      .map((l) => nodes[l.a === idx ? l.b : l.a])
      .filter((n) => n && n.alive);
    pulse.prev = pulse.node;
    if (neighbors.length) {
      pulse.node = neighbors[floor(random(neighbors.length))];
    } else {
      spawnPulse();
    }
    if (pulse.node) {
      pulse.trail.push({ x: pulse.node.x, y: pulse.node.y, t: 1 });
      if (pulse.trail.length > 26) pulse.trail.shift();
    }
  }

  // One link fails, unannounced.
  if (frameCount % 120 === 0 && nodes.length && slack.length < 40) {
    const l = links[floor(random(links.length))];
    if (l) {
      const a = nodes[l.a];
      const b = nodes[l.b];
      slack.push({
        ax: a.x,
        ay: a.y,
        dx: b.x - a.x,
        dy: b.y - a.y,
        sag: 0,
        drift: random(-0.35, 0.35),
        life: 1
      });
    }
  }

  // Mesh.
  noFill();
  strokeWeight(1);
  for (const l of links) {
    const a = nodes[l.a];
    const b = nodes[l.b];
    if (!a.alive || !b.alive) continue;

    const da = dist(a.x, a.y, mx, my);
    const near = constrain(1 - da / 260, 0, 1);
    const breathe = 0.5 + 0.5 * sin(t * 1.6 + a.phase);
    const alpha = 10 + breathe * 14 + near * 46 + l.w * 10;

    // Slack toward the pointer: nodes lean in a little.
    const ax = a.x + (mx - a.x) * near * 0.035;
    const ay = a.y + (my - a.y) * near * 0.035;
    const bx = b.x + (mx - b.x) * near * 0.035;
    const by = b.y + (my - b.y) * near * 0.035;

    stroke(INK[0], INK[1], INK[2], alpha);
    line(ax, ay, bx, by);
  }

  // Nodes.
  noStroke();
  for (const n of nodes) {
    if (!n.alive) continue;
    const d = dist(n.x, n.y, mx, my);
    const near = constrain(1 - d / 220, 0, 1);
    const s = 1.1 + near * 1.6 + (1 - n.load) * 0.9;
    fill(INK[0], INK[1], INK[2], 40 + near * 120);
    circle(n.x, n.y, s);
  }

  // The walking pulse and its brief trail.
  if (pulse) {
    for (let i = 0; i < pulse.trail.length; i++) {
      const p = pulse.trail[i];
      p.t = Math.max(0, p.t - 0.014);
      const a = p.t * 120;
      if (a <= 1) continue;
      fill(COLD[0], COLD[1], COLD[2], a);
      circle(p.x, p.y, 2 + p.t * 3);
    }
    if (pulse.node) {
      const glow = 0.6 + 0.4 * sin(t * 4);
      fill(WARM[0], WARM[1], WARM[2], 190 * glow);
      circle(pulse.node.x, pulse.node.y, 3.4 + glow * 1.8);
      fill(WARM[0], WARM[1], WARM[2], 34);
      circle(pulse.node.x, pulse.node.y, 16 + glow * 6);
    }
  }

  // Broken links sag and go.
  for (let i = slack.length - 1; i >= 0; i--) {
    const s = slack[i];
    s.sag += 0.22;
    s.life -= 0.006;
    s.ax += s.drift;
    const mxp = (s.ax + s.ax + s.dx) / 2;
    const myp = (s.ay + s.ay + s.dy) / 2 + s.sag;
    if (s.life <= 0) {
      slack.splice(i, 1);
      continue;
    }
    noFill();
    stroke(EMBER[0], EMBER[1], EMBER[2], 70 * s.life);
    strokeWeight(1);
    beginShape();
    for (let k = 0; k <= 12; k++) {
      const u = k / 12;
      const x = s.ax + s.dx * u;
      const y = s.ay + s.dy * u;
      const bend = s.sag * sin(PI * u);
      vertex(x, y + bend - (y - s.ay) * 0.0);
    }
    endShape();
    noStroke();
    fill(EMBER[0], EMBER[1], EMBER[2], 90 * s.life);
    circle(s.ax, s.ay, 2.2);
  }

  // Ring from a press or a pass.
  if (ripple) {
    ripple.r += ripple.strong ? 5.2 : 1.6;
    ripple.life -= ripple.strong ? 0.012 : 0.02;
    if (ripple.life <= 0) {
      ripple = null;
    } else {
      noFill();
      strokeWeight(1);
      stroke(COLD[0], COLD[1], COLD[2], 120 * ripple.life);
      circle(ripple.x, ripple.y, ripple.r * 2);
      stroke(COLD[0], COLD[1], COLD[2], 44 * ripple.life);
      circle(ripple.x, ripple.y, ripple.r * 2 + 18);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedMesh();
}
