// Norman World — 2026-05-15
// Sentiment: The things we build to outlast us become more precious the more the world proves permanence is an illusion.

let particles = [];
let monuments = [];
const MONUMENT_COUNT = 5;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  // Stone monuments — what endures
  for (let i = 0; i < MONUMENT_COUNT; i++) {
    monuments.push({
      x: random(width),
      y: random(height * 0.2, height * 0.7),
      r: random(18, 42),
      hue: random(30, 55),
      wobble: random(TWO_PI),
      wobbleSpeed: random(0.003, 0.008)
    });
  }

  // Particles — what fades
  for (let i = 0; i < 220; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Deep night background
  background(220, 18, 6);

  // Draw monuments first — they are still
  noStroke();
  for (let m of monuments) {
    let wobbleX = sin(frameCount * m.wobbleSpeed + m.wobble) * 1.5;
    let wobbleY = cos(frameCount * m.wobbleSpeed * 0.7 + m.wobble) * 0.8;

    // Warm inner glow — amber/gold
    fill(m.hue, 55, 88, 30);
    ellipse(m.x + wobbleX, m.y + wobbleY, m.r * 2.4);

    fill(m.hue, 40, 95, 80);
    ellipse(m.x + wobbleX, m.y + wobbleY, m.r * 1.5);

    fill(m.hue, 25, 100, 95);
    ellipse(m.x + wobbleX, m.y + wobbleY, m.r);
  }

  // Draw particles — they are ephemeral
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Ground line — a thin horizon where things dissolve
  stroke(220, 10, 20, 60);
  strokeWeight(0.5);
  line(0, height - 30, width, height - 30);
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-height * 0.3, 0);
    this.vx = random(-0.3, 0.3);
    this.vy = random(0.4, 1.2);
    this.size = random(1.5, 5);
    this.hue = random(200, 240); // cool — gray-blue
    this.alpha = random(30, 70);
    this.life = random(0.5, 1.0);
    this.decay = random(0.15, 0.4);
  }

  update() {
    // Gentle pull toward mouse
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;
    this.vx += dx * 0.00004;
    this.vy += dy * 0.00003;

    // Wind
    this.vx += sin(frameCount * 0.01 + this.x * 0.01) * 0.02;

    this.vx *= 0.99;
    this.vy *= 0.99;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay * 0.01;

    if (this.life <= 0 || this.y > height - 25) {
      this.alpha -= 2;
    }
    if (this.alpha <= 0 || this.y > height) {
      this.reset();
    }
  }

  display() {
    noStroke();
    fill(this.hue, 15, 85, this.alpha * this.life);
    ellipse(this.x, this.y, this.size * this.life);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
