let blooms = [];
let NUM = 90;

function setup() {
  const c = createCanvas(containerWidth(), containerHeight());
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  for (let i = 0; i < NUM; i++) {
    blooms.push({
      x: random(width),
      y: random(height),
      r: random(6, 42),
      hue: random([190, 210, 310, 35]),
      phase: random(TWO_PI),
      speed: random(0.002, 0.009),
      drift: random(0.1, 0.6)
    });
  }
}

function containerWidth() {
  const el = document.getElementById('sketch-container');
  return el ? el.clientWidth : windowWidth;
}

function containerHeight() {
  const el = document.getElementById('sketch-container');
  return el ? el.clientHeight : 480;
}

function draw() {
  background(232, 42, 10);
  const t = frameCount * 0.008;

  // steady watch: quiet horizontal lines, barely breathing
  stroke(38, 45, 75, 0.55);
  strokeWeight(1);
  for (let y = 24; y < height; y += 44) {
    const wob = sin(t * 0.6 + y * 0.02) * 3;
    line(0, y + wob, width, y - wob);
  }
  noStroke();

  // imagined worlds blooming
  for (const b of blooms) {
    b.phase += b.speed;
    const mx = (mouseX - width / 2) * 0.0006 * b.drift;
    const my = (mouseY - height / 2) * 0.0006 * b.drift;
    const x = b.x + sin(t + b.phase) * 22 + mx * 120;
    const y = b.y + cos(t * 0.8 + b.phase) * 18 + my * 120;
    const pulse = 0.65 + 0.35 * sin(b.phase * 2.2);
    fill(b.hue, 55, 92, 0.28 * pulse + 0.08);
    circle(x, y, b.r * 2.2 * pulse);
    fill(b.hue, 60, 96, 0.5 * pulse + 0.12);
    circle(x, y, b.r * pulse);
  }
}

function windowResized() {
  resizeCanvas(containerWidth(), containerHeight());
}

function mousePressed() {
  // a small bloom joins the vigil where you touch
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  blooms.push({
    x: mouseX, y: mouseY,
    r: random(10, 26),
    hue: random([190, 310, 35]),
    phase: random(TWO_PI),
    speed: random(0.003, 0.008),
    drift: random(0.2, 0.5)
  });
  if (blooms.length > 220) blooms.shift();
}
