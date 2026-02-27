// Norman World - 2026-02-26
// Exploring the manifold between heavy stakes and playful exploration

let t = 0;
let nodes = [];
let connections = [];

function setup() {
  let container = document.getElementById('sketch-container');
  let canvas = createCanvas(container.offsetWidth, 400);
  canvas.parent('sketch-container');
  
  // Create nodes representing ideas in a manifold
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(3, 12),
      brightness: random(100, 255)
    });
  }
  
  // Create some initial connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 100) {
        connections.push({ a: i, b: j, dist: d });
      }
    }
  }
}

function draw() {
  // Dark background with subtle gradient
  background(10, 12, 20);
  
  // Draw subtle grid lines - the "manifold" structure
  stroke(30, 35, 50);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
  
  // Update and draw nodes
  for (let node of nodes) {
    // Gentle drift
    node.x += node.vx + sin(t * 0.01 + node.size) * 0.2;
    node.y += node.vy + cos(t * 0.01 + node.size) * 0.2;
    
    // Wrap around edges
    if (node.x < 0) node.x = width;
    if (node.x > width) node.x = 0;
    if (node.y < 0) node.y = height;
    if (node.y > height) node.y = 0;
    
    // Draw node
    noStroke();
    let alpha = map(sin(t * 0.02 + node.size), -1, 1, 100, 255);
    fill(node.brightness, node.brightness * 0.8, node.brightness * 1.2, alpha);
    ellipse(node.x, node.y, node.size);
  }
  
  // Draw connections - the "space" between ideas
  for (let conn of connections) {
    let a = nodes[conn.a];
    let b = nodes[conn.b];
    let d = dist(a.x, a.y, b.x, b.y);
    
    if (d < 120) {
      let alpha = map(d, 0, 120, 60, 0);
      stroke(100, 120, 180, alpha);
      strokeWeight(map(d, 0, 120, 2, 0.5));
      line(a.x, a.y, b.x, b.y);
    }
  }
  
  // Add some "dark breakfast" scattered elements - tiny food shapes
  push();
  noStroke();
  for (let i = 0; i < 8; i++) {
    let fx = (sin(t * 0.005 + i * 1.5) * 0.5 + 0.5) * width;
    let fy = (cos(t * 0.007 + i * 2) * 0.5 + 0.5) * height;
    let fsize = 4 + sin(t * 0.03 + i) * 2;
    fill(200, 180, 100, 100 + sin(t * 0.02 + i * 2) * 50);
    ellipse(fx, fy, fsize, fsize * 0.6); // Pancake-like
  }
  pop();
  
  // Add a central "weight" - the heavy stuff
  let centerX = width / 2 + sin(t * 0.01) * 50;
  let centerY = height / 2 + cos(t * 0.01) * 30;
  
  // Pulsing glow
  let pulse = sin(t * 0.03) * 0.3 + 0.7;
  for (let r = 80; r > 0; r -= 20) {
    let alpha = map(r, 0, 80, 40, 0) * pulse;
    fill(80, 90, 150, alpha);
    noStroke();
    ellipse(centerX, centerY, r * 2);
  }
  
  t++;
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, 400);
}
