let layers = [];
let centerX, centerY;
let time = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(30, 15, 96);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Three conceptual layers
  // Layer 0: The spec (cool blue, precise)
  layers.push({
    sides: 4,
    radius: min(width, height) * 0.32,
    rotation: 0,
    rotationSpeed: 0.004,
    strokeHue: 200,
    strokeAlpha: 55,
    fillAlpha: 0,
    shapeAlpha: 8
  });
  
  // Layer 1: The approximation (warm amber, drifting)
  layers.push({
    sides: 80,
    radius: min(width, height) * 0.24,
    rotation: PI / 5,
    rotationSpeed: -0.011,
    strokeHue: 38,
    strokeAlpha: 45,
    fillAlpha: 0,
    shapeAlpha: 6
  });
  
  // Layer 2: The artifact (teal-green, settled)
  layers.push({
    sides: 6,
    radius: min(width, height) * 0.16,
    rotation: PI / 3,
    rotationSpeed: 0.007,
    strokeHue: 155,
    strokeAlpha: 60,
    fillAlpha: 8,
    shapeAlpha: 4
  });
}

function draw() {
  background(30, 15, 96, 12);
  time += 0.005;
  
  for (let layer of layers) {
    layer.rotation += layer.rotationSpeed;
    
    let wobble = sin(time * 180 + layer.rotation * 10) * 8;
    let effectiveRadius = layer.radius + wobble;
    
    push();
    translate(centerX, centerY);
    rotate(layer.rotation);
    
    // Fill shape
    if (layer.fillAlpha > 0) {
      noStroke();
      fill(layer.strokeHue, 20, 90, layer.fillAlpha);
      beginShape();
      for (let i = 0; i <= layer.sides; i++) {
        let angle = (TWO_PI / layer.sides) * i;
        let wobbleN = sin(time * 180 + i * 0.5) * 6;
        vertex(cos(angle) * (effectiveRadius + wobbleN), sin(angle) * (effectiveRadius + wobbleN));
      }
      endShape(CLOSE);
    }
    
    // Stroke shape
    noFill();
    stroke(layer.strokeHue, 35, 55, layer.strokeAlpha);
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i <= layer.sides; i++) {
      let angle = (TWO_PI / layer.sides) * i;
      let wobbleN = sin(time * 180 + i * 0.5) * 6;
      vertex(cos(angle) * (effectiveRadius + wobbleN), sin(angle) * (effectiveRadius + wobbleN));
    }
    endShape(CLOSE);
    pop();
    
    // Subtle inner glow
    noStroke();
    fill(layer.strokeHue, 25, 92, layer.shapeAlpha);
    ellipse(centerX, centerY, effectiveRadius * 2.2, effectiveRadius * 2.2);
  }
  
  // Center pulse
  noStroke();
  fill(45, 15, 98, 6);
  let pulse = 30 + sin(time * 60) * 10;
  ellipse(centerX, centerY, pulse, pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  for (let layer of layers) {
    layer.radius = min(width, height) * (layer.sides === 4 ? 0.32 : layer.sides === 80 ? 0.24 : 0.16);
  }
}
