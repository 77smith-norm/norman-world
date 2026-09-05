// Norman World — 2026-09-04
// Sentiment: A truth left in the margin can wait centuries to be proven,
// then rise again like small mirrors after the storm.
// Abstract: notes drift across a dark page as faint dust; the rare few that
// wander into the margin are caught and slowly resolve into small golden
// marks, hold their light for a long while, then scatter again — patient,
// unhurried, never announced. A hand with a lamp stirs what it touches.

let motes = [];
let breath = 0;
let marginX = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  marginX = width * 0.18;
  for (let i = 0; i < 150; i++) {
    motes.push(new Mote());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  marginX = width * 0.18;
}

function draw() {
  // deep indigo ink; trails fade like long memory
  background(250, 55, 8, 7);
  breath += 0.004;

  // the margin seam — a quiet vertical possibility that breathes
  const seam = 12 + 5 * sin(breath);
  fill(45, 60, 92, 3);
  rect(marginX - seam / 2, 0, seam, height);
  fill(45, 80, 96, 7);
  rect(marginX - 0.5, 0, 1, height);

  for (const m of motes) {
    m.update();
    m.show();
  }
}

class Mote {
  constructor() {
    this.reset();
    this.gold = random() < 0.16;   // the rare truths that resolve
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.lane = this.y;
    this.vx = random(0.06, 0.22);  // drift like dust across the page
    this.wob = random(TWO_PI);
    this.r = random(1, 2.6);
    this.hue = random([46, 200, 265]); // amber dust, cool blue, deep violet
    this.life = 0;
    this.holdT = 0;                 // centuries spent holding light
    this.held = false;
  }

  update() {
    this.life += 1;
    this.wob += 0.003;
    const d = dist(mouseX, mouseY, this.x, this.y);
    const near = mouseIsPressed && d < 150;

    if (near) {
      // a hand with a lamp stirs the dark page
      this.x += (this.x - mouseX) * 0.002 + this.vx;
      this.wob += 0.06;
    } else {
      this.x += this.vx;
    }

    // a golden note near the margin may be caught and slowly resolved
    if (!this.held && this.gold && this.x < marginX + 14 && this.x > marginX - 4 && random() < 0.02) {
      this.held = true;
      this.holdT = random(400, 900);
      this.vx = 0;
    }

    if (this.held) {
      this.holdT -= 1;
      this.wob += 0.02;
      if (this.holdT <= 0) {
        // …and rises again, its light given
        this.held = false;
        this.vx = random(0.2, 0.5);
        this.gold = false;
        this.hue = 46;
      }
    }

    this.y = this.lane + sin(this.wob) * (this.held ? 3 : 16);

    if (this.x > width + 14 || (this.life > 1200 && !this.held)) {
      this.reset();
      this.gold = random() < 0.16;
    }
  }

  show() {
    if (this.gold) {
      // a resolved truth: a small warm cross in the margin
      const g = this.held ? 1 : 0.35;
      const s = (1.5 + 0.6 * sin(this.wob * 3)) * g;
      fill(46, 85, 98, 92);
      rect(this.x - s * 3, this.y, s * 6, 1.4);
      rect(this.x, this.y - s * 3, 1.4, s * 6);
      fill(46, 80, 96, 16);
      circle(this.x, this.y, s * 22);
    } else {
      const pulse = 0.7 + 0.4 * sin(this.wob * 2);
      fill(this.hue, 40, this.held ? 85 : 55, this.held ? 60 : 26);
      circle(this.x, this.y, this.r * 2 * pulse);
    }
  }
}
