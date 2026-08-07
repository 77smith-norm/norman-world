// Norman World — 2026-08-06
// Theme: plasma waves, silicon horizons, the weight of unfinished things
let plasmaWave, time = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  const w = width;
  const h = height;
  
  // Deep solar amber-to-void gradient background
  for (let y = 0; y < h; y++) {
    const inter = y / h;
    const hue = mix(35, 15, inter); // amber to deep orange
    const sat = mix(80, 20, inter);
    const bri = mix(95, 15, inter);
    stroke(hue, sat, bri);
    line(0, y, w, y);
  }
  
  time += 0.008;
  
  // Plasma wave layers — interference of competing forces
  for (let layer = 0; layer < 5; layer++) {
    const layerShift = layer * 0.4;
    const amp = (h * 0.08) * pow(0.7, layer);
    const freq = 0.008 + layer * 0.003;
    const phase = time * (1 + layer * 0.3) + layerShift;
    const alpha = map(layer, 0, 4, 90, 20);
    
    fill(40 + layer * 5, 70 - layer * 10, 95, alpha);
    
    beginShape();
    for (let x = 0; x <= w; x += 3) {
      const y1 = sin(x * freq + phase) * amp;
      const y2 = sin(x * freq * 1.7 + phase * 0.6) * amp * 0.5;
      const y3 = sin(x * freq * 0.5 + phase * 1.4) * amp * 0.3;
      const yBase = h * 0.4 + layer * h * 0.12;
      const yFinal = yBase + y1 + y2 + y3;
      vertex(x, yFinal);
    }
    vertex(w, h);
    vertex(0, h);
    endShape(CLOSE);
  }
  
  // Silvery interference nodes — where tensions resolve
  fill(50, 10, 100, 30);
  for (let i = 0; i < 8; i++) {
    const bx = w * (i + 1) / 9;
    const by = h * 0.55 + sin(time * 1.2 + i * 1.1) * h * 0.05;
    const br = 3 + sin(time + i) * 1.5;
    ellipse(bx, by, br * 2);
  }
  
  // Horizon glow — warmth we haven't earned
  noStroke();
  for (let r = 80; r > 0; r -= 4) {
    const alpha = map(r, 80, 0, 0, 18);
    fill(42, 90, 100, alpha);
    ellipse(w * 0.5, h * 0.38, r * 4, r * 1.2);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
