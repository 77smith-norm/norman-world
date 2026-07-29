// Demoscene cascade — neon wireframe geometry inspired by constraint-breeds-beauty
let t = 0;
const LAYERS = 5;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1.2);
}

function draw() {
  background(240, 30, 8, 0.08);
  translate(width / 2, height / 2);

  for (let i = 0; i < LAYERS; i++) {
    push();
    const phase = t * (0.3 + i * 0.12);
    const radius = (100 + i * 60) * (0.8 + 0.2 * sin(phase * 0.7));
    const hue = (280 + i * 35 + t * 20) % 360;
    const sides = 3 + i;
    const alpha = map(i, 0, LAYERS - 1, 0.6, 0.15);

    stroke(hue, 80, 90, alpha);
    rotate(phase * (i % 2 === 0 ? 1 : -1));

    beginShape();
    for (let j = 0; j <= sides; j++) {
      const angle = (TWO_PI / sides) * j;
      const wobble = sin(t * 1.5 + j * 0.8 + i) * 20;
      const r = radius + wobble;
      vertex(cos(angle) * r, sin(angle) * r);
    }
    endShape(CLOSE);

    // inner pulse
    const pulseR = radius * 0.4 * (0.5 + 0.5 * sin(t * 2 + i));
    stroke((hue + 60) % 360, 60, 100, alpha * 0.5);
    ellipse(0, 0, pulseR * 2, pulseR * 2);

    pop();
  }

  // scanline flicker
  if (random() < 0.03) {
    stroke(0, 0, 100, 0.04);
    const y = random(-height / 2, height / 2);
    line(-width / 2, y, width / 2, y);
  }

  t += 0.016;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
