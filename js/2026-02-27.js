// Norman World - 2026-02-27
// Sentiment: In tech, sometimes the most powerful thing employees can do is stand together.
// Theme: Unity - nodes connecting, forming collective shape

let nodes = [];
let connections = [];
let centerX, centerY;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Create nodes in a circular pattern, each representing an individual
  let nodeCount = 24;
  let radius = 180;
  
  for (let i = 0; i < nodeCount; i++) {
    let angle = TWO_PI / nodeCount * i;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    
    nodes.push({
      x: x,
      y: y,
      baseX: x,
      baseY: y,
      angle: angle,
      radius: random(3, 6),
      pulseOffset: random(1000)
    });
  }
  
  // Create connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 120) {
        connections.push({ a: i, b: j, strength: map(d, 0, 120, 1, 0.2) });
      }
    }
  }
}

function draw() {
  // Deep space background
  background(10, 12, 20);
  
  let time = millis() * 0.001;
  
  // Draw subtle grid
  stroke(30, 35, 50, 30);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
  
  // Draw connections first (behind nodes)
  for (let conn of connections) {
    let nodeA = nodes[conn.a];
    let nodeB = nodes[conn.b];
    
    // Connection pulses with the collective rhythm
    let pulse = sin(time * 2 + nodeA.pulseOffset * 0.1) * 0.3 + 0.7;
    
    let alpha = conn.strength * pulse * 180;
    stroke(100, 180, 255, alpha);
    strokeWeight(conn.strength * 2);
    line(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
  }
  
  // Draw nodes
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    
    // Gentle breathing motion
    let breathe = sin(time * 1.5 + node.pulseOffset) * 8;
    let currentRadius = node.radius + breathe * 0.5;
    
    // Outer glow
    let glowSize = currentRadius * 4;
    for (let r = glowSize; r > currentRadius; r -= 2) {
      let alpha = map(r, currentRadius, glowSize, 60, 0);
      fill(100, 180, 255, alpha * 0.3);
      ellipse(node.x, node.y, r * 2);
    }
    
    // Core
    fill(200, 230, 255);
    ellipse(node.x, node.y, currentRadius * 2);
    
    // Inner bright spot
    fill(255, 255, 255, 200);
    ellipse(node.x, node.y, currentRadius);
  }
  
  // Central unifying pulse - the "we" in "we will not be divided"
  let centerPulse = sin(time * 0.8) * 0.2 + 0.8;
  let centerSize = 40 + sin(time * 2) * 10;
  
  // Central glow
  for (let r = centerSize * 3; r > centerSize; r -= 5) {
    let alpha = map(r, centerSize, centerSize * 3, 40, 0) * centerPulse;
    fill(255, 200, 100, alpha);
    ellipse(centerX, centerY, r * 2);
  }
  
  // Center core
  fill(255, 240, 200);
  ellipse(centerX, centerY, centerSize);
  
  // Warm inner
  fill(255, 255, 255, 220);
  ellipse(centerX, centerY, centerSize * 0.6);
  
  // Subtle title text
  fill(150, 170, 200, 100);
  textAlign(CENTER);
  textSize(14);
  textFont('Georgia');
  text("we will not be divided", centerX, height - 30);
}
