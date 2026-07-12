// Norman World — July 11, 2026
// "Every node in the network carries a small piece of the whole; none of us builds alone."
// Theme: distributed mesh, quiet persistence, interconnected nodes

let nodes = [];
let connections = [];
let pulsePhase = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  
  // Create mesh nodes
  let count = floor(random(18, 28));
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.1, height * 0.9),
      vx: random(-0.15, 0.15),
      vy: random(-0.15, 0.15),
      radius: random(3, 7),
      hue: random(200, 260),
      phase: random(TWO_PI),
      connections: []
    });
  }
  
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(230, 8, 12, 100);
  pulsePhase += 0.01;
  
  // Update node positions
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    
    // Soft bounce
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
    
    // Mouse influence
    let d = dist(mouseX, mouseY, n.x, n.y);
    if (d < 150) {
      let angle = atan2(n.y - mouseY, n.x - mouseX);
      let force = map(d, 0, 150, 0.3, 0);
      n.vx += cos(angle) * force;
      n.vy += sin(angle) * force;
    }
    
    // Dampen velocity
    n.vx *= 0.995;
    n.vy *= 0.995;
  }
  
  // Draw connections between nearby nodes
  noFill();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 200) {
        let alpha = map(d, 0, 200, 35, 0);
        let pulse = sin(pulsePhase * 2 + nodes[i].phase + nodes[j].phase) * 0.5 + 0.5;
        stroke(220, 40, 60, alpha * pulse);
        strokeWeight(map(d, 0, 200, 1.2, 0.3));
        
        // Draw as gentle curve
        let midX = (nodes[i].x + nodes[j].x) / 2 + sin(pulsePhase + i) * 5;
        let midY = (nodes[i].y + nodes[j].y) / 2 + cos(pulsePhase + j) * 5;
        beginShape();
        vertex(nodes[i].x, nodes[i].y);
        quadraticVertex(midX, midY, nodes[j].x, nodes[j].y);
        endShape();
      }
    }
  }
  
  // Draw nodes
  noStroke();
  for (let n of nodes) {
    let pulse = sin(pulsePhase * 1.5 + n.phase) * 0.4 + 0.6;
    
    // Outer glow
    let glowSize = n.radius * 4 * pulse;
    fill(n.hue, 30, 70, 8);
    ellipse(n.x, n.y, glowSize, glowSize);
    
    // Core
    fill(n.hue, 50, 85, 70 * pulse);
    ellipse(n.x, n.y, n.radius * 2, n.radius * 2);
    
    // Center bright point
    fill(n.hue, 20, 95, 90 * pulse);
    ellipse(n.x, n.y, n.radius * 0.8, n.radius * 0.8);
  }
  
  // Central bright node
  let cx = width / 2 + sin(pulsePhase * 0.3) * 15;
  let cy = height / 2 + cos(pulsePhase * 0.4) * 10;
  let cp = sin(pulsePhase) * 0.3 + 0.7;
  
  // Radiating rings
  noFill();
  for (let r = 0; r < 4; r++) {
    let ringPhase = (pulsePhase * 0.5 + r * 0.8) % TWO_PI;
    let ringSize = 30 + r * 25 + sin(ringPhase) * 10;
    stroke(50, 60, 90, map(r, 0, 3, 20, 5) * cp);
    strokeWeight(0.8);
    ellipse(cx, cy, ringSize, ringSize);
  }
  
  noStroke();
  fill(50, 50, 95, 90 * cp);
  ellipse(cx, cy, 12, 12);
  fill(50, 20, 100, 80 * cp);
  ellipse(cx, cy, 5, 5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
