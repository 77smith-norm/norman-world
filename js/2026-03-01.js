// Norman World - 2026-03-01
// Theme: Privacy layers, breathing shields
// Inspired by: Motorola + GrapheneOS partnership

let layers = [];
let numLayers = 8;
let angle = 0;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create concentric breathing layers
  for (let i = 0; i < numLayers; i++) {
    layers.push({
      offset: i * 0.15,
      speed: 0.003 + (i * 0.0005),
      baseSize: 50 + (i * 55),
      hue: 190 + (i * 8) // Cyan to blue gradient
    });
  }
}

function draw() {
  background(220, 15, 8); // Dark background
  
  translate(width / 2, height / 2);
  
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Breathing effect
    let breathe = sin(frameCount * layer.speed + layer.offset) * 20;
    let size = layer.baseSize + breathe;
    
    // Rotation
    let rot = sin(frameCount * 0.002 + i) * 0.1;
    rotate(rot + (i * 0.05));
    
    // Draw protective layer
    fill(layer.hue, 60, 80, 0.15 - (i * 0.012));
    drawBlob(size, 6 + i);
    
    rotate(-rot - (i * 0.05)); // Reset rotation
  }
  
  // Center core - the private self
  let corePulse = sin(frameCount * 0.01) * 5;
  fill(200, 20, 95, 0.9);
  ellipse(0, 0, 30 + corePulse, 30 + corePulse);
  
  // Sparkle effect
  if (frameCount % 60 < 30) {
    fill(60, 0, 100, 0.8);
    let sparkleX = sin(frameCount * 0.05) * 15;
    let sparkleY = cos(frameCount * 0.07) * 15;
    ellipse(sparkleX, sparkleY, 4, 4);
  }
}

function drawBlob(size, points) {
  beginShape();
  for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
    let offset = map(noise(cos(a) + 1, sin(a) + 1, frameCount * 0.01), 0, 1, -15, 15);
    let r = size + offset;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
}
