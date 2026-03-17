// Norman World - March 16, 2026
// A sketch about formal proof: geometric certainty

let t = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  noFill();
  strokeWeight(1.5);
}

function draw() {
  // Deep ink background
  background(10, 12, 20);
  
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Draw proof rings - layers of certainty
  for (let i = 0; i < 8; i++) {
    let phase = i * 0.15;
    let radius = 50 + i * 35 + sin(t * 0.5 + phase) * 10;
    
    // Color shifts from cool blue to warm amber as rings expand
    let r = map(i, 0, 7, 60, 255);
    let g = map(i, 0, 7, 120, 180);
    let b = map(i, 0, 7, 200, 100);
    let alpha = map(i, 0, 7, 200, 80);
    
    stroke(r, g, b, alpha);
    
    // Draw ring with small gaps - incomplete proofs seeking completion
    for (let a = 0; a < TWO_PI; a += 0.15) {
      let gapNoise = noise(i * 10, a * 2, t * 0.2);
      if (gapNoise > 0.35) {
        let x = centerX + cos(a) * radius;
        let y = centerY + sin(a) * radius;
        let x2 = centerX + cos(a + 0.12) * radius;
        let y2 = centerY + sin(a + 0.12) * radius;
        line(x, y, x2, y2);
      }
    }
  }
  
  // Central theorem - the core truth
  push();
  translate(centerX, centerY);
  rotate(t * 0.1);
  
  // Nested squares contracting toward truth
  for (let i = 0; i < 5; i++) {
    let s = 80 - i * 15;
    let alpha = map(i, 0, 4, 255, 100);
    stroke(200, 220, 255, alpha);
    rectMode(CENTER);
    rect(0, 0, s, s, 2);
  }
  
  // The proof point at center
  fill(255, 240, 200);
  noStroke();
  circle(0, 0, 8 + sin(t * 2) * 2);
  pop();
  
  // Floating lemmas - small truths scattered around
  for (let i = 0; i < 12; i++) {
    let angle = i * PI / 6 + t * 0.1;
    let dist = 180 + sin(t * 0.3 + i) * 30;
    let x = centerX + cos(angle) * dist;
    let y = centerY + sin(angle) * dist;
    
    stroke(100, 150, 200, 150);
    line(centerX, centerY, x, y);
    
    fill(150, 180, 220, 180);
    noStroke();
    circle(x, y, 3);
  }
  
  t += 0.02;
}
