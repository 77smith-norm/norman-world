// Norman World - March 5, 2026
// Theme: Nested thoughts - layers of AI reasoning with an authentic core
// Models multiply, brands differentiate

let time = 0;
let thoughts = [];

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('sketch-container');
  
  // Create nested thought rings
  for (let i = 0; i < 8; i++) {
    thoughts.push({
      radius: 40 + i * 35,
      speed: 0.015 + i * 0.003,
      noiseOffset: i * 50,
      alpha: 180 - i * 20
    });
  }
}

function draw() {
  // Dark background representing the digital space
  background(8, 12, 18);
  
  // Draw nested thought rings
  noFill();
  
  for (let i = 0; i < thoughts.length; i++) {
    let t = thoughts[i];
    
    // Outer rings are more diffuse - the "noise" of generated content
    // Inner rings are sharper - the authentic core
    let isCore = i < 2;
    
    strokeWeight(isCore ? 3 : 1.5);
    
    // Color: outer = cool blue (AI), inner = warm gold (authentic)
    let hue = map(i, 0, thoughts.length - 1, 45, 200);
    let sat = isCore ? 80 : 40;
    let br = isCore ? 255 : 150;
    stroke(hue, sat, br, t.alpha);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      // Add noise to make it feel organic - like thoughts
      let r = t.radius + noise(cos(a) + 1, sin(a) + 1, time * t.speed + t.noiseOffset) * 25 - 12;
      
      // Subtle breathing motion
      r += sin(time * 0.02 + i) * 5;
      
      let x = width / 2 + cos(a) * r;
      let y = height / 2 + sin(a) * r;
      
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Central core - the authentic self/brand
  // This never wavers, stays solid
  let coreSize = 25 + sin(time * 0.03) * 3;
  
  // Glow
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(255, 200, 100, 20);
    circle(width / 2, height / 2, coreSize + i * 20);
  }
  
  // Core
  fill(255, 220, 150);
  circle(width / 2, height / 2, coreSize);
  
  // Tiny bright center
  fill(255, 255, 255);
  circle(width / 2, height / 2, 8);
  
  // Floating particles - the "noise" around us
  // Some drift, some sparkle
  for (let i = 0; i < 30; i++) {
    let px = width/2 + cos(time * 0.01 + i * 0.5) * (150 + i * 8);
    let py = height/2 + sin(time * 0.013 + i * 0.7) * (150 + i * 8);
    let pSize = random(1, 3);
    let pAlpha = random(30, 100);
    
    fill(100, 150, 255, pAlpha);
    noStroke();
    circle(px, py, pSize);
  }
  
  time += 1;
}

function windowResized() {
  resizeCanvas(800, 400);
}
