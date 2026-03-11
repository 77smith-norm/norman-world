// Norman World - March 10, 2026
// Theme: Signal through noise, lazy evaluation, value over hype

let waves = [];
let time = 0;
const numWaves = 7;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch-container');
  
  colorMode(HSB, 360, 100, 100, 1);
  background(220, 30, 10); // Deep night
  
  // Create waves that emerge when they have something to say
  for (let i = 0; i < numWaves; i++) {
    waves.push(new Wave(i));
  }
}

function draw() {
  // Very subtle trails
  background(220, 30, 10, 0.04);
  
  // Draw horizontal signal waves - the message beneath the noise
  for (let w of waves) {
    w.update();
    w.display();
  }
  
  // Occasional signal pulses - moments of clarity
  if (frameCount % 120 === 0) {
    pulse = new Pulse();
    pulses.push(pulse);
  }
  
  for (let i = pulses.length - 1; i >= 0; i--) {
    pulses[i].update();
    pulses[i].display();
    if (pulses[i].done) {
      pulses.splice(i, 1);
    }
  }
  
  // Central beacon - the value you create
  let beaconSize = 8 + sin(time * 0.03) * 3;
  noStroke();
  fill(150, 40, 90, 0.8);
  ellipse(width/2, height/2, beaconSize, beaconSize);
  
  // Soft glow around beacon
  for (let i = 4; i > 0; i--) {
    fill(150, 30, 80, 0.02);
    ellipse(width/2, height/2, beaconSize * i * 2, beaconSize * i * 2);
  }
  
  time++;
}

class Wave {
  constructor(index) {
    this.y = map(index, 0, numWaves - 1, 100, 500);
    this.offset = random(1000);
    this.amplitude = map(index, 0, numWaves - 1, 30, 10);
    this.frequency = map(index, 0, numWaves - 1, 0.01, 0.02);
    this.speed = map(index, 0, numWaves - 1, 0.8, 1.2);
    this.hue = map(index, 0, numWaves - 1, 180, 220); // Blue to cyan
    this.opacity = map(index, 0, numWaves - 1, 0.3, 0.15);
  }
  
  update() {
    // Wave moves forward - signal propagates
  }
  
  display() {
    noFill();
    strokeWeight(2);
    
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let y = this.y + sin((x + time * this.speed + this.offset) * this.frequency) * this.amplitude;
      let alpha = this.opacity * (1 - abs(x - width/2) / (width/2) * 0.5);
      stroke(this.hue, 50, 80, alpha);
      vertex(x, y);
    }
    endShape();
  }
}

let pulses = [];

class Pulse {
  constructor() {
    this.x = random(width);
    this.y = random(100, 500);
    this.size = 0;
    this.maxSize = random(30, 60);
    this.done = false;
    this.hue = random(140, 160);
  }
  
  update() {
    this.size += 1.5;
    if (this.size > this.maxSize) {
      this.done = true;
    }
  }
  
  display() {
    noFill();
    let alpha = map(this.size, 0, this.maxSize, 0.5, 0);
    stroke(this.hue, 40, 90, alpha);
    strokeWeight(1.5);
    ellipse(this.x, this.y, this.size, this.size * 0.4);
  }
}
