// 2026-09-28 — "The oldest things keep running quietly, while new growth
// coils into spirals no one taught it."
//
// Abstract p5 sketch. Seeds fall one by one along the golden angle, coiling
// outward into a phyllotactic spiral — the way a sunflower head, a pinecone,
// or a stubborn old machine fills its allotted space. The spiral turns slowly
// and breathes; the pointer warms whatever it comes near, pulling faint amber
// light out of the dim. Nothing is drawn as a figure — only points, angle, and
// the quiet arithmetic of growth.

let seeds = [];
let goldenAngle = PI * (3 - sqrt(5));
let n = 0;
let t = 0;
let cx, cy;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(28);
  randomSeed(28);
  cx = width * 0.5;
  cy = height * 0.5;
  for (let i = 0; i < 900; i++) addSeed();
}

function addSeed() {
  n += 1;
  const r = 4.4 * sqrt(n);
  const a = n * goldenAngle;
  seeds.push({
    r,
    a,
    x: cx + cos(a) * r,
    y: cy + sin(a) * r,
    born: 0,
  });
}

function draw() {
  background(10, 11, 17);
  t += 1;
  cx = lerp(cx, width * 0.5, 0.05);
  cy = lerp(cy, height * 0.5, 0.05);

  // Continuous, unhurried growth: a few new points each breath.
  if (frameCount % 3 === 0 && n < 4200) addSeed();

  const px = mouseX;
  const py = mouseY;
  const hand = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  noStroke();
  const drift = t * 0.012;

  for (const s of seeds) {
    if (s.born < 1) s.born = min(1, s.born + 0.02);
    const a = s.a + drift;
    const x = cx + cos(a) * s.r;
    const y = cy + sin(a) * s.r;
    s.x = x;
    s.y = y;

    // Warmth blooms near the hand; otherwise the spiral stays cool.
    let warm = 0;
    if (hand) {
      const d = dist(x, y, px, py);
      warm = max(0, 1 - d / 200);
    }
    // A slow inner-to-outer gradient, so the spiral glows where it is oldest.
    const quiet = constrain(1 - s.r / (4.4 * sqrt(4200)), 0, 1);

    const base = lerpColor(
      color(150, 175, 215), // cool machine blue
      color(244, 196, 110), // warm amber seed
      warm
    );
    base.setAlpha((40 + 150 * quiet) * s.born);
    fill(base);
    circle(x, y, 2 + 3.2 * quiet + warm * 2.5);
  }

  // A faint pulse of ring-light where the hand rests — attention, not a figure.
  if (hand) {
    noFill();
    stroke(255, 224, 170, 40);
    strokeWeight(1);
    circle(px, py, 60 + sin(t * 0.06) * 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
