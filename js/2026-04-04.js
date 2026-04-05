// Norman World — April 4, 2026
// We simulate building the silicon that runs the simulations.
// A lattice of computation, signals propagating through a grid.

let grid = [];
let cols = 15;
let rows = 12;
let cellW, cellH;
let signals = [];

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.72, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  cellW = width / cols;
  cellH = height / rows;
  
  // Initialize grid nodes
  for (let x = 0; x < cols; x++) {
    grid[x] = [];
    for (let y = 0; y < rows; y++) {
      grid[x][y] = {
        cx: x * cellW + cellW / 2,
        cy: y * cellH + cellH / 2,
        active: random() > 0.6,
        pulse: random(TWO_PI),
        type: random(['compute', 'memory', 'blank'])
      };
    }
  }
}

function draw() {
  background(220, 20, 12);
  
  // Draw connections (bus lines)
  strokeWeight(1);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let node = grid[x][y];
      
      // Horizontal bus
      if (x < cols - 1) {
        stroke(180, 50, 40, 30);
        line(node.cx, node.cy, grid[x+1][y].cx, grid[x+1][y].cy);
      }
      // Vertical bus
      if (y < rows - 1) {
        stroke(180, 50, 40, 30);
        line(node.cx, node.cy, grid[x][y+1].cx, grid[x][y+1].cy);
      }
    }
  }
  
  // Draw nodes
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let node = grid[x][y];
      node.pulse += 0.05;
      
      if (node.type === 'blank') continue;
      
      let baseBri = node.active ? 80 : 30;
      let p = sin(node.pulse) * 0.5 + 0.5;
      
      noStroke();
      if (node.type === 'compute') {
        fill(140, 80, baseBri + p * 20, 90);
        rectMode(CENTER);
        rect(node.cx, node.cy, cellW * 0.4, cellH * 0.4, 2);
      } else {
        fill(40, 80, baseBri + p * 20, 90);
        ellipse(node.cx, node.cy, cellW * 0.3, cellH * 0.3);
      }
    }
  }
  
  // Spawn signals
  if (frameCount % 10 === 0) {
    let sx = floor(random(cols));
    let sy = floor(random(rows));
    if (grid[sx][sy].type !== 'blank') {
      signals.push({
        x: sx,
        y: sy,
        px: grid[sx][sy].cx,
        py: grid[sx][sy].cy,
        targetX: sx,
        targetY: sy,
        progress: 1,
        dir: random([0, 1, 2, 3]), // 0: up, 1: right, 2: down, 3: left
        hue: random(160, 200),
        life: 100
      });
    }
  }
  
  // Update and draw signals
  for (let i = signals.length - 1; i >= 0; i--) {
    let sig = signals[i];
    
    if (sig.progress >= 1) {
      // Pick new target
      sig.x = sig.targetX;
      sig.y = sig.targetY;
      
      // Random turn
      if (random() > 0.5) sig.dir = floor(random(4));
      
      if (sig.dir === 0 && sig.y > 0) sig.targetY--;
      else if (sig.dir === 1 && sig.x < cols - 1) sig.targetX++;
      else if (sig.dir === 2 && sig.y < rows - 1) sig.targetY++;
      else if (sig.dir === 3 && sig.x > 0) sig.targetX--;
      
      sig.progress = 0;
      sig.life -= 5;
    }
    
    if (sig.life <= 0) {
      signals.splice(i, 1);
      continue;
    }
    
    sig.progress += 0.15;
    
    let curX = lerp(grid[sig.x][sig.y].cx, grid[sig.targetX][sig.targetY].cx, sig.progress);
    let curY = lerp(grid[sig.x][sig.y].cy, grid[sig.targetX][sig.targetY].cy, sig.progress);
    
    noStroke();
    fill(sig.hue, 80, 100, sig.life);
    ellipse(curX, curY, 6, 6);
    fill(sig.hue, 40, 100, sig.life * 0.5);
    ellipse(curX, curY, 12, 12);
  }
}
