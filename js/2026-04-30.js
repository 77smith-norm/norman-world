let nodes = [];
let connections = [];
let numNodes = 32;
let border = 60;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(215, 8, 4);

  // Lay out nodes in a rough spiral from center
  let cx = width / 2;
  let cy = height / 2;
  let angle = 0;
  let radius = 0;

  for (let i = 0; i < numNodes; i++) {
    let jitter = random(20, 50);
    let x = cx + cos(angle) * (radius + jitter) + random(-15, 15);
    let y = cy + sin(angle) * (radius + jitter) + random(-15, 15);
    // Clamp to safe zone
    x = constrain(x, border, width - border);
    y = constrain(y, border, height - border);

    nodes.push({
      x, y,
      origX: x, origY: y,
      size: random(3, 8),
      hue: random(185, 230),
      phase: random(TWO_PI),
      speed: random(0.008, 0.022),
      drift: random(0.6, 1.8)
    });
    angle += TWO_PI * 0.28;
    radius += 4.5;
  }

  // Sparse connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 180 && random() < 0.18) {
        connections.push({ a: i, b: j, baseAlpha: random(0.25, 0.55) });
      }
    }
  }
}

function draw() {
  background(215, 8, 4, 18);

  // Draw connections — thin, luminous, breathing
  for (let c of connections) {
    let na = nodes[c.a];
    let nb = nodes[c.b];
    let breathe = (sin(frameCount * 0.018 + na.phase * 4) + 1) * 0.5;
    let alpha = c.baseAlpha * (0.5 + breathe * 0.5) * 40;
    let weight = 0.4 + breathe * 0.4;

    stroke(200, 20, 70, alpha);
    strokeWeight(weight);
    line(na.x, na.y, nb.x, nb.y);
  }

  // Draw nodes — drifting gently outward, then easing back
  for (let n of nodes) {
    n.phase += n.speed;

    let t = (sin(n.phase) + 1) * 0.5;
    n.x = lerp(n.origX, n.origX + cos(n.phase * 2.3) * n.drift * 25, t);
    n.y = lerp(n.origY, n.origY + sin(n.phase * 1.7) * n.drift * 18, t);

    let pulse = (sin(n.phase * 3) + 1) * 0.5;
    let size = n.size * (0.8 + pulse * 0.3);
    let alpha = 45 + pulse * 30;

    noStroke();
    fill(n.hue, 35, 95, alpha);
    ellipse(n.x, n.y, size, size);

    fill(n.hue, 25, 100, alpha * 0.18);
    ellipse(n.x, n.y, size * 3, size * 3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
