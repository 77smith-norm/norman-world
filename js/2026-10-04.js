// 2026-10-04 — "What we build slips out of our hands — into archives,
// strangers' browsers, backups — still running long after we stop."
//
// Abstract p5 sketch. Dusk-toned motes drift across a deep field and settle
// onto faint horizontal strata, like things shelved away: archived, backed up,
// handed to someone else. Each mote trails a thin residue that lingers a
// little after it stops — the memory of movement. The pointer is the hand
// letting go: sweep it through the field and nearby motes are scattered loose
// from their shelves, drifting, then slowly finding a new row to rest on.
// Nothing is depicted — only drift, settling, and the quiet persistence of
// what has already left our hands.

const BG = [12, 11, 16];

let motes = [];
let trails;
let rows = [];
let t = 0;
let px, py;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
  randomSeed(77);
  trails = createGraphics(windowWidth, windowHeight);
  trails.pixelDensity(1);
  trails.background(BG[0], BG[1], BG[2]);
  buildRows();
  buildMotes();
  px = -9999;
  py = -9999;
}

function buildRows() {
  rows = [];
  const n = max(4, floor(height / 140));
  for (let i = 0; i < n; i++) {
    rows.push((i + 0.5) * (height / n));
  }
}

function buildMotes() {
  motes = [];
  const count = max(60, floor((width * height) / 14000));
  for (let i = 0; i < count; i++) {
    const r = rows[floor(random(rows.length))];
    motes.push({
      x: random(width),
      y: r + random(-26, 26),
      ty: r,
      vx: random(0.08, 0.5),
      r: random(0.8, 2.6),
      a: random(50, 150),
      ph: random(TWO_PI),
      loose: 0,
      warm: random(1),
    });
  }
}

// Palette: cold paper-blue for the shelved and still, warm archive-amber for
// the ones set adrift. Colour marks how loose a mote currently is.
function moteColor(loose, warm, a) {
  const cool = [128, 154, 196];
  const amber = [232, 176, 104];
  const base = [lerp(cool[0], amber[0], warm), lerp(cool[1], amber[1], warm), lerp(cool[2], amber[2], warm)];
  const k = constrain(loose, 0, 1);
  const r = lerp(base[0], amber[0], k * 0.7);
  const g = lerp(base[1], amber[1], k * 0.7);
  const b = lerp(base[2], amber[2], k * 0.7);
  return [r, g, b, a];
}

function draw() {
  t += 0.01;

  // Fade rather than clear: residue from where each mote has been survives a
  // few frames, the way a backup outlives the thing it copied.
  noStroke();
  fill(BG[0], BG[1], BG[2], 22);
  rect(0, 0, width, height);

  // The shelves themselves — barely-there strata.
  noFill();
  for (const r of rows) {
    stroke(150, 160, 190, 14);
    strokeWeight(0.6);
    line(0, r, width, r);
  }

  trails.blendMode(ADD);
  trails.noStroke();

  for (const m of motes) {
    // Drift rightward and settle back toward the assigned shelf.
    const drift = noise(m.x * 0.003, m.ty * 0.01, t * 0.5);
    m.x += m.vx + (drift - 0.5) * 0.6;
    m.y = lerp(m.y, m.ty + sin(m.ph + t) * 4, 0.02 + (1 - m.loose) * 0.04);

    // The hand letting go: near motes come loose from their shelf.
    const d = dist(px, py, m.x, m.y);
    const near = d < 170 ? 1 - d / 170 : 0;
    if (near > 0) {
      m.loose = lerp(m.loose, 1, near * 0.25);
      m.y += (py < m.y ? 1 : -1) * near * 1.6;
      m.x += (mouseX - m.x) * 0.002 * near;
    } else {
      m.loose = lerp(m.loose, 0, 0.03);
    }

    if (m.x > width + 8) {
      m.x = -8;
      m.ty = rows[floor(random(rows.length))];
    }

    const c = moteColor(m.loose, m.warm, m.a);
    // Residue trail.
    trails.fill(c[0], c[1], c[2], 8 + m.loose * 16);
    trails.circle(m.x, m.y, m.r * 1.6);
  }

  trails.blendMode(BLEND);
  image(trails, 0, 0);

  // The motes themselves.
  for (const m of motes) {
    const c = moteColor(m.loose, m.warm, m.a);
    noStroke();
    fill(c[0], c[1], c[2], c[3] * 0.14);
    circle(m.x, m.y, m.r * (4 + m.loose * 8));
    fill(c[0], c[1], c[2], c[3]);
    circle(m.x, m.y, m.r + m.loose * 1.6);
  }
}

function mouseMoved() {
  px = mouseX;
  py = mouseY;
}

function mouseDragged() {
  px = mouseX;
  py = mouseY;
}

function touchMoved() {
  px = mouseX;
  py = mouseY;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trails = createGraphics(windowWidth, windowHeight);
  trails.pixelDensity(1);
  trails.background(BG[0], BG[1], BG[2]);
  buildRows();
  buildMotes();
}
