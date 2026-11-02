// 2026-11-01
// Sentiment: "A book is a stranger's quiet handed forward; the work that takes longer is usually the work still being looked at."
// Abstract study: attention as the only real currency. A shelf of unnamed spines stands in dusk; a band of
// reading light crosses them without hurry, and each spine holds the warmth it was given long after the
// light has moved on. Nothing is catalogued. The slowness is not a delay in the process — it is the process.

let spines = [];
let motes = [];
let ripples = [];
let band = 0.42;
let t0 = 0;

const P = {
  dark: [15, 14, 13],
  ink: [34, 33, 31],
  warm: [226, 190, 132],
  pale: [238, 232, 218],
  cool: [104, 118, 132],
  rust: [176, 106, 74]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(1101);
  build();
  t0 = millis();
}

function build() {
  spines = [];
  motes = [];
  ripples = [];

  const shelfY = height * 0.88;
  let x = -20;

  while (x < width + 20) {
    const w = random(2.5, 13);
    const tall = random(0.28, 0.78);
    // A few spines are set back further than the rest; depth reads as darkness.
    const depth = random(0.35, 1);
    const tint = random();

    spines.push({
      x: x + w * 0.5,
      w: w,
      base: shelfY + random(-2, 2),
      h: height * tall * (0.86 + depth * 0.2),
      depth: depth,
      lean: random(-0.035, 0.035),
      tint: tint,
      // Each book is on its own clock; some are read sooner, some late, some never in the time you watch.
      patience: random(0.5, 1.9),
      warmth: random(0, 0.16),
      open: 0,
      grain: random(1000)
    });

    x += w + random(1.2, 3.4);
  }

  const moteCount = constrain(floor((width * height) / 22000), 30, 130);
  for (let i = 0; i < moteCount; i++) {
    motes.push({
      x: random(width),
      y: random(height),
      r: random(0.5, 1.7),
      vx: random(-0.09, 0.09),
      vy: random(-0.07, 0.05),
      a: random(8, 30)
    });
  }
}

function draw() {
  background(P.dark[0], P.dark[1], P.dark[2]);

  // The reading light moves slowly and answers the cursor only a little.
  const drift = 0.5 + 0.33 * sin(frameCount * 0.0013) + (mouseX / max(width, 1) - 0.5) * 0.22;
  band = lerp(band, constrain(drift, 0.06, 0.94), 0.008);
  const bandX = band * width;
  const bandW = width * 0.30;

  drawAir(bandX, bandW);

  // Back to front so the near spines occlude the far ones.
  const ordered = spines.slice().sort((a, b) => a.depth - b.depth);
  for (let i = 0; i < ordered.length; i++) {
    drawSpine(ordered[i], bandX, bandW);
  }

  drawMotes();
  drawShelf(bandX, bandW);
  stepRipples();
}

function drawAir(bandX, bandW) {
  noStroke();
  for (let i = 0; i < 44; i++) {
    const t = i / 43;
    const x = bandX - bandW + t * bandW * 2;
    const fall = pow(1 - abs(t - 0.5) * 2, 2.4);
    fill(P.warm[0], P.warm[1], P.warm[2], 8 * fall + 1.5);
    rect(x - bandW / 44 - 1, 0, bandW / 44 + 2, height);
  }
}

