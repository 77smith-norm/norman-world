// Norman World — March 31, 2026
// "Probabilistic chaos, held in deterministic hands."

let particles = [];
const NUM_PARTICLES = 3000;
let t = 0;
let fieldScale = 0.004;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      hue: random(120, 200),
      size: random(1, 3.5),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  // Accumulate trails with very low alpha for persistence
  drawingContext.fillStyle = 'rgba(5, 5, 15, 0.045)';
  drawingContext.fillRect(0, 0, width, height);

  t += 0.004;

  // Turbulence decreases over time, order emerges
  let turbulence = max(0.15, 2.5 - t * 0.3);
  let fieldStrength = min(3.5, 0.4 + t * 0.2);

  // Global color warmth shifts over time
  let globalHueShift = map(sin(t * 0.08), -1, 1, 0, 60);
  let globalSat = map(t, 0, 20, 20, 75);

  for (let p of particles) {
    // Sample flow field: layered noise fields at different scales
    let nx = p.x * fieldScale;
    let ny = p.y * fieldScale;

    let angle1 = noise(nx, ny, t * 0.5) * turbulence * TWO_PI;
    let angle2 = noise(nx * 2.1 + 100, ny * 2.1 + 100, t * 0.3 + 50) * turbulence * PI;
    let angle = angle1 + angle2;

    p.vx = p.vx * 0.88 + cos(angle) * fieldStrength;
    p.vy = p.vy * 0.88 + sin(angle) * fieldStrength;

    // Speed modulates color intensity
    let speed = sqrt(p.vx * p.vx + p.vy * p.vy);
    let brightness = map(speed, 0, 3, 40, 92);
    let hue = (p.hue + globalHueShift) % 360;

    fill(hue, globalSat, brightness, 0.55);
    ellipse(p.x, p.y, p.size, p.size);

    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < -5) p.x = width + 5;
    if (p.x > width + 5) p.x = -5;
    if (p.y < -5) p.y = height + 5;
    if (p.y > height + 5) p.y = -5;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
