// 2026-06-02 — boundaries hold, boundaries break
let nodes = [];
let trails = [];
let fade;
let time = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);
  fade = 0;

  const count = min(floor(width * height / 2200), 160);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      r: random(1.8, 5),
      hue: random() < 0.4 ? random(30, 55) : random(195, 245),
      phase: random(TWO_PI),
      lifespan: random(120, 400),
      age: 0
    });
  }
}

function draw() {
  background(220, 8, 7, 18);
  time += 0.004;

  // pulse wave across the field
  const pulseX = width * 0.5 + sin(time * 0.3) * width * 0.35;
  const pulseY = height * 0.5 + cos(time * 0.2) * height * 0.25;
  const pulseRadius = 80 + 40 * sin(time * 0.5);

  // draw boundary rings
  noFill();
  for (let i = 0; i < 4; i++) {
    const r = pulseRadius + i * 35 + 15 * sin(time * 0.7 + i * 1.2);
    const alpha = map(i, 0, 3, 6, 1);
    stroke(210, 25, 90, alpha);
    strokeWeight(0.5 + i * 0.2);
    ellipse(pulseX, pulseY, r * 2, r * 2);
  }

  // update and draw nodes
  noStroke();
  for (const n of nodes) {
    n.age++;
    // drift
    n.x += n.vx;
    n.y += n.vy;

    // slight pulse attraction/repulsion
    const dx = n.x - pulseX;
    const dy = n.y - pulseY;
    const d = sqrt(dx * dx + dy * dy);
    if (d < pulseRadius + 60 && d > 0) {
      const force = map(d, 0, pulseRadius + 60, 0.6, -0.3);
      n.x += (dx / d) * force;
      n.y += (dy / d) * force;
    }

    // wrap edges softly
    if (n.x < -20) n.x = width + 20;
    if (n.x > width + 20) n.x = -20;
    if (n.y < -20) n.y = height + 20;
    if (n.y > height + 20) n.y = -20;

    // draw node
    const glow = 1 + 0.3 * sin(time * 2 + n.phase);
    fill(n.hue, 35, 92, 20);
    circle(n.x, n.y, n.r * 5 * glow);
    fill(n.hue, 50, 95, 50);
    circle(n.x, n.y, n.r * 2.2 * glow);
    fill(n.hue + 10, 15, 100, 75);
    circle(n.x, n.y, n.r * 0.8);

    // connect nearby nodes — boundary lines that form and dissolve
    for (const other of nodes) {
      if (other === n) continue;
      const dx2 = n.x - other.x;
      const dy2 = n.y - other.y;
      const d2 = sqrt(dx2 * dx2 + dy2 * dy2);
      if (d2 < 100 && d2 > 5) {
        const a = map(d2, 5, 100, 12, 0);
        const hueMix = (n.hue + other.hue) / 2;
        stroke(hueMix, 20, 85, a);
        strokeWeight(0.4 + 0.3 * sin(time + n.phase));
        line(n.x, n.y, other.x, other.y);
      }
    }

    // replace aged-out nodes with new ones
    if (n.age > n.lifespan) {
      n.x = random(width);
      n.y = random(height);
      n.vx = random(-0.4, 0.4);
      n.vy = random(-0.4, 0.4);
      n.hue = random() < 0.4 ? random(30, 55) : random(195, 245);
      n.phase = random(TWO_PI);
      n.age = 0;
      n.lifespan = random(120, 400);
    }
  }

  // subtle mouse interaction — a small gravity well
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    noFill();
    stroke(50, 40, 95, 8);
    strokeWeight(0.8);
    ellipse(mouseX, mouseY, 80, 80);
    for (const n of nodes) {
      const dm = dist(n.x, n.y, mouseX, mouseY);
      if (dm < 40 && dm > 1) {
        const angle = atan2(mouseY - n.y, mouseX - n.x);
        n.x += cos(angle) * 0.8;
        n.y += sin(angle) * 0.8;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
