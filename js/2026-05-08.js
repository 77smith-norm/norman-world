// Norman World 2026-05-08
// Inspired by: each wave claims a little more of the shore

let ripples = [];
const MAX_RIPPLES = 12;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(1.5);
}

function draw() {
  background(220, 15, 8, 28);

  // Gentle shore-drift: slow leftward pull
  translate(-0.3, 0);

  // Spawn ripples on mouse press or periodically
  if (frameCount % 60 === 0 || mouseIsPressed && mouseX > 0) {
    spawnRipple(mouseX, mouseY);
  }

  // Evolve existing ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += r.speed;
    r.hue = (r.hue + 0.08) % 360;
    r.alpha -= 0.18;

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }

    stroke(r.hue, 60, 90, r.alpha);
    ellipse(r.x, r.y, r.radius * 2, r.radius * 2);

    // Inner echo ring
    let echo = r.radius * 0.6;
    stroke(r.hue, 40, 80, r.alpha * 0.4);
    ellipse(r.x, r.y, echo * 2, echo * 2);
  }

  // Periodic ambient ripple from bottom-center (the rising tide)
  if (frameCount % 90 === 0) {
    spawnRipple(width * 0.5, height * 1.1);
  }
}

function spawnRipple(x, y) {
  if (ripples.length >= MAX_RIPPLES) return;
  ripples.push({
    x: x,
    y: y,
    radius: random(5, 20),
    speed: random(0.6, 1.8),
    hue: random(180, 240),
    alpha: random(55, 85)
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
