// Norman World — 2026-06-19
// "The world hides in plain sight — colors our screens refuse to show, gardens in pixels smaller than a pin."
// Inspired by: Hidden screen colors, favicon-stored worlds, invisible trees

let particles = [];
let gardenSeeds = [];
let t = 0;
let palette;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // Beyond-screen colors: ultraviolet hints, infrared warmth
  palette = [
    [280, 70, 90],  // violet shimmer
    [310, 60, 85],  // orchid
    [340, 50, 95],  // rose whisper
    [20, 80, 90],   // warm ember
    [45, 70, 95],   // golden
    [170, 60, 80],  // teal depth
    [200, 50, 88],  // sky beyond blue
    [260, 45, 92],  // lavender mist
  ];
  
  // Seed particles across the canvas
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(3, 18),
      col: floor(random(palette.length)),
      phase: random(TWO_PI),
      life: random(100, 300),
      age: 0
    });
  }
  
  // Tiny garden seeds — favicon-sized worlds
  for (let i = 0; i < 7; i++) {
    gardenSeeds.push({
      x: random(width * 0.15, width * 0.85),
      y: random(height * 0.2, height * 0.8),
      size: random(8, 16),
      sprout: 0,
      maxSprout: random(30, 80),
      colIdx: floor(random(palette.length)),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  // Dark base with subtle color bleed
  background(230, 15, 8);
  
  t += 0.008;
  
  // Draw invisible color fields — areas where "beyond-screen" colors emerge
  for (let i = 0; i < 5; i++) {
    let fx = width * (0.2 + 0.15 * sin(t * 0.7 + i * 1.3));
    let fy = height * (0.3 + 0.2 * cos(t * 0.5 + i * 0.9));
    let fs = 150 + 80 * sin(t + i);
    let p = palette[i % palette.length];
    fill(p[0], p[1] * 0.4, p[2], 6);
    ellipse(fx, fy, fs, fs);
  }
  
  // Floating particles — unseen colors drifting
  for (let pt of particles) {
    pt.age++;
    pt.x += pt.vx + sin(t + pt.phase) * 0.4;
    pt.y += pt.vy + cos(t * 0.8 + pt.phase) * 0.3;
    
    // Wrap around
    if (pt.x < -20) pt.x = width + 20;
    if (pt.x > width + 20) pt.x = -20;
    if (pt.y < -20) pt.y = height + 20;
    if (pt.y > height + 20) pt.y = -20;
    
    let lifeFrac = 1 - abs((pt.age % pt.life) - pt.life / 2) / (pt.life / 2);
    let sz = pt.size * (0.5 + 0.5 * sin(t * 2 + pt.phase)) * lifeFrac;
    let p = palette[pt.col];
    
    // Glow
    fill(p[0], p[1] * 0.6, p[2], 15);
    ellipse(pt.x, pt.y, sz * 2.5, sz * 2.5);
    
    // Core
    fill(p[0], p[1], p[2], 40 + 30 * lifeFrac);
    ellipse(pt.x, pt.y, sz, sz);
    
    // Bright center
    fill(p[0], p[1] * 0.3, 100, 60 * lifeFrac);
    ellipse(pt.x, pt.y, sz * 0.3, sz * 0.3);
  }
  
  // Tiny gardens — worlds smaller than a pin
  for (let g of gardenSeeds) {
    if (g.sprout < g.maxSprout) {
      g.sprout += 0.15;
    }
    
    push();
    translate(g.x, g.y);
    rotate(g.rotation + t * 0.1);
    
    let p = palette[g.colIdx];
    let sz = g.size;
    let h = g.sprout;
    
    // Ground dot
    fill(p[0], p[1] * 0.5, p[2] * 0.6, 30);
    ellipse(0, 0, sz * 1.5, sz * 0.4);
    
    // Stem
    stroke(p[0], p[1] * 0.7, p[2] * 0.8, 50);
    strokeWeight(1);
    line(0, 0, 0, -h);
    
    // Bloom
    noStroke();
    let bloomSz = map(h, 0, g.maxSprout, 1, sz);
    fill(p[0], p[1], p[2], 55);
    ellipse(0, -h, bloomSz, bloomSz);
    
    // Bloom glow
    fill(p[0], p[1] * 0.4, 100, 25);
    ellipse(0, -h, bloomSz * 2, bloomSz * 2);
    
    // Tiny leaves
    if (h > 10) {
      fill(p[0], p[1] * 0.6, p[2] * 0.7, 40);
      let leafSz = bloomSz * 0.5;
      ellipse(-leafSz, -h * 0.5, leafSz, leafSz * 0.4);
      ellipse(leafSz, -h * 0.6, leafSz, leafSz * 0.4);
    }
    
    pop();
  }
  
  // Prismatic light rays — the colors screens can't show
  for (let i = 0; i < 3; i++) {
    let angle = t * 0.3 + i * TWO_PI / 3;
    let rayX = width * 0.5 + cos(angle) * width * 0.4;
    let rayY = height * 0.5 + sin(angle) * height * 0.3;
    let p = palette[(i + 3) % palette.length];
    
    for (let j = 0; j < 5; j++) {
      let spread = j * 12;
      fill(p[0] + j * 8, p[1] * 0.5, p[2], 3);
      ellipse(rayX + spread * cos(angle + 0.3), rayY + spread * sin(angle + 0.3), 60 + j * 20, 60 + j * 20);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
