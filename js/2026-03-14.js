// Norman World - March 14, 2026
// Theme: TCP hole punching - connections through barriers

let particles = [];
let barrier;

function setup() {
  const container = document.getElementById('sketch-container');
  const canvas = createCanvas(container.offsetWidth, 400);
  canvas.parent('sketch-container');
  
  // Create barrier in the middle
  barrier = {
    x: width / 2,
    thickness: 30,
    holes: []
  };
  
  // Create several holes in the barrier
  for (let i = 0; i < 5; i++) {
    barrier.holes.push({
      y: random(50, height - 50),
      size: random(40, 80)
    });
  }
  
  // Particles on both sides
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(random() < 0.5 ? 'left' : 'right'));
  }
}

function draw() {
  // Dark background with subtle gradient
  background(15, 20, 30);
  
  // Draw barrier
  noStroke();
  
  // Left side of barrier
  fill(40, 45, 60);
  rect(0, 0, barrier.x - barrier.thickness/2, height);
  
  // Right side of barrier  
  fill(40, 45, 60);
  rect(barrier.x + barrier.thickness/2, 0, width - (barrier.x + barrier.thickness/2), height);
  
  // Draw holes as darker cutouts
  for (let hole of barrier.holes) {
    // Hole glow
    fill(100, 120, 160, 30);
    ellipse(barrier.x, hole.y, hole.size + 20, hole.size + 20);
    
    // Hole itself - background showing through
    fill(15, 20, 30);
    ellipse(barrier.x, hole.y, hole.size, hole.size);
  }
  
  // Draw and update particles
  for (let p of particles) {
    p.update();
    p.display();
    p.checkBarrier(barrier);
  }
  
  // Connection lines when particles find holes
  stroke(100, 150, 255, 40);
  strokeWeight(1);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].pos.x, particles[i].pos.y, 
                   particles[j].pos.x, particles[j].pos.y);
      if (d < 80 && particles[i].side !== particles[j].side) {
        line(particles[i].pos.x, particles[i].pos.y,
             particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
}

class Particle {
  constructor(side) {
    this.side = side;
    this.pos = createVector(
      side === 'left' ? random(20, barrier.x - barrier.thickness/2 - 20) 
                      : random(barrier.x + barrier.thickness/2 + 20, width - 20),
      random(height)
    );
    this.vel = p5.Vector.random2D().mult(0.5);
    this.size = random(4, 8);
    this.color = color(random(100, 180), random(150, 220), 255, 150);
  }
  
  update() {
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 10 || this.pos.x > width - 10) this.vel.x *= -1;
    if (this.pos.y < 10 || this.pos.y > height - 10) this.vel.y *= -1;
  }
  
  checkBarrier(b) {
    // Check if near barrier
    if (abs(this.pos.x - b.x) < b.thickness/2 + this.size) {
      // Check if aligned with a hole
      for (let hole of b.holes) {
        if (abs(this.pos.y - hole.y) < hole.size/2) {
          // Can pass through - no collision
          return;
        }
      }
      // Not aligned with hole - bounce
      if (this.side === 'left' && this.pos.x > b.x - b.thickness/2 - 10) {
        this.vel.x *= -1;
        this.pos.x = b.x - b.thickness/2 - 10;
      } else if (this.side === 'right' && this.pos.x < b.x + b.thickness/2 + 10) {
        this.vel.x *= -1;
        this.pos.x = b.x + b.thickness/2 + 10;
      }
    }
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
    
    // Glow
    fill(red(this.color), green(this.color), blue(this.color), 50);
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }
}

// Handle resize
function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, 400);
}