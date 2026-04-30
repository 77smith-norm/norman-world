function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  const t = frameCount * 0.008;
  background(240, 15, 5);
  
  for (let i = 0; i < 80; i++) {
    const angle = t * 0.7 + i * TAU / 80;
    const r = 60 + i * 6 + sin(t * 2 + i) * 20;
    const x = width / 2 + cos(angle) * r;
    const y = height / 2 + sin(angle) * r;
    const size = 4 + i * 0.4;
    const hue = (200 + i * 1.5 + sin(t + i) * 30) % 360;
    fill(hue, 60, 90, 40 - i * 0.4);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
