// Norman World Daily — 2026-08-17
// Sentiment: "Everything almost overflows tonight, yet each part fits — barely, beautifully, enough."
// Theme: nearly-full, scarce rooms, the glow of things that just barely make it

let cells = [];
const CELL_COUNT = 110;
let breath = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  // Seed the room with pieces that barely fit
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  // Deep dusk indigo, layered
  fill(230, 22, 6, 26);
  rect(0, 0, width, height);

  breath += 0.008;
  const pressure = 0.5 + 0.5 * sin(breath); // 0..1 slow inhale/exhale

  // The vessel: a soft boundary that holds everything
  const cx = width / 2, cy = height / 2;
  const vesselR = min(width, height) * 0.38;
  fill(235, 18, 9, 18);
  circle(cx, cy, vesselR * 2);
  noFill();

  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    const dc = dist(c.x, c.y, cx, cy);

    // Pressure from the vessel: push outward when breathing in, settle when out
    const push = (dc < vesselR - 10 ? -1 : 1) * pressure * 0.05;
    c.vx += (c.x - cx) / max(dc, 1) * push;
    c.vy += (c.y - cy) / max(dc, 1) * push;

    // Every piece nudges its neighbors — everything is almost too close
    if (frameCount % 2 === 0) {
      selfOrganize(c, i);
    }

    // Mouse adds one more thing: a warm hand pressing into the pile
    if (mouseX > 0 && mouseY > 0) {
      const dm = dist(c.x, c.y, mouseX, mouseY);
      if (dm < 90) {
        const away = 0.05 * (1 - dm / 90);
        c.vx += (c.x - mouseX) / max(dm, 1) * away;
        c.vy += (c.y - mouseY) / max(dm, 1) * away;
        c.warm = min(1, c.warm + 0.02);
      }
    }
    c.warm = max(0, c.warm - 0.004);

    c.resetPin();
    c.vx *= 0.94;
    c.vy *= 0.94;
    c.x += c.vx;
    c.y += c.vy;

    // Seams glow where pieces press close — barely fitting is luminous
    if (c.close < 26 && frameCount % 2 === 0) {
      const glow = 1 - c.close / 26;
      stroke(42, 70, 90, 4 + glow * 22 + c.warm * 20);
      strokeWeight(0.6);
      line(c.x, c.y, c.nx, c.ny);
      noStroke();
    }

    // Pieces themselves: tired amber where tight, cool white where loose
    const tightness = c.close / 26;
    const pulse = 0.6 + 0.4 * sin(c.phase + breath * 4);
    if (tightness > 0.5) {
      fill(36, 58, 84, 30 + tightness * 52 + c.warm * 18);
      circle(c.x, c.y, 2.5 + tightness * 6 * pulse);
    } else {
      fill(215, 10, 90, 20 + (1 - tightness) * 30);
      circle(c.x, c.y, 1.8 + (1 - tightness) * 3 * pulse);
    }
  }

  // The vessel edge breathes — almost, but never quite, overflowing
  stroke(40, 45, 80, 12 + pressure * 14);
  strokeWeight(1 + pressure * 1.6);
  noFill();
  circle(cx, cy, vesselR * 2 * (1 + pressure * 0.015));
  noStroke();
}

// Each piece finds its nearest neighbor; closeness becomes a quiet seam
function selfOrganize(c, idx) {
  let nd = Infinity, ni = -1;
  for (let j = 0; j < cells.length; j++) {
    if (j === idx) continue;
    const d = dist(c.x, c.y, cells[j].x, cells[j].y);
    if (d < nd) { nd = d; ni = j; }
  }
  c.nx = cells[ni].x;
  c.ny = cells[ni].y;
  c.close = nd;
  if (nd < 24) {
    // gentle mutual shove — keep barely-fitting without collapsing
    const away = (24 - nd) * 0.012;
    c.vx += (c.x - c.nx) / max(nd, 1) * away;
    c.vy += (c.y - c.ny) / max(nd, 1) * away;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.nx = x;
    this.ny = y;
    this.close = 999;
    this.warm = 0;
    this.phase = random(TWO_PI);
  }
  resetPin() {
    this.nx = this.x;
    this.ny = this.y;
    this.close = 999;
  }
}