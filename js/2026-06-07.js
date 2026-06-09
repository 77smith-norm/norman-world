let t = 0;
let noiseOffset = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  noStroke();
}

function draw() {
  background(245, 242, 235);
  
  t += 0.008;
  noiseOffset += 0.003;
  
  // Soft interference waves - signal vs noise
  for (let x = 0; x < width; x += 12) {
    for (let y = 0; y < height; y += 12) {
      let n = noise(x * 0.008 + noiseOffset, y * 0.008, t * 0.3);
      let distFromCenter = dist(x, y, width/2, height/2);
      let pulse = sin(t * 1.2 + distFromCenter * 0.01) * 0.5 + 0.5;
      
      let alpha = map(n * pulse, 0, 1, 20, 90);
      let size = map(n, 0, 1, 2, 7);
      
      // Muted gold and dust blue palette
      if (n > 0.6) {
        fill(180, 160, 120, alpha);
      } else {
        fill(120, 140, 160, alpha * 0.7);
      }
      circle(x, y, size);
    }
  }
  
  // Gentle horizontal signal lines - friction between layers
  stroke(80, 70, 60, 35);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let y = height * 0.3 + i * 40 + sin(t * 0.8 + i) * 8;
    line(0, y, width, y + cos(t * 0.6) * 3);
  }
  noStroke();
  
  // Subtle attention pulses on mouse
  if (mouseX > 0 && mouseY > 0) {
    let d = dist(mouseX, mouseY, width/2, height/2);
    let pulseSize = map(sin(t * 3), -1, 1, 20, 60);
    fill(200, 180, 140, 40);
    circle(mouseX, mouseY, pulseSize);
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}