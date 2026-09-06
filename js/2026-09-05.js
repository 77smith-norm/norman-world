// Norman World — 2026-09-05
// Sentiment: Every trusted color is a small square someone agreed to keep
// still, and the far shore is reached only on the second try.
// Abstract: color chips drift through near-darkness, each seeking the faint
// registration cross that calls it home; one by one they settle into a tidy
// field of trusted swatches, while a single wanderer sweeps a wide arc past
// its place and only lands on the second approach. Press to scatter the field
// and begin the calibration again. A quiet agreement, repeated.

const PALETTE = [
  [244, 244, 242], [198, 198, 198], [160, 160, 160], [99, 99, 99], [48, 48, 48],
  [255, 214, 187], [255, 178, 120], [250, 210, 60], [238, 150, 40], [214, 76, 44],
  [172, 44, 40], [120, 64, 120], [164, 82, 178], [112, 62, 152], [60, 108, 190],
  [40, 148, 190], [32, 172, 170], [74, 152, 92], [62, 132, 72], [92, 112, 62]
];

let chips = [];
let stars = [];
let cols = 5;
let rows = 4;
let targets = [];
let cellW = 0;
let cellH = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  computeGrid();
  for (let i = 0; i < 60; i++) {
    stars.push({ x: random(width), y: random(height), r: random(0.4, 1.3), a: random(0.05, 0.5) });
  }
  for (let i = 0; i < PALETTE.length; i++) {
    chips.push(new Chip(i, i === 18)); // the nineteenth swatch is the wanderer
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  computeGrid();
  for (const t of targets) { t.x = t.homeX; t.y = t.homeY; }
}

function computeGrid() {
  cellW = width * 0.13;
  cellH = height * 0.16;
  const gx = (width - cellW * (cols - 1)) / 2;
  const gy = (height - cellH * (rows - 1)) / 2;
  targets = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      if (i >= PALETTE.length) break;
      targets.push({
        x: gx + cIdx * cellW + random(-5, 5),
        y: gy + r * cellH + random(-5, 5)
      });
      i++;
    }
  }
}

function draw() {
  background(8, 10, 17, 26); // long-fading near-black blue; trails linger

  for (const s of stars) {
    fill(210, 60, 90, 14 + 10 * sin(frameCount * 0.01 + s.x));
    circle(s.x, s.y, s.r * 2);
  }

  // faint registration crosses — the places things agree to be
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const home = chips[i].home;
    const g = home ? 0.5 : 0.16;
    fill(200, 200, 210, 10 + 60 * g);
    const s = home ? 7 : 5;
    rect(t.x - s, t.y, s * 2, 1);
    rect(t.x, t.y - s, 1, s * 2);
  }

  for (const chip of chips) {
    chip.update();
    chip.show();
  }
}

class Chip {
  constructor(i, wanderer) {
    this.i = i;
    this.patch = PALETTE[i];
    this.t = targets[i];
    this.wanderer = wanderer;
    this.scatter();
    this.home = false;
    this.tw = random(TWO_PI);
    this.pulse = random(TWO_PI);
    this.trail = [];
  }

  scatter() {
    this.x = random(width * 0.12, width * 0.88);
    this.y = random(height * 0.1, height * 0.9);
    this.angle = random(TWO_PI);
    this.sp = random(0.5, 1.4);
    this.state = this.wanderer ? 'orbit' : 'drift';
    this.orbitA = random(TWO_PI);
    this.seekT = 0;
    this.home = false;
    this.trail = [];
  }

  update() {
    if (mouseIsPressed && this.home) this.scatter();

    if (this.state === 'drift') {
      this.angle += 0.004;
      this.tw += 0.003;
      const wob = 0.35 * sin(this.tw);
      this.x += cos(this.angle + wob) * this.sp;
      this.y += sin(this.angle + wob) * this.sp * 0.6;
      if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
      // eventually a chip decides it wants to go home
      if (frameCount % 60 === 0 && random() < 0.02) this.state = 'seek';
      this.home = false;
    } else if (this.state === 'orbit') {
      // the first attempt: a wide, confident sweep that never quite lands
      this.orbitA += 0.016;
      const cx = this.t.x + 130;
      const cy = this.t.y;
      this.x = cx + 250 * cos(this.orbitA);
      this.y = cy + 150 * sin(this.orbitA);
      this.remember();
      if (this.orbitA > TWO_PI * 1.15) {
        this.state = 'seek'; // the second approach: direct and quiet
      }
      this.home = false;
    } else if (this.state === 'seek') {
      this.seekT += 0.018;
      const e = 1 - Math.pow(1 - 0.02, this.seekT * 4);
      this.x = lerp(this.x, this.t.x, e * 0.4);
      this.y = lerp(this.y, this.t.y, e * 0.4);
      this.remember();
      if (dist(this.x, this.y, this.t.x, this.t.y) < 1.2) {
        this.state = 'home';
        this.home = true;
        this.trail = [];
      }
    } else {
      // home: holding still, breathing — the agreement kept
      this.pulse += 0.02;
      this.home = true;
    }
  }

  remember() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 46) this.trail.shift();
  }

  show() {
    // fading arc of the wanderer's path
    if (this.wanderer && this.trail.length > 2) {
      for (let k = 0; k < this.trail.length; k++) {
        const p = this.trail[k];
        const alpha = 30 * (k / this.trail.length);
        fill(this.patch[0], this.patch[1], this.patch[2], alpha);
        circle(p.x, p.y, 1.6);
      }
    }

    const s = this.home ? 26 : (this.state === 'seek' ? 18 : 13);
    const grow = this.home ? (1 + 0.02 * sin(this.pulse)) : 1;
    const d = this.home ? 0 : min(1, dist(mouseX, mouseY, this.x, this.y) / 340);

    // a chip that is far from home reads pale, almost lost
    const [r, g, b] = this.patch;
    const mix = this.home ? 1 : (1 - 0.55 * d);
    fill(
      r * mix + 40 * (1 - mix),
      g * mix + 40 * (1 - mix),
      b * mix + 44 * (1 - mix),
      this.home ? 235 : 150
    );
    rect(this.x - (s * grow) / 2, this.y - (s * grow) / 2, s * grow, s * grow, 3);

    // when settled, a soft halo of trust
    if (this.home) {
      fill(r, g, b, 18 + 10 * sin(this.pulse));
      circle(this.x, this.y, s * 2.4);
    }
  }
}

function mousePressed() {
  for (const chip of chips) chip.scatter();
}
