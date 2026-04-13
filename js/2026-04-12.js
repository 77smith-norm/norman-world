let nodes = [];
let connections = [];
let numNodes = 28;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(220, 12, 5);
  
  // Create nodes in a rough grid
  let cols = 7;
  let rows = ceil(numNodes / cols);
  let cellW = width / (cols + 1);
  let cellH = height / (rows + 1);
  
  for (let i = 0; i < numNodes; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    nodes.push({
      x: cellW * (col + 1) + random(-cellW * 0.3, cellW * 0.3),
      y: cellH * (row + 1) + random(-cellH * 0.3, cellH * 0.3),
      size: random(4, 9),
      hue: random(30, 65),
      phase: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
  
  // Connect nearby nodes (sparse)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < width * 0.22 && random() < 0.25) {
        connections.push({ a: i, b: j, strength: random(0.3, 0.7) });
      }
    }
  }
}

function draw() {
  background(220, 12, 5, 20);
  
  // Draw connections
  for (let c of connections) {
    let na = nodes[c.a];
    let nb = nodes[c.b];
    let d = dist(na.x, na.y, nb.x, nb.y);
    let pulse = (sin(frameCount * 0.02 + c.strength * 10) + 1) * 0.5;
    let alpha = 8 + pulse * 8;
    let weight = 0.5 + pulse * 0.5;
    
    stroke(na.hue, 30, 50, alpha * c.strength);
    strokeWeight(weight);
    line(na.x, na.y, nb.x, nb.y);
  }
  
  // Draw nodes
  for (let n of nodes) {
    n.phase += n.speed;
    let pulse = (sin(n.phase) + 1) * 0.5;
    let size = n.size * (0.7 + pulse * 0.3);
    let alpha = 50 + pulse * 35;
    
    noStroke();
    fill(n.hue, 50, 90, alpha);
    ellipse(n.x, n.y, size, size);
    
    // Glow
    fill(n.hue, 30, 100, alpha * 0.25);
    ellipse(n.x, n.y, size * 2.5, size * 2.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
