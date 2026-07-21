// 2026-07-20 — Incremental propagation
// Inspired by: incremental computation, constrained persistence, running Doom on custom hardware
let nodes = [];
let connections = [];
let pulseWave = 0;
let cols, rows;
let spacing = 40;
let noiseScale = 0.008;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  cols = floor(width / spacing) + 2;
  rows = floor(height / spacing) + 2;
  
  for (let i = 0; i < cols; i++) {
    nodes[i] = [];
    for (let j = 0; j < rows; j++) {
      nodes[i][j] = {
        x: i * spacing,
        y: j * spacing,
        val: 0,
        target: 0,
        phase: random(TWO_PI),
        speed: random(0.01, 0.03)
      };
    }
  }
}

function draw() {
  background(230, 15, 8);
  
  pulseWave += 0.015;
  
  // Update node values with noise-driven incremental propagation
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let n = nodes[i][j];
      let nx = noise(i * noiseScale + pulseWave * 0.3, j * noiseScale, pulseWave * 0.1);
      n.target = nx;
      n.val = lerp(n.val, n.target, 0.08 + n.speed);
    }
  }
  
  // Draw connections between adjacent nodes
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let n = nodes[i][j];
      let right = nodes[i + 1][j];
      let below = nodes[i][j + 1];
      
      // Horizontal
      let alpha = (n.val + right.val) * 25;
      stroke(200, 40, 60, alpha);
      strokeWeight(map(n.val, 0, 1, 0.3, 1.5));
      line(n.x, n.y, right.x, right.y);
      
      // Vertical
      let alphaV = (n.val + below.val) * 25;
      stroke(200, 40, 60, alphaV);
      strokeWeight(map(n.val, 0, 1, 0.3, 1.5));
      line(n.x, n.y, below.x, below.y);
    }
  }
  
  // Draw nodes
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let n = nodes[i][j];
      let sz = map(n.val, 0, 1, 1.5, 6);
      let hue = map(n.val, 0, 1, 200, 280);
      let sat = map(n.val, 0, 1, 30, 70);
      let bri = map(n.val, 0, 1, 40, 90);
      fill(hue, sat, bri, 80);
      ellipse(n.x, n.y, sz, sz);
      
      // Glow for high-value nodes
      if (n.val > 0.65) {
        fill(hue, sat - 20, bri + 10, 20);
        ellipse(n.x, n.y, sz * 4, sz * 4);
      }
    }
  }
  
  // Pulse wave indicator — a bright line sweeping across
  let waveX = (pulseWave * 80) % (width + 200) - 100;
  for (let y = 0; y < height; y += 8) {
    let wobble = noise(y * 0.01, pulseWave) * 30 - 15;
    let alpha = map(abs(y - height / 2), 0, height / 2, 50, 0);
    stroke(260, 60, 90, alpha);
    strokeWeight(1.5);
    point(waveX + wobble, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / spacing) + 2;
  rows = floor(height / spacing) + 2;
  nodes = [];
  for (let i = 0; i < cols; i++) {
    nodes[i] = [];
    for (let j = 0; j < rows; j++) {
      nodes[i][j] = {
        x: i * spacing,
        y: j * spacing,
        val: 0,
        target: 0,
        phase: random(TWO_PI),
        speed: random(0.01, 0.03)
      };
    }
  }
}
