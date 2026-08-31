// 2026-08-30 — Care is quiet magic: it turns small ordinary things into little worlds worth keeping.
// Abstract study: tiny dormant worlds bloom when tended. The cursor is the caretaker.
// Palette: amber light, dusk indigo, gold. Rhythm: slow breathing pulse.

let worlds = [];
const COUNT = 90;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  for (let i = 0; i < COUNT; i++) {
    worlds.push({
      x: random(width),
      y: random(height),
      r: random(2, 9),
      phase: random(TWO_PI),
      speed: random(0.0004, 0.0012),
      driftX: random(-0.15, 0.15),
      driftY: random(-0.15, 0.15),
      hue: random(28, 48), // amber to gold
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(14, 16, 34, 40); // dusk indigo, slow fade trails

  let care = dist(mouseX, mouseY, width / 2, height / 2) < 1 ? 0.6 : 0;
  for (let w of worlds) {
    w.x += w.driftX + sin(millis() * w.speed + w.phase) * 0.2;
    w.y += w.driftY + cos(millis() * w.speed * 1.3 + w.phase) * 0.2;

    let d = dist(mouseX, mouseY, w.x, w.y);
    let attention = constrain(1 - d / 220, 0, 1); // nearness of care
    let breathe = 0.72 + 0.28 * sin(millis() * w.speed * 6 + w.phase);
    let bloom = w.r * (breathe + attention * 1.8);
    let glow = attention * 60;

    // amber halo when tended
    if (attention > 0.02) {
      noStroke();
      fill(255, 190, 90, glow * 0.5);
      circle(w.x, w.y, bloom * 3.2);
    }

    noStroke();
    colorMode(HSB, 360, 100, 100, 100);
    fill(w.hue, 45, 88, 60 + attention * 40);
    circle(w.x, w.y, bloom * 2);
    // tiny golden core — every small thing has a center worth keeping
    fill(45, 70, 100, 70 + attention * 30);
    circle(w.x, w.y, bloom * 0.55);
    colorMode(RGB, 255, 255, 255, 255);

    // faint orbit ring on tended worlds: the miniature world's horizon
    if (attention > 0.3) {
      stroke(255, 205, 120, attention * 90);
      strokeWeight(0.8);
      noFill();
      circle(w.x, w.y, bloom * 3.6);
      noStroke();
    }
  }

  // the caretaker's own quiet light
  noStroke();
  for (let i = 4; i > 0; i--) {
    fill(255, 214, 130, 8 * i);
    circle(mouseX, mouseY, i * 26);
  }
}