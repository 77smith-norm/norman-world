// Norman World — 2026-07-24
// Sentiment: The quiet math of reaching others is the longest proof we ever write.

let particles = [];
let theorems = [];
let t = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketch-container');
  noStroke();
  
  // Floating proof fragments
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speed: random(0.2, 0.8),
      drift: random(-0.3, 0.3),
      alpha: random(60, 180),
      hue: random([200, 210, 220, 40, 50])
    });
  }
  
  // Theorem lines — slow-drawing connections
  for (let i = 0; i < 8; i++) {
    theorems.push({
      x1: random(width * 0.1, width * 0.4),
      y1: random(height * 0.2, height * 0.8),
      x2: random(width * 0.6, width * 0.9),
      y2: random(height * 0.2, height * 0.8),
      progress: 0,
      speed: random(0.002, 0.006),
      weight: random(1, 2.5),
      hue: random([30, 40, 200, 210])
    });
  }
}

function draw() {
  // Deep indigo-slate gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(15, 18, 40), color(35, 30, 60), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Warm lamplight glow at center
  noStroke();
  for (let r = 300; r > 0; r -= 3) {
    let a = map(r, 0, 300, 30, 0);
    fill(255, 220, 140, a);
    ellipse(width / 2, height * 0.45, r * 2, r * 1.5);
  }
  
  // Draw theorem lines (proofs connecting ideas)
  for (let th of theorems) {
    th.progress += th.speed;
    if (th.progress > 1) {
      th.progress = 0;
      th.x1 = random(width * 0.1, width * 0.4);
      th.y1 = random(height * 0.2, height * 0.8);
      th.x2 = random(width * 0.6, width * 0.9);
      th.y2 = random(height * 0.2, height * 0.8);
    }
    let prog = th.progress;
    // Bezier curve — proof takes a winding path
    let cx1 = lerp(th.x1, th.x2, 0.3) + sin(t * 0.5 + th.x1) * 60;
    let cy1 = lerp(th.y1, th.y2, 0.3) + cos(t * 0.4 + th.y1) * 40;
    let cx2 = lerp(th.x1, th.x2, 0.7) + sin(t * 0.6 + th.x2) * 60;
    let cy2 = lerp(th.y1, th.y2, 0.7) + cos(t * 0.3 + th.y2) * 40;
    
    stroke(hue_for(th.hue, 80, 80, 60));
    strokeWeight(th.weight);
    noFill();
    beginShape();
    for (let u = 0; u <= prog; u += 0.02) {
      let px = bezierPoint(th.x1, cx1, cx2, th.x2, u);
      let py = bezierPoint(th.y1, cy1, cy2, th.y2, u);
      vertex(px, py);
    }
    endShape();
  }
  
  // Floating particles — drifting upward like resolved lemmas
  noStroke();
  for (let p of particles) {
    p.y -= p.speed;
    p.x += p.drift + sin(t * 0.3 + p.x * 0.01) * 0.3;
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }
    fill(hue_for(p.hue, 70, 90, p.alpha));
    ellipse(p.x, p.y, p.size, p.size);
    
    // Glow
    fill(hue_for(p.hue, 60, 100, p.alpha * 0.3));
    ellipse(p.x, p.y, p.size * 3, p.size * 3);
  }
  
  // Central constellation — a slowly rotating proof tree
  push();
  translate(width / 2, height * 0.45);
  rotate(t * 0.1);
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i + t * 0.05;
    let r = 60 + sin(t * 0.3 + i) * 20;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    fill(255, 230, 160, 120);
    ellipse(x, y, 4, 4);
    // Connect to center
    stroke(255, 230, 160, 40);
    strokeWeight(0.8);
    line(0, 0, x, y);
    noStroke();
  }
  pop();
  
  t += 0.016;
}

function hue_for(h, s, b, a) {
  colorMode(HSB, 360, 100, 100, 255);
  let c = color(h, s, b, a);
  colorMode(RGB, 255);
  return c;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
