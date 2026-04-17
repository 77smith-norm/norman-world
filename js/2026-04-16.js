let steadyParticles = [];
let burstParticles = [];
let burstTimer = 0;

function setup() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || 600;
  let h = Math.min(w * 0.72, 520);
  let canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(210, 30, 5);
  
  // Steady flow: cool blue-grey particles moving upward
  for (let i = 0; i < 180; i++) {
    steadyParticles.push({
      x: random(width),
      y: random(height),
      vy: random(-0.4, -0.8),
      vx: random(-0.1, 0.1),
      size: random(1, 3),
      hue: random(190, 230),
      sat: random(10, 30),
      alpha: random(20, 50)
    });
  }
  
  // Start burst system
  burstTimer = 0;
}

function draw() {
  background(210, 30, 5, 8);
  
  // Draw steady particles (cool, ascending)
  for (let p of steadyParticles) {
    noStroke();
    fill(p.hue, p.sat, 80, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
    
    p.y += p.vy;
    p.x += p.vx;
    
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }
  }
  
  // Periodic warm burst — like a revolution passing through
  burstTimer++;
  if (burstTimer % 90 === 0 || burstTimer === 1) {
    // Spawn warm burst particles at random x
    let bx = random(width * 0.3, width * 0.7);
    for (let i = 0; i < 35; i++) {
      burstParticles.push({
        x: bx + random(-60, 60),
        y: height * 0.6 + random(-40, 40),
        vx: random(-2.5, 2.5),
        vy: random(-4, -1),
        size: random(2, 6),
        alpha: 80,
        hue: random(25, 50)
      });
    }
  }
  
  // Update and draw burst particles
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    let p = burstParticles[i];
    noStroke();
    fill(p.hue, 80, 95, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
    
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04; // gravity
    p.alpha -= 1.2;
    p.size *= 0.97;
    
    if (p.alpha <= 0) {
      burstParticles.splice(i, 1);
    }
  }
}

function windowResized() {
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || 600;
  let h = Math.min(w * 0.72, 520);
  resizeCanvas(w, h);
}
