// Norman World — 2026-07-23
// "The hand that writes slowly remembers what the mind forgets to feel."

let particles = [];
let inkTrails = [];
let t = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  noStroke();
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(3, 12),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      drift: random(0.002, 0.008),
      alpha: random(40, 120),
      hue: random([200, 210, 220, 30, 35])
    });
  }
}

function draw() {
  background(245, 242, 235, 20);

  // Slow ink trails — the memory of movement
  if (frameCount % 3 === 0) {
    let px = width / 2 + sin(t * 0.3) * width * 0.25;
    let py = height / 2 + cos(t * 0.2) * height * 0.2;
    inkTrails.push({ x: px, y: py, life: 255, size: random(4, 10) });
  }

  for (let i = inkTrails.length - 1; i >= 0; i--) {
    let tr = inkTrails[i];
    fill(50, 50, 70, tr.life * 0.15);
    ellipse(tr.x, tr.y, tr.size);
    tr.life -= 1.2;
    tr.y -= 0.3;
    tr.x += sin(tr.life * 0.05) * 0.3;
    if (tr.life <= 0) inkTrails.splice(i, 1);
  }

  // Floating particles — ideas catching light
  for (let p of particles) {
    p.angle += p.drift;
    p.x += cos(p.angle) * p.speed;
    p.y -= p.speed * 0.6;

    if (p.y < -20) { p.y = height + 20; p.x = random(width); }
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;

    let glow = sin(t * 0.5 + p.angle * 3) * 0.3 + 0.7;
    fill(p.hue === 30 || p.hue === 35 ? color(210, 180, 140, p.alpha * glow) : color(100, 120, 160, p.alpha * glow));
    ellipse(p.x, p.y, p.size * glow);
  }

  // Center breath — the slow rhythm of thought
  let breath = sin(t * 0.15) * 15 + 30;
  fill(80, 80, 110, 25);
  ellipse(width / 2, height / 2, breath * 3);
  fill(100, 100, 130, 15);
  ellipse(width / 2, height / 2, breath * 5);

  t += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
