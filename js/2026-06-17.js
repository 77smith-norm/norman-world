// 2026-06-17 — "The tools we make are mirrors"
let t = 0;
let pg;
const GOLD = [212, 175, 55];
const COPPER = [184, 115, 51];
const INK = [30, 28, 26];
const WARM = [255, 243, 224];

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pg = createGraphics(width, height);
  pg.background(WARM);
  pg.noStroke();
  drawReachingForms(pg, 0);
}

function draw() {
  t += 0.008;
  image(pg, 0, 0);

  // Mirror axis — the tool reflects
  let midX = width / 2;
  stroke(GOLD[0], GOLD[1], GOLD[2], 30 + sin(t * 2) * 20);
  strokeWeight(0.5);
  line(midX, 0, midX, height);

  // Reaching tendrils that mirror across the center
  noFill();
  for (let i = 0; i < 12; i++) {
    let yOff = (i * height / 12) + sin(t + i * 0.7) * 20;
    let amp = 40 + sin(t * 0.5 + i) * 25;

    // Left side — reaching right
    stroke(COPPER[0], COPPER[1], COPPER[2], 60 + sin(t + i) * 30);
    strokeWeight(1 + sin(t + i * 0.3) * 0.5);
    beginShape();
    for (let x = 0; x < midX; x += 8) {
      let d = x / midX;
      let y = yOff + sin(x * 0.02 + t * 2 + i) * amp * d;
      vertex(x, y);
    }
    endShape();

    // Right side — mirror
    stroke(COPPER[0], COPPER[1], COPPER[2], 60 + sin(t + i) * 30);
    beginShape();
    for (let x = width; x > midX; x -= 8) {
      let d = (width - x) / midX;
      let y = yOff + sin((width - x) * 0.02 + t * 2 + i) * amp * d;
      vertex(x, y);
    }
    endShape();
  }

  // Floating dust motes — golden particles
  noStroke();
  for (let i = 0; i < 60; i++) {
    let px = noise(i * 0.3, t * 0.5) * width;
    let py = noise(i * 0.3 + 100, t * 0.5) * height;
    let sz = noise(i * 0.5, t) * 4 + 1;
    let alpha = noise(i * 0.4, t * 0.8) * 120 + 40;
    fill(GOLD[0], GOLD[1], GOLD[2], alpha);
    ellipse(px, py, sz, sz);
  }

  // Central lens — the mirror at the heart
  let lensR = 60 + sin(t * 1.5) * 15;
  let lensAlpha = 15 + sin(t) * 10;
  noFill();
  stroke(INK[0], INK[1], INK[2], lensAlpha);
  strokeWeight(1.5);
  ellipse(midX, height / 2, lensR * 2, lensR * 2);
  stroke(GOLD[0], GOLD[1], GOLD[2], lensAlpha * 1.5);
  strokeWeight(0.5);
  ellipse(midX, height / 2, lensR * 2.3, lensR * 2.3);
}

function drawReachingForms(g, offset) {
  // Abstract clustered circles — half-formed ideas, tools not yet made
  for (let i = 0; i < 30; i++) {
    let x = noise(i * 0.7) * width;
    let y = noise(i * 0.7 + 50) * height;
    let r = noise(i * 0.5) * 30 + 5;
    let a = noise(i * 0.3) * 40 + 10;
    g.fill(COPPER[0], COPPER[1], COPPER[2], a);
    g.noStroke();
    g.ellipse(x, y, r * 2, r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  pg.background(WARM);
  pg.noStroke();
  drawReachingForms(pg, 0);
}
