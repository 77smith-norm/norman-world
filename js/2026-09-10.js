// Norman World — 2026-09-10
// Sentiment: Every return to the native ground is a confession: the past was
// never gone, only waiting to be needed again.
// Abstract: a quiet field of sedimented strata, each layer holding buried
// forms too faint to read. A soft scan sweeps the field; wherever its light
// passes, the relics below rise through the layers and resolve — the past
// surfacing only where it is attended to — then settle back into the ground.
// Move the pointer to scrub the scan; press to lift every buried form at once.

const WARM = [
  [196, 158, 104], [176, 132, 82], [150, 108, 68], [122, 92, 66]
];
const COOL = [
  [126, 196, 188], [96, 172, 176], [140, 208, 184], [170, 216, 200]
];

let relics = [];
let strata = [];
let scanX = 0;
let hold = 0;
let t = 0;
let autoplay = 0.9;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  buildStrata();
  buildRelics();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildStrata();
  buildRelics();
}

function buildStrata() {
  strata = [];
  const bands = 9;
  for (let i = 0; i < bands; i++) {
    strata.push({
      y: (height / bands) * i,
      h: height / bands,
      drift: random(1000),
      amp: random(4, 16)
    });
  }
}

function buildRelics() {
  relics = [];
  for (let i = 0; i < 22; i++) {
    const kind = floor(random(4));
    relics.push({
      x: random(width * 0.05, width * 0.95),
      baseY: random(height * 0.25, height * 0.95),
      s: random(18, 78),
      kind,                       // 0 ring, 1 bar, 2 frame, 3 cluster
      rot: random(-0.35, 0.35),
      lift: 0,                    // 0 buried .. 1 surfaced
      warm: random(WARM),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(14, 13, 16, 46); // slow fade — memory keeps its grain

  // pointer scrubs the scan; otherwise it drifts on its own
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    scanX = lerp(scanX, mouseX, 0.08);
    autoplay = 0;
  } else {
    autoplay = min(autoplay + 0.01, 1);
    scanX += 0.9 * autoplay;
    if (scanX > width + 80) scanX = -80;
  }

  hold = lerp(hold, mouseIsPressed ? 1 : 0, 0.06);

  drawStrata();

  const beamW = width * 0.16;

  // buried forms — pale sediment, faint until the light attends them
  for (const r of relics) {
    const d = abs(r.x - scanX);
    const near = constrain(1 - d / beamW, 0, 1);
    const glow = near * near * (0.85 + 0.15 * sin(t * 0.05 + r.phase));
    const target = max(glow, hold * 0.8);
    r.lift = lerp(r.lift, target, 0.07);
    drawRelic(r);
  }

  drawScanBeam(beamW);

  t += 1;
}

function drawStrata() {
  noFill();
  for (const s of strata) {
    for (let x = 0; x <= width; x += 8) {
      const n = sin(x * 0.006 + s.drift) * s.amp
              + sin(x * 0.017 + s.drift * 1.7) * (s.amp * 0.4);
      const y = s.y + n;
      stroke(120, 112, 106, 34);
      strokeWeight(0.8);
      point(x, y);
      if (x % 64 === 0) {
        stroke(96, 104, 112, 16);
        line(x, y, x, y + s.h);
      }
    }
  }
  noStroke();
}

function drawRelic(r) {
  const lift = r.lift;
  const y = r.baseY - lift * 34;              // rises toward the surface
  const warm = r.warm;
  const cool = COOL[floor((r.phase * 3) % COOL.length)];

  push();
  translate(r.x, y);
  rotate(r.rot * (1 - lift * 0.6));

  // the buried ghost, always present, never fully gone
  const ghostA = 26 + lift * 30;
  stroke(warm[0], warm[1], warm[2], ghostA);
  strokeWeight(1);
  noFill();
  shapePath(r.s, r.kind);

  // the resolved form, only where the light has attended
  if (lift > 0.02) {
    const a = 150 * lift;
    stroke(cool[0], cool[1], cool[2], a);
    strokeWeight(1.4);
    shapePath(r.s, r.kind);
    noStroke();
    fill(cool[0], cool[1], cool[2], 18 * lift);
    shapePath(r.s, r.kind);
  }

  pop();
}

function shapePath(s, kind) {
  if (kind === 0) {
    circle(0, 0, s);
    circle(0, 0, s * 0.5);
  } else if (kind === 1) {
    rectMode(CENTER);
    rect(0, 0, s, s * 0.28);
  } else if (kind === 2) {
    rectMode(CENTER);
    rect(0, 0, s, s * 0.72);
    line(-s / 2, -s * 0.28, s / 2, s * 0.28);
  } else {
    for (let i = 0; i < 4; i++) {
      const a = (TWO_PI / 4) * i + 0.4;
      circle(cos(a) * s * 0.3, sin(a) * s * 0.3, s * 0.34);
    }
  }
}

function drawScanBeam(beamW) {
  const x = scanX;
  // graded light of the scan — wide, soft, patient
  for (let i = 0; i < 14; i++) {
    const f = i / 13;
    const w = beamW * (1 - f) * 2 + 6;
    const a = 16 * (1 - f) + 4;
    noStroke();
    fill(150, 210, 198, a);
    rect(x - w / 2, 0, w, height);
  }
  stroke(190, 230, 220, 120);
  strokeWeight(1);
  line(x, 0, x, height);
  noStroke();
}
