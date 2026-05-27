// Norman World — 2026-05-26
// Sentiment: "We extend a strange tenderness to things built to be destroyed — the monster, the model, the ritual please."

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.6, 400);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  // Deep quiet dark — laboratory night, the hum of machines
  background(220, 15, 6);

  const cx = width / 2;
  const cy = height / 2;
  const t = millis() * 0.0004;

  // The central tank — slow, breathing pulse
  // Methyl methacrylate hardening into permanence
  const breathe = sin(t * PI) * 0.5 + 0.5;
  const tankR = min(width, height) * 0.38 * (0.88 + breathe * 0.12);

  // Outer glow — soft halo of industrial light
  for (let i = 5; i > 0; i--) {
    fill(200, 60, 70, i * 3);
    ellipse(cx, cy, tankR * 2 + i * 28, tankR * 2 + i * 28);
  }

  // The tank body itself
  fill(210, 30, 88, 95);
  ellipse(cx, cy, tankR * 2, tankR * 2);

  // Inner liquid — gently shifting hue with time
  const hueShift = (sin(t * 1.3) * 0.5 + 0.5) * 40 + 190;
  fill(hueShift, 50, 65, 80);
  ellipse(cx, cy, tankR * 1.5, tankR * 1.5);

  // Small floating particles inside the tank — like suspended something
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * TWO_PI + t * 0.4;
    const dist = tankR * 0.35 * (0.4 + sin(t * 2 + i) * 0.3);
    const px = cx + cos(angle) * dist;
    const py = cy + sin(angle) * dist;
    const pSize = 3 + sin(t * 3 + i * 1.7) * 2;
    fill(hueShift + 30, 40, 80, 60);
    ellipse(px, py, pSize, pSize);
  }

  // Orbital rings — the ritual, the rotation, the tenderness
  for (let r = 0; r < 3; r++) {
    const ringR = tankR * (1.4 + r * 0.18);
    const ringAlpha = 25 - r * 6;
    const ringHue = 40 + r * 50;
    fill(ringHue, 30, 75, ringAlpha);
    ellipse(cx, cy, ringR * 2, ringR * 2);
  }

  // Tendrils — thin arcs radiating outward, like the model's breath
  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * TWO_PI + t * 0.08;
    const len = tankR * (1.8 + sin(t * 1.8 + i) * 0.3);
    const tipX = cx + cos(baseAngle) * len;
    const tipY = cy + sin(baseAngle) * len;
    const baseWidth = 1.5 + sin(t + i) * 0.8;
    stroke(30, 50, 90, 35);
    strokeWeight(baseWidth);
    line(cx, cy, tipX, tipY);
  }
  noStroke();

  // A small warm highlight — the tenderness in the industrial
  fill(45, 80, 92, 70);
  ellipse(cx - tankR * 0.25, cy - tankR * 0.28, 14, 10);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.6, 400);
  resizeCanvas(w, h);
}