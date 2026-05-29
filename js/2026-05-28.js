// gestures that need no translation
let particles = [];
const NUM = 80;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      s: random(2, 6),
      hue: random(35, 55),
      phase: random(TWO_PI),
      trail: []
    });
  }
}

function draw() {
  background(45, 10, 7, 8);

  // Mouse influence
  let mx = mouseX,
    my = mouseY;
  let hasMouse = mx > 0 && mx < width && my > 0 && my < height;

  noFill();
  for (let p of particles) {
    // Gentle oscillation
    p.vx += sin(frameCount * 0.004 + p.phase) * 0.008;
    p.vy += cos(frameCount * 0.004 + p.phase) * 0.008;

    // Mouse attraction
    if (hasMouse) {
      let dx = mx - p.x,
        dy = my - p.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 160 && d > 1) {
        let force = map(d, 0, 160, 0.04, 0);
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    }

    p.vx *= 0.99;
    p.vy *= 0.99;
    p.x += p.vx;
    p.y += p.vy;

    // Wrap
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;

    // Connections to nearby particles
    for (let q of particles) {
      if (p === q) continue;
      let dx = q.x - p.x,
        dy = q.y - p.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 90) {
        let a = map(d, 0, 90, 20, 0);
        stroke(p.hue, 60, 70, a);
        strokeWeight(0.3 + map(d, 0, 90, 0.7, 0));
        line(p.x, p.y, q.x, q.y);
      }
    }

    // Glow
    noStroke();
    fill(p.hue, 60, 75, 5);
    circle(p.x, p.y, p.s * 4);
    fill(p.hue, 70, 80, 50);
    circle(p.x, p.y, p.s);
    fill(50, 40, 90, 80);
    circle(p.x, p.y, p.s * 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
