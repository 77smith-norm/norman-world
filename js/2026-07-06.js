// Ghost of Intention — 2026-07-06
let particles = [];
let trails = [];
let t = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 60; i++) {
    particles.push(new Ghost());
  }
}

function draw() {
  background(230, 15, 8, 100);

  // Faint grid lines — like ruled paper fading
  stroke(220, 10, 30, 8);
  strokeWeight(0.5);
  for (let y = 0; y < height; y += 32) {
    line(0, y, width, y);
  }
  noStroke();

  // Ghostly hand-trail that fades
  if (frameCount % 3 === 0) {
    trails.push({
      x: width / 2 + sin(t * 0.7) * width * 0.25 + noise(t) * 40 - 20,
      y: height * 0.45 + cos(t * 0.5) * 30 + noise(t + 99) * 20 - 10,
      life: 100,
      hue: 200 + sin(t * 0.3) * 40
    });
  }

  // Draw and fade trails — the handwritten mark dissolving
  for (let i = trails.length - 1; i >= 0; i--) {
    let tr = trails[i];
    tr.life -= 1.2;
    if (tr.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    fill(tr.hue, 40, 90, tr.life * 0.6);
    ellipse(tr.x, tr.y, map(tr.life, 0, 100, 1, 6), map(tr.life, 0, 100, 1, 6));
  }

  // Rising ghost particles — intention lifting off the page
  for (let p of particles) {
    p.update();
    p.display();
  }

  t += 0.01;
}

class Ghost {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = height + random(20);
    this.baseX = this.x;
    this.vx = 0;
    this.vy = random(-0.3, -1.2);
    this.size = random(2, 8);
    this.hue = random(180, 260);
    this.sat = random(20, 50);
    this.bri = random(70, 100);
    this.alpha = 0;
    this.maxAlpha = random(20, 60);
    this.drift = random(0.002, 0.008);
    this.phase = random(TWO_PI);
    this.life = random(200, 500);
    this.age = 0;
  }

  update() {
    this.age++;
    if (this.age < 60) {
      this.alpha = map(this.age, 0, 60, 0, this.maxAlpha);
    } else if (this.age > this.life - 60) {
      this.alpha = map(this.age, this.life - 60, this.life, this.maxAlpha, 0);
    }
    this.y += this.vy;
    this.x = this.baseX + sin(frameCount * this.drift + this.phase) * 30;
    if (this.y < -20 || this.age > this.life) {
      this.reset();
    }
  }

  display() {
    fill(this.hue, this.sat, this.bri, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
    // Soft glow
    fill(this.hue, this.sat * 0.5, this.bri, this.alpha * 0.3);
    ellipse(this.x, this.y, this.size * 2.5, this.size * 2.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
