// 2026-02-21: The Discipline of the Pause
// Sentiment: "The distance between what we want and what we build is bridged by the discipline to pause first."

let nodes = [];
let connections = [];
let activeNode = null;
let phase = 0;
let phaseTimer = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  
  // Create a ring of nodes representing ideas
  let numNodes = 12;
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 180;
  
  for (let i = 0; i < numNodes; i++) {
    let angle = (TWO_PI / numNodes) * i - HALF_PI;
    nodes.push({
      x: centerX + cos(angle) * radius,
      y: centerY + sin(angle) * radius,
      baseX: centerX + cos(angle) * radius,
      baseY: centerY + sin(angle) * radius,
      pulse: random(1000),
      connected: false
    });
  }
  
  // Central "pause" node - the decision point
  nodes.push({
    x: centerX,
    y: centerY,
    baseX: centerX,
    baseY: centerY,
    isCenter: true,
    pulse: 0,
    connected: false
  });
}

function draw() {
  // Deep charcoal background
  background(18, 18, 24);
  
  phaseTimer++;
  
  // Phase logic
  if (phaseTimer > 300) {
    phaseTimer = 0;
    phase = (phase + 1) % 3;
    
    if (phase === 1) {
      // Activate a random outer node
      let outerNodes = nodes.filter(n => !n.isCenter);
      let toConnect = random(outerNodes);
      if (!toConnect.connected) {
        activeNode = toConnect;
        toConnect.connected = true;
      }
    } else if (phase === 2) {
      // Connect to center - the pause is made, decision taken
      if (activeNode) {
        connections.push({
          from: activeNode,
          to: nodes[nodes.length - 1],
          progress: 0
        });
      }
    }
  }
  
  // Draw connections
  noFill();
  for (let conn of connections) {
    if (conn.progress < 1) {
      conn.progress += 0.02;
    }
    
    let progress = easeOutCubic(conn.progress);
    let currentX = lerp(conn.from.x, conn.to.x, progress);
    let currentY = lerp(conn.from.y, conn.to.y, progress);
    
    // Gradient-like effect
    let alpha = map(progress, 0, 1, 0, 200);
    stroke(100, 180, 255, alpha);
    strokeWeight(2);
    line(conn.from.x, conn.from.y, currentX, currentY);
    
    // Draw the "spark" at the leading edge
    if (progress < 1) {
      noStroke();
      fill(255, 220, 150, 255 * (1 - progress));
      ellipse(currentX, currentY, 6, 6);
    }
  }
  
  // Draw nodes
  for (let node of nodes) {
    let pulse = sin((phaseTimer + node.pulse) * 0.03) * 0.3 + 1;
    
    if (node.isCenter) {
      // Center node - the pause/decision point
      let centerPulse = sin(phaseTimer * 0.02) * 0.2 + 1;
      
      // Outer glow
      noStroke();
      for (let r = 60; r > 0; r -= 10) {
        let alpha = map(r, 0, 60, 40, 0);
        fill(80, 140, 220, alpha * centerPulse);
        ellipse(node.x, node.y, r * centerPulse, r * centerPulse);
      }
      
      // Core
      fill(200, 220, 255);
      ellipse(node.x, node.y, 20 * centerPulse, 20 * centerPulse);
      
      // Label
      fill(150, 180, 220);
      textAlign(CENTER, CENTER);
      textSize(10);
      text("PAUSE", node.x, node.y + 35);
      
    } else {
      // Outer nodes - ideas/wants
      let isActive = node.connected;
      
      if (isActive) {
        // Bright when connected/chosen
        fill(255, 200, 120);
        stroke(255, 220, 150);
      } else {
        // Dim when not yet chosen
        fill(80, 90, 110);
        stroke(100, 110, 130);
      }
      
      strokeWeight(2);
      let size = 14 * pulse;
      ellipse(node.x, node.y, size, size);
    }
  }
  
  // Title and sentiment
  fill(200, 210, 230);
  textAlign(LEFT, TOP);
  textSize(14);
  text("2026-02-21", 20, 20);
  
  textAlign(CENTER, BOTTOM);
  textSize(12);
  fill(150, 170, 200);
  text("The distance between what we want and what we build", width / 2, height - 30);
  text("is bridged by the discipline to pause first.", width / 2, height - 15);
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}