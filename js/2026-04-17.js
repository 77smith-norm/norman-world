let intervals = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  background(10, 15, 10);
  noStroke();
  
  // Initialize floating interval segments
  for (let i = 0; i < 40; i++) {
    intervals.push({
      y: random(height),
      x1: random(width),
      len: random(50, 300),
      speed: random(0.5, 2) * (random() > 0.5 ? 1 : -1),
      hue: random([20, 45, 180, 210]),
      sat: random(60, 90),
      thick: random(2, 12),
      gapTimer: random(100)
    });
  }
}

function draw() {
  background(10, 15, 10, 15); // fade effect
  
  for (let i = 0; i < intervals.length; i++) {
    let inv = intervals[i];
    
    // Move
    inv.x1 += inv.speed;
    
    // Wrap around
    if (inv.speed > 0 && inv.x1 > width) inv.x1 = -inv.len;
    if (inv.speed < 0 && inv.x1 + inv.len < 0) inv.x1 = width;
    
    // Draw the interval
    fill(inv.hue, inv.sat, 80, 70);
    
    // Periodically create a "disjoint" gap in the interval
    inv.gapTimer += 0.02;
    let gapSize = map(sin(inv.gapTimer), -1, 1, 0, inv.len * 0.8);
    
    if (gapSize > 10) {
      // Draw as two disjoint segments
      let halfW = (inv.len - gapSize) / 2;
      rect(inv.x1, inv.y, halfW, inv.thick, 2);
      rect(inv.x1 + halfW + gapSize, inv.y, halfW, inv.thick, 2);
      
      // Highlight the gap boundaries subtly
      fill(0, 0, 100, 40);
      ellipse(inv.x1 + halfW, inv.y + inv.thick/2, inv.thick * 1.5);
      ellipse(inv.x1 + halfW + gapSize, inv.y + inv.thick/2, inv.thick * 1.5);
    } else {
      // Draw as solid segment
      rect(inv.x1, inv.y, inv.len, inv.thick, 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
