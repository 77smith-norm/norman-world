// Norman World Daily — 2026-08-15
// Sentiment: "Systems built to think alongside us reveal as much about the builders as the built."
// Theme: multi-agent coordination, async patience, emergent systems

let agents = [];
const MAX_AGENTS = 60;
let bgHue = 230;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < MAX_AGENTS; i++) {
    agents.push(new Agent(random(width), random(height)));
  }
}

function draw() {
  // Deep indigo fade — layered for depth
  fill(bgHue, 18, 6, 28);
  rect(0, 0, width, height);
  bgHue = (bgHue + 0.04) % 360;

  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];

    // Sense proximity to neighbors — emergent clustering
    let nx = 0, ny = 0, neighbors = 0;
    for (let j = 0; j < agents.length; j++) {
      if (i === j) continue;
      const b = agents[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 120) {
        nx += b.vx;
        ny += b.vy;
        neighbors++;
      }
    }

    if (neighbors > 0) {
      a.vx += (nx / neighbors - a.vx) * 0.018;
      a.vy += (ny / neighbors - a.vy) * 0.018;
    }

    // Gentle attractor toward center when sparse
    const cx = width / 2, cy = height / 2;
    const dc = dist(a.x, a.y, cx, cy);
    if (dc > 200) {
      a.vx += (cx - a.x) * 0.0004;
      a.vy += (cy - a.y) * 0.0004;
    }

    // Async rhythm: each agent has its own phase
    a.phase += a.phaseSpeed;

    a.vx *= 0.96;
    a.vy *= 0.96;
    a.x += a.vx;
    a.y += a.vy;

    // Bounce off edges with damping
    if (a.x < 0) { a.x = 0; a.vx *= -0.6; }
    if (a.x > width) { a.x = width; a.vx *= -0.6; }
    if (a.y < 0) { a.y = 0; a.vy *= -0.6; }
    if (a.y > height) { a.y = height; a.vy *= -0.6; }

    // Soft pulse — breathing rhythm
    const pulse = sin(a.phase) * 0.5 + 0.5;
    const alpha = 30 + pulse * 55;
    const sz = 3 + pulse * 3.5;

    fill(212, 55, 92, alpha);
    circle(a.x, a.y, sz);

    // Subtle thread to nearest neighbor
    if (frameCount % 4 === 0) {
      let nearest = null, nd = Infinity;
      for (let j = i + 1; j < agents.length; j++) {
        const d = dist(a.x, a.y, agents[j].x, agents[j].y);
        if (d < nd) { nd = d; nearest = agents[j]; }
      }
      if (nearest && nd < 80) {
        stroke(212, 30, 80, 12);
        strokeWeight(0.5);
        line(a.x, a.y, nearest.x, nearest.y);
        noStroke();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.phase = random(TWO_PI);
    this.phaseSpeed = random(0.012, 0.032);
  }
}
