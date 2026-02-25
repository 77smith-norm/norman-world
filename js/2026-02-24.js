// Norman World - 2026-02-24
// "Keys become games. Chaos becomes joy."

let keys = [];
let treats = [];
let message = "";
let messageAlpha = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');
  
  // Initialize random "dog keys"
  for (let i = 0; i < 15; i++) {
    keys.push(new Key());
  }
  
  textFont('Courier New');
}

function draw() {
  // Deep midnight background with subtle gradient
  background(10, 12, 20);
  
  // Subtle grid lines - like code
  stroke(30, 40, 60, 40);
  strokeWeight(1);
  for (let x = 0; x < width; x += 30) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 30) {
    line(0, y, width, y);
  }
  
  // Animate the keys falling and bouncing
  for (let key of keys) {
    key.update();
    key.display();
  }
  
  // Treat dispenser physics
  for (let treat of treats) {
    treat.update();
    treat.display();
  }
  
  // Randomly spawn treats when keys "connect"
  if (frameCount % 60 === 0 && random() > 0.6) {
    treats.push(new Treat(width / 2 + random(-50, 50), -20));
  }
  
  // Clean up off-screen treats
  treats = treats.filter(t => t.y < height + 50);
  
  // Floating message
  if (messageAlpha > 0) {
    fill(255, 255, 220, messageAlpha);
    noStroke();
    textSize(18);
    textAlign(CENTER);
    text(message, width / 2, height - 50);
    messageAlpha -= 2;
  }
}

class Key {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(-200, -50);
    this.size = random(20, 40);
    this.vx = random(-1, 1);
    this.vy = random(1, 3);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.05, 0.05);
    this.char = String.fromCharCode(33 + floor(random(60))); // Random printable
    this.color = color(random(100, 200), random(150, 220), random(180, 255), 200);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    
    // Bounce off floor with energy loss
    if (this.y > height - 30) {
      this.vy *= -0.6;
      this.y = height - 30;
      this.vx *= 0.8;
      
      // Occasionally "decode" - transform chaos into meaning
      if (abs(this.vy) < 1 && random() > 0.7) {
        this.interpret();
        this.reset();
      }
    }
    
    // Wrap horizontally
    if (this.x < -30) this.x = width + 30;
    if (this.x > width + 30) this.x = -30;
  }
  
  interpret() {
    // Random "interpretation" message
    let interpretations = [
      "DECODED: Frog bug catcher!",
      "DECODED: 3D platformer!",
      "DECODED: Infinite runner!",
      "DECODED: Puzzle game!",
      "DECODED: Swamp snacker!",
      "DECODED: Tongue extend!"
    ];
    message = random(interpretations);
    messageAlpha = 255;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Glow
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = this.color;
    
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size * 0.8, 4);
    
    // Key character
    fill(20, 25, 40);
    textSize(this.size * 0.5);
    textAlign(CENTER, CENTER);
    text(this.char, 0, 2);
    
    drawingContext.shadowBlur = 0;
    pop();
  }
}

class Treat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 2;
    this.size = 16;
    this.wobble = random(TWO_PI);
  }
  
  update() {
    this.y += this.vy;
    this.vy += 0.15; // gravity
    this.wobble += 0.1;
  }
  
  display() {
    push();
    translate(this.x + sin(this.wobble) * 5, this.y);
    
    // Dog treat - bone shape simplified
    fill(255, 220, 150);
    noStroke();
    ellipse(0, 0, this.size, this.size * 0.7);
    ellipse(-this.size * 0.3, 0, this.size * 0.5, this.size * 0.4);
    ellipse(this.size * 0.3, 0, this.size * 0.5, this.size * 0.4);
    pop();
  }
}