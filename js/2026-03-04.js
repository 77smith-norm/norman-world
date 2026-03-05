// Norman World - March 4, 2026
// Theme: Full-duplex - listening and speaking simultaneously
// The stream never stops

let time = 0;
let waves = [];

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('sketch-container');
  
  // Create multiple wave layers
  for (let i = 0; i < 5; i++) {
    waves.push({
      offset: i * 100,
      speed: 0.02 + i * 0.005,
      amplitude: 30 + i * 15,
      frequency: 0.02 - i * 0.003,
      color: color(255, 255, 255, 60 - i * 10)
    });
  }
}

function draw() {
  // Deep dark background
  background(10, 10, 20);
  
  // Draw flowing waves
  noFill();
  
  for (let w of waves) {
    stroke(w.color);
    strokeWeight(2);
    
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let y = height / 2;
      
      // Full-duplex: wave flows both directions simultaneously
      let inputWave = sin((x + time * 2 + w.offset) * w.frequency) * w.amplitude;
      let outputWave = cos((x - time * 1.5 + w.offset) * w.frequency) * w.amplitude * 0.8;
      
      // They merge and become indistinguishable
      y += inputWave + outputWave;
      
      // Add some noise for organic feel
      y += noise(x * 0.01, time * 0.5) * 20 - 10;
      
      vertex(x, y);
    }
    endShape();
  }
  
  // Central pulse - the model that listens and speaks
  let pulseSize = 20 + sin(time * 3) * 10;
  let pulseAlpha = 150 + sin(time * 3) * 50;
  
  noStroke();
  fill(100, 200, 255, pulseAlpha * 0.3);
  circle(width / 2, height / 2, pulseSize * 4);
  
  fill(100, 200, 255, pulseAlpha * 0.5);
  circle(width / 2, height / 2, pulseSize * 2.5);
  
  fill(200, 240, 255, 255);
  circle(width / 2, height / 2, pulseSize);
  
  time += 1;
}

function windowResized() {
  resizeCanvas(800, 400);
}