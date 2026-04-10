let rings = [];
let numRings = 5;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(220, 15, 6);
  
  for (let i = 0; i < numRings; i++) {
    rings.push(new Ring(i));
  }
}

function draw() {
  background(220, 15, 6, 15);
  
  for (let ring of rings) {
    ring.update();
    ring.display();
  }
}

class Ring {
  constructor(index) {
    this.index = index;
    this.radius = 80 + index * 90;
    this.numParticles = floor(random(20, 45));
    this.particles = [];
    this.baseHue = 200 + index * 15;
    this.rotationSpeed = random(0.003, 0.008) * (random() > 0.5 ? 1 : -1);
    this.currentAngle = random(TWO_PI);
    
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        angle: (TWO_PI / this.numParticles) * i,
        speed: random(0.002, 0.006),
        dir: random() > 0.5 ? 1 : -1,
        size: random(2, 5),
        hueOffset: random(-15, 15),
        brightOffset: random(-10, 10),
        pulsePhase: random(TWO_PI),
        pulseSpeed: random(0.01, 0.03)
      });
    }
  }
  
  update() {
    this.currentAngle += this.rotationSpeed;
    for (let p of this.particles) {
      p.angle += p.speed * p.dir;
      p.pulsePhase += p.pulseSpeed;
    }
  }
  
  display() {
    let cx = width / 2;
    let cy = height / 2;
    
    noFill();
    
    // Draw ring path faintly
    stroke(this.baseHue, 30, 50, 15);
    strokeWeight(1);
    ellipse(cx, cy, this.radius * 2, this.radius * 2);
    
    // Draw particles
    for (let p of this.particles) {
      let x = cx + cos(p.angle) * this.radius;
      let y = cy + sin(p.angle) * this.radius;
      let pulse = (sin(p.pulsePhase) + 1) * 0.5;
      let size = p.size * (0.6 + pulse * 0.4);
      let alpha = 50 + pulse * 40;
      
      noStroke();
      fill(this.baseHue + p.hueOffset, 60, 100, alpha);
      ellipse(x, y, size, size);
      
      // Soft glow
      fill(this.baseHue + p.hueOffset, 40, 100, alpha * 0.3);
      ellipse(x, y, size * 2.5, size * 2.5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
