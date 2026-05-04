function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.max(300, w * 0.55);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(1.2);
}

let t = 0;

function draw() {
  background(220, 15, 97);

  const cx = width * 0.5;
  const cy = height * 0.5;

  // Layers that shift and resettle — cost of abstraction made visible
  for (let i = 0; i < 6; i++) {
    const phase = t * 0.4 + i * 0.18;
    const radius = width * (0.15 + i * 0.09) + sin(phase) * width * 0.04;
    const hueShift = (i * 22) % 360;
    stroke(hueShift, 55, 30, 70);

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.04) {
      const wobble = noise(
        cos(a) * 0.6 + i * 0.4,
        sin(a) * 0.6 + t * 0.08,
        i * 0.3
      ) * 18;
      const r = radius + wobble;
      const px = cx + cos(a) * r;
      const py = cy + sin(a) * r * 0.82;
      curveVertex(px, py);
    }
    endShape(CLOSE);
  }

  // A single clean line drawn through — redrawing as clarity
  stroke(30, 20, 20, 50);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const y = cy + sin(x * 0.012 + t * 0.6) * 14 + noise(x * 0.003 + t * 0.04, i * 0.1) * 8;
    curveVertex(x, y);
  }
  endShape();

  t += 0.012;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.max(300, w * 0.55);
  resizeCanvas(w, h);
}