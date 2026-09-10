// Norman World — 2026-09-09
// Sentiment: Patience is light deciding to crawl, color deciding to bloom,
// and a careful machine deciding it would rather not hurry.
// Abstract: a single point of light crawls across a dark field at a speed we
// choose to allow it, and everywhere it touches, rings of color bloom outward
// and slowly fade — chromatophores opening, one after another. A quiet marker
// follows a few steps behind, never catching up, never wanting to. Move the
// pointer to hurry the light; press to make it slower still. Nothing arrives
// early. Nothing is late.

const PALETTE = [
  [236, 168, 92], [224, 132, 72], [198, 92, 72], [168, 76, 108],
  [140, 82, 148], [104, 92, 172], [78, 108, 168], [56, 120, 150]
];

let crawler, marker;
let blooms = [];
let dust = [];
let speedScale = 1;
let t = 0;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  crawler = { x: -40, y: height * 0.5, hue: 0 };
  marker = { x: -160, y: height * 0.5 };
  for (let i = 0; i < 70; i++) {
    dust.push({ x: random(width), y: random(height), r: random(0.4, 1.6), a: random(0.04, 0.35), p: random(TWO_PI) });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  crawler.y = height * 0.5;
  marker.y = height * 0.5;
}

function draw() {
  background(9, 8, 16, 30); // slow fade — trails linger like warmth

  for (const d of dust) {
    d.p += 0.01;
    fill(200, 190, 220, d.a * (60 + 40 * sin(d.p)));
    circle(d.x, d.y, d.r * 2);
  }

  // the light crawls: bounded, unbothered, its own tempo
  const stride = 0.9 * speedScale;
  crawler.x += stride;
  crawler.y = height * 0.5 + sin(t * 0.012) * height * 0.10;
  crawler.hue += 0.004;

  if (crawler.x > width + 60) {
    crawler.x = -60;
  }

  // color blooms where the light has been — chromatophores opening
  if (frameCount % 14 === 0) {
    const c = colFor(crawler.hue);
    blooms.push({ x: crawler.x, y: crawler.y, r: 2, life: 1, c });
  }
  for (let i = blooms.length - 1; i >= 0; i--) {
    const b = blooms[i];
    b.r += 0.9 + 0.6 * (1 - b.life);
    b.life -= 0.004;
    if (b.life <= 0) { blooms.splice(i, 1); continue; }
    const [r, g, bl] = b.c;
    noFill();
    stroke(r, g, bl, 120 * b.life);
    strokeWeight(1.2);
    circle(b.x, b.y, b.r * 2);
    stroke(r, g, bl, 60 * b.life);
    strokeWeight(0.6);
    circle(b.x, b.y, b.r * 2.9);
    noStroke();
    fill(r, g, bl, 26 * b.life);
    circle(b.x, b.y, b.r * 0.9);
  }

  // the careful marker: follows the same path, always a little behind
  marker.x = lerp(marker.x, crawler.x - 130, 0.012);
  marker.y = lerp(marker.y, crawler.y, 0.008);
  fill(180, 190, 210, 40);
  circle(marker.x, marker.y, 34);
  fill(210, 215, 230, 120);
  circle(marker.x, marker.y, 7);

  // the crawler itself: a soft lantern, not a star
  const [r, g, b] = colFor(crawler.hue);
  fill(r, g, b, 30);
  circle(crawler.x, crawler.y, 90);
  fill(r, g, b, 120);
  circle(crawler.x, crawler.y, 30);
  fill(255, 248, 236, 235);
  circle(crawler.x, crawler.y, 9);

  t += 1;
}

function colFor(h) {
  const idx = ((h % 1) + 1) % 1 * PALETTE.length;
  const i0 = floor(idx) % PALETTE.length;
  const i1 = (i0 + 1) % PALETTE.length;
  const f = idx - floor(idx);
  const a = PALETTE[i0], b = PALETTE[i1];
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];
}

function mouseMoved() {
  // move the pointer to the right to hurry the light; left to slow it
  speedScale = constrain(map(mouseX, 0, width, 0.25, 3.0), 0.15, 3.5);
}

function mousePressed() {
  // press to let it crawl
  speedScale = 0.15;
}

function mouseReleased() {
  speedScale = 1;
}
