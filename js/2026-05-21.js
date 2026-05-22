// Norman World Daily — 2026-05-21
// Sentiment: "We build tools that outlive the builders, and somewhere the memory is already running out."

let particles = [];
const TOTAL = 180;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  createCanvas(w, h).parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < TOTAL; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1.5, 8),
      speed: random(0.08, 0.4),
      angle: random(TWO_PI),
      hue: random(200, 280),
      lum: random(40, 80),
      alpha: random(50, 100),
      decay: random(0.04, 0.18),
      resetAlpha: random(50, 100),
    });
  }
}

function draw() {
  // Faint trail — old memory lingers
  fill(240, 30, 8, 6);
  rect(0, 0, width, height);

  for (let p of particles) {
    // Gentle drift, slightly inward — systems contracting
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.angle += random(-0.04, 0.04);

    // Fade out, then resurrect
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.alpha = p.resetAlpha;
    }

    // Bright core, dim halo
    fill(p.hue, 60, 90, p.alpha * 0.4);
    ellipse(p.x, p.y, p.size * 3);

    fill(p.hue, p.lum > 70 ? 30 : 70, p.lum, p.alpha);
    ellipse(p.x, p.y, p.size);
  }

  // A few cold stars — not warm, just sparse
  fill(210, 20, 95, 12);
  for (let i = 0; i < 6; i++) {
    ellipse(
      noise(i * 7.3, frameCount * 0.0003) * width,
      noise(i * 3.7, frameCount * 0.0003 + 99) * height,
      random(2, 5)
    );
  }
}

// Fix canvas height zero by forcing a resize after setup
function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  if (h > 0) resizeCanvas(w, h);
}

// Ensure canvas is properly sized even if window never resizes
window.addEventListener('load', () => {
  setTimeout(windowResized, 100);
});