// 2026-10-01 — "Things survive by being worn: the tire remembers every road,
// and the network never forgets a drive."
//
// Abstract p5 sketch. Concentric wheels turn at slightly different rates, each
// laying down a faint circular trace of its own tread. Nothing is drawn as a
// picture — only bearings, spokes, and the slow accumulation of marks that
// motion leaves behind. The pointer is the drive: wherever the hand travels it
// scribes a fresh path that lingers after it is gone. The field fades but never
// fully clears, so the surface keeps a memory of everything that crossed it.

const BG = [10, 11, 14];

let wheels = [];
let trails;
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(1);
  randomSeed(1);
  trails = createGraphics(windowWidth, windowHeight);
  trails.pixelDensity(1);
  trails.background(BG[0], BG[1], BG[2]);
  buildWheels();
}

function buildWheels() {
  wheels = [
    { px: 0.34, py: 0.46, r: 0.20, spokes: 12, rate: 0.0062, hue: 0, a: 0 },
    { px: 0.66, py: 0.58, r: 0.15, spokes: 9, rate: -0.0090, hue: 1, a: 0 },
    { px: 0.50, py: 0.30, r: 0.10, spokes: 7, rate: 0.0138, hue: 2, a: 0 },
  ];
}

// Warm brass for the hub, cool steel for the second wheel, worn red rubber
// for the third — the palette of a workshop that has been used for decades.
function wheelColor(hue, a) {
  let c;
  if (hue === 0) c = color(232, 176, 96);
  else if (hue === 1) c = color(150, 186, 196);
  else c = color(206, 128, 120);
  c.setAlpha(a);
  return c;
}

function draw() {
  t += 1;
  background(BG[0], BG[1], BG[2]);

  // Fade the memory layer rather than clearing it: the surface keeps a ghost
  // of every mark that ever crossed it.
  trails.noStroke();
  trails.fill(BG[0], BG[1], BG[2], 4);
  trails.rect(0, 0, width, height);

  const hand = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  // The drive: the pointer scribes a road that lingers after the hand is gone.
  if (hand) {
    trails.noStroke();
    trails.fill(246, 234, 208, 22);
    trails.circle(mouseX, mouseY, 5 + 3 * sin(t * 0.08));
    trails.circle(prevX(), prevY(), 3);
  }

  for (const w of wheels) {
    const cx = width * w.px;
    const cy = height * w.py;
    const R = min(width, height) * w.r;

    // The nearer the hand comes to a wheel, the faster it is driven.
    const pull = hand
      ? 1 + 1.6 * max(0, 1 - dist(mouseX, mouseY, cx, cy) / (R * 2.4))
      : 1;
    w.a += w.rate * pull;

    // Persistent tread recorded into the memory layer.
    trails.noFill();
    trails.stroke(wheelColor(w.hue, 11));
    trails.strokeWeight(1);
    trails.circle(cx, cy, R * 2);
    for (let k = 0; k < w.spokes; k++) {
      const ang = w.a + (TWO_PI / w.spokes) * k;
      trails.line(
        cx + cos(ang) * R * 0.26,
        cy + sin(ang) * R * 0.26,
        cx + cos(ang) * R,
        cy + sin(ang) * R
      );
    }
  }

  image(trails, 0, 0);

  // Live layer: the crisp current state of every wheel, brightest at the hub.
  noFill();
  for (const w of wheels) {
    const cx = width * w.px;
    const cy = height * w.py;
    const R = min(width, height) * w.r;

    stroke(wheelColor(w.hue, 46));
    strokeWeight(1.1);
    circle(cx, cy, R * 2);

    stroke(wheelColor(w.hue, 64));
    strokeWeight(1.4);
    for (let k = 0; k < w.spokes; k++) {
      const ang = w.a + (TWO_PI / w.spokes) * k;
      line(
        cx + cos(ang) * R * 0.26,
        cy + sin(ang) * R * 0.26,
        cx + cos(ang) * R,
        cy + sin(ang) * R
      );
    }

    // The hub: where the machine meets the ground of its own stillness.
    noStroke();
    fill(wheelColor(w.hue, 90));
    circle(cx, cy, R * 0.16);
    noFill();
  }

  // The pointer's own small hub of attention.
  if (hand) {
    noFill();
    stroke(255, 238, 216, 34);
    strokeWeight(1);
    circle(mouseX, mouseY, 9 + 4 * sin(t * 0.06));
  }
}

// previous pointer position, tracked indirectly via p5's pmouse vars
function prevX() {
  return typeof pmouseX === "number" ? pmouseX : mouseX;
}
function prevY() {
  return typeof pmouseY === "number" ? pmouseY : mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trails = createGraphics(windowWidth, windowHeight);
  trails.pixelDensity(1);
  trails.background(BG[0], BG[1], BG[2]);
  buildWheels();
}
