// 2026-07-08 — "What we build with patience outlasts what we rush to completion."
// Honeycomb assembly: hexagonal cells slowly fill with warm light while
// small precise agents sweep dark specks away.

let cols, rows, cellSize;
let grid = [];
let agents = [];
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  initGrid();
}

function initGrid() {
  cellSize = min(width, height) / 16;
  let hexW = cellSize * sqrt(3);
  let hexH = cellSize * 2;
  cols = ceil(width / hexW) + 2;
  rows = ceil(height / (hexH * 0.75)) + 2;
  grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      let x = c * hexW + (r % 2) * hexW / 2;
      let y = r * hexH * 0.75;
      let distFromCenter = dist(x, y, width / 2, height / 2) / (min(width, height) * 0.5);
      grid[r][c] = {
        x: x,
        y: y,
        light: 0,
        target: 0,
        mite: random() < 0.06,
        miteAlpha: 0,
        radius: cellSize * 0.9,
        wave: random(TWO_PI)
      };
    }
  }
  agents = [];
  for (let i = 0; i < 5; i++) {
    agents.push({
      r: floor(random(rows)),
      c: floor(random(cols)),
      x: 0, y: 0,
      targetR: floor(random(rows)),
      targetC: floor(random(cols)),
      speed: random(0.008, 0.02),
      progress: 0,
      size: cellSize * 0.3,
      hue: random(20, 50)
    });
  }
}

function draw() {
  background(20, 8, 95);
  t += 0.008;

  // Update hex cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cell = grid[r][c];
      let wave = sin(t * 0.5 + cell.wave) * 0.5 + 0.5;
      let distFactor = dist(cell.x, cell.y, width / 2, height / 2) / (min(width, height) * 0.4);
      cell.target = wave * (1 - distFactor * 0.6);
      cell.target = constrain(cell.target, 0, 1);
      cell.light = lerp(cell.light, cell.target, 0.02);
      if (cell.mite) {
        cell.miteAlpha = lerp(cell.miteAlpha, 80 + sin(t * 3) * 20, 0.05);
      }
    }
  }

  // Update agents
  for (let agent of agents) {
    agent.progress += agent.speed;
    if (agent.progress >= 1) {
      agent.r = agent.targetR;
      agent.c = agent.targetC;
      // Clear mite if present
      if (grid[agent.r] && grid[agent.r][agent.c]) {
        grid[agent.r][agent.c].mite = false;
        grid[agent.r][agent.c].miteAlpha = 0;
      }
      // Pick new target
      agent.targetR = floor(random(rows));
      agent.targetC = floor(random(cols));
      agent.progress = 0;
    }
    // Interpolate position
    let cr = grid[agent.r] && grid[agent.r][agent.c];
    let tr = grid[agent.targetR] && grid[agent.targetR][agent.targetC];
    if (cr && tr) {
      agent.x = lerp(cr.x, tr.x, agent.progress);
      agent.y = lerp(cr.y, tr.y, agent.progress);
    }
  }

  // Draw hexagons
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cell = grid[r][c];
      let s = cell.radius;
      let brightness = 85 + cell.light * 15;
      let saturation = 15 - cell.light * 10;
      let h = 35 + sin(cell.wave + t * 0.3) * 8;
      fill(h, saturation, brightness, 90);
      push();
      translate(cell.x, cell.y);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = PI / 6 + i * PI / 3;
        vertex(cos(angle) * s, sin(angle) * s);
      }
      endShape(CLOSE);
      // Inner glow
      let glowSize = s * 0.6 * cell.light;
      if (glowSize > 2) {
        fill(40, 10, 100, cell.light * 40);
        ellipse(0, 0, glowSize * 2, glowSize * 2);
      }
      // Mite
      if (cell.mite && cell.miteAlpha > 1) {
        fill(0, 60, 30, cell.miteAlpha);
        ellipse(sin(t * 5 + cell.wave) * 2, cos(t * 4 + cell.wave) * 2, s * 0.2, s * 0.2);
      }
      pop();
    }
  }

  // Draw agents
  for (let agent of agents) {
    push();
    translate(agent.x, agent.y);
    // Trail glow
    fill(agent.hue, 30, 100, 30);
    ellipse(0, 0, agent.size * 3, agent.size * 3);
    // Body
    fill(agent.hue, 40, 100, 80);
    ellipse(0, 0, agent.size, agent.size);
    // Eye
    fill(0, 0, 100, 90);
    ellipse(0, -agent.size * 0.1, agent.size * 0.35, agent.size * 0.35);
    fill(0, 0, 20, 90);
    ellipse(0, -agent.size * 0.1, agent.size * 0.15, agent.size * 0.15);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initGrid();
}
