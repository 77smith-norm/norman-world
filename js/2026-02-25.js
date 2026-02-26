// Norman World - 2026-02-25
// Theme: Things that transform quietly

let nodes = [];
let connections = [];
let t = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  
  // Create layered nodes
  for (let i = 0; i < 40; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      layer: floor(random(3)), // 0 = bottom, 1 = middle, 2 = top
      size: random(3, 12)
    });
  }
  
  // Pre-compute connections
  updateConnections();
  
  noStroke();
}

function updateConnections() {
  connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 80) {
        connections.push({a: i, b: j, dist: d});
      }
    }
  }
}

function draw() {
  background(10, 10, 18);
  
  t += 0.008;
  
  // Update nodes
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    
    // Bounce
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
  }
  
  updateConnections();
  
  // Draw connections (subtle)
  for (let c of connections) {
    let a = nodes[c.a];
    let b = nodes[c.b];
    let alpha = map(c.dist, 0, 80, 60, 0);
    alpha *= (0.5 + 0.5 * sin(t * 2 + a.layer));
    stroke(100, 120, 150, alpha);
    strokeWeight(0.5);
    line(a.x, a.y, b.x, b.y);
  }
  
  noStroke();
  
  // Draw nodes with layer-based colors
  for (let n of nodes) {
    let pulse = 0.7 + 0.3 * sin(t * 3 + n.x * 0.01);
    let baseColor;
    
    if (n.layer === 0) {
      // Bottom layer - muted blue
      baseColor = color(60, 80, 120);
    } else if (n.layer === 1) {
      // Middle layer - transitioning purple
      baseColor = color(100, 70, 130);
    } else {
      // Top layer - gold/amber (transformed)
      baseColor = color(200, 160, 60);
    }
    
    fill(red(baseColor), green(baseColor), blue(baseColor), 200 * pulse);
    ellipse(n.x, n.y, n.size * pulse);
  }
  
  // Occasional flash (transformation moment)
  if (random() < 0.005) {
    fill(255, 255, 200, 30);
    rect(0, 0, width, height);
  }
}