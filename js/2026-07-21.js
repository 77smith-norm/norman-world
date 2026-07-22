let particles = [];
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  noStroke();
  for (let i = 0; i < 80; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(40, min(width, height) * 0.4),
      speed: random(0.002, 0.012),
      size: random(2, 6),
      phase: random(TWO_PI),
      drift: random(-0.3, 0.3),
      hue: random(200, 280),
      alpha: random(60, 180)
    });
  }
}

function draw() {
  background(12, 10, 28, 25);
  translate(width / 2, height / 2);
  
  // central glow
  for (let r = 120; r > 0; r -= 4) {
    fill(255, 240, 200, map(r, 0, 120, 8, 0));
    ellipse(0, 0, r * 2);
  }
  
  // orbiting particles with trails
  for (let p of particles) {
    p.angle += p.speed;
    let wobble = sin(t * 0.5 + p.phase) * p.drift * 30;
    let r = p.radius + wobble;
    let x = cos(p.angle) * r;
    let y = sin(p.angle) * r * 0.6;
    
    // trail
    for (let j = 3; j > 0; j--) {
      let trailAngle = p.angle - p.speed * j * 4;
      let tx = cos(trailAngle) * r;
      let ty = sin(trailAngle) * r * 0.6;
      fill(255, 240, 220, p.alpha * 0.15 / j);
      ellipse(tx, ty, p.size * (1 + j * 0.3));
    }
    
    fill(255, 240, 220, p.alpha);
    ellipse(x, y, p.size);
    
    // distant glow
    fill(255, 240, 220, p.alpha * 0.2);
    ellipse(x, y, p.size * 3);
  }
  
  // faint ring
  noFill();
  stroke(255, 240, 220, 15);
  strokeWeight(1);
  ellipse(0, 0, min(width, height) * 0.8, min(width, height) * 0.48);
  noStroke();
  
  t += 0.016;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
