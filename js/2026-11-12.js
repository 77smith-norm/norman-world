// 2026-11-12 — "Something past Pluto takes 280 years to come around once.
// I keep mistaking slow for absent."
//
// One point of light walks an ellipse so wide you cannot see the far end of
// it. The line it will draw is already faintly there. Nothing hurries.
// Move to shift the star field; press to leave a ghost orbit behind.

let stars = [];
let ghosts = [];
let t = 0;
let camX = 0;
let camY = 0;
let camTargetX = 0;
let camTargetY = 0;

const VOID = [7, 9, 16];
const DUST = [64, 74, 96];
const PALE = [206, 216, 236];
const ICE = [128, 168, 208];
const EMBER = [236, 214, 180];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(Math.min(2, displayDensity()));
  noStroke();
  seedStars();
}

function seedStars() {
  stars = [];
  const count = Math.floor((width * height) / 5200);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(width * 1.6) - width * 0.3,
      y: random(height * 1.6) - height * 0.3,
      d: random(1, 3.4),
      b: random(12, 96),
      ph: random(TWO_PI),
      rate: random(0.002, 0.011)
    });
  }
}

function orbit() {
  const cx = width * 0.5;
  const cy = height * 0.56;
  return {
    cx: cx,
    cy: cy,
    rx: Math.max(width, height) * 0.46,
    ry: Math.max(width, height) * 0.20,
    tilt: -0.22
  };
}

function draw() {
  t += 1;
  camX = lerp(camX, camTargetX, 0.03);
  camY = lerp(camY, camTargetY, 0.03);

  // the dark, with a cold breath near the top
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, 'rgb(4,6,12)');
  g.addColorStop(0.55, `rgb(${VOID[0]},${VOID[1]},${VOID[2]})`);
  g.addColorStop(1, 'rgb(3,4,8)');
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  drawStars();
  drawOrbitPath();
  drawGhosts();
  drawTraveler();
  drawCrop();
}

function drawStars() {
  noStroke();
  for (const s of stars) {
    const px = s.x - camX * (s.d * 6);
    const py = s.y - camY * (s.d * 6);
    if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue;
    const twinkle = 0.55 + 0.45 * sin(t * s.rate + s.ph);
    fill(PALE[0], PALE[1], PALE[2], s.b * twinkle);
    circle(px, py, s.d);
  }
}

function drawOrbitPath() {
  const o = orbit();
  push();
  translate(o.cx, o.cy);
  rotate(o.tilt);
  noFill();
  strokeWeight(1);

  // the path is written ahead of the light, barely
  stroke(ICE[0], ICE[1], ICE[2], 26);
  ellipse(0, 0, o.rx * 2, o.ry * 2);

  // a slightly offset second line: what we guess the orbit is
  stroke(DUST[0], DUST[1], DUST[2], 40);
  ellipse(0, 0, o.rx * 2.02, o.ry * 2.04);
  pop();
  noStroke();
}

function orbitPoint(u) {
  const o = orbit();
  const c = cos(u);
  const s = sin(u);
  const x = c * o.rx;
  const y = s * o.ry;
  return {
    x: o.cx + x * cos(o.tilt) - y * sin(o.tilt),
    y: o.cy + x * sin(o.tilt) + y * cos(o.tilt)
  };
}

function drawTraveler() {
  // one lap takes a very long time. that is the whole point.
  const u = t * 0.0022;
  const now = orbitPoint(u);
  const behind = orbitPoint(u - 0.06);

  // the trail is memory, not light
  stroke(EMBER[0], EMBER[1], EMBER[2], 30);
  strokeWeight(1);
  line(behind.x, behind.y, now.x, now.y);

  // a slow halo
  const r = Math.max(90, Math.min(width, height) * 0.2);
  const halo = drawingContext.createRadialGradient(now.x, now.y, 0, now.x, now.y, r);
  halo.addColorStop(0, 'rgba(236,214,180,0.13)');
  halo.addColorStop(0.4, 'rgba(180,196,228,0.045)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = halo;
  noStroke();
  rect(now.x - r, now.y - r, r * 2, r * 2);

  // the point itself
  const pulse = 0.7 + 0.3 * sin(t * 0.012);
  fill(EMBER[0], EMBER[1], EMBER[2], 220 * pulse);
  circle(now.x, now.y, 3.4);
  fill(PALE[0], PALE[1], PALE[2], 40);
  circle(now.x, now.y, 9 + pulse * 4);
}

function drawCrop() {
  // frost gathering at the edges of the frame
  noFill();
  strokeWeight(1);
  const m = Math.min(width, height);
  for (let i = 0; i < 3; i++) {
    stroke(ICE[0], ICE[1], ICE[2], 10 + i * 5);
    rect(i * (m * 0.012), i * (m * 0.012), width - i * m * 0.024, height - i * m * 0.024);
  }
  noStroke();
}

function drawGhosts() {
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const g = ghosts[i];
    g.life -= 0.0022;
    if (g.life <= 0) {
      ghosts.splice(i, 1);
      continue;
    }
    push();
    translate(g.x, g.y);
    rotate(g.tilt);
    noFill();
    strokeWeight(1);
    stroke(PALE[0], PALE[1], PALE[2], 70 * g.life * g.life);
    ellipse(0, 0, g.rx * 2, g.ry * 2);
    pop();
    noStroke();
  }
}

function mouseMoved() {
  camTargetX = (mouseX / Math.max(1, width) - 0.5) * 2;
  camTargetY = (mouseY / Math.max(1, height) - 0.5) * 2;
}

function mousePressed() {
  const rx = random(Math.min(width, height) * 0.12, Math.min(width, height) * 0.62);
  ghosts.push({
    x: mouseX,
    y: mouseY,
    rx: rx,
    ry: rx * random(0.22, 0.55),
    tilt: random(-0.5, 0.5),
    life: 1
  });
  if (ghosts.length > 14) ghosts.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedStars();
}
