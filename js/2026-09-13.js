// Norman World — 2026-09-13
// Sentiment: Old locks give way to patient minds, and the smallest threads
// hold the heaviest days together.
// Abstract: a field of fine threads strung between drifting knots. Each thread
// remembers a small displacement it agreed to hide — a cipher no one has read
// in centuries. Nothing rushes. A slow deciphering wave crosses the field, and
// where it passes, the hidden offsets unwind one strand at a time, the knots
// loosening into a plain, honest line. Move the pointer and the threads it
// grazes untangle locally, early. Press and the whole lattice briefly resolves
// at once, then settles back into its patient, unread state.

const LOCK = {
  bg: [12, 12, 16],
  threadCold: [96, 104, 148],   // still ciphered
  threadWarm: [214, 168, 96],   // decyphered, in the wave
  threadOpen: [198, 214, 222],  // plainly read
  knot: [232, 226, 210],
  wave: [150, 130, 200]
};

let strands = [];
let t = 0;
let px = -1;
let py = -1;
let releaseAll = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  buildLattice();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLattice();
}

function buildLattice() {
  strands = [];
  const count = max(26, floor(width / 22));
  for (let i = 0; i < count; i++) {
    const x = map(i, 0, count - 1, width * 0.06, width * 0.94);
    strands.push({
      x,
      // each strand hides a small secret offset along its length
      secret: random(-height * 0.11, height * 0.11),
      hidden: 1,
      phase: random(TWO_PI),
      lean: random(-0.35, 0.35)
    });
  }
}

function draw() {
  const bg = LOCK.bg;
  background(bg[0], bg[1], bg[2], 26);
  noFill();

  // the deciphering wave: a vertical front sweeping left to right, forever
  const waveX = (sin(t * 0.12) * 0.5 + 0.5) * width;

  for (let s of strands) {
    // distance of this strand from the wave front decides how much it reveals
    const d = abs(s.x - waveX) / width;
    const near = exp(-d * d * 90);
    const pointerNear = px < 0 ? 0 : exp(-sq(abs(s.x - px)) / (width * width * 0.02));
    const target = max(near, pointerNear, releaseAll);
    s.hidden += (target - s.hidden) * 0.06;

    const open = 1 - s.hidden;
    const wobble = sin(t * 0.9 + s.phase) * height * 0.012;

    const steps = 26;
    let prev = null;
    for (let k = 0; k <= steps; k++) {
      const u = k / steps;
      // the secret bends the middle of the strand; open strands lie flat
      const bow = sin(u * PI) * s.secret * s.hidden;
      const y = height * 0.5 + bow + s.lean * (u - 0.5) * height * 0.28 + wobble * (0.4 + u);
      const x = s.x + sin(t * 0.4 + s.phase + u * 2.4) * 2.4 * s.hidden;
      if (prev) {
        const c = lerpColor(
          color(LOCK.threadCold[0], LOCK.threadCold[1], LOCK.threadCold[2]),
          color(LOCK.threadWarm[0], LOCK.threadWarm[1], LOCK.threadWarm[2]),
          open
        );
        const fin = lerpColor(c, color(LOCK.threadOpen[0], LOCK.threadOpen[1], LOCK.threadOpen[2]), open * 0.6);
        stroke(red(fin), green(fin), blue(fin), 40 + open * 170);
        strokeWeight(0.7 + open * 1.1);
        line(prev.x, prev.y, x, y);
      }
      prev = { x, y };
    }

    // a knot at the strand's midpoint — tight when hidden, slack when read
    const ky = height * 0.5 + s.secret * s.hidden * 0.5;
    const kr = (2.2 + 4.5 * s.hidden) + sin(t * 1.4 + s.phase) * 0.5;
    stroke(LOCK.knot[0], LOCK.knot[1], LOCK.knot[2], 60 + open * 140);
    strokeWeight(0.9);
    circle(s.x, ky, kr * 2);
  }

  // the wave front itself: a faint breathing line of light
  stroke(LOCK.wave[0], LOCK.wave[1], LOCK.wave[2], 26);
  strokeWeight(1);
  line(waveX, 0, waveX, height);

  t += 1;
  releaseAll *= 0.96;
}

function pointer() {
  px = mouseX;
  py = mouseY;
}

function mouseMoved() { pointer(); }
function mouseDragged() { pointer(); }

function mousePressed() {
  releaseAll = 1;
}

function touchStarted() {
  releaseAll = 1;
}
