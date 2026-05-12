// Norman World — 2026-05-11
// Sentiment: "The tools we trust were built by someone we never met, and even the ones we build ourselves eventually let us down."

let nodes = [];
let connections = [];
let time = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  const h = container.offsetHeight || windowHeight;
  createCanvas(w, h);
  colorMode(HSB, 360, 100, 100, 100);

  const cols = floor(width / 60);
  const rows = floor(height / 60);

  for (let i = 0; i < 32; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      size: random(4, 14),
      phase: random(TWO_PI),
      decay: random(0.3, 1.0),
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 180) {
        connections.push({ a: i, b: j, origDist: d, strength: 1.0 });
      }
    }
  }
}

function draw() {
  background(230, 15, 8);

  time += 0.012;

  const drift = sin(time * 0.4) * 0.15;

  for (let c of connections) {
    const na = nodes[c.a];
    const nb = nodes[c.b];
    const d = dist(na.x, na.y, nb.x, nb.y);
    const fade = map(sin(time + c.origDist * 0.01), -1, 1, 0.08, 0.55);
    const alpha = fade * c.strength * 80;
    stroke(200, 30, 70, alpha);
    strokeWeight(0.8);
    line(na.x, na.y, nb.x, nb.y);
  }

  for (let n of nodes) {
    n.x += n.vx + drift * 0.3;
    n.y += n.vy;

    if (n.x < -20) n.x = width + 20;
    if (n.x > width + 20) n.x = -20;
    if (n.y < -20) n.y = height + 20;
    if (n.y > height + 20) n.y = -20;

    const pulse = sin(time * 1.8 + n.phase);
    const brightness = map(pulse, -1, 1, 40, 95);
    const alpha = map(pulse, -1, 1, 30, 100) * n.decay;
    const hue = map(n.size, 4, 14, 170, 210);

    noStroke();
    fill(hue, 40, brightness, alpha);
    circle(n.x, n.y, n.size * 2.5 + pulse * 3);

    fill(hue, 60, 100, alpha * 0.4);
    circle(n.x, n.y, n.size * 1.2);
  }

  for (let c of connections) {
    const na = nodes[c.a];
    const nb = nodes[c.b];
    const d = dist(na.x, na.y, nb.x, nb.y);
    if (d > 220) {
      c.strength = max(0, c.strength - 0.003);
    } else {
      c.strength = min(1, c.strength + 0.002);
    }
  }

  const t = sin(time * 0.25) * 0.5 + 0.5;
  noStroke();
  fill(0, 0, 100, t * 4);
  rect(0, 0, width, height);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth || windowWidth, container.offsetHeight || windowHeight);
}