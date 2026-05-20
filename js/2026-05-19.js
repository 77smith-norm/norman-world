// Norman World — 2026-05-19
// Theme: Museum of operating systems — preservation, memory, quiet curation

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth || windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(RGB, 255, 255, 255, 255);
  noStroke();
}

const windows = [];
const PALETTE = [
  [180, 210, 230], // win3.1 blue-gray
  [220, 200, 180], // mac classic beige
  [160, 190, 160], // motif green
  [200, 200, 220], // kde blue
  [190, 210, 180], // gnome green
  [230, 220, 190], // solaris gold
  [170, 180, 200], // bsd dark blue
];

for (let i = 0; i < 28; i++) {
  windows.push({
    x: random(width),
    y: random(height),
    w: random(60, 200),
    h: random(40, 130),
    vx: random(-0.25, 0.25),
    vy: random(-0.2, 0.2),
    col: PALETTE[i % PALETTE.length],
    alpha: random(100, 220),
    phase: random(TWO_PI),
    speed: random(0.003, 0.012),
  });
}

let t = 0;

function draw() {
  background(8, 10, 18);

  // Subtle vignette glow
  const vg = drawingContext.createRadialGradient(
    width / 2, height / 2, height * 0.1,
    width / 2, height / 2, height * 0.8
  );
  vg.addColorStop(0, 'rgba(30,40,70,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  drawingContext.fillStyle = vg;
  drawingContext.fillRect(0, 0, width, height);

  for (let i = 0; i < windows.length; i++) {
    const w = windows[i];
    const pulse = sin(t * w.speed * 60 + w.phase) * 0.12 + 0.88;

    // Window blur glow
    for (let g = 3; g >= 1; g--) {
      fill(w.col[0], w.col[1], w.col[2], w.alpha * 0.04 * g);
      rect(w.x - w.w / 2 - g * 2, w.y - w.h / 2 - g * 2,
           w.w + g * 4, w.h + g * 4, 4);
    }

    // Window body
    fill(w.col[0], w.col[1], w.col[2], w.alpha * pulse);
    stroke(255, 255, 255, 30);
    strokeWeight(1);
    rect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h, 3);

    // Title bar
    noStroke();
    fill(w.col[0] + 30, w.col[1] + 30, w.col[2] + 30, w.alpha * pulse);
    rect(w.x - w.w / 2, w.y - w.h / 2, w.w, 12, 3, 3, 0, 0);

    // Inner content lines
    const lineCount = floor(random(2, 6));
    for (let l = 0; l < lineCount; l++) {
      const lx = w.x - w.w / 2 + 6;
      const lw = w.w - 12;
      const ly = w.y - w.h / 2 + 18 + l * 7;
      fill(w.col[0] - 20, w.col[1] - 20, w.col[2] - 20, w.alpha * 0.5 * pulse);
      rect(lx, ly, lw * random(0.3, 0.9), 3, 1);
    }

    // Hover repulsion from mouse
    if (mouseX > 0 && mouseY > 0) {
      const dx = w.x - mouseX;
      const dy = w.y - mouseY;
      const dist = sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.8;
        w.vx += (dx / dist) * force * 0.02;
        w.vy += (dy / dist) * force * 0.02;
      }
    }

    // Damping
    w.vx *= 0.98;
    w.vy *= 0.98;

    // Speed cap
    const spd = sqrt(w.vx * w.vx + w.vy * w.vy);
    if (spd > 1.2) {
      w.vx = (w.vx / spd) * 1.2;
      w.vy = (w.vy / spd) * 1.2;
    }

    w.x += w.vx;
    w.y += w.vy;

    // Wrap edges
    if (w.x < -w.w) w.x = width + w.w;
    if (w.x > width + w.w) w.x = -w.w;
    if (w.y < -w.h) w.y = height + w.h;
    if (w.y > height + w.h) w.y = -w.h;
  }

  t += deltaTime * 0.001;
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, Math.max(400, windowHeight * 0.6));
}
