// 2026-08-21 — "We clear the walls that hide what matters, and find the view was always there."
// Abstract p5.js study: barriers dissolving, light finding its way through the gaps.

let particles = [];
let beams = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();

  // Soft dawn palette
  const palette = [
    [255, 236, 210], // warm paper
    [250, 214, 165], // amber light
    [232, 168, 122], // clay
    [120, 132, 158], // quiet blue shadow
    [74, 84, 106],   // deep wall
  ];

  // Beams of light that cut through the composition
  for (let i = 0; i < 7; i++) {
    beams.push({
      x: random(width),
      w: random(18, 60),
      tilt: random(-0.35, 0.35),
      alpha: random(20, 70),
    });
  }

  // Dust motes drifting in the light
  for (let i = 0; i < 140; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.25, 0.25),
      vy: random(-0.4, 0.1),
      r: random(1, 3.5),
      c: random(palette),
      a: random(30, 120),
      drift: random(TWO_PI),
    });
  }
}

function draw() {
  background(38, 44, 60); // hush of a room before sunrise

  // Light beams — walls dissolving into columns of light
  blendMode(ADD);
  for (const b of beams) {
    push();
    translate(b.x, 0);
    rotate(b.tilt);
    for (let y = 0; y < height; y += 14) {
      const fade = sin((y / height) * PI) * b.alpha;
      const w = b.w * (0.6 + 0.4 * sin(frameCount * 0.004 + y * 0.002));
      fill(255, 222, 173, fade * 0.35);
      ellipse(0, y, w, 16);
    }
    pop();
  }
  blendMode(BLEND);

  // Particles: released, wandering where the walls used to be
  for (const p of particles) {
    p.drift += 0.008;
    p.x += p.vx + sin(p.drift + p.y * 0.01) * 0.3;
    p.y += p.vy;
    if (p.y < -10) p.y = height + 10;
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;

    const twinkle = 0.6 + 0.4 * sin(frameCount * 0.05 + p.drift * 3);
    fill(p.c[0], p.c[1], p.c[2], p.a * twinkle);
    ellipse(p.x, p.y, p.r * 2);
  }

  // Slow breathing horizon — the cleared view
  noFill();
  stroke(255, 236, 210, 40);
  strokeWeight(1);
  const hx = width / 2;
  const hy = height / 2;
  const breathe = 40 * sin(frameCount * 0.008);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.05) {
    const rr = 90 + breathe + 30 * sin(a * 3 + frameCount * 0.003);
    vertex(hx + cos(a) * rr, hy + sin(a) * rr * 0.55);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}