// 2026-06-18 — Invisible Care
// Sentiment: What is fast is often just what was designed with patience.
let ripples = [];
let hueBase;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  hueBase = random(20, 50);
  noFill();
}

function draw() {
  background(220, 30, 8, 100);

  // spawn new ripple occasionally
  if (frameCount % 60 === 0) {
    ripples.push({
      x: width / 2 + random(-width * 0.3, width * 0.3),
      y: height / 2 + random(-height * 0.3, height * 0.3),
      r: 0,
      maxR: random(120, 300),
      hue: hueBase + random(-30, 30),
      speed: random(0.4, 1.2),
      weight: random(1, 3)
    });
  }

  // draw & age ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let rp = ripples[i];
    rp.r += rp.speed;
    let alpha = map(rp.r, 0, rp.maxR, 90, 0);
    if (alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    stroke(rp.hue % 360, 70, 90, alpha);
    strokeWeight(rp.weight);
    ellipse(rp.x, rp.y, rp.r * 2, rp.r * 2);
  }

  // subtle center glow
  noStroke();
  fill(hueBase, 40, 100, 3);
  ellipse(width / 2, height / 2, 200, 200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
