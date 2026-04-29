function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  noFill();
  stroke(255, 255, 255, 40);
  strokeWeight(1);
}

function draw() {
  background(0, 0, 0, 8);
  
  let t = frameCount * 0.003;
  let cx = width / 2;
  let cy = height / 2;
  
  // Concentric rings — echoes that don't quite close
  for (let i = 0; i < 18; i++) {
    let r = map(i, 0, 18, 40, width * 0.45);
    let wobble = sin(t + i * 0.4) * 12;
    let rx = r + wobble;
    let ry = r * 0.6 + sin(t * 0.7 + i * 0.3) * 8;
    
    push();
    translate(cx, cy);
    rotate(t * 0.1 + i * 0.15);
    ellipse(0, 0, rx * 2, ry * 2);
    pop();
  }
  
  // Sparse points — like words that stopped being used
  let numDots = 12;
  for (let j = 0; j < numDots; j++) {
    let angle = (TWO_PI / numDots) * j + t * 0.2;
    let dist = map(sin(t + j * 0.9), -1, 1, width * 0.15, width * 0.42);
    let px = cx + cos(angle) * dist;
    let py = cy + sin(angle) * dist * 0.55;
    noStroke();
    fill(255, 255, 255, 25);
    circle(px, py, 3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
