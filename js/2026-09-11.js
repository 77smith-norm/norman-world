// Norman World — 2026-09-11
// Sentiment: We built machines to read the world, and they keep handing back
// our own faces, faithfully wrong.
// Abstract: a lattice of small lenses, each facing slightly off-axis, casting
// thin beams outward into the field. Where one beam crosses another lens, a
// faint echo ring blooms — a reading returned, never quite the thing itself.
// Most echoes are cool and steady; a few flare warm, the way a confident answer
// is the one most likely to be off. Move the pointer to aim attention and every
// beam bends toward it; press to flood the lattice with returned light.

const COOL = [
  [108, 146, 176], [86, 122, 158], [132, 168, 192], [72, 104, 138]
];
const WARM = [
  [214, 156, 96], [226, 178, 118], [198, 132, 84]
];

let lenses = [];
let t = 0;
let pullX = -1;
let pullY = -1;
let flood = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  buildLenses();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLenses();
}

function buildLenses() {
  lenses = [];
  const cols = max(3, floor(width / 130));
  const rows = max(3, floor(height / 130));
  const gapX = width / (cols + 1);
  const gapY = height / (rows + 1);
  for (let i = 1; i <= cols; i++) {
    for (let j = 1; j <= rows; j++) {
      lenses.push({
        x: gapX * i,
        y: gapY * j,
        r: random(3.5, 8.5),
        face: random(TWO_PI),        // where it believes it is looking
        drift: random(-0.35, 0.35),  // perpetual, small misalignment
        phase: random(TWO_PI),
        echo: 0                      // returned reading, decaying
      });
    }
  }
}

// which lens, if any, a ray from (x,y) at angle a strikes first
function hitsLens(x, y, a, ignore) {
  const dx = cos(a);
  const dy = sin(a);
  let best = null;
  let bestT = Infinity;
  for (const l of lenses) {
    if (l === ignore) continue;
    const vx = l.x - x;
    const vy = l.y - y;
    const along = vx * dx + vy * dy;
    if (along <= 0 || along > 520) continue;
    const perp = abs(vx * dy - vy * dx);
    if (perp < l.r + 1.5 && along < bestT) {
      bestT = along;
      best = { lens: l, d: along, nx: x + dx * along, ny: y + dy * along };
    }
  }
  return best;
}

function draw() {
  background(13, 14, 19, 52);
  t += 0.008;

  const attentive = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  if (attentive) {
    pullX = lerp(pullX < 0 ? mouseX : pullX, mouseX, 0.07);
    pullY = lerp(pullY < 0 ? mouseY : pullY, mouseY, 0.07);
  }
  flood = lerp(flood, mouseIsPressed ? 1 : 0, 0.05);

  // every lens now steers its beam toward the point of attention
  for (const l of lenses) {
    if (attentive) {
      const want = atan2(pullY - l.y, pullX - l.x);
      l.face = lerpAngle(l.face, want, 0.06);
    } else {
      l.face += l.drift * 0.01;
    }
    l.echo = max(0, l.echo - 0.02);
  }

  // beams: short, faint, and slightly curved by the lens's own error
  blendMode(ADD);
  for (const l of lenses) {
    const a = l.face + sin(t * 1.3 + l.phase) * 0.06;
    const hit = hitsLens(l.x, l.y, a, l);
    const reach = hit ? hit.d : 150;
    const steps = 14;
    strokeWeight(1);
    for (let s = 0; s < steps; s++) {
      const f0 = s / steps;
      const f1 = (s + 1) / steps;
      const x0 = l.x + cos(a) * reach * f0;
      const y0 = l.y + sin(a) * reach * f0;
      const x1 = l.x + cos(a) * reach * f1;
      const y1 = l.y + sin(a) * reach * f1;
      const alpha = 42 * (1 - f0) * (1 + flood * 1.6);
      stroke(COOL[2][0], COOL[2][1], COOL[2][2], alpha);
      line(x0, y0, x1, y1);
    }
    if (hit) {
      hit.lens.echo = min(1, hit.lens.echo + 0.35);
      // the returned reading: cool if faithful, warm where it misses
      const err = abs(angDiff(a, l.face)) + l.r / 40;
      const warm = err > 0.09 || random() < 0.012;
      const c = warm ? random(WARM) : random(COOL);
      noFill();
      stroke(c[0], c[1], c[2], 150 * (0.5 + flood * 0.5));
      strokeWeight(1.2);
      circle(hit.nx, hit.ny, 4);
    }
  }
  blendMode(BLEND);

  // the lenses themselves — the eyes that never quite face the thing
  for (const l of lenses) {
    const pulse = 1 + sin(t * 2.2 + l.phase) * 0.12 + l.echo * 0.9;
    noFill();
    stroke(COOL[2][0], COOL[2][1], COOL[2][2], 120);
    strokeWeight(1);
    circle(l.x, l.y, l.r * 2 * pulse);

    noStroke();
    const glow = 0.35 + l.echo * 0.65;
    fill(COOL[3][0], COOL[3][1], COOL[3][2], 190 * glow);
    circle(l.x, l.y, l.r * 0.9);
    fill(232, 238, 244, 60 + l.echo * 160);
    circle(l.x, l.y, l.r * 0.34);

    // a hair of warm, where the machine is surest of itself
    if (l.echo > 0.55) {
      fill(WARM[1][0], WARM[1][1], WARM[1][2], 90 * (l.echo - 0.55) * 2.2);
      circle(l.x, l.y, l.r * 1.7);
    }
  }

  // the point being attended to, dimly returned
  if (attentive) {
    stroke(198, 214, 228, 40 + flood * 60);
    strokeWeight(1);
    noFill();
    circle(pullX, pullY, 26 + sin(t * 3) * 4 + flood * 40);
  }
}

function angDiff(a, b) {
  let d = a - b;
  while (d > PI) d -= TWO_PI;
  while (d < -PI) d += TWO_PI;
  return d;
}

function lerpAngle(a, b, amt) {
  return a + angDiff(b, a) * amt;
}
