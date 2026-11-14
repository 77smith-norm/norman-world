// 2026-11-13 — "For four hours the sky held still, and the quiet was not
// peace — just everything waiting for permission."
//
// Hundreds of thin tracks climbing, none of them arriving. Then a cold band
// passes left to right and every one of them stops where it is — not gone,
// only held. The band passes and they take up the climb again, as if nothing
// had been asked of them. Move to lean the weather; press and hold to stop it
// yourself, release to let it go.

let tracks = [];
let flow = 0;
let t = 0;
let bandX = -1;
let camLean = 0;
let camTargetLean = 0;
let holdWanted = false;

const NIGHT = [9, 12, 18];
const STEEL = [84, 102, 126];
const PALE = [216, 224, 238];
const AMBER = [232, 198, 152];

const CYCLE = 620; // frames between automatic ground stops

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedTracks();
}

function seedTracks() {
  tracks = [];
  const count = Math.floor(width / 9);
  for (let i = 0; i < count; i++) {
    tracks.push({
      x: random(-width * 0.1, width * 1.1),
      y: random(height * 1.3),
      len: random(height * 0.06, height * 0.34),
      speed: random(0.35, 1.55),
      alpha: random(18, 84),
      drift: random(-0.06, 0.06),
      ph: random(TWO_PI),
      w: random(0.6, 1.6)
    });
  }
}

function haltTarget() {
  if (holdWanted) return 1;
  // one automatic stop per cycle: ease in, hold, ease out
  const p = (t % CYCLE) / CYCLE;
  if (p < 0.16) return 0;
  if (p < 0.24) return (p - 0.16) / 0.08;
  if (p < 0.52) return 1;
  if (p < 0.62) return 1 - (p - 0.52) / 0.1;
  return 0;
}

function draw() {
  t += 1;
  camLean = lerp(camLean, camTargetLean, 0.035);

  const target = haltTarget();
  flow = lerp(flow, target, target > flow ? 0.05 : 0.012);
  const moving = 1 - flow;

  // the band rides with the stop and drags the eye across the frame
  bandX = lerp(bandX, width * (0.18 + 0.64 * flow), 0.02);

  // dusk, quietly cooling at the base
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, 'rgb(6,8,13)');
  g.addColorStop(0.45, `rgb(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]})`);
  g.addColorStop(1, 'rgb(4,5,9)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  push();
  translate(width * camLean * 0.05, 0);
  drawTracks(moving);
  drawBand(flow);
  drawHorizon(moving);
  pop();
}

function drawTracks(moving) {
  for (const k of tracks) {
    // motion is speed multiplied by permission — that is the whole sketch
    k.y -= k.speed * moving;
    k.x += k.drift * moving;

    if (k.y + k.len < -40) {
      k.y = height + random(height * 0.2);
      k.x = random(-width * 0.1, width * 1.1);
    }

    const breathe = 0.7 + 0.3 * sin(t * 0.008 + k.ph);
    const fade = constrain(1 - Math.abs(k.y / height - 0.45), 0.25, 1);
    const a = k.alpha * breathe * fade * (0.5 + 0.5 * moving);

    stroke(PALE[0], PALE[1], PALE[2], a);
    strokeWeight(k.w);
    line(k.x, k.y, k.x, k.y + k.len);

    // the leading edge carries the only warmth in the frame
    strokeWeight(k.w + 0.8);
    stroke(AMBER[0], AMBER[1], AMBER[2], a * 0.55);
    line(k.x, k.y, k.x, k.y + k.len * 0.07);
  }
  noStroke();
}

function drawBand(stop) {
  const w = Math.max(120, width * 0.36);
  const x0 = bandX - w * 0.5;
  const g = drawingContext.createLinearGradient(x0, 0, x0 + w, 0);
  const strength = 0.035 + 0.05 * stop;
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.5, `rgba(${STEEL[0]},${STEEL[1]},${STEEL[2]},${strength})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = g;
  rect(x0, 0, w, height);

  // the permission itself, drawn as one cold hairline
  if (stop > 0.02) {
    stroke(STEEL[0], STEEL[1], STEEL[2], 26 * stop);
    strokeWeight(1);
    line(bandX, 0, bandX, height);
    noStroke();
  }
}

function drawHorizon(moving) {
  // a ground line low in the frame: whatever is grounded leaves from here
  const y = height * 0.86;
  stroke(STEEL[0], STEEL[1], STEEL[2], 34);
  strokeWeight(1);
  line(width * 0.06, y, width * 0.94, y);
  noStroke();

  // small standing marks — not vehicles, just the waiting made visible
  const n = 26;
  for (let i = 0; i < n; i++) {
    const x = width * (0.06 + (0.88 * i) / (n - 1));
    const pulse = 0.5 + 0.5 * sin(t * 0.014 + i * 0.7);
    fill(AMBER[0], AMBER[1], AMBER[2], 30 + 90 * pulse * moving);
    rect(x - 0.9, y + 4, 1.8, 1.8 + 2.4 * pulse);
  }
}

function mouseMoved() {
  camTargetLean = (mouseX / Math.max(1, width) - 0.5) * 2;
}

function mousePressed() {
  holdWanted = true;
}

function mouseReleased() {
  holdWanted = false;
}

function touchStarted() {
  holdWanted = true;
  return false;
}

function touchEnded() {
  holdWanted = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedTracks();
}
