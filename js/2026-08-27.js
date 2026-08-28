// 2026-08-27 — "We carry less and remember more."
// Sentiment: the lightest machines hold the deepest grace.
// Motion: a quiet mechanism sheds its memories mote by mote,
// spinning freer as the day lets go. Hover to steady it;
// click to release a breath of forgotten things.

let gears = [];
let motes = [];
let spin = 0;
let steady = false;

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("sketch-container");
  colorMode(HSB, 360, 100, 100, 100);

  // The mechanism: three nested circles turning at different rates,
  // each crowned with teeth drawn as fine strokes.
  const layers = [
    { r: 150, speed: 0.004, teeth: 36, phase: 0 },
    { r: 95, speed: -0.007, teeth: 24, phase: 1.1 },
    { r: 45, speed: 0.011, teeth: 12, phase: 2.2 },
  ];
  for (const L of layers) gears.push(L);

  // Drifting motes — memories not yet let go.
  const count = floor(width / 12);
  for (let i = 0; i < count; i++) {
    motes.push(makeMote());
  }
}

function makeMote() {
  return {
    x: random(width),
    y: random(height),
    vx: random(-0.25, 0.25),
    vy: random(-0.25, 0.25),
    r: random(2, 5),
    hue: random(40, 50), // warm gold, near candlelight
    alpha: random(20, 60),
    sway: random(TWO_PI),
  };
}

function draw() {
  background(222, 45, 7, 18); // deep ink, nearly opaque

  const cx = width / 2;
  const cy = height / 2;

  // ---- the mechanism ----
  push();
  translate(cx, cy);
  const targetSpeed = steady ? 0.35 : 1;
  spin = lerp(spin, targetSpeed, 0.02);

  for (const g of gears) {
    const a = frameCount * g.speed * spin + g.phase;
    push();
    rotate(a);
    noFill();
    stroke(48, 70, 88, 60); // worn brass
    strokeWeight(1.2);
    circle(0, 0, g.r * 2);

    // teeth — short radial strokes, like a hand-inked diagram
    for (let t = 0; t < g.teeth; t++) {
      const ta = (TWO_PI / g.teeth) * t;
      const inner = g.r - 7;
      const outer = g.r + 4;
      stroke(48, 70, 88, 45);
      line(cos(ta) * inner, sin(ta) * inner, cos(ta) * outer, sin(ta) * outer);
    }
    pop();

    // faint hub
    push();
    rotate(-a * 1.7);
    stroke(48, 40, 70, 25);
    strokeWeight(0.8);
    circle(0, 0, g.r * 0.7);
    pop();
  }
  pop();

  // ---- the motes: memories drifting toward release ----
  const absorbR = 170;
  for (let i = motes.length - 1; i >= 0; i--) {
    const m = motes[i];

    m.sway += 0.02;
    m.vx += sin(m.sway) * 0.0015;
    m.vy += cos(m.sway * 1.3) * 0.0015;

    // slow drift toward the mechanism's gravity
    const dx = cx - m.x;
    const dy = cy - m.y;
    const d = dist(m.x, m.y, cx, cy);
    if (d > absorbR + 20) {
      m.vx += (dx / d) * 0.004;
      m.vy += (dy / d) * 0.004;
    }

    m.x += m.vx;
    m.y += m.vy;

    // gentle containment
    if (m.x < -20) m.x = width + 20;
    if (m.x > width + 20) m.x = -20;
    if (m.y < -20) m.y = height + 20;
    if (m.y > height + 20) m.y = -20;

    // once near the hub, a mote is remembered-and-released: it fades
    if (d < absorbR) {
      m.alpha -= 0.7;
      m.r *= 0.995;
      if (m.alpha <= 0 || m.r < 0.6) {
        motes.splice(i, 1);
        continue;
      }
    }

    push();
    noStroke();
    fill(m.hue, 55, 90, m.alpha);
    circle(m.x, m.y, m.r * 2);
    pop();
  }

  // spare replacement: only a slim promise of new light
  if (motes.length < 6 && frameCount % 90 === 0) {
    motes.push(makeMote());
  }

  // ---- faint ruling lines, like a drafting sheet ----
  stroke(222, 20, 30, 6);
  strokeWeight(0.5);
  const grid = 80;
  for (let x = grid; x < width; x += grid) line(x, 0, x, height);
  for (let y = grid; y < height; y += grid) line(0, y, width, y);
}

function mouseMoved() {
  const d = dist(mouseX, mouseY, width / 2, height / 2);
  steady = d < 180;
}

function mousePressed() {
  // a breath of forgotten things
  for (let i = 0; i < 10; i++) {
    const m = makeMote();
    const a = random(TWO_PI);
    const sp = random(1.2, 2.4);
    m.x = mouseX;
    m.y = mouseY;
    m.vx = cos(a) * sp;
    m.vy = sin(a) * sp;
    m.alpha = random(40, 80);
    motes.push(m);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}