// Norman World Daily — March 19, 2026
// Theme: Institutions in flux — particles seeking new orbits

let particles = [];
let centers = [];
let t = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  // Three "institution" centers — not fixed, drifting slowly
  centers = [
    { x: width * 0.2, y: height * 0.5, vx: 0.15, vy: 0.08 },
    { x: width * 0.5, y: height * 0.35, vx: -0.1, vy: 0.12 },
    { x: width * 0.8, y: height * 0.6, vx: 0.08, vy: -0.09 }
  ];

  // Spawn particles — some orbiting, some drifting free
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.8, 0.8),
      vy: random(-0.8, 0.8),
      size: random(2, 5),
      hue: random(180, 280), // blue-violet range
      orbitTarget: random(centers),
      orbiting: random() > 0.4,
      alpha: random(40, 90)
    });
  }
}

function draw() {
  // Trail effect — old positions fade
  background(240, 15, 8, 30);

  // Draw institution centers — soft glowing anchors
  noStroke();
  for (let c of centers) {
    // Drifting motion
    c.x += c.vx;
    c.y += c.vy;
    // Gentle boundary bounce
    if (c.x < width * 0.1 || c.x > width * 0.9) c.vx *= -1;
    if (c.y < height * 0.15 || c.y > height * 0.85) c.vy *= -1;

    // Glow
    for (let r = 40; r > 0; r -= 5) {
      fill(200, 30, 60, map(r, 0, 40, 30, 0));
      ellipse(c.x, c.y, r * 2, r * 2);
    }
    fill(200, 20, 95, 80);
    ellipse(c.x, c.y, 8, 8);
  }

  // Particles
  for (let p of particles) {
    if (p.orbiting) {
      // Gently pull toward orbit target
      let dx = p.orbitTarget.x - p.x;
      let dy = p.orbitTarget.y - p.y;
      p.vx += dx * 0.0008;
      p.vy += dy * 0.0008;
      p.vx *= 0.97;
      p.vy *= 0.97;
    } else {
      // Free drift — slight wander
      p.vx += random(-0.05, 0.05);
      p.vy += random(-0.05, 0.05);
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Randomly decide to orbit
      if (random() < 0.002) {
        p.orbitTarget = random(centers);
        p.orbiting = true;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Soft wrap
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Draw particle
    noStroke();
    fill(p.hue, 30, 95, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
  }

  t += 0.005;

  // Subtle title
  if (frameCount < 180) {
    fill(200, 10, 70, map(frameCount, 0, 180, 60, 0));
    textSize(11);
    textAlign(CENTER);
    textFont('Georgia');
    text('institutions seeking new orbits', width / 2, height - 20);
  }
}
