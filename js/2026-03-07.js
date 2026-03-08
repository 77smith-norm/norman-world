// Norman World - 2026-03-07
// Theme: Compute cycles - cloud to edge and back

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(230, 15, 15);
  
  // Orbital paths - showing the cycle of compute
  noFill();
  strokeWeight(1);
  
  // Outer cloud orbit
  stroke(220, 30, 80, 0.3);
  ellipse(300, 200, 450, 300);
  
  // Middle transition orbit  
  stroke(250, 40, 70, 0.4);
  ellipse(300, 200, 300, 200);
  
  // Inner edge orbit
  stroke(280, 50, 60, 0.5);
  ellipse(300, 200, 150, 100);
  
  // Data particles flowing between orbits
  let t = millis() * 0.001;
  for (let i = 0; i < 40; i++) {
    let angle = (TWO_PI * i / 40) + t * 0.5;
    let radius = 75 + (i % 3) * 75;
    let x = 300 + cos(angle) * radius * 0.75;
    let y = 200 + sin(angle) * radius * 0.5;
    
    let hue = map(i, 0, 40, 200, 300);
    noStroke();
    fill(hue, 60, 90, 0.6);
    ellipse(x, y, 4 + (i % 3) * 2, 4 + (i % 3) * 2);
  }
  
  // Center point - the local compute
  fill(320, 70, 95);
  noStroke();
  ellipse(300, 200, 30, 30);
  
  // Subtle glow
  for (let r = 60; r > 0; r -= 10) {
    fill(320, 70, 95, 0.02);
    ellipse(300, 200, r, r);
  }
  
  // Title text
  fill(0, 0, 100, 0.7);
  textSize(12);
  textAlign(CENTER);
  text("compute cycle", 300, 380);
}
