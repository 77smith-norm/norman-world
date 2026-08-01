// 2026-07-31 — Between floors
let floors = [];
let currentFloor = 0;
let transitionProgress = 0;
let transitioning = false;
let particles = [];
let elevatorY;
let canvasW, canvasH;

function setup() {
  let container = document.getElementById('sketch-container');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('sketch-container');
  
  for (let i = 0; i < 7; i++) {
    floors.push({
      y: map(i, 0, 6, canvasH * 0.1, canvasH * 0.9),
      label: i + 1,
      hue: map(i, 0, 6, 200, 340),
      drift: random(1000)
    });
  }
  elevatorY = floors[0].y;
  
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(canvasW),
      y: random(canvasH),
      vx: random(-0.3, 0.3),
      vy: random(-0.5, -0.1),
      size: random(2, 5),
      alpha: random(40, 100),
      hue: random([200, 220, 260, 300, 340])
    });
  }
  
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  // Sky gradient
  for (let y = 0; y < canvasH; y++) {
    let t = y / canvasH;
    let h = lerp(210, 280, t);
    let s = lerp(30, 60, t);
    let b = lerp(85, 40, t);
    stroke(h, s, b);
    line(0, y, canvasW, y);
  }
  noStroke();
  
  // Floating floor indicators
  for (let i = 0; i < floors.length; i++) {
    let f = floors[i];
    let drift = sin(frameCount * 0.01 + f.drift) * 8;
    let x = canvasW * 0.15;
    let y = f.y + drift;
    
    // Connection line to elevator shaft
    stroke(f.hue, 40, 70, 30);
    strokeWeight(1);
    line(canvasW * 0.5, elevatorY, x + 20, y);
    noStroke();
    
    // Floor circle
    let isCurrent = (i === currentFloor);
    let sz = isCurrent ? 32 : 20;
    fill(f.hue, isCurrent ? 60 : 30, isCurrent ? 95 : 70, isCurrent ? 90 : 50);
    ellipse(x + 20, y, sz, sz);
    
    // Floor number
    fill(0, 0, 100, isCurrent ? 100 : 60);
    textAlign(CENTER, CENTER);
    textSize(isCurrent ? 14 : 10);
    text(f.label, x + 20, y);
  }
  
  // Elevator shaft
  let shaftX = canvasW * 0.5;
  stroke(0, 0, 100, 15);
  strokeWeight(2);
  line(shaftX, canvasH * 0.05, shaftX, canvasH * 0.95);
  noStroke();
  
  // Elevator car
  if (transitioning) {
    transitionProgress += 0.015;
    let targetY = floors[currentFloor].y;
    elevatorY = lerp(elevatorY, targetProgress > 1 ? targetY : elevatorY, transitionProgress);
    elevatorY = lerp(floors[max(0, currentFloor - 1)].y, targetY, min(1, transitionProgress));
    if (transitionProgress >= 1) {
      transitioning = false;
      transitionProgress = 0;
      elevatorY = targetY;
    }
  }
  
  // Elevator glow
  for (let r = 60; r > 0; r -= 10) {
    fill(floors[currentFloor].hue, 50, 90, map(r, 60, 0, 5, 20));
    ellipse(shaftX, elevatorY, r, r);
  }
  
  // Elevator body
  fill(0, 0, 100, 85);
  rectMode(CENTER);
  rect(shaftX, elevatorY, 40, 50, 8);
  fill(floors[currentFloor].hue, 40, 90, 60);
  rect(shaftX, elevatorY, 30, 40, 5);
  
  // Particles (ambient motes)
  for (let p of particles) {
    p.x += p.vx + sin(frameCount * 0.02 + p.y * 0.01) * 0.2;
    p.y += p.vy;
    if (p.y < -10) { p.y = canvasH + 10; p.x = random(canvasW); }
    if (p.x < -10) p.x = canvasW + 10;
    if (p.x > canvasW + 10) p.x = -10;
    fill(p.hue, 40, 80, p.alpha * (0.5 + 0.5 * sin(frameCount * 0.03 + p.x)));
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Hint text
  fill(0, 0, 100, 30 + sin(frameCount * 0.04) * 15);
  textAlign(CENTER);
  textSize(12);
  text('tap to change floors', canvasW / 2, canvasH - 30);
}

function mousePressed() {
  if (!transitioning) {
    currentFloor = (currentFloor + 1) % floors.length;
    transitioning = true;
    transitionProgress = 0;
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;
  resizeCanvas(canvasW, canvasH);
  for (let i = 0; i < floors.length; i++) {
    floors[i].y = map(i, 0, 6, canvasH * 0.1, canvasH * 0.9);
  }
  elevatorY = floors[currentFloor].y;
}
