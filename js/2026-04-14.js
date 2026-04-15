let particles = [];
let flowZones = [];
let numZones = 6;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(15, 25, 7);
  
  let zoneW = width / numZones;
  for (let i = 0; i < numZones; i++) {
    flowZones.push({
      x: zoneW * i,
      w: zoneW,
      baseAngle: random(-PI * 0.4, PI * 0.4),
      pulsePhase: random(TWO_PI),
      hue: 25 + i * 10
    });
  }
  
  for (let i = 0; i < 220; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(15, 25, 7, 18);
  
  for (let f of flowZones) {
    f.pulsePhase += 0.008;
    let alpha = 6 + sin(f.pulsePhase) * 3;
    stroke(f.hue, 25, 45, alpha);
    strokeWeight(1);
    line(f.x, 0, f.x, height);
  }
  
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(1, 2.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);
    this.hue = random(20, 50);
    this.baseHue = this.hue;
    this.sat = random(50, 85);
    this.size = random(2, 5);
    this.age = 0;
  }
  
  update() {
    let zoneIdx = floor(constrain(this.pos.x / (width / numZones), 0, numZones - 1));
    let zone = flowZones[zoneIdx];
    
    let t = frameCount * 0.003;
    let noiseVal = noise(this.pos.x * 0.0015, this.pos.y * 0.0015, t);
    let angle = zone.baseAngle + map(noiseVal, 0, 1, -PI * 0.3, PI * 0.3);
    
    let target = p5.Vector.fromAngle(angle);
    target.setMag(0.06);
    this.acc.add(target);
    
    this.vel.add(this.acc);
    this.vel.limit(2.5);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.age++;
    
    if (this.pos.x > width + 20 || this.pos.x < -20 || this.pos.y > height + 20 || this.pos.y < -20) {
      this.reset();
    }
  }
  
  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(1, 2.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);
    this.age = 0;
  }
  
  display() {
    let alpha = 40 + (this.age * 0.05);
    noStroke();
    fill(this.hue, this.sat, 90, alpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    fill(this.hue, this.sat * 0.5, 95, alpha * 0.2);
    ellipse(this.pos.x, this.pos.y, this.size * 2.2, this.size * 2.2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
