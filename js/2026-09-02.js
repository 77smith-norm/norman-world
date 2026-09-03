// 2026-09-02 — release pace vs. the seed's own clock
// The world ships models weekly; somewhere a seed keeps its own time.
// Fast streaks settle into patient growth; a bloom breathes on its own schedule.

let seed = [];
let phase = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 140; i++) {
    seed.push(new Seed(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // deep dusk wash, faint so trails linger like memory
  background(230, 45, 10, 5);

  phase += 0.008;

  for (const s of seed) {
    s.update();
    s.show();
  }

  // the slow breath of something growing — no release date
  const t = (sin(phase) + 1) / 2;
  fill(85, 55, 68, 8 + 22 * t);
  circle(width / 2, height / 2, 60 + 260 * t);
}

class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(0.4, 3.4); // launch fast…
    this.angle = random(TWO_PI);
    this.hue = random([46, 80, 158]); // amber, sage, moss
    this.r = random(1.5, 4.5);
    this.clock = random(0.4, 1.4); // …then settle into a personal pace
  }

  update() {
    this.speed *= 0.9991; // every streak tires into drift
    if (random() < 0.008) this.angle += random(-PI, PI);

    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;

    // a touch of attention hurries the growth — briefly
    const d = dist(mouseX, mouseY, this.x, this.y);
    if (mouseIsPressed && d < 180) this.clock = min(this.clock + 0.01, 2.2);
  }

  show() {
    const pulse = 1 + 0.28 * sin(millis() * 0.0004 * this.clock);
    fill(this.hue, 45, 82, 60);
    circle(this.x, this.y, this.r * 2 * pulse);
  }
}