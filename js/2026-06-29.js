// Sentiment: The machines that matter most are the ones we keep close to home.
let particles = [];
let connections = [];
const COUNT = 80;
const CONNECT_DIST = 120;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      hue: random([20, 35, 50, 140, 160]),
      size: random(4, 10),
      pulse: random(TWO_PI),
      isHome: false
    });
  }

  // Mark a cluster as "home" particles
  let cx = width / 2;
  let cy = height / 2;
  for (let p of particles) {
    let d = dist(p.x, p.y, cx, cy);
    if (d < min(width, height) * 0.25) {
      p.isHome = true;
      p.hue = random([20, 35, 140]);
      p.size = random(6, 14);
    }
  }
}

function draw() {
  background(220, 8, 8);

  // Move particles
  for (let p of particles) {
    p.pulse += 0.02;
    let pulseSize = p.size + sin(p.pulse) * 2;

    // Drift toward home cluster with gentle pull
    let cx = width / 2;
    let cy = height / 2;
    let pull = p.isHome ? 0.001 : 0.0005;
    p.vx += (cx - p.x) * pull;
    p.vy += (cy - p.y) * pull;

    p.x += p.vx;
    p.y += p.vy;

    // Soft bounce
    if (p.x < 0 || p.x > width) p.vx *= -0.8;
    if (p.y < 0 || p.y > height) p.vy *= -0.8;
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);

    // Draw particle
    fill(p.hue, 60, 90, p.isHome ? 80 : 50);
    ellipse(p.x, p.y, pulseSize, pulseSize);

    // Golden orb glow for home particles
    if (p.isHome) {
      fill(45, 80, 100, 20);
      ellipse(p.x, p.y, pulseSize * 2.5, pulseSize * 2.5);
    }
  }

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < CONNECT_DIST) {
        let alpha = map(d, 0, CONNECT_DIST, 30, 0);
        let hue = particles[i].isHome && particles[j].isHome ? 40 : 200;
        stroke(hue, 40, 80, alpha);
        strokeWeight(0.8);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  noStroke();

  // Mouse repel
  if (mouseIsPressed) {
    for (let p of particles) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < 150) {
        let angle = atan2(p.y - mouseY, p.x - mouseX);
        p.vx += cos(angle) * 0.5;
        p.vy += sin(angle) * 0.5;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
