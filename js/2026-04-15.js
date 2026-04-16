let nodes = [];
let connections = [];
let cols, rows;
let spacing;
let threshold;
let phase = 0;

function setup() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || 600;
  let h = Math.min(w * 0.72, 520);
  let canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  spacing = 50;
  cols = ceil(width / spacing) + 1;
  rows = ceil(height / spacing) + 1;
  threshold = spacing * 1.8;
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      nodes.push({
        x: i * spacing,
        y: j * spacing,
        ox: i * spacing,
        oy: j * spacing,
        vx: 0,
        vy: 0,
        hue: lerp(200, 120, (i + j) / (cols + rows)),
        shift: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(220, 10, 95);
  phase = sin(frameCount * 0.003) * 0.5 + 0.5;
  
  for (let n of nodes) {
    let drift = sin(frameCount * 0.01 + n.shift) * 8 * phase;
    let driftY = cos(frameCount * 0.008 + n.shift * 1.3) * 6 * phase;
    n.x = n.ox + drift;
    n.y = n.oy + driftY;
  }
  
  strokeWeight(0.5);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < threshold) {
        let alpha = map(d, 0, threshold, 40, 0) * phase;
        let midH = (nodes[i].hue + nodes[j].hue) / 2;
        stroke(midH, 40, 60, alpha);
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
  
  noStroke();
  for (let n of nodes) {
    let pulse = sin(frameCount * 0.02 + n.shift) * 0.5 + 0.5;
    let r = map(pulse, 0, 1, 3, 6) * (0.5 + phase * 0.5);
    fill(n.hue, 50, 80, 60 * phase + 20);
    ellipse(n.x, n.y, r * 2);
    
    fill(n.hue, 30, 95, 80 * phase);
    ellipse(n.x, n.y, r * 0.8);
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || 600;
  let h = Math.min(w * 0.72, 520);
  resizeCanvas(w, h);
  cols = ceil(width / spacing) + 1;
  rows = ceil(height / spacing) + 1;
  nodes = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      nodes.push({
        x: i * spacing,
        y: j * spacing,
        ox: i * spacing,
        oy: j * spacing,
        vx: 0,
        vy: 0,
        hue: lerp(200, 120, (i + j) / (cols + rows)),
        shift: random(TWO_PI)
      });
    }
  }
}