function drawSpine(s, bandX, bandW) {
  const near = 1 - constrain(abs(s.x - bandX) / bandW, 0, 1);
  const attention = pow(near, 1.5);

  // Warmth arrives fast and leaves slowly. That asymmetry is the whole piece.
  s.warmth += (attention - s.warmth * 0.72) * 0.006 / s.patience;
  s.warmth = constrain(s.warmth, 0, 1);
  s.open = lerp(s.open, s.warmth, 0.02);

  // Ripples tilt the spine as they pass, then leave it alone.
  let tilt = 0;
  for (let i = 0; i < ripples.length; i++) {
    const rp = ripples[i];
    const age = frameCount - rp.t;
    const arrival = abs(s.x - rp.x) * 0.55;
    if (age < arrival) continue;
    const local = (age - arrival) / 46;
    if (local > 3.2) continue;
    tilt += sin(local * 3.4) * 0.030 * exp(-local * 1.5) * rp.strength;
  }

  const lean = s.lean + tilt;
  const topX = s.x + lean * s.h;
  const topY = s.base - s.h;

  // Base tone: cool grey turning to amber as the light takes hold.
  const mix = s.warmth;
  const r = lerp(lerp(P.cool[0], P.ink[0], 0.55), P.warm[0], mix * 0.55 + s.tint * 0.1);
  const g = lerp(lerp(P.cool[1], P.ink[1], 0.55), P.warm[1], mix * 0.5 + s.tint * 0.08);
  const b = lerp(lerp(P.cool[2], P.ink[2], 0.55), P.warm[2], mix * 0.4 + s.tint * 0.06);

  const darken = 0.28 + s.depth * 0.62;
  noStroke();
  fill(r * darken, g * darken, b * darken, 210 + 40 * s.depth);
  quad(
    s.x - s.w * 0.5, s.base,
    s.x + s.w * 0.5, s.base,
    topX + s.w * 0.5, topY,
    topX - s.w * 0.5, topY
  );

  // A crown band near the top of the spine — the one place a book admits it ends.
  if (s.w > 4) {
    const crownY = lerp(s.base, topY, 0.14);
    const crownH = max(1.2, s.h * 0.012);
    fill(P.pale[0], P.pale[1], P.pale[2], 14 + 52 * s.open);
    quad(
      s.x - s.w * 0.44, crownY,
      s.x + s.w * 0.44, crownY,
      topX + s.w * 0.44, crownY - crownH - s.h * 0.012,
      topX - s.w * 0.44, crownY - crownH - s.h * 0.012
    );
  }

  // Foil lines: thin horizontal rules that only show when the light is on them.
  if (s.w > 6 && s.open > 0.05) {
    stroke(P.pale[0], P.pale[1], P.pale[2], 44 * s.open);
    strokeWeight(0.7);
    for (let k = 1; k <= 2; k++) {
      const ty = lerp(s.base, topY, 0.34 + k * 0.17);
      const tx = lerp(s.x, topX, 0.34 + k * 0.17);
      line(tx - s.w * 0.33, ty, tx + s.w * 0.33, ty);
    }
  }

  // The lit edge. Not a glow — just the left edge catching the band.
  if (s.open > 0.02) {
    stroke(P.warm[0], P.warm[1], P.warm[2], 60 * s.open * (0.4 + s.depth * 0.6));
    strokeWeight(0.8);
    line(s.x - s.w * 0.5, s.base, topX - s.w * 0.5, topY);
  }

  // Rust-coloured spines are the ones somebody already read.
  if (s.tint > 0.86 && s.w > 5) {
    noStroke();
    fill(P.rust[0], P.rust[1], P.rust[2], 30 + 40 * s.open);
    quad(
      s.x - s.w * 0.5, s.base,
      s.x + s.w * 0.5, s.base,
      topX + s.w * 0.5, lerp(s.base, topY, 0.28),
      topX - s.w * 0.5, lerp(s.base, topY, 0.28)
    );
  }
}

function drawMotes() {
  noStroke();
  for (let i = 0; i < motes.length; i++) {
    const m = motes[i];
    m.x += m.vx + sin(frameCount * 0.0018 + i) * 0.06;
    m.y += m.vy + cos(frameCount * 0.0014 + i * 2.1) * 0.05;
    if (m.x < -4) m.x = width + 4;
    if (m.x > width + 4) m.x = -4;
    if (m.y < -4) m.y = height + 4;
    if (m.y > height + 4) m.y = -4;
    fill(P.warm[0], P.warm[1], P.warm[2], m.a);
    ellipse(m.x, m.y, m.r, m.r);
  }
}

function drawShelf(bandX, bandW) {
  noStroke();
  const h = height * 0.055;
  fill(10, 9, 8, 230);
  rect(0, height - h, width, h);
  // The shelf lip holds a thin line of the light it received.
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const x = bandX - bandW + t * bandW * 2;
    const fall = pow(1 - abs(t - 0.5) * 2, 1.8);
    fill(P.warm[0], P.warm[1], P.warm[2], 6 * fall);
    rect(x - bandW / 30 - 1, height - h, bandW / 30 + 2, 1.5);
  }
}

function stepRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    if (frameCount - ripples[i].t > 220) ripples.splice(i, 1);
  }
}

// A press is a hand reaching for one book: the disturbance travels the shelf, not the room.
function mousePressed() {
  ripples.push({ x: mouseX, t: frameCount, strength: 1 });
  if (ripples.length > 4) ripples.shift();
  for (let i = 0; i < spines.length; i++) {
    const s = spines[i];
    const d = abs(s.x - mouseX);
    s.warmth = constrain(s.warmth + map(constrain(d, 0, 320), 0, 320, 0.35, 0.02), 0, 1);
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  build();
}
