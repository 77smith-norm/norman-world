let particles = [];
let arcs = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(220, 80, 10);
  
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
  
  for (let i = 0; i < 5; i++) {
    arcs.push(new VastArc(i));
  }
}

function draw() {
  background(220, 80, 10, 15);
  
  translate(width / 2, height / 2);
  
  for (let a of arcs) {
    a.update();
    a.display();
  }
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class VastArc {
  constructor(index) {
    this.r = random(min(width, height) * 0.3, min(width, height) * 0.8);
    this.angle = random(TWO_PI);
    this.speed = random(0.001, 0.003) * (index % 2 === 0 ? 1 : -1);
    this.hue = random(200, 240);
    this.weight = random(1, 3);
  }
  
  update() {
    this.angle += this.speed;
  }
  
  display() {
    noFill();
    stroke(this.hue, 50, 90, 40);
    strokeWeight(this.weight);
    arc(0, 0, this.r, this.r, this.angle, this.angle + PI / 3);
    
    // Moon-like glowing node
    let x = cos(this.angle) * this.r / 2;
    let y = sin(this.angle) * this.r / 2;
    noStroke();
    fill(0, 0, 100, 80);
    ellipse(x, y, 8, 8);
    fill(0, 0, 100, 20);
    ellipse(x, y, 20, 20);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(-50, 50), random(-50, 50));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1, 4);
    this.hue = random(10, 40);
  }
  
  update() {
    let friction = p5.Vector.mult(this.vel, -0.05); // The friction of builds
    let centerPull = p5.Vector.sub(createVector(0, 0), this.pos);
    centerPull.setMag(0.05);
    
    let noiseVec = createVector(
      noise(this.pos.x * 0.01, frameCount * 0.01) - 0.5,
      noise(this.pos.y * 0.01, frameCount * 0.01) - 0.5
    );
    noiseVec.setMag(0.2);
    
    this.acc.add(friction);
    this.acc.add(centerPull);
    this.acc.add(noiseVec);
    
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  display() {
    noStroke();
    fill(this.hue, 80, 100, 60);
    ellipse(this.pos.x, this.pos.y, 3, 3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
