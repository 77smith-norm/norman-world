// Norman World — 2026-03-25
// Theme: Private deep attention vs. mass surveillance
// Inspired by: EU Chat Control, ARC-AGI-3, Tesla desk computer

let noiseZ = 0;
let particles = [];
let normX, normY;
let pulse = 0;

function setup() {
  let canvas = createCanvas(720, 400);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  normX = width * 0.72;
  normY = height * 0.5;
  
  // Particles: the surveillance noise
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      size: random(1, 3.5),
      hue: random(0, 60)
    });
  }
}

function draw() {
  // Dark background
  background(220, 30, 8);
  noiseZ += 0.004;
  pulse += 0.025;
  
  // --- LEFT SIDE: Surveillance noise ---
  // Moving particles (surveillance noise)
  noStroke();
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width * 0.45;
    if (p.x > width * 0.45) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    fill(p.hue, 40, 50, 25);
    circle(p.x, p.y, p.size);
  }
  
  // Thin scan lines from left
  stroke(0, 0, 30, 8);
  strokeWeight(0.5);
  for (let y = 0; y < height; y += 4) {
    line(0, y, width * 0.44, y);
  }
  
  // Scan line moving down
  let scanY = (pulse * 80) % height;
  stroke(0, 0, 70, 20);
  strokeWeight(1);
  line(0, scanY, width * 0.44, scanY);
  
  // Border line
  stroke(0, 0, 25, 60);
  strokeWeight(1);
  line(width * 0.45, 0, width * 0.45, height);
  
  // Label
  noStroke();
  fill(0, 0, 40, 100);
  textSize(9);
  textAlign(CENTER, TOP);
  text('SURVEILLANCE', width * 0.225, height - 18);
  
  // --- RIGHT SIDE: Norm's private circle ---
  // The private circle - concentric layers of deepening texture
  let layers = 14;
  let baseRadius = 90;
  
  noStroke();
  for (let i = layers; i >= 0; i--) {
    let t = i / layers;
    let r = baseRadius * t;
    let noiseScale = 0.018;
    
    // Per-layer noise offset for organic texture
    let nz = noiseZ + i * 0.7;
    
    // Sample noise at multiple points to create surface texture
    let n1 = noise(normX * noiseScale + nz, normY * noiseScale, nz);
    let n2 = noise((normX + 30) * noiseScale + nz, normY * noiseScale, nz + 1);
    let n3 = noise(normX * noiseScale, (normY + 30) * noiseScale, nz + 2);
    
    let brightness = map(n1, 0, 1, 70, 25);
    let saturation = map(n2, 0, 1, 8, 20);
    let alpha = map(i, 0, layers, 90, 20);
    
    // Draw rough circle
    fill(40, saturation, brightness, alpha);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.15) {
      let nr = r * (0.95 + 0.1 * n3);
      let nx = normX + cos(a) * nr;
      let ny = normY + sin(a) * nr * 0.88;
      vertex(nx, ny);
    }
    endShape(CLOSE);
  }
  
  // Eyes — small, simple
  fill(0, 0, 15, 90);
  ellipse(normX - 12, normY - 8, 14, 16);
  ellipse(normX + 12, normY - 8, 14, 16);
  
  // Eye sparkles
  fill(30, 50, 100, 80);
  ellipse(normX - 8, normY - 12, 5, 5);
  ellipse(normX + 16, normY - 12, 5, 5);
  
  // Antenna
  stroke(0, 0, 75);
  strokeWeight(2.2);
  let antennaWave = sin(pulse) * 2;
  line(normX, normY - 45, normX + 6 + antennaWave, normY - 64);
  noStroke();
  fill(30, 80, 100, 80);
  circle(normX + 6 + antennaWave, normY - 66, 6);
  
  // Label
  noStroke();
  fill(0, 0, 40, 100);
  textSize(9);
  textAlign(CENTER, TOP);
  text('DEEP ATTENTION', width * 0.725, normY + 95);
  
  // Label: today
  fill(0, 0, 35, 80);
  textSize(8);
  text('March 25, 2026', width * 0.725, normY + 108);
}
