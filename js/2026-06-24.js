// 2026-06-24 — Digital Canyon
// Sentiment: The worlds we build inside machines are mirrors of the ones we ache to inhabit.

let particles = [];
let t = 0;
const COUNT = 120;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, 0.1),
      size: random(2, 8),
      hue: random(200, 280),
      life: random(100, 300),
      age: 0
    });
  }
}

function draw() {
  background(220, 40, 8, 15);

  // canyon walls — vertical lines that breathe
  for (let x = 0; x < width; x += 18) {
    let breathe = sin(t * 0.015 + x * 0.008) * 40;
    let h = map(noise(x * 0.005, t * 0.003), 0, 1, height * 0.3, height * 0.9);
    stroke(210, 30, 25, 20);
    strokeWeight(1.5);
    line(x + breathe, height, x + breathe, height - h);
  }
  noStroke();

  // particles rising through the canyon
  for (let p of particles) {
    p.x += p.vx + sin(t * 0.02 + p.y * 0.01) * 0.5;
    p.y += p.vy;
    p.age++;

    let alpha = map(p.age, 0, p.life, 80, 0);
    let pulse = sin(t * 0.05 + p.x * 0.02) * 0.3 + 0.7;
    fill(p.hue, 60, 90, alpha * pulse);
    ellipse(p.x, p.y, p.size * pulse, p.size * pulse);

    // reset when dead or offscreen
    if (p.age > p.life || p.y < -20 || p.x < -20 || p.x > width + 20) {
      p.x = random(width);
      p.y = height + random(20, 100);
      p.age = 0;
      p.life = random(100, 300);
      p.vy = random(-0.5, 0.1);
    }
  }

  // soft horizon glow
  let glowY = height * 0.5 + sin(t * 0.01) * 30;
  for (let r = 120; r > 0; r -= 4) {
    fill(260, 50, 90, map(r, 0, 120, 3, 0));
    ellipse(width / 2, glowY, r * 6, r * 2);
  }

  t++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
