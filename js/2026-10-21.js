// 2026-10-21
// Sentiment: "A tiny mind learns the world by pretending, until the pretending becomes a place you can live in."
// Abstract study: a soft field of light-cells that only come into being near a traveling caret.
// Nothing here is a character; the world is made of belief, one lit cell at a time.

let CELL = 22;
let cols, rows;
let t = 0;
let ripples = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  buildGrid();
  noStroke();
}

function buildGrid() {
  cols = ceil(width / CELL) + 1;
  rows = ceil(height / CELL) + 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}

function draw() {
  // dawn gradient — deep indigo up top, warm amber at the horizon
  const top = color(14, 16, 38);
  const bot = color(240, 168, 96);
  for (let y = 0; y < height; y += 4) {
    const p = y / height;
    stroke(lerpColor(top, bot, pow(p, 2.2)));
    line(0, y, width, y);
  }
  noStroke();

  const caretY = height * 0.62 - 40;
  const caret = ((t * 42) % (width + 160)) - 80;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * CELL;
      const y = j * CELL;

      // slow overlapping waves — the drift of imagined structure
      let v = 0;
      v += 0.34 * (0.5 + 0.5 * sin(i * 0.35 + t * 1.4));
      v += 0.30 * (0.5 + 0.5 * sin(j * 0.28 - t * 0.9));

      // the caret writes the world: cells brighten only near it
      const d = abs(x - caret) / 90 + abs(y - caretY) / 220;
      v += 0.55 * exp(-d * d);

      // ripples from each touch, decaying like a remembered place
      for (const r of ripples) {
        const rr = dist(x, y, r.x, r.y);
        const wave = sin(rr * 0.06 - r.age * 0.12);
        const atten = exp(-rr / (r.age * 3 + 40)) * exp(-r.age * 0.012);
        v += 0.6 * wave * atten;
      }

      v = constrain(v, 0, 1);

      const cool = color(150, 190, 255, v * 235);
      const warm = color(255, 214, 150, v * 235);
      fill(lerpColor(cool, warm, v));
      const s = CELL * (0.28 + 0.5 * v);
      rect(x - s / 2, y - s / 2, s, s, s * 0.35);
    }
  }

  // the caret itself — a single bright pulse at the edge of the known
  fill(255, 250, 235, 240);
  rect(caret - 1.5, caretY - 26, 3, 52, 2);

  for (const r of ripples) r.age++;
  ripples = ripples.filter((r) => r.age < 260);

  t += 1 / 60;
}

function mousePressed() {
  ripples.push({ x: mouseX, y: mouseY, age: 0 });
  if (ripples.length > 8) ripples.shift();
}
