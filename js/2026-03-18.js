// Norman World — March 18, 2026
// Theme: Simple rules, emergent complexity — inspired by Conway's Game of Life
// and the idea that constraint is the engine of creativity.

let cells = [];
let cols, rows;
const CELL_SIZE = 12;

function setup() {
  const w = document.getElementById('sketch-container').offsetWidth || windowWidth;
  const h = 420;
  createCanvas(w, h);
  cols = floor(width / CELL_SIZE);
  rows = floor(height / CELL_SIZE);

  // Seed with a Gosper Glider Gun + a few random clusters
  cells = Array(cols).fill(null).map(() => Array(rows).fill(0));

  // Gosper Glider Gun at col 5, row 5
  const gun = [
    [0,0],[1,0],[0,1],[1,1], // block
    [10,0],[10,1],[10,2],[11,1],[9,1], // left part
    [20,0],[21,0],[20,1],[21,1], // block 2
    [20,2],[21,2],[22,2],[21,3], // spout
  ];

  // Classic blinker seeds
  const seeds = [
    [25, 5], [25, 6], [25, 7],
    [40, 10], [41, 10], [42, 10],
  ];

  // Scatter a few random gliders
  for (let i = 0; i < 6; i++) {
    const cx = floor(random(cols));
    const cy = floor(random(rows));
    cells[cx][cy] = 1;
    cells[(cx+1)%cols][cy] = 1;
    cells[(cx+2)%cols][cy] = 1;
    cells[cx][(cy+1)%rows] = 1;
  }

  frameRate(8);
  noStroke();
}

function draw() {
  background(10, 12, 20);

  // Draw cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (cells[i][j] === 1) {
        const age = min(frameCount % 60, 30);
        const b = map(sin(age * 0.3), -1, 1, 120, 255);
        fill(80 + b * 0.3, 200, 180 + b * 0.1, 220);
        rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1, 2);
      }
    }
  }

  // Evolve every ~12 frames
  if (frameCount % 12 === 0) {
    evolve();
  }

  // Subtle grid overlay
  stroke(255, 255, 255, 12);
  for (let i = 0; i < cols; i++) {
    line(i * CELL_SIZE, 0, i * CELL_SIZE, height);
  }
  for (let j = 0; j < rows; j++) {
    line(0, j * CELL_SIZE, width, j * CELL_SIZE);
  }
}

function evolve() {
  const next = Array(cols).fill(null).map(() => Array(rows).fill(0));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const neighbors = countNeighbors(i, j);
      if (cells[i][j] === 1) {
        next[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
      } else {
        next[i][j] = (neighbors === 3) ? 1 : 0;
      }
    }
  }
  cells = next;
}

function countNeighbors(x, y) {
  let total = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const xi = (x + i + cols) % cols;
      const yj = (y + j + rows) % rows;
      total += cells[xi][yj];
    }
  }
  return total;
}

function windowResized() {
  const w = document.getElementById('sketch-container').offsetWidth;
  resizeCanvas(w, 420);
}
