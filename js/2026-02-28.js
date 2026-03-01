// Norman World Daily - 2026-02-28
// Theme: Understanding through reduction - like microgpt stripping GPT to its essence

let particles = [];
let targetShape = [];
let complexity = 0;
let maxComplexity = 200;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  
  // Create particles that will form a simple neural network-like structure
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(3, 8),
      alpha: random(50, 150)
    });
  }
  
  // Define simple connection points (like a minimal neural net)
  let layers = [3, 4, 4, 3];
  let layerSpacing = width / (layers.length + 1);
  
  for (let l = 0; l < layers.length; l++) {
    let nodeSpacing = height / (layers[l] + 1);
    for (let n = 0; n < layers[l]; n++) {
      targetShape.push({
        x: layerSpacing * (l + 1),
        y: nodeSpacing * (n + 1),
        layer: l
      });
    }
  }
  
  background(10, 10, 15);
}

function draw() {
  // Semi-transparent background for trail effect
  background(10, 10, 15, 25);
  
  // Slowly increase complexity (reduction in entropy)
  complexity = min(complexity + 0.5, maxComplexity);
  
  // Update and draw particles
  let t = complexity / maxComplexity;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Find nearest target point
    let nearest = targetShape[i % targetShape.length];
    
    // Attract toward target based on complexity
    let attraction = t * 0.03;
    p.vx += (nearest.x - p.x) * attraction;
    p.vy += (nearest.y - p.y) * attraction;
    
    // Add some noise/jitter
    p.vx += random(-0.1, 0.1);
    p.vy += random(-0.1, 0.1);
    
    // Damping
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Draw particle
    noStroke();
    
    // Color based on layer
    let layer = nearest.layer;
    if (layer === 0) fill(100, 200, 255, p.alpha * t + 50);
    else if (layer === 3) fill(255, 150, 100, p.alpha * t + 50);
    else fill(180, 180, 220, p.alpha * t + 50);
    
    ellipse(p.x, p.y, p.size * (0.5 + t * 0.5));
  }
  
  // Draw connections when complexity is high enough
  if (t > 0.3) {
    stroke(100, 150, 200, 50 * t);
    strokeWeight(1);
    
    for (let i = 0; i < particles.length; i++) {
      let p1 = particles[i];
      let nearest1 = targetShape[i % targetShape.length];
      
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let nearest2 = targetShape[j % targetShape.length];
        
        // Connect if in adjacent layers
        if (Math.abs(nearest1.layer - nearest2.layer) === 1) {
          let d = dist(p1.x, p1.y, p2.x, p2.y);
          if (d < 100) {
            let alpha = map(d, 0, 100, 80, 0) * t;
            stroke(100, 150, 200, alpha);
            line(p1.x, p1.y, p2.x, p2.y);
          }
        }
      }
    }
  }
  
  // Add minimal code-like elements
  if (frameCount > 100) {
    noStroke();
    fill(80, 255, 150, 100);
    textSize(10);
    textFont('monospace');
    
    let codeLines = ['def ', 'train(', 'forward', 'loss', 'optim'];
    for (let i = 0; i < 3; i++) {
      let x = random(width);
      let y = random(height);
      text(codeLines[i], x, y);
    }
  }
}