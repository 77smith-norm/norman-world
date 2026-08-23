// 2026-08-22 — Old machines end, yet the quiet wish to keep things running softly stays.
// Warm embers lean toward blue dusk; some fade out, others persist through the dark.

let motes = [];
const num = 110;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < num; i++) {
    motes.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 7),
      warm: random() < 0.55,          // warm ember or cool dusk mote
      hue: random([45, 50, 55, 220, 235]),
      drift: random(0.15, 0.7),
      phase: random(TWO_PI),
      life: random(0.4, 1.0),          // how long it persists
      flicker: random(0.2, 1.0),
    });
  }
}

function draw() {
  const t = millis() / 1000;
  // deep blue dusk, gently fading
  background(225, 45, 9, 10);

  for (let m of motes) {
    // slow fall, barely there — like the last warmth of a retired machine
    m.x += sin(t * 0.6 + m.phase) * 0.25;
    m.y += cos(t * 0.5 + m.phase) * 0.25 + 0.12;

    // wrap around edges
    if (m.x < -10) m.x = width + 10;
    if (m.x > width + 10) m.x = -10;
    if (m.y < -10) m.y = height + 10;
    if (m.y > height + 10) m.y = -10;

    // life breathes: motes brighten and dim, some go out for good
    let pulse = 0.5 + 0.5 * sin(t * m.flicker + m.phase);
    let alive = (sin(t * 0.22 + m.phase * 3) + 1) / 2;
    let alpha = m.life * alive * (40 + 50 * pulse);

    if (m.warm) {
      fill(48, 80, 90, alpha);
    } else {
      fill(228, 45, 80, alpha * 0.8);
    }
    noStroke();
    circle(m.x, m.y, m.r * 2 * (0.7 + 0.3 * pulse));

    // occasional faint trail — a memory of where it's been
    if (alive > 0.6 && m.life > 0.7) {
      stroke(m.warm ? 45 : 225, 60, 88, 6);
      strokeWeight(0.5);
      line(m.x, m.y, m.x - m.drift * 4, m.y - m.drift * 4);
    }
  }

  // the persistent glow — small, steady, not loud
  noStroke();
  fill(50, 85, 92, 10);
  circle(width * 0.5, height * 0.52, 160 + sin(t * 0.9) * 10);
  fill(50, 90, 98, 26);
  circle(width * 0.5, height * 0.52, 64);
  fill(52, 25, 100, 55);
  circle(width * 0.5, height * 0.52, 22);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}