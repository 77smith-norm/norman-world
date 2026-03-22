// Norman World — March 21, 2026
// A tree grows slowly. We sprint everywhere else.

let branches = [];
let leaves = [];
let seed;
let startTime;
let duration = 18000; // 18 seconds to full tree
let done = false;
let glowPhase = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // Ground line
  let groundY = height * 0.82;
  seed = new Seed(width / 2, groundY);
  startTime = millis();
}

function draw() {
  let elapsed = millis() - startTime;
  let progress = min(elapsed / duration, 1);
  // Ease in-out cubic
  progress = progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  background(22, 15, 8);

  // Stars / ambient particles
  drawAmbient();

  // Ground
  fill(30, 20, 15);
  ellipse(width / 2, height * 0.88, width * 1.5, height * 0.25);

  // Grass tufts
  drawGrass(progress);

  // Seed / root glow
  glowPhase += 0.03;
  let glowAlpha = map(progress, 0, 0.3, 80, 20, true);
  let glowSize = 12 + sin(glowPhase) * 3;
  fill(40, 90, 100, glowAlpha);
  ellipse(width / 2, height * 0.82, glowSize, glowSize);

  // Trunk
  let trunkH = lerp(0, height * 0.28, progress);
  let trunkW = lerp(4, 18, progress);
  drawTrunk(width / 2, height * 0.82, trunkH, trunkW);

  // Branches
  let branchCount = 7;
  for (let i = 0; i < branchCount; i++) {
    let branchProgress = constrain(map(progress, 0.15 + i * 0.08, 0.5 + i * 0.08, 0, 1), 0, 1);
    if (branchProgress > 0) {
      let side = i % 2 === 0 ? 1 : -1;
      let yStart = height * 0.82 - trunkH * (0.4 + i * 0.07);
      let len = lerp(0, 40 + i * 8, branchProgress);
      drawBranch(width / 2, yStart, side * len, -PI / 4 * side, lerp(0, 3, branchProgress));
    }
  }

  // Canopy emerges with leaves
  let leafProgress = constrain(map(progress, 0.5, 1.0, 0, 1), 0, 1);
  drawCanopy(width / 2, height * 0.82 - trunkH, trunkH, leafProgress);

  // Label
  if (progress < 0.05) {
    let a = map(progress, 0, 0.05, 0, 255);
    fill(40, 10, 90, a);
    textSize(13);
    textAlign(CENTER);
    textFont('Georgia');
    text('a seed planted today', width / 2, height * 0.78);
  }
}

function drawAmbient() {
  randomSeed(42);
  fill(40, 10, 60, 30);
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height * 0.6);
    let s = random(1, 3);
    ellipse(x, y, s, s);
  }
  randomSeed(Date.now());
}

function drawGrass(progress) {
  let density = floor(map(progress, 0, 1, 10, 80));
  stroke(100, 30, 35);
  strokeWeight(1.5);
  for (let i = 0; i < density; i++) {
    let x = map(i, 0, density, width * 0.1, width * 0.9);
    let h = random(5, 18) * (progress < 0.5 ? progress * 2 : 1);
    let lean = random(-0.3, 0.3);
    line(x, height * 0.88, x + lean * h, height * 0.88 - h);
  }
  noStroke();
}

function drawTrunk(x, y, h, w) {
  fill(25, 45, 40);
  rectMode(CENTER);
  rect(x, y - h / 2, w, h, 3);
  // Subtle texture lines
  fill(25, 50, 30, 40);
  for (let i = 0; i < 4; i++) {
    let ty = y - h * 0.15 - i * h * 0.18;
    line(x - w * 0.3, ty, x + w * 0.3, ty);
  }
  rectMode(CORNER);
}

function drawBranch(x, y, len, angle, weight) {
  if (len < 1) return;
  stroke(25, 45, 38, 90);
  strokeWeight(weight);
  let ex = x + cos(angle) * len;
  let ey = y + sin(angle) * len;
  line(x, y, ex, ey);
  noStroke();
}

function drawCanopy(cx, cy, trunkH, p) {
  // Multiple leaf clusters
  let clusters = [
    { ox: 0,      oy: -20, r: 55 },
    { ox: -25,    oy: -8,  r: 42 },
    { ox: 25,     oy: -10, r: 42 },
    { ox: -10,    oy: -40, r: 35 },
    { ox: 12,     oy: -38, r: 32 },
  ];

  noStroke();
  for (let c of clusters) {
    let cr = c.r * p;
    for (let i = 0; i < 25 * p; i++) {
      let angle = random(TWO_PI);
      let dist = random(cr * 0.1, cr);
      let lx = cx + c.ox + cos(angle) * dist;
      let ly = cy + c.oy + sin(angle) * dist * 0.7;
      let hue = random(95, 135);
      let sat = random(45, 70);
      let bri = random(45, 70);
      fill(hue, sat, bri, random(50, 85));
      ellipse(lx, ly, random(5, 12), random(4, 9));
    }
  }

  // Occasional flower
  if (p > 0.6) {
    for (let i = 0; i < 6; i++) {
      let fx = cx + random(-40, 40);
      let fy = cy - 15 + random(-35, 20);
      fill(340, 70, 90, random(40, 70));
      ellipse(fx, fy, 5, 5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
