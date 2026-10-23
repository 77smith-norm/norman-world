// 2026-10-22
// Sentiment: "Every mind agrees on the shape of us from far away; only walking the near ground tells us anything new."
// Abstract study: a walking-radius field — concentric rings of reach that only resolve into detail near a roaming home point.
// Nothing here is a character; the map is made of nearness, not of shapes.

let NODES = [];
let RINGS = 7;
let t = 0;
let home = { x: 0, y: 0 };
let visited = [];

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  pixelDensity(1);
  home = { x: width * 0.5, y: height * 0.55 };
  seedNodes();
}

function seedNodes() {
  NODES = [];
  const n = floor((width * height) / 26000);
  for (let i = 0; i < n; i++) {
    NODES.push({
      x: random(width),
      y: random(height),
      ph: random(TWO_PI),
      r: random(0.6, 2.4),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedNodes();
}

// smooth step toward the pointer — the home point wanders rather than jumps
function draw() {
  const top = color(18, 20, 34);
  const bot = color(236, 156, 92);
  for (let y = 0; y < height; y += 3) {
    const p = y / height;
    stroke(lerpColor(top, bot, pow(p, 2.0)));
    line(0, y, width, y);
  }
  noStroke();

  const target = visited.length ? visited[visited.length - 1] : { x: mouseX || width * 0.5, y: mouseY || height * 0.55 };
  home.x = lerp(home.x, target.x, 0.045);
  home.y = lerp(home.y, target.y, 0.045);

  // the walk itself — an arm's reach that turns as it grows
  const maxReach = max(width, height) * 0.62;
  noFill();
  for (let i = RINGS; i >= 1; i--) {
    const base = (i / RINGS) * maxReach;
    const breathe = 16 * sin(t * 0.5 - i * 0.6);
    const r = base + breathe;
    const a = 90 / i;
    stroke(255, 236, 204, a);
    strokeWeight(1.1);
    beginShape();
    for (let ang = 0; ang <= TWO_PI + 0.02; ang += 0.06) {
      const wobble = 10 * sin(ang * 3 + t * 0.7 + i) + 6 * sin(ang * 5 - t * 0.4);
      vertex(home.x + (r + wobble) * cos(ang), home.y + (r + wobble) * sin(ang));
    }
    endShape(CLOSE);
  }
  noStroke();

  // places resolve only near the home point; distance washes them out
  for (const nd of NODES) {
    const d = dist(nd.x, nd.y, home.x, home.y);
    const near = exp(-d / 190);
    const pulse = 0.5 + 0.5 * sin(t * 1.5 + nd.ph);
    const v = constrain(near * (0.55 + 0.45 * pulse), 0, 1);
    if (v < 0.02) continue;
    fill(lerpColor(color(150, 190, 255), color(255, 222, 168), v), v * 235);
    const s = nd.r * (1 + 3.6 * v);
    ellipse(nd.x, nd.y, s, s);
  }

  // the home point: a small steady lamp at the center of the known
  fill(255, 250, 232, 235);
  ellipse(home.x, home.y, 5, 5);
  fill(255, 236, 200, 120);
  ellipse(home.x, home.y, 22 + 4 * sin(t * 2), 22 + 4 * sin(t * 2));

  // a slow walk trace — the near ground written one step at a time
  visited = visited.filter((v) => ++v.age < 320);
  for (const v of visited) {
    const a = exp(-v.age * 0.012) * 60;
    fill(255, 244, 214, a);
    ellipse(v.x, v.y, 3, 3);
  }

  t += 1 / 60;
}

function mousePressed() {
  visited.push({ x: mouseX, y: mouseY, age: 0 });
  if (visited.length > 24) visited.shift();
}
