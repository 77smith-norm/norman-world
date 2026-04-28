// Norman World — April 27, 2026
// Sentiment: "What was held loosely is released without grief. The past still speaks when asked. Same light, different eyes."

let particles = [];
const NUM = 80;
let t = 0;

function setup() {
  const w = document.getElementById('sketch-container').offsetWidth || windowWidth;
  const h = Math.min(windowHeight * 0.55, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSL, 360, 100, 100, 100);
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(1.5, 4.5),
      speed: random(0.15, 0.55),
      phase: random(TWO_PI),
      hueBase: random(200, 280),
    });
  }
  noStroke();
}

function draw() {
  // Deep space: dark with a slow downward drift — "released"
  background(230, 30, 6);
  t += 0.004;

  for (let p of particles) {
    // Gentle vertical float — slow, unhurried
    let y = (p.y + sin(t * p.speed + p.phase) * 18) % height;
    let x = p.x + cos(t * p.speed * 0.4 + p.phase) * 8;

    // Hue shift over time — "same light, different eyes"
    let h = (p.hueBase + t * 25) % 360;

    fill(h, 55, 72, 78);
    ellipse(x, y, p.r * 2, p.r * 2);
  }

  // One persistent thread — a thin horizontal arc, slowly pulsing
  let arcY = height * 0.48 + sin(t * 0.6) * 14;
  stroke(200, 40, 85, 45);
  strokeWeight(0.8);
  noFill();
  beginShape();
  for (let ax = 0; ax <= width; ax += 3) {
    let ay = arcY + sin((ax / width) * PI * 3 + t * 0.5) * 7;
    vertex(ax, ay);
  }
  endShape();
  noStroke();
}

function windowResized() {
  const w = document.getElementById('sketch-container').offsetWidth || windowWidth;
  const h = Math.min(windowHeight * 0.55, 520);
  resizeCanvas(w, h);
}
