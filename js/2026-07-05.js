// 2026-07-05 — "Some of the most beautiful things in the world have never been seen by very many people."
// Inspired by: Has_not_been_viewed_much (Art Institute of Chicago's hidden artworks)
// Theme: Unseen beauty, quiet waiting, the gentle persistence of things no one looks at

let particles = [];
let spotlight;
let time = 0;
let viewedCount = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Hidden artworks — small quiet particles scattered in the dark
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(20, 60), // warm golds and soft amber
      brightness: random(10, 30), // dim, barely visible
      phase: random(TWO_PI),
      speed: random(0.002, 0.008),
      viewed: false,
      viewTime: 0
    });
  }
  
  spotlight = { x: width / 2, y: height / 2, radius: 120 };
}

function draw() {
  background(230, 20, 8); // deep dark gallery
  
  time += 0.01;
  
  // Spotlight follows mouse gently
  spotlight.x = lerp(spotlight.x, mouseX, 0.03);
  spotlight.y = lerp(spotlight.y, mouseY, 0.03);
  
  // Draw spotlight glow
  for (let r = spotlight.radius; r > 0; r -= 4) {
    let alpha = map(r, 0, spotlight.radius, 15, 0);
    fill(45, 30, 100, alpha);
    noStroke();
    ellipse(spotlight.x, spotlight.y, r * 2, r * 2);
  }
  
  // Draw particles — the hidden artworks
  for (let p of particles) {
    let d = dist(p.x, p.y, spotlight.x, spotlight.y);
    let inLight = d < spotlight.radius;
    
    // Gentle breathing motion
    let breathe = sin(time * 2 + p.phase) * 0.5 + 0.5;
    
    if (inLight) {
      // When illuminated, beauty reveals itself
      let intensity = map(d, 0, spotlight.radius, 1, 0.3);
      let sz = p.size * (1 + breathe * 0.5) * intensity;
      
      // Soft glow
      fill(p.hue, 60, 95 * intensity, 80);
      noStroke();
      ellipse(p.x, p.y, sz * 2, sz * 2);
      
      // Inner bright core
      fill(p.hue, 30, 100 * intensity, 90);
      ellipse(p.x, p.y, sz, sz);
      
      // Mark as viewed
      if (!p.viewed) {
        p.viewed = true;
        p.viewTime = time;
        viewedCount++;
      }
    } else {
      // In darkness — barely visible, just a whisper
      let flicker = sin(time * 3 + p.phase) * 0.3 + 0.7;
      let sz = p.size * breathe * 0.6;
      
      fill(p.hue, 40, p.brightness * flicker, 40);
      noStroke();
      ellipse(p.x, p.y, sz, sz);
    }
  }
  
  // Viewed counter — quiet, in the corner
  fill(45, 20, 60, 50);
  noStroke();
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text(viewedCount + " seen", width - 20, height - 20);
  
  // Faint text hint
  fill(45, 15, 40, 30);
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text("move the light", 20, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Redistribute particles
  for (let p of particles) {
    p.x = random(width);
    p.y = random(height);
  }
}
