// Norman World — 2026-07-04
// Theme: The tools we build quietly begin building themselves.
// Canvas parent: sketch-container

let particles = [];
let numParticles = 80;
let palette = [];
let t = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  palette = [
    color(210, 60, 25),   // deep indigo
    color(30, 80, 95),    // warm amber
    color(350, 50, 85),   // soft rose
    color(170, 40, 60),   // muted teal
    color(45, 70, 100),   // golden
  ];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(3, 10),
      col: palette[floor(random(palette.length))],
      life: random(100, 300),
      maxLife: 300,
      drift: random(0.002, 0.008),
      phase: random(TWO_PI),
    });
  }
}

function draw() {
  // Slow breathing background gradient
  let bgHue = map(sin(t * 0.003), -1, 1, 215, 235);
  background(bgHue, 50, 12);
  t++;

  // Subtle radial glow from center
  let glowAlpha = map(sin(t * 0.005), -1, 1, 3, 10);
  for (let r = 300; r > 0; r -= 20) {
    fill(30, 60, 80, glowAlpha * (1 - r / 300));
    ellipse(width / 2, height * 0.6, r * 3, r * 2);
  }

  for (let p of particles) {
    // Organic drift using noise
    let angle = noise(p.x * p.drift, p.y * p.drift, t * 0.002) * TWO_PI * 2;
    p.vx += cos(angle) * 0.02;
    p.vy += sin(angle) * 0.02 - 0.005; // gentle upward pull

    p.vx *= 0.98;
    p.vy *= 0.98;

    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    // Fade in and out
    let lifeRatio = p.life / p.maxLife;
    let alpha = lifeRatio < 0.2 ? lifeRatio * 5 : (lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1);
    alpha *= 70;

    // Occasional clustering — particles drawn toward neighbors
    let cx = 0, cy = 0, count = 0;
    for (let other of particles) {
      let d = dist(p.x, p.y, other.x, other.y);
      if (d > 0 && d < 60) {
        cx += other.x;
        cy += other.y;
        count++;
      }
    }
    if (count > 3) {
      cx /= count;
      cy /= count;
      p.vx += (cx - p.x) * 0.0003;
      p.vy += (cy - p.y) * 0.0003;
    }

    // Draw with soft edge
    let c = p.col;
    fill(hue(c), saturation(c), brightness(c), alpha);
    ellipse(p.x, p.y, p.size + sin(t * 0.03 + p.phase) * 1.5);

    // Respawn
    if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > width + 20) {
      p.x = random(width);
      p.y = height + random(20, 80);
      p.vx = random(-0.3, 0.3);
      p.vy = random(-0.8, -0.2);
      p.life = random(150, 350);
      p.maxLife = p.life;
      p.col = palette[floor(random(palette.length))];
    }
  }

  // Occasional bright flare — a new tool being born
  if (random() < 0.008) {
    let fx = random(width * 0.2, width * 0.8);
    let fy = random(height * 0.3, height * 0.7);
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: fx + random(-20, 20),
        y: fy + random(-20, 20),
        vx: random(-1.5, 1.5),
        vy: random(-2, -0.5),
        size: random(5, 14),
        col: palette[4], // golden
        life: random(40, 80),
        maxLife: 80,
        drift: random(0.003, 0.01),
        phase: random(TWO_PI),
      });
    }
  }

  // Cap particle count
  while (particles.length > 200) {
    particles.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
