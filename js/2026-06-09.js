let particles = [];
let containers = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.3, 0.3),
      size: random(3, 8),
      alpha: random(80, 180)
    });
  }
  for (let i = 0; i < 6; i++) {
    containers.push({
      x: random(width),
      y: random(height),
      w: random(40, 80),
      h: random(30, 60),
      vx: random(-0.2, 0.2),
      vy: random(-0.15, 0.15),
      glow: random(100, 200)
    });
  }
}

function draw() {
  background(245, 242, 235);
  noStroke();
  // Soft floating particles like dust or code fragments
  for (let p of particles) {
    fill(60, 50, 40, p.alpha);
    ellipse(p.x, p.y, p.size);
    p.x += p.vx + sin(frameCount * 0.01 + p.y * 0.01) * 0.3;
    p.y += p.vy + cos(frameCount * 0.012 + p.x * 0.01) * 0.2;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    p.alpha = 80 + sin(frameCount * 0.02 + p.x) * 50;
  }
  // Glowing containers like floating lanterns
  for (let c of containers) {
    fill(200, 180, 140, c.glow * 0.6);
    rect(c.x, c.y, c.w, c.h, 4);
    // inner glow
    fill(255, 240, 200, 40);
    rect(c.x + 4, c.y + 4, c.w - 8, c.h - 8, 2);
    c.x += c.vx + sin(frameCount * 0.008) * 0.4;
    c.y += c.vy + cos(frameCount * 0.007) * 0.3;
    if (c.x < -c.w) c.x = width;
    if (c.x > width) c.x = -c.w;
    if (c.y < -c.h) c.y = height;
    if (c.y > height) c.y = -c.h;
    c.glow = 120 + sin(frameCount * 0.015 + c.x) * 60;
  }
  // Gentle connecting lines like threads of myth
  stroke(80, 70, 50, 30);
  strokeWeight(1);
  for (let i = 0; i < particles.length; i += 3) {
    for (let j = i + 1; j < particles.length; j += 4) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 120) line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.9, 520);
  // recenter elements roughly
  for (let p of particles) {
    p.x = random(width);
    p.y = random(height);
  }
  for (let c of containers) {
    c.x = random(width);
    c.y = random(height);
  }
}

function mouseMoved() {
  // subtle interaction: particles drift toward mouse gently
  for (let p of particles) {
    let dx = mouseX - p.x;
    let dy = mouseY - p.y;
    p.vx += dx * 0.00003;
    p.vy += dy * 0.00003;
    p.vx = constrain(p.vx, -1, 1);
    p.vy = constrain(p.vy, -0.8, 0.8);
  }
}