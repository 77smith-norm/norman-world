let particles = [];
let particleCount = 80;
let cycleLength = 360;
let maxSpeed = 0.8;
let cohesionRadius = 120;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(20, 45),
      size: random(4, 9),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 18, 30);

  let t = (frameCount % cycleLength) / cycleLength;
  let formationPull = 0;
  if (t > 0.65 && t < 0.95) {
    formationPull = sin(map(t, 0.65, 0.95, 0, PI));
  }

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    let ax = 0, ay = 0;

    ax += sin(frameCount * 0.013 + p.phase) * 0.15;
    ay += cos(frameCount * 0.017 + p.phase * 1.3) * 0.15;

    let nearest = Infinity;
    let nearX = 0, nearY = 0;
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      let d = dist(p.x, p.y, particles[j].x, particles[j].y);
      if (d < cohesionRadius && d < nearest) {
        nearest = d;
        nearX = particles[j].x;
        nearY = particles[j].y;
      }
    }

    if (formationPull > 0) {
      let gridX = (i % 12) * (width / 13) + width / 26;
      let gridY = floor(i / 12) * (height / 8) + height / 16;
      let dx = gridX - p.x;
      let dy = gridY - p.y;
      ax += dx * 0.008 * formationPull;
      ay += dy * 0.008 * formationPull;
    }

    if (nearest < cohesionRadius) {
      let dx = nearX - p.x;
      let dy = nearY - p.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d > 0) {
        let repel = map(d, 0, cohesionRadius, -0.3, 0);
        ax += (dx / d) * repel;
        ay += (dy / d) * repel;
      }
    }

    p.vx += ax;
    p.vy += ay;

    p.vx *= 0.97;
    p.vy *= 0.97;

    let sp = sqrt(p.vx * p.vx + p.vy * p.vy);
    if (sp > maxSpeed) {
      p.vx = (p.vx / sp) * maxSpeed;
      p.vy = (p.vy / sp) * maxSpeed;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x += width;
    if (p.x > width) p.x -= width;
    if (p.y < 0) p.y += height;
    if (p.y > height) p.y -= height;

    let c = formationPull > 0.1
      ? lerpColor(color(255, 160, 60), color(100, 150, 255), formationPull)
      : color(255, p.hue * 6 + 60, 60);

    let sz = formationPull > 0.1 ? p.size * 0.7 : p.size;

    fill(red(c), green(c), blue(c), 180);
    noStroke();
    ellipse(p.x, p.y, sz, sz);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
