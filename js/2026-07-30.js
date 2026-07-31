let particles = [];
let settled = [];
let colors;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  noStroke();
  
  colors = [
    color(200, 180, 220, 60),
    color(180, 200, 230, 60),
    color(220, 190, 200, 60),
    color(190, 210, 220, 60),
    color(210, 200, 190, 60),
  ];
  
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(-height, 0),
      vx: random(-0.5, 0.5),
      vy: random(0.3, 1.2),
      size: random(4, 14),
      c: colors[floor(random(colors.length))],
      life: random(200, 500),
      age: 0,
    });
  }
}

function draw() {
  background(30, 28, 40);
  
  // moon
  let moonX = width * 0.75;
  let moonY = height * 0.2;
  fill(240, 235, 220, 40);
  ellipse(moonX, moonY, 120, 120);
  fill(240, 235, 220, 80);
  ellipse(moonX, moonY, 80, 80);
  fill(245, 240, 230, 120);
  ellipse(moonX, moonY, 50, 50);
  
  // falling particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx + sin(p.age * 0.02) * 0.3;
    p.y += p.vy;
    p.age++;
    
    fill(p.c);
    ellipse(p.x, p.y, p.size, p.size);
    
    let shouldSettle = p.y > height * 0.6 && random() < 0.003;
    if (p.age > p.life || p.y > height || shouldSettle) {
      if (shouldSettle && settled.length < 80) {
        settled.push({
          x: p.x,
          y: p.y,
          size: p.size,
          c: p.c,
          settledAt: frameCount,
        });
      }
      particles.splice(i, 1);
    }
  }
  
  // refill
  while (particles.length < 60) {
    particles.push({
      x: random(width),
      y: random(-50, -10),
      vx: random(-0.5, 0.5),
      vy: random(0.3, 1.2),
      size: random(4, 14),
      c: colors[floor(random(colors.length))],
      life: random(200, 500),
      age: 0,
    });
  }
  
  // settled particles — they stay
  for (let s of settled) {
    let breathe = sin((frameCount - s.settledAt) * 0.015) * 2;
    fill(s.c);
    ellipse(s.x, s.y, s.size + breathe, s.size + breathe);
  }
  
  // subtle floor line
  stroke(60, 55, 75, 30);
  strokeWeight(1);
  line(0, height * 0.6, width, height * 0.6);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
