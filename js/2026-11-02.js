// 2026-11-02
// Sentiment: "To move the weights from inside, to speak without sound — the disc keeps the light pressed into it long after."
// Abstract study: three ways of touching a thing without touching its surface. A field of concentric grooves holds
// a shape it was never told to hold; pressure arrives from the cursor as silence, never as noise, and the rings
// rearrange themselves a little. Light is written into the disc and stays after the writing hand is gone.

let rings = [];
let ripples = [];
let field = 0;
let t0 = 0;

const P = {
  void: [9, 10, 12],
  deep: [16, 19, 23],
  teal: [92, 196, 186],
  amber: [226, 178, 104],
  violet: [156, 122, 198],
  bone: [232, 229, 220],
  shadow: [28, 32, 38]
};

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  noiseSeed(1102);
  build();
  t0 = millis();
}

function build() {
  rings = [];
  ripples = [];

  // Radius is measured in fractions of the disc, so a resize rewrites the same instrument at a new scale.
  const count = 96;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    rings.push({
      t: t,
      // Each groove has its own resting offset. The offsets are the "weights": nothing draws them, they just are.
      rest: (noise(i * 0.37) - 0.5) * 0.055,
      offset: 0,
      weight: noise(i * 0.11 + 40) * 0.9 + 0.1,
      drift: random(1000),
      hue: noise(i * 0.23 + 90),
      gap: noise(i * 0.71 + 12) * TWO_PI,
      lit: 0
    });
  }
}

function draw() {
  background(P.void[0], P.void[1], P.void[2]);

  const cx = width * 0.5;
  const cy = height * 0.52;
  const R = min(width, height) * 0.40;

  // The disc turns so slowly it reads as still. Movement is in the grooves, not the object.
  field = frameCount * 0.0016;

  drawGround(cx, cy, R);
  drawHalo(cx, cy, R);
  drawGrooves(cx, cy, R);
  drawPressedSpiral(cx, cy, R);
  stepRipples(cx, cy, R);
  drawSilence(cx, cy, R);
}

// A faint table plane under the disc — the disc is an object in a room, not a screen.
function drawGround(cx, cy, R) {
  noStroke();
  const top = cy + R * 0.55;
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    fill(P.deep[0], P.deep[1], P.deep[2], 40 * (1 - t) * 0.7);
    rect(0, lerp(top, height, t), width, (height - top) / 40 + 1);
  }
}

function drawHalo(cx, cy, R) {
  noStroke();
  for (let i = 26; i > 0; i--) {
    const t = i / 26;
    fill(P.teal[0], P.teal[1], P.teal[2], 3.2 * (1 - t) + 0.4);
    ellipse(cx, cy, R * 2.05 * t + R * 0.1, R * 2.05 * t + R * 0.1);
  }
}

function drawGrooves(cx, cy, R) {
  // The cursor is silent pressure. It never makes a sound; it only shifts what the grooves want to be.
  const px = constrain((mouseX - cx) / max(R, 1), -1.4, 1.4);
  const py = constrain((mouseY - cy) / max(R, 1), -1.4, 1.4);
  const reach = sqrt(px * px + py * py);

  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];

    // Target offset: a shallow bulge aimed at the pointer, falling off with distance from the rim.
    const bulge = r.t < 1 ? pow(r.t, 0.7) * reach * 0.075 * r.weight : 0;
    const target = r.rest + bulge + sin(field * 3 + r.drift) * 0.004;

    // Weights move from inside: the offset chases its target without anything visible pushing it.
    r.offset = lerp(r.offset, target, 0.035 + 0.02 * r.weight);

    const rad = R * (0.18 + r.t * 0.82) + R * r.offset;

    // Interference: hue rotates around the groove, so one ring is never one colour.
    const seg = 130;
    const openA = r.gap + field * (0.5 + r.weight);
    const sweep = TWO_PI * (0.72 + 0.28 * sin(r.hue * 4 + field));
    noFill();
    strokeWeight(0.5 + 1.1 * r.weight * (0.3 + r.lit * 0.7));

    for (let k = 0; k < seg; k++) {
      const a0 = openA + (k / seg) * sweep;
      const a1 = openA + ((k + 1) / seg) * sweep;
      const mid = (a0 + a1) * 0.5;

      const c = bandColor(r.hue, mid, r.t);
      const alpha = 26 + 92 * r.weight * (0.35 + 0.65 * r.lit);
      stroke(c[0], c[1], c[2], alpha);
      arc(cx, cy, rad * 2, rad * 2, a0, a1);
    }

    // A groove catches light where the pressed spiral crosses it.
    if (r.t > 0.06) {
      r.lit = lerp(r.lit, 0.18 + 0.82 * pow(sin(field * 1.3 + r.t * 7.4), 2), 0.03);
    }
  }
}

function bandColor(hue, angle, t) {
  // Two slow waves over the ring, phase-shifted — the surface of a disc read at a shallow angle.
  const w1 = 0.5 + 0.5 * sin(angle * 3 + hue * 9 + field * 2);
  const w2 = 0.5 + 0.5 * sin(angle * -5 + hue * 4 + field * 1.4 + 1.7);
  const a = w1 * (0.35 + 0.65 * t);
  const b = w2 * (0.55 - 0.35 * t);

  const r = lerp(P.teal[0], P.violet[0], a) * (0.55 + b * 0.55) + P.amber[0] * b * 0.22;
  const g = lerp(P.teal[1], P.violet[1], a) * (0.55 + b * 0.55) + P.amber[1] * b * 0.20;
  const bl = lerp(P.teal[2], P.violet[2], a) * (0.55 + b * 0.55) + P.amber[2] * b * 0.16;
  return [r, g, bl];
}

// The light pressed into the disc: one continuous groove written by a hand that has already left.
function drawPressedSpiral(cx, cy, R) {
  noFill();
  const turns = 7;
  const steps = 900;
  let prev = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * TWO_PI * turns + field * 0.4;
    const rad = R * (0.20 + t * 0.78);
    const x = cx + cos(a) * rad;
    const y = cy + sin(a) * rad * 0.995;

    if (prev) {
      const near = 1 - constrain(dist(x, y, mouseX, mouseY) / (R * 0.9), 0, 1);
      stroke(P.bone[0], P.bone[1], P.bone[2], 8 + 46 * pow(near, 2));
      strokeWeight(0.6 + 0.8 * near);
      line(prev[0], prev[1], x, y);
    }
    prev = [x, y];
  }
}

// Subvocal: pressure that travels, but makes no sound. The disturbance is real; the noise is not.
function stepRipples(cx, cy, R) {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    const age = frameCount - rp.t;
    const maxAge = 150;
    if (age > maxAge) {
      ripples.splice(i, 1);
      continue;
    }

    const p = age / maxAge;
    const rad = R * p * 1.05;
    const fade = pow(1 - p, 2);

    noFill();
    strokeWeight(1 + 1.6 * fade);
    stroke(P.bone[0], P.bone[1], P.bone[2], 40 * fade);
    arc(cx, cy, rad * 2, rad * 2, rp.a, rp.a + rp.span);

    stroke(P.teal[0], P.teal[1], P.teal[2], 26 * fade);
    arc(cx, cy, (rad - 6) * 2, (rad - 6) * 2, rp.a + 0.4, rp.a + rp.span);

    // The ripple is felt in the grooves before it is seen at the rim.
    for (let j = 0; j < rings.length; j++) {
      const r = rings[j];
      const ringR = 0.18 + r.t * 0.82;
      const band = abs(ringR - p) * 3.2;
      if (band < 1) {
        const push = sin(band * PI) * 0.012 * fade;
        r.offset += push * r.weight;
      }
    }
  }
}

function drawSilence(cx, cy, R) {
  // The middle is not empty — it is the part that never got written.
  noStroke();
  fill(P.void[0], P.void[1], P.void[2], 232);
  ellipse(cx, cy, R * 0.36, R * 0.36);

  fill(P.bone[0], P.bone[1], P.bone[2], 12);
  ellipse(cx, cy, R * 0.36, R * 0.36);

  noFill();
  stroke(P.shadow[0], P.shadow[1], P.shadow[2], 180);
  strokeWeight(1);
  ellipse(cx, cy, R * 0.36, R * 0.36);
}

function mousePressed() {
  const cx = width * 0.5;
  const cy = height * 0.52;
  const a = atan2(mouseY - cy, mouseX - cx);
  const spread = 1.1 + random(0.4, 1.2);
  ripples.push({ t: frameCount, a: a - spread * 0.5, span: spread });
  if (ripples.length > 5) ripples.shift();

  // A press is a hand on the disc: the weights near the pointer move first.
  const R = min(width, height) * 0.40;
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    const d = abs(dist(mouseX, mouseY, cx, cy) / max(R, 1) - (0.18 + r.t * 0.82));
    r.offset += (1 - constrain(d * 2.2, 0, 1)) * 0.02 * r.weight;
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
