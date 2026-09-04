// Norman World — 2026-09-03
// Sentiment: A river returns to itself one slow dam at a time;
// whole small worlds end quietly — both go unannounced.
// Abstract: creek-light drops drift downstream; some get caught in a
// patient eddy, circle for a long while, then slip free. The water
// restores itself and never once announces it.

let drops = [];
let breath = 0;
let damY = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  damY = height * 0.45;
  for (let i = 0; i < 160; i++) {
    drops.push(new Drop());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // pre-dawn creek wash; faint trails linger like the memory of water
  background(220, 38, 9, 6);

  breath += 0.005;

  // the dam line breathes — a slow, unannounced movement
  damY = height * (0.45 + 0.06 * sin(breath));
  const t = (sin(breath) + 1) / 2;

  for (const d of drops) {
    d.update();
    d.show();
  }

  // a still seam of light where the pool holds
  fill(46, 60, 78, 4 + 6 * t);
  rect(0, damY - 1, width, 2);
}

class Drop {
  constructor() {
    this.lane = random(height * 0.06, height * 0.94);
    this.x = random(width);
    this.y = this.lane;
    this.speed = random(0.4, 1.6);      // the current's own pace
    this.wob = random(TWO_PI);
    this.hue = random([46, 158, 205]);  // silt-amber, sage, cold water
    this.r = random(1.2, 3.4);
    this.held = false;                   // caught in a patient eddy?
    this.holdT = 0;
  }

  update() {
    const d = dist(mouseX, mouseY, this.x, this.y);

    // a hand in the creek stirs the water; then it settles again
    if (mouseIsPressed && d < 160) {
      this.speed = min(this.speed + 0.05, 3);
      this.wob += random(-0.25, 0.25);
    } else {
      this.speed = max(this.speed * 0.9995, 0.4);
    }

    // sometimes the eddy catches a drop and holds it — patient, no hurry
    if (!this.held && abs(this.y - damY) < 18 && random() < 0.004) {
      this.held = true;
      this.holdT = random(80, 260);
    }

    if (this.held) {
      this.holdT -= 1;
      this.wob += 0.012;
      if (this.holdT <= 0) this.held = false;   // …and slips free downstream
    } else {
      this.wob += 0.002;
      this.x += this.speed;
    }

    // sway around the lane; held drops barely stir
    this.y = this.lane + sin(this.wob) * (this.held ? 7 : 20);

    // the lane itself drifts slowly, like a season turning
    this.lane += sin(this.wob * 0.3) * 0.02;
    this.lane = constrain(this.lane, height * 0.06, height * 0.94);

    // recycle — the water is one loop, endlessly returning
    if (this.x > width + 12) {
      this.x = -12;
      this.lane = random(height * 0.06, height * 0.94);
      this.y = this.lane;
      this.held = false;
      this.speed = random(0.4, 1.6);
    }
  }

  show() {
    const pulse = 1 + 0.25 * sin(millis() * 0.001 + this.wob);
    fill(this.hue, 45, this.held ? 90 : 72, this.held ? 75 : 48);
    circle(this.x, this.y, this.r * 2 * pulse);
  }
}
