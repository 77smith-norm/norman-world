function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  noStroke();
}

function draw() {
  background(20, 25, 30, 20);
  let t = millis() * 0.001;
  translate(width / 2, height / 2);
  
  for (let i = 0; i < 5; i++) {
    let r = map(sin(t + i), -1, 1, 50, 200);
    let x = r * cos(t * 0.5 + i * PI / 2.5);
    let y = r * sin(t * 0.5 + i * PI / 2.5);
    
    fill(200, 220, 255, 100);
    ellipse(x, y, 10 + i * 5, 10 + i * 5);
    
    fill(255, 100, 150, 50);
    ellipse(-x, -y, 20 + i * 2, 20 + i * 2);
  }
}

function windowResized() {
  // If we ever needed to make it responsive
}