// Norman World — March 17, 2026
// "In the shadow of enterprise AI forges, a tinkerer wires a CPU by hand.
//  The spark of creation knows no scale."
//
// A hand-wired circuit: traces light up one by one as Norm solders them.
// The monolithic "forge" looms dark in the background, but the small spark
// on the breadboard glows brightest.

let nodes = [];
let edges = [];
let sparks = [];
let solderProgress = 0;
let currentEdge = 0;
let forge;
let normBlob;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(Math.floor(w * 0.6), 380);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');

  forge = { x: width * 0.72, y: height * 0.5, w: width * 0.22, h: height * 0.7 };
  normBlob = { x: width * 0.18, y: height * 0.62 };

  // Breadboard nodes — a simple CPU-like layout
  const cx = width * 0.38;
  const cy = height * 0.48;
  const positions = [
    [cx - 80, cy - 60], [cx,      cy - 80], [cx + 80, cy - 60],
    [cx + 100, cy],      [cx + 80, cy + 60], [cx,      cy + 80],
    [cx - 80, cy + 60],  [cx - 100, cy],
    [cx, cy],  // center — the CPU
  ];

  for (let i = 0; i < positions.length; i++) {
    nodes.push({ x: positions[i][0], y: positions[i][1], lit: false, r: i === 8 ? 10 : 5 });
  }

  // Edges — wiring the circuit outward from center
  const center = 8;
  for (let i = 0; i < 8; i++) {
    edges.push({ a: center, b: i, progress: 0, lit: false });
  }
  // A few cross-connections
  edges.push({ a: 0, b: 1, progress: 0, lit: false });
  edges.push({ a: 2, b: 3, progress: 0, lit: false });
  edges.push({ a: 4, b: 5, progress: 0, lit: false });
  edges.push({ a: 6, b: 7, progress: 0, lit: false });
}

function draw() {
  background(12, 10, 18);

  drawForge();
  drawBreadboard();
  animateWiring();
  drawSparks();
  drawNorm();
}

function drawForge() {
  // Dark monolithic tower in the background
  noStroke();
  fill(28, 24, 40);
  rect(forge.x - forge.w / 2, forge.y - forge.h / 2, forge.w, forge.h, 4);

  // Its blinking lights — cold, uniform
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 3; col++) {
      const bx = forge.x - 22 + col * 18;
      const by = forge.y - 80 + row * 26;
      const on = (frameCount + row * 7 + col * 13) % 60 < 20;
      fill(on ? color(60, 100, 180, 180) : color(30, 30, 50));
      ellipse(bx, by, 5, 5);
    }
  }

  // Label
  fill(60, 55, 90);
  noStroke();
  textSize(9);
  textAlign(CENTER);
  text('ENTERPRISE FORGE', forge.x, forge.y + forge.h / 2 - 8);
}

function drawBreadboard() {
  // Board surface
  noStroke();
  fill(20, 35, 22);
  const bx = width * 0.38;
  const by = height * 0.48;
  rect(bx - 130, by - 110, 260, 190, 6);

  // Grid holes
  stroke(30, 55, 32);
  strokeWeight(1);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 12; c++) {
      point(bx - 110 + c * 20, by - 90 + r * 22);
    }
  }

  // Draw edges
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    const a = nodes[e.a];
    const b = nodes[e.b];
    if (e.lit) {
      const glow = 0.6 + 0.4 * sin(frameCount * 0.08 + i);
      stroke(80, 220, 120, 200 * glow);
      strokeWeight(2);
    } else if (e.progress > 0) {
      stroke(80, 220, 120, 100);
      strokeWeight(1.5);
    } else {
      continue;
    }
    const tx = lerp(a.x, b.x, e.progress);
    const ty = lerp(a.y, b.y, e.progress);
    line(a.x, a.y, tx, ty);
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.lit) {
      const glow = 0.7 + 0.3 * sin(frameCount * 0.1 + i * 0.5);
      fill(100, 255, 140, 230 * glow);
      noStroke();
    } else {
      fill(40, 70, 45);
      noStroke();
    }
    ellipse(n.x, n.y, n.r * 2, n.r * 2);
  }
}

function animateWiring() {
  if (currentEdge >= edges.length) return;

  const e = edges[currentEdge];
  e.progress = min(1, e.progress + 0.018);

  if (e.progress >= 1) {
    e.lit = true;
    nodes[e.a].lit = true;
    nodes[e.b].lit = true;
    // Spawn a spark
    const a = nodes[e.a];
    const b = nodes[e.b];
    sparks.push({ x: b.x, y: b.y, life: 40, vx: random(-2, 2), vy: random(-3, 0) });
    currentEdge++;
  }
}

function drawSparks() {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    const alpha = map(s.life, 0, 40, 0, 255);
    noStroke();
    fill(255, 230, 80, alpha);
    ellipse(s.x, s.y, 3, 3);
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.12;
    s.life--;
    if (s.life <= 0) sparks.splice(i, 1);
  }
}

function drawNorm() {
  // Norm — small white blob, watching and soldering
  const nx = normBlob.x;
  const ny = normBlob.y;

  // Arm reaching toward circuit
  stroke(220, 220, 220, 180);
  strokeWeight(2);
  noFill();
  const armTargetX = width * 0.28;
  const armTargetY = height * 0.52;
  bezier(nx + 14, ny - 4, nx + 30, ny - 10, armTargetX - 10, armTargetY + 10, armTargetX, armTargetY);

  // Blob body
  noStroke();
  fill(240, 240, 245);
  ellipse(nx, ny, 36, 32);

  // Eyes
  fill(20, 15, 30);
  ellipse(nx - 7, ny - 4, 9, 10);
  ellipse(nx + 7, ny - 4, 9, 10);
  // Sparkle
  fill(255);
  ellipse(nx - 5, ny - 6, 3, 3);
  ellipse(nx + 9, ny - 6, 3, 3);

  // Antenna
  stroke(200, 200, 210);
  strokeWeight(1.5);
  line(nx, ny - 16, nx + 4, ny - 28);
  noStroke();
  const aGlow = 0.5 + 0.5 * sin(frameCount * 0.15);
  fill(lerpColor(color(180, 220, 255), color(80, 220, 140), aGlow));
  ellipse(nx + 4, ny - 30, 5, 5);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth || 600, Math.min(Math.floor((container.offsetWidth || 600) * 0.6), 380));
}
