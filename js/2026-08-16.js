// Norman World Daily — 2026-08-16
// Sentiment: "Not every thought deserves a vote; the loudest ones usually pull toward the edges, away from what quietly matters."
// Theme: overthinking, permanent periphery, quiet resilient connection

let thoughts = [];
const MAX_THOUGHTS = 70;
let bgHue = 228;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < MAX_THOUGHTS; i++) {
    thoughts.push(new Thought(random(width), random(height)));
  }
}

function draw() {
  // Dusk indigo fade — layered for depth
  fill(bgHue, 16, 7, 30);
  rect(0, 0, width, height);
  bgHue = (bgHue + 0.03) % 360;

  const cx = width / 2, cy = height / 2;

  for (let i = 0; i < thoughts.length; i++) {
    const t = thoughts[i];

    // Loud thoughts drift outward toward the edges; quiet ones settle near center
    const dc = dist(t.x, t.y, cx, cy);
    const loudness = t.noise; // 0..1
    const edgePull = loudness * (dc < 120 ? 0.003 : 0.0006);
    t.vx += (t.x - cx) * edgePull * 0.02;
    t.vy += (t.y - cy) * edgePull * 0.02;

    // Quiet thoughts held gently by the center
    if (loudness < 0.35 && dc > 140) {
      t.vx += (cx - t.x) * 0.0005;
      t.vy += (cy - t.y) * 0.0005;
    }

    // Mouse presence calms nearby thoughts — attention quiets the noise
    if (mouseX > 0 && mouseY > 0) {
      const dm = dist(t.x, t.y, mouseX, mouseY);
      if (dm < 160) {
        t.noise = max(0, t.noise - 0.004);
        t.vx += (mouseX - t.x) * 0.00006;
        t.vy += (mouseY - t.y) * 0.00006;
      }
    }

    // Slow noise drift — restlessness
    t.noise = constrain(t.noise + (noise(t.seed, frameCount * 0.004) - 0.5) * 0.02, 0.05, 0.95);

    t.phase += t.phaseSpeed;
    t.vx *= 0.97;
    t.vy *= 0.97;
    t.x += t.vx;
    t.y += t.vy;

    // Soft bounce at edges
    if (t.x < 0) { t.x = 0; t.vx *= -0.5; }
    if (t.x > width) { t.x = width; t.vx *= -0.5; }
    if (t.y < 0) { t.y = 0; t.vy *= -0.5; }
    if (t.y > height) { t.y = height; t.vy *= -0.5; }

    // Threads to nearest neighbor — quiet connection
    if (frameCount % 3 === 0) {
      let nearest = null, nd = Infinity;
      for (let j = i + 1; j < thoughts.length; j++) {
        const d = dist(t.x, t.y, thoughts[j].x, thoughts[j].y);
        if (d < nd) { nd = d; nearest = thoughts[j]; }
      }
      if (nearest && nd < 110) {
        // Threads glow warm where both thoughts are quiet
        const calm = (1 - t.noise) * (1 - nearest.noise);
        stroke(40, 55, 82, 6 + calm * 26);
        strokeWeight(0.5);
        line(t.x, t.y, nearest.x, nearest.y);
        noStroke();
      }
    }

    // Loud thoughts: bright amber, restless pulse; quiet ones: soft white, steady
    const pulse = sin(t.phase) * 0.5 + 0.5;
    if (t.noise > 0.6) {
      fill(38, 62, 88, 26 + t.noise * 40 + pulse * 14);
      circle(t.x, t.y, 2.5 + t.noise * 7 + pulse * 1.5);
    } else {
      fill(210, 8, 92, 24 + (1 - t.noise) * 45 + pulse * 10);
      circle(t.x, t.y, 2 + (1 - t.noise) * 3.5 + pulse);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Thought {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.4, 0.4);
    this.vy = random(-0.4, 0.4);
    this.noise = random(0.05, 0.95);
    this.seed = random(1000);
    this.phase = random(TWO_PI);
    this.phaseSpeed = random(0.012, 0.04);
  }
}