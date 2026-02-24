// Norman World Daily - 2026-02-23
// Theme: The Age Verification Trap - a web of surveillance spreading across the web
// Sentiment: "We built walls to protect the vulnerable, and discovered we'd trapped ourselves."

let nodes = [];
let connections = [];
let maxNodes = 40;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  
  // Initialize nodes scattered across the canvas
  for (let i = 0; i < 15; i++) {
    nodes.push(new Node(random(width), random(height)));
  }
  
  textFont('Georgia');
}

function draw() {
  // Dark, contemplative background
  background(18, 20, 28);
  
  // Subtle grid representing the web/internet
  stroke(40, 45, 60, 30);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
  
  // Draw connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 200) {
        // The closer nodes are, the stronger the connection
        let alpha = map(d, 0, 200, 80, 10);
        stroke(100, 120, 180, alpha);
        strokeWeight(map(d, 0, 200, 2, 0.5));
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
  
  // Add new nodes slowly over time (the web spreading)
  if (frameCount % 60 === 0 && nodes.length < maxNodes) {
    // Spawn near existing nodes to show spread
    let parentNode = random(nodes);
    let angle = random(TWO_PI);
    let dist = random(30, 100);
    nodes.push(new Node(parentNode.x + cos(angle) * dist, parentNode.y + sin(angle) * dist));
  }
  
  // Update and draw nodes
  for (let node of nodes) {
    node.update();
    node.display();
  }
  
  // Add some "watching" eyes occasionally
  if (frameCount % 120 === 0) {
    let node = random(nodes);
    node.hasEye = true;
    node.eyeTimer = 60;
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = random(8, 20);
    this.pulseOffset = random(1000);
    this.hasEye = false;
    this.eyeTimer = 0;
  }
  
  update() {
    // Gentle floating motion
    this.x = this.baseX + sin(frameCount * 0.01 + this.pulseOffset) * 3;
    this.y = this.baseY + cos(frameCount * 0.008 + this.pulseOffset) * 3;
    
    if (this.eyeTimer > 0) {
      this.eyeTimer--;
    } else {
      this.hasEye = false;
    }
  }
  
  display() {
    // Node body - soft glow
    let pulse = sin(frameCount * 0.05 + this.pulseOffset) * 5;
    
    // Outer glow
    noStroke();
    fill(100, 120, 180, 15);
    ellipse(this.x, this.y, this.size * 2 + pulse + 10);
    fill(100, 120, 180, 25);
    ellipse(this.x, this.y, this.size * 1.5 + pulse);
    
    // Core
    fill(60, 70, 100);
    ellipse(this.x, this.y, this.size);
    
    // Inner bright spot
    fill(150, 170, 220);
    ellipse(this.x, this.y, this.size * 0.4);
    
    // Draw eye if active
    if (this.hasEye) {
      this.drawEye();
    }
  }
  
  drawEye() {
    // An eye watching from the node
    let eyeY = this.y - this.size * 0.3;
    let eyeSize = this.size * 0.8;
    
    // Eye white
    fill(200, 210, 230);
    noStroke();
    ellipse(this.x, eyeY, eyeSize, eyeSize * 0.7);
    
    // Iris - slightly offset for watching effect
    let lookX = this.x + random(-2, 2);
    let lookY = eyeY + random(-2, 2);
    fill(80, 50, 50);
    ellipse(lookX, lookY, eyeSize * 0.4, eyeSize * 0.4);
    
    // Pupil
    fill(20, 15, 25);
    ellipse(lookX, lookY, eyeSize * 0.2, eyeSize * 0.2);
    
    // Highlight
    fill(255, 255, 255, 200);
    ellipse(lookX - eyeSize * 0.08, eyeY - eyeSize * 0.08, eyeSize * 0.1);
  }
}

// Add mouse interaction to add nodes
function mousePressed() {
  if (nodes.length < maxNodes) {
    nodes.push(new Node(mouseX, mouseY));
  }
}