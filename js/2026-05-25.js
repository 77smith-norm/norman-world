// Norman World — 2026-05-25
// Sentiment: "Even the best secrets are built to be shared — and in that trust,
// something worth protecting becomes worth building."
// Theme: fragments of light that can be separated and reunited — division, trust, wholeness

let fragments = [];
const FRAG_COUNT = 7;

function setup() {
  const container = document.getElementById('sketch-container');
  const cnv = createCanvas(container.offsetWidth, container.offsetHeight);
  cnv.parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 100);

  for (let i = 0; i < FRAG_COUNT; i++) {
    fragments.push({
      ox: random(width),
      oy: random(height),
      x: random(width),
      y: random(height),
      size: random(18, 42),
      hue: random(30, 55),
      phase: random(TWO_PI),
      speed: random(0.006, 0.018),
      pulled: false,
      returnEase: 0.04,
    });
  }
}

function draw() {
  clear();
  background(230, 30, 6);

  // Draw connecting threads between fragments that are close enough
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      const a = fragments[i];
      const b = fragments[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 180) {
        const alpha = map(d, 0, 180, 70, 5);
        stroke(a.hue, 60, 70, alpha);
        strokeWeight(0.8);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // Update and draw fragments
  noStroke();
  for (let f of fragments) {
    if (f.pulled) {
      f.x = lerp(f.x, mouseX, 0.07);
      f.y = lerp(f.y, mouseY, 0.07);
    } else {
      f.x = lerp(f.x, f.ox + sin(frameCount * f.speed + f.phase) * 18, f.returnEase);
      f.y = lerp(f.y, f.oy + cos(frameCount * f.speed * 0.7 + f.phase) * 12, f.returnEase);
    }

    // Glow
    for (let r = 4; r > 0; r--) {
      fill(f.hue, 65, 75, 8 - r * 1.8);
      ellipse(f.x, f.y, f.size * r * 0.5, f.size * r * 0.5);
    }
    fill(f.hue, 50, 92);
    ellipse(f.x, f.y, f.size, f.size);

    // Bright core
    fill(f.hue, 30, 98);
    ellipse(f.x, f.y, f.size * 0.3, f.size * 0.3);
  }

  // Draw a "whole" form when all fragments are near center
  const allNear = fragments.every(f => dist(f.x, f.y, width / 2, height / 2) < 80);
  if (allNear) {
    noFill();
    stroke(48, 70, 90, 40);
    strokeWeight(1.5);
    const pulse = sin(frameCount * 0.04) * 6;
    ellipse(width / 2, height / 2, 100 + pulse, 100 + pulse);
  }
}

function mousePressed() {
  for (let f of fragments) {
    if (dist(mouseX, mouseY, f.x, f.y) < f.size * 1.2) {
      f.pulled = true;
    }
  }
}

function mouseReleased() {
  for (let f of fragments) {
    f.pulled = false;
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
  // Re-spread original positions across new dimensions
  for (let f of fragments) {
    f.ox = random(width);
    f.oy = random(height);
  }
}