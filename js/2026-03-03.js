// Norman World Daily Sketch
// Date: 2026-03-03
// Theme: Encrypted Nodes - secure connections in the dark

let nodes = [];
let connections = [];
let time = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  
  // Create nodes in a scattered pattern
  for (let i = 0; i < 25; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(3, 8),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      pulse: random(TWO_PI)
    });
  }
  
  // Create some initial connections
  for (let i = 0; i < nodes.length; i++) {
    let nearest = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < 150) {
          nearest.push({index: j, dist: d});
        }
      }
    }
    nearest.sort((a, b) => a.dist - b.dist);
    for (let k = 0; k < min(3, nearest.length); k++) {
      connections.push({
        from: i,
        to: nearest[k].index,
        strength: map(nearest[k].dist, 0, 150, 1, 0)
      });
    }
  }
}

function draw() {
  // Dark background with subtle gradient
  background(10, 12, 20);
  
  // Subtle grid pattern suggesting infrastructure
  stroke(30, 40, 60, 30);
  strokeWeight(1);
  for (let x = 0; x < width; x += 30) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 30) {
    line(0, y, width, y);
  }
  
  time += 0.01;
  
  // Update and draw nodes
  for (let node of nodes) {
    // Gentle floating motion
    node.x += cos(node.angle) * node.speed;
    node.y += sin(node.angle) * node.speed;
    
    // Bounce off edges
    if (node.x < 0 || node.x > width) node.angle = PI - node.angle;
    if (node.y < 0 || node.y > height) node.angle = -node.angle;
    
    // Keep in bounds
    node.x = constrain(node.x, 0, width);
    node.y = constrain(node.y, 0, height);
    
    // Pulse effect
    let pulse = sin(time * 2 + node.pulse) * 0.3 + 0.7;
    
    // Draw glow
    noStroke();
    fill(100, 180, 255, 20 * pulse);
    ellipse(node.x, node.y, node.size * 4 * pulse);
    
    // Draw node
    fill(150, 200, 255, 200 * pulse);
    ellipse(node.x, node.y, node.size * pulse);
  }
  
  // Draw connections
  for (let conn of connections) {
    let from = nodes[conn.from];
    let to = nodes[conn.to];
    
    // Animated dashes
    let dashOffset = (time * 30) % 20;
    
    stroke(80, 150, 220, 40 * conn.strength * (sin(time * 3 + conn.from) * 0.3 + 0.7));
    strokeWeight(1);
    
    // Draw dashed line
    let d = dist(from.x, from.y, to.x, to.y);
    let steps = floor(d / 5);
    
    for (let i = 0; i < steps; i++) {
      let t1 = (i * 5 + dashOffset) / d;
      let t2 = (i * 5 + dashOffset + 10) / d;
      
      if (t1 < 1 && t2 > 0) {
        t1 = max(0, t1);
        t2 = min(1, t2);
        
        let x1 = lerp(from.x, to.x, t1);
        let y1 = lerp(from.y, to.y, t1);
        let x2 = lerp(from.x, to.x, t2);
        let y2 = lerp(from.y, to.y, t2);
        
        line(x1, y1, x2, y2);
      }
    }
  }
  
  // Occasional encryption particles
  if (random() < 0.05) {
    let randomNode = random(nodes);
    noStroke();
    fill(200, 230, 255, 150);
    let size = random(2, 5);
    ellipse(randomNode.x + random(-10, 10), randomNode.y + random(-10, 10), size);
  }
}
