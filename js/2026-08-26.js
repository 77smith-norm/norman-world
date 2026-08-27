// 2026-08-26 — Even the open rooms get folded into larger houses — yet someone keeps the door lit, and the quiet work goes on.
// A dusk-tunnel of nested archways: a relay of small bulbs hands light from room to room, dimming one by one, until only the far door is left burning.

const fract = (v) => v - Math.floor(v);
const easeInOut = (v) => v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;

let motes = [];
const numMotes = 90;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < numMotes; i++) {
    motes.push({
      x: random(width),
      y: random(height),
      z: random(0.3, 1),
      drift: random(0.2, 0.8),
      phase: random(TWO_PI),
    });
  }
}

function draw() {
  const t = millis() / 1000;

  // deep dusk, held still
  background(229, 46, 6);

  // the viewer's gaze becomes the vanishing point — the door waits where we look
  const vx = mouseX || width * 0.5;
  const vy = mouseY || height * 0.44;

  // nested archways — rooms folded into rooms, receding toward the door
  const layers = 9;
  for (let i = layers; i >= 1; i--) {
    const p = i / layers;                      // 0 far .. 1 near
    const w = width * (0.16 + p * 0.78);
    const h = height * (0.14 + p * 0.9);
    const x = vx - w / 2;
    const y = vy - h * 0.42;

    // the relay of light: brightness hands outward, room by room
    const wave = fract(t * 0.14 - i * 0.11);   // 0..1, dim→lit
    const lit = easeInOut(wave);
    const hue = lerp(226, 46, lit);            // indigo → amber as it lights
    const bri = 8 + lit * 52;

    noFill();
    stroke(hue, 70, bri, 30 + p * 30);
    strokeWeight(1 + p * 2.5);
    rect(x, y, w, h, 8 + p * 14);

    // the bulb above each room, going dark or coming back to life
    const glow = lit * lit;
    fill(hue, 78, 30 + glow * 66, 26 + glow * 40);
    noStroke();
    circle(vx, y - height * 0.02, 3 + p * 5 + glow * 14);
  }

  // the far door — the smallest room, never left dark
  const doorW = max(26, width * 0.045);
  const breath = 0.75 + 0.25 * sin(t * 1.1);
  noStroke();
  fill(46, 88, 62, 90 * breath);
  rect(vx - doorW / 2, vy - doorW * 0.6, doorW, doorW * 1.15, 3);
  fill(46, 90, 78, 70 * breath);
  rect(vx - doorW * 0.28, vy - doorW * 0.42, doorW * 0.56, doorW * 0.95, 2);

  // dust drifting through the last amber light
  for (const m of motes) {
    const tw = 0.5 + 0.5 * sin(t * m.drift + m.phase);
    const d = dist(vx, vy, m.x, m.y);
    const near = constrain(1 - d / (width * 0.5), 0, 1);
    fill(46, 40, 80, 8 + near * tw * 34);
    circle(m.x + sin(t * 0.3 + m.phase) * 12, m.y + cos(t * 0.22 + m.phase) * 8, m.z * (1.2 + tw));
  }

  // a faint hairlike line stitching the rooms together — the quiet work
  noFill();
  stroke(44, 55, 88, 16);
  strokeWeight(1);
  beginShape();
  for (let x = 0; x <= width; x += 16) {
    const wob = sin(x * 0.01 + t * 0.55) * 10 + sin(x * 0.027 - t * 0.8) * 6;
    vertex(x, height * 0.9 + wob);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}