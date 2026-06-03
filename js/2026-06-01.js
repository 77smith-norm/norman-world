// 2026-06-01 - frontiers, anchors, and the ground you hold
let anchors = [];
let drifters = [];
let horizon;
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);

  horizon = height * 0.45 + random(-30, 30);

  for (let i = 0; i < 33; i++) {
    anchors.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.15, height * 0.85),
      r: random(4, 14),
      phase: random(TWO_PI),
      hue: random([205, 215, 34, 48, 156]),
      anchorX: 0,
      anchorY: 0
    });
  }
  for (const a of anchors) {
    a.anchorX = a.x;
    a.anchorY = a.y;
  }

  for (let i = 0; i < 120; i++) {
    drifters.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 4),
      speed: random(0.3, 1.1),
      phase: random(TWO_PI),
      hue: random([200, 215, 230])
    });
  }
}

function draw() {
  background(215, 12, 8, 12);
  t += 0.005;

  // horizon line - subtle wave
  noFill();
  stroke(45, 18, 88, 12);
  strokeWeight(1.2);
  beginShape();
  for (let x = -10; x <= width + 10; x += 14) {
    const wave = sin(x * 0.008 + t * 0.6) * 12 + sin(x * 0.02 + t * 1.1) * 5;
    curveVertex(x, horizon + wave);
  }
  endShape();

  // anchored nodes - holding position with gentle resistance
  noStroke();
  for (const a of anchors) {
    const driftX = sin(t * 0.5 + a.phase) * 2.5;
    const driftY = cos(t * 0.4 + a.phase * 1.3) * 2.5;
    // spring back toward anchor
    const pullX = (a.anchorX - a.x) * 0.008;
    const pullY = (a.anchorY - a.y) * 0.008;
    a.x += driftX + pullX;
    a.y += driftY + pullY;

    // subtle glow ring
    const pulse = a.r * (1 + 0.25 * sin(t * 2 + a.phase));
    fill(a.hue, 32, 92, 8);
    circle(a.x, a.y, pulse * 4);
    fill(a.hue, 42, 88, 55);
    circle(a.x, a.y, pulse * 1.8);
    fill(a.hue + 10, 18, 98, 70);
    circle(a.x, a.y, pulse * 0.7);
  }

  // connections between nearby anchors - territory lines
  for (let i = 0; i < anchors.length; i++) {
    for (let j = i + 1; j < anchors.length; j++) {
      const a = anchors[i];
      const b = anchors[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 140 && d > 20) {
        stroke(210, 20, 88, map(d, 0, 140, 18, 0));
        strokeWeight(0.6);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // drifters - flowing across the canvas
  for (const d of drifters) {
    d.x += d.speed * 0.5 + sin(t + d.phase) * 0.15;
    d.y += cos(t * 0.7 + d.phase) * 0.12;

    // some interaction with anchors - repelled nearby
    let repelled = false;
    for (const a of anchors) {
      const distToA = dist(d.x, d.y, a.x, a.y);
      if (distToA < 60) {
        const angle = atan2(d.y - a.y, d.x - a.x);
        d.x += cos(angle) * 1.2;
        d.y += sin(angle) * 1.2;
        repelled = true;
      }
    }

    // mouse influence
    if (mouseX > 0 && mouseY > 0 && !repelled) {
      const dm = dist(mouseX, mouseY, d.x, d.y);
      if (dm < 100) {
        const angle = atan2(mouseY - d.y, mouseX - d.x);
        d.x += cos(angle) * 0.3;
        d.y += sin(angle) * 0.3;
      }
    }

    if (d.x > width + 20) d.x = -20;
    if (d.x < -20) d.x = width + 20;
    if (d.y < -20) d.y = height + 20;
    if (d.y > height + 20) d.y = -20;

    fill(d.hue, 24, 80, 35);
    circle(d.x, d.y, d.r * 2);
  }

  // boundary markers - small vertical strokes along the horizon
  stroke(48, 35, 92, 14);
  strokeWeight(1);
  for (let x = 30; x < width - 20; x += random(45, 80)) {
    const sway = sin(t + x * 0.01) * 3;
    line(x, horizon - 15 + sway, x, horizon + 10 + sway);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
