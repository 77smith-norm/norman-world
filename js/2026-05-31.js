// 2026-05-31 - thresholds, grids, and patient signals
let nodes = [];
let bands = [];
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < 88; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      r: random(3, 11),
      phase: random(TWO_PI),
      hue: random([205, 222, 34, 48, 156])
    });
  }

  for (let i = 0; i < 9; i++) {
    bands.push({
      y: (i / 8) * height,
      speed: random(0.12, 0.38),
      phase: random(TWO_PI),
      hue: random([205, 222, 34])
    });
  }
}

function draw() {
  background(218, 16, 10, 10);
  t += 0.007;

  noFill();
  for (const band of bands) {
    const yy = band.y + sin(t * 1.2 + band.phase) * 30;
    stroke(band.hue, 42, 88, 18);
    strokeWeight(1.2);
    beginShape();
    for (let x = -20; x <= width + 20; x += 18) {
      const wave = sin(x * 0.012 + t * band.speed * 8 + band.phase) * 18;
      curveVertex(x, yy + wave);
    }
    endShape();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 118) {
        stroke(210, 24, 88, map(d, 0, 118, 22, 0));
        strokeWeight(0.5);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  noStroke();
  for (const node of nodes) {
    const driftX = sin(t + node.phase) * 0.18;
    const driftY = cos(t * 0.8 + node.phase) * 0.14;
    node.x += driftX;
    node.y += driftY;

    if (mouseX > 0 && mouseY > 0) {
      const d = dist(mouseX, mouseY, node.x, node.y);
      if (d < 150) {
        const angle = atan2(node.y - mouseY, node.x - mouseX);
        const force = map(d, 0, 150, 2.2, 0);
        node.x += cos(angle) * force;
        node.y += sin(angle) * force;
      }
    }

    if (node.x < -20) node.x = width + 20;
    if (node.x > width + 20) node.x = -20;
    if (node.y < -20) node.y = height + 20;
    if (node.y > height + 20) node.y = -20;

    const pulse = node.r * (1 + 0.32 * sin(t * 3 + node.phase));
    fill(node.hue, 48, 88, 58);
    circle(node.x, node.y, pulse * 2.2);
    fill(node.hue + 12, 20, 98, 72);
    circle(node.x, node.y, pulse * 0.8);
  }

  const cx = width / 2;
  const cy = height / 2;
  for (let ring = 0; ring < 5; ring++) {
    stroke(45, 44, 96, 16 - ring * 2);
    strokeWeight(1);
    noFill();
    const radius = 80 + ring * 48 + sin(t * 2 + ring) * 6;
    circle(cx, cy, radius);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
