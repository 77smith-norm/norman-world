// 2026-07-16 — Parallel Voices Settling Into Stone
let particles = [];
let clusters = [];
let settled = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // Create two streams of particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.8, 0.8),
      vy: random(-0.8, 0.8),
      stream: i % 2,
      size: random(4, 10),
      settled: false,
      settleX: 0,
      settleY: 0,
      alpha: 80
    });
  }
  
  // Define cluster points (stone forms)
  let numClusters = floor(random(3, 6));
  for (let i = 0; i < numClusters; i++) {
    clusters.push({
      x: random(width * 0.15, width * 0.85),
      y: random(height * 0.15, height * 0.85),
      r: random(40, 100),
      hue: random(20, 45)
    });
  }
}

function draw() {
  background(30, 8, 95);
  
  // Draw cluster zones (subtle stone texture)
  for (let c of clusters) {
    fill(c.hue, 15, 85, 20);
    ellipse(c.x, c.y, c.r * 2, c.r * 2);
  }
  
  // Update and draw particles
  for (let p of particles) {
    if (!p.settled) {
      // Move with slight drift toward nearest cluster
      let nearest = null;
      let nearestDist = Infinity;
      for (let c of clusters) {
        let d = dist(p.x, p.y, c.x, c.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = c;
        }
      }
      
      // Gentle pull when close to a cluster
      if (nearestDist < nearest.r * 2.5) {
        let angle = atan2(nearest.y - p.y, nearest.x - p.x);
        let pull = map(nearestDist, 0, nearest.r * 2.5, 0.15, 0.01);
        p.vx += cos(angle) * pull;
        p.vy += sin(angle) * pull;
      }
      
      // Add some turbulence
      p.vx += random(-0.05, 0.05);
      p.vy += random(-0.05, 0.05);
      
      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      
      // Check if should settle
      if (nearestDist < nearest.r * 0.4 && random() < 0.008) {
        p.settled = true;
        p.settleX = p.x;
        p.settleY = p.y;
        p.vx = 0;
        p.vy = 0;
        settled++;
      }
    } else {
      // Settled particles gently pulse
      p.alpha = 70 + sin(frameCount * 0.02 + p.settleX * 0.01) * 15;
    }
    
    // Draw
    let hue = p.stream === 0 ? 35 : 25;
    let sat = p.settled ? 25 : 40;
    let bri = p.settled ? 65 : 85;
    fill(hue, sat, bri, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
    
    // Connection lines between nearby same-stream particles
    if (!p.settled) {
      for (let other of particles) {
        if (other !== p && other.stream === p.stream && !other.settled) {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < 60) {
            stroke(hue, 20, 80, map(d, 0, 60, 30, 0));
            line(p.x, p.y, other.x, other.y);
          }
        }
      }
      noStroke();
    }
  }
  
  // Reset if all settled
  if (settled >= particles.length * 0.7) {
    for (let p of particles) {
      if (p.settled && random() < 0.1) {
        p.settled = false;
        p.vx = random(-1, 1);
        p.vy = random(-1, 1);
        settled--;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
