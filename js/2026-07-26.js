// 2026-07-26 — Gravity's quiet song
// Inspired by the black hole visualization story and the way vast forces become intimate
let particles = [];
const COUNT = 200;
let cx, cy;
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  cx = width / 2;
  cy = height / 2;
  for (let i = 0; i < COUNT; i++) {
    particles.push(newParticle());
  }
  noStroke();
}

function newParticle() {
  let angle = random(TWO_PI);
  let r = random(50, min(width, height) * 0.45);
  return {
    angle: angle,
    r: r,
    speed: map(r, 50, min(width, height) * 0.45, 0.012, 0.002) * (random() > 0.5 ? 1 : -1),
    size: random(1.5, 4),
    hue: random(180, 260),
    drift: random(-0.3, 0.3),
    alpha: random(80, 200)
  };
}

function draw() {
  background(8, 6, 18, 25);
  t += 0.01;

  // central gravitational glow
  for (let r = 120; r > 0; r -= 4) {
    let a = map(r, 0, 120, 60, 0);
    fill(100, 80, 200, a);
    ellipse(cx, cy, r * 2);
  }

  // draw light-bending arcs
  for (let i = 0; i < 3; i++) {
    let arcR = 80 + i * 50 + sin(t + i) * 10;
    stroke(140, 120, 220, 20 + sin(t * 0.5 + i) * 10);
    strokeWeight(1.5);
    noFill();
    arc(cx, cy, arcR * 2, arcR * 2, t * 0.3 + i, t * 0.3 + i + PI * 0.6);
  }
  noStroke();

  // particles spiraling
  for (let p of particles) {
    p.angle += p.speed;
    p.r += p.drift * sin(t + p.angle * 3) * 0.1;

    // gently pull inward
    p.r -= 0.05;
    if (p.r < 30) {
      // respawn at edge
      p.r = random(100, min(width, height) * 0.45);
      p.angle = random(TWO_PI);
    }

    let x = cx + cos(p.angle) * p.r;
    let y = cy + sin(p.angle) * p.r;

    // color shifts near center
    let nearness = map(p.r, 30, min(width, height) * 0.45, 1, 0);
    let h = lerp(p.hue, 280, nearness * 0.5);
    let s = lerp(60, 90, nearness);
    let b = lerp(150, 255, nearness);

    colorMode(HSB, 360, 100, 100, 255);
    fill(h, s, b, p.alpha);
    ellipse(x, y, p.size + nearness * 2);
    colorMode(RGB, 255);
  }

  // faint distant stars
  for (let i = 0; i < 40; i++) {
    let sx = (noise(i * 100) * width);
    let sy = (noise(i * 100 + 500) * height);
    let twinkle = noise(i * 10 + t * 2) * 150 + 50;
    fill(200, 200, 255, twinkle);
    ellipse(sx, sy, 1.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;
}
