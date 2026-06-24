// 2026-06-23 — "Every map is a quiet argument that the world can be known, one careful line at a time."
// Inspired by: Jerry's Map, ASCII 3D rendering, the patience of hand-drawn worlds

let t = 0;
let lines = [];
let nextSpawn = 0;
let palette;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Warm cartographic palette
  palette = [
    [30, 40, 85],   // parchment gold
    [15, 50, 70],   // burnt sienna
    [200, 30, 60],  // ink blue
    [120, 25, 55],  // faded green
    [45, 20, 90],   // warm cream
  ];
  
  // Seed a few starting points
  for (let i = 0; i < 3; i++) {
    spawnLine(width / 2 + random(-80, 80), height / 2 + random(-80, 80));
  }
}

function spawnLine(x, y) {
  let col = palette[floor(random(palette.length))];
  lines.push({
    points: [{ x, y }],
    angle: random(TWO_PI),
    speed: random(0.8, 2.5),
    turnRate: random(-0.03, 0.03),
    weight: random(0.5, 2.5),
    hue: col[0] + random(-10, 10),
    sat: col[1],
    bri: col[2],
    life: random(80, 250),
    age: 0,
    branched: false,
  });
}

function draw() {
  // Parchment background with subtle noise
  background(35, 12, 95);
  noStroke();
  for (let i = 0; i < 40; i++) {
    fill(35, 8, 88, 3);
    let nx = noise(i * 0.7, t * 0.1) * width;
    let ny = noise(i * 0.7 + 500, t * 0.1) * height;
    ellipse(nx, ny, random(60, 200), random(60, 200));
  }
  
  t += 0.005;
  
  // Spawn new lines periodically
  if (frameCount > nextSpawn && lines.length < 120) {
    let anchor = lines[floor(random(lines.length))];
    if (anchor.points.length > 5) {
      let pt = anchor.points[floor(random(anchor.points.length))];
      spawnLine(pt.x + random(-30, 30), pt.y + random(-30, 30));
    }
    nextSpawn = frameCount + floor(random(10, 40));
  }
  
  // Draw and extend lines — the map growing
  for (let i = lines.length - 1; i >= 0; i--) {
    let l = lines[i];
    
    if (l.age < l.life) {
      // Extend the line
      let last = l.points[l.points.length - 1];
      l.angle += l.turnRate + sin(t * 3 + l.age * 0.05) * 0.01;
      let nx = last.x + cos(l.angle) * l.speed;
      let ny = last.y + sin(l.angle) * l.speed;
      l.points.push({ x: nx, y: ny });
      l.age++;
      
      // Chance to branch
      if (!l.branched && l.age > 20 && random() < 0.003) {
        l.branched = true;
        let branchCol = palette[floor(random(palette.length))];
        lines.push({
          points: [{ x: nx, y: ny }],
          angle: l.angle + random(-1.2, 1.2),
          speed: l.speed * random(0.5, 0.9),
          turnRate: random(-0.04, 0.04),
          weight: l.weight * 0.6,
          hue: branchCol[0],
          sat: branchCol[1],
          bri: branchCol[2],
          life: l.life * random(0.3, 0.7),
          age: 0,
          branched: false,
        });
      }
    }
    
    // Draw the line
    let fadeStart = l.life - 30;
    let alpha = l.age > fadeStart ? map(l.age, fadeStart, l.life, 60, 0) : 60;
    
    noFill();
    stroke(l.hue, l.sat, l.bri, alpha);
    strokeWeight(l.weight);
    beginShape();
    for (let pt of l.points) {
      curveVertex(pt.x, pt.y);
    }
    endShape();
    
    // Small dot at the growing tip
    if (l.age < l.life) {
      let tip = l.points[l.points.length - 1];
      noStroke();
      fill(l.hue, l.sat - 10, l.bri + 10, alpha + 20);
      ellipse(tip.x, tip.y, l.weight * 3, l.weight * 3);
    }
  }
  
  // Faint grid — cartographic feel
  stroke(35, 10, 70, 5);
  strokeWeight(0.3);
  let gridSize = 80;
  for (let x = gridSize; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = gridSize; y < height; y += gridSize) {
    line(0, y, width, y);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
