let layers = [];
let time = 0;
let centerX, centerY;

let previousWidth = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container ? container.offsetWidth : windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  previousWidth = w;
  let cnv = createCanvas(w, h);
  if (cnv && cnv.parent) cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  background(240, 30, 6);
  
  // Three nested "what persists" layers — like peeling away the non-essential
  // Layer 0: Outer frame (cool, distant, barely touched)
  layers.push({
    w: min(width, height) * 0.85,
    h: min(width, height) * 0.85,
    alpha: 18,
    hue: 195,
    strokeAlpha: 35,
    strokeWeight: 1
  });
  
  // Layer 1: The revealed layer (warm, closer)
  layers.push({
    w: min(width, height) * 0.60,
    h: min(width, height) * 0.60,
    alpha: 22,
    hue: 42,
    strokeAlpha: 45,
    strokeWeight: 1.2
  });
  
  // Layer 2: The core (teal-green, what remains)
  layers.push({
    w: min(width, height) * 0.35,
    h: min(width, height) * 0.35,
    alpha: 28,
    hue: 155,
    strokeAlpha: 55,
    strokeWeight: 1.4
  });
}

function draw() {
  // Fade previous frame — creates persistence trails
  background(240, 30, 6, 10);
  time += 0.003;
  
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    let wobbleX = sin(time * 120 + i * 40) * (width * 0.015);
    let wobbleY = cos(time * 100 + i * 30) * (height * 0.015);
    
    push();
    translate(centerX + wobbleX, centerY + wobbleY);
    
    // Each layer is a rounded rectangle — like a peeling sheet
    noStroke();
    fill(layer.hue, 18, 92, layer.alpha);
    rectMode(CENTER);
    let corner = 8 + i * 4;
    rect(0, 0, layer.w, layer.h, corner);
    
    // Subtle stroke on edges
    noFill();
    stroke(layer.hue, 30, 50, layer.strokeAlpha);
    strokeWeight(layer.strokeWeight);
    rect(0, 0, layer.w, layer.h, corner);
    
    pop();
  }
  
  // Ghost outline — a fourth "deleted" layer, barely there
  push();
  translate(centerX, centerY);
  noFill();
  stroke(0, 0, 70, 18);
  strokeWeight(0.8);
  let ghostSize = min(width, height) * (0.92 + sin(time * 80) * 0.01);
  rect(0, 0, ghostSize, ghostSize, 20);
  pop();
  
  // Soft center glow — what remains after stripping
  noStroke();
  fill(160, 20, 95, 8);
  let pulseRadius = 30 + sin(time * 50) * 8;
  ellipse(centerX, centerY, pulseRadius * 2, pulseRadius * 2);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  if (abs(w - previousWidth) > 10) {
    const h = Math.max(400, windowHeight * 0.6);
    resizeCanvas(w, h);
    previousWidth = w;
  
  centerX = width / 2;
  centerY = height / 2;
  
  let scale = min(width, height);
  layers[0].w = scale * 0.85; layers[0].h = scale * 0.85;
  layers[1].w = scale * 0.60; layers[1].h = scale * 0.60;
  layers[2].w = scale * 0.35; layers[2].h = scale * 0.35;

  }
}
