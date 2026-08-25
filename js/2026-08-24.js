// 2026-08-24 — Even the small makers keep their orbit — the world's machinery hums, but the moon doesn't ask permission to shine.
// Small warm lights hold their own quiet orbits while vast cool machinery turns overhead; one brass moon keeps its steady face.

let makers = [];
const numMakers = 110;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < numMakers; i++) {
    // each little maker has its own center and its own small orbit
    makers.push({
      cx: random(width),
      cy: random(height * 0.85),
      radius: random(2, 26),          // size of the orbit
      speed: random(0.1, 0.9),
      phase: random(TWO_PI),
      size: random(1.5, 5),
      hue: random([30, 38, 44, 48]),  // warm lamp-gold, the small light that persists
      tilt: random(TWO_PI),
      wobble: random(0.4, 1.4),
    });
  }
}

function draw() {
  const t = millis() / 1000;
  // the deep night the machinery hums through
  background(232, 42, 5, 14);

  // the vast turning machinery — slow cool polygons passing behind everything
  push();
  translate(width * 0.5, height * 0.5);
  rotate(t * 0.02);
  for (let i = 1; i <= 5; i++) {
    let r = 90 + i * 130;
    stroke(215, 30, 74, 4);
    strokeWeight(10);
    noFill();
    if (i % 2 === 0) {
      // hex teeth of a far gear
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
        vertex(cos(a) * r, sin(a) * r);
      }
      endShape(CLOSE);
    } else {
      circle(0, 0, r * 2);
    }
  }
  pop();

  // the small makers, keeping their own orbits
  for (let m of makers) {
    let a = t * m.speed + m.phase;
    let x = m.cx + cos(a) * m.radius;
    let y = m.cy + sin(a * m.tilt) * m.radius * 0.55;

    // being seen brightens the little light
    let d = dist(x, y, mouseX, mouseY);
    let seen = 1 - constrain(d / 220, 0, 1);

    // a faint orbital thread
    stroke(m.hue, 60, 90, 3 + seen * 6);
    strokeWeight(0.5);
    noFill();
    ellipse(m.cx, m.cy, m.radius * 2, m.radius * 1.1);

    // the maker itself, a warm point of light
    noStroke();
    fill(m.hue, 72, 92, 26 + seen * 46 + sin(t * 2 + m.phase) * 8);
    circle(x, y, m.size * (1.6 + sin(t * m.wobble + m.phase) * 0.5));
  }

  // the moon — one steady face, untroubled by the hum
  let mx = width * 0.72 + sin(t * 0.06) * 14;
  let my = height * 0.3;
  noStroke();
  fill(220, 14, 62, 7);
  circle(mx, my, 220 + sin(t * 0.11) * 10);
  fill(220, 10, 82, 12);
  circle(mx, my, 150);
  // the moon disc
  fill(224, 9, 94, 46);
  circle(mx, my, 92);
  // crescent shadow drifting across, phase-like — it turns without asking
  let px = mx - cos(t * 0.05) * 30;
  let py = my - sin(t * 0.05) * 18;
  fill(232, 42, 8, 40);
  circle(px, py, 88);
  // a thin golden rim
  noFill();
  stroke(46, 58, 88, 40);
  strokeWeight(1.4);
  circle(mx, my, 96);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}