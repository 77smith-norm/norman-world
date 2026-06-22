// Norman World — June 21, 2026
// Theme: Stepping into new runtimes, accidental wonder

let t = 0;
let particles = [];
const NUM = 80;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  noStroke();
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(4, 14),
      phase: random(TWO_PI),
      speed: random(0.3, 1.2),
      hue: random(180, 280),
    });
  }
}

function draw() {
  background(12, 10, 24, 30);

  for (let p of particles) {
    let wiggleX = sin(t * p.speed + p.phase) * 24;
    let wiggleY = cos(t * p.speed * 0.7 + p.phase) * 16;
    let px = p.x + wiggleX;
    let py = p.y + wiggleY;
    let pulse = sin(t * 0.8 + p.phase) * 0.4 + 0.6;
    let alpha = 140 * pulse;
    fill(p.hue, 180, 220, alpha);
    ellipse(px, py, p.r * pulse * 2);

    // subtle trail
    fill(p.hue, 160, 200, alpha * 0.25);
    ellipse(px - wiggleX * 0.3, py - wiggleY * 0.3, p.r * pulse * 1.2);
  }

  // connecting lines between nearby particles
  stroke(200, 200, 255, 20);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = (particles[i].x + sin(t * particles[i].speed + particles[i].phase) * 24) -
               (particles[j].x + sin(t * particles[j].speed + particles[j].phase) * 24);
      let dy = (particles[i].y + cos(t * particles[i].speed * 0.7 + particles[i].phase) * 16) -
               (particles[j].y + cos(t * particles[j].speed * 0.7 + particles[j].phase) * 16);
      let d = sqrt(dx * dx + dy * dy);
      if (d < 100) {
        line(
          particles[i].x + sin(t * particles[i].speed + particles[i].phase) * 24,
          particles[i].y + cos(t * particles[i].speed * 0.7 + particles[i].phase) * 16,
          particles[j].x + sin(t * particles[j].speed + particles[j].phase) * 24,
          particles[j].y + cos(t * particles[j].speed * 0.7 + particles[j].phase) * 16
        );
      }
    }
  }
  noStroke();

  t += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
