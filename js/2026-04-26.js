let time = 0;
let discs = [];
let centerX, centerY;
const COLS = 28;
const ROWS = 18;
const CELL = 12;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  background(50, 8, 8);
  
  // Flipdiscs — each is a two-state mechanical pixel: black or lit
  // No smooth transitions, no in-between. Just flip or don't.
  let totalW = COLS * CELL;
  let totalH = ROWS * CELL;
  let startX = centerX - totalW / 2;
  let startY = centerY - totalH / 2;
  
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      let state = random() > 0.5;
      discs.push({
        col: c,
        row: r,
        x: startX + c * CELL,
        y: startY + r * CELL,
        state: state,
        flipTimer: random(60, 800),
        flipSpeed: random(0.06, 0.14),  // mechanical — not smooth, not eased
        animProgress: state ? 1 : 0,
        isAnimating: false
      });
    }
  }
}

function draw() {
  background(50, 8, 8, 25);
  time += 0.02;
  
  for (let d of discs) {
    d.flipTimer--;
    
    // Trigger a flip when timer expires
    if (d.flipTimer <= 0 && !d.isAnimating) {
      d.isAnimating = true;
      d.flipTimer = random(60, 800);
    }
    
    // Mechanical flip animation — not smooth, deliberate
    if (d.isAnimating) {
      let target = d.state ? 1 : 0;
      d.animProgress += d.state ? d.flipSpeed : -d.flipSpeed;
      
      // Binary threshold — commits when it gets close enough
      if (d.state && d.animProgress >= 0.85) {
        d.animProgress = 1;
        d.isAnimating = false;
      } else if (!d.state && d.animProgress <= 0.15) {
        d.animProgress = 0;
        d.isAnimating = false;
      }
      
      // Also commit on reaching the midpoint — mechanical commitment
      if (d.animProgress >= 0.5 && d.animProgress < 0.55 && d.state) {
        d.state = false;
      } else if (d.animProgress <= 0.5 && d.animProgress > 0.45 && !d.state) {
        d.state = true;
      }
    }
    
    // Disc rendering — two-state mechanical look
    let discSize = CELL - 2;
    
    // Dark face (the underside)
    noStroke();
    fill(45, 8, 12);
    rect(d.x + 1, d.y + 1, discSize, discSize, 1);
    
    // Lit face — visible when state is true
    let litAlpha = d.animProgress;
    if (litAlpha > 0.05) {
      // Warm amber face
      fill(38, 55, 82, litAlpha * 100);
      // Rotate the lit face by flipping along Y (flip-disc illusion)
      let litH = discSize * litAlpha;
      let litY = d.state ? d.y + 1 : d.y + 1 + discSize - litH;
      rect(d.x + 1, litY, discSize, litH, 1);
    }
    
    // Highlight edge — the mechanical rim
    noFill();
    stroke(55, 12, 22, 60);
    strokeWeight(0.5);
    rect(d.x + 1, d.y + 1, discSize, discSize, 1);
  }
  
  // Center text — no smooth fade here
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(9);
  fill(45, 15, 45, 35);
  text("EACH DOT, TWO STATES", centerX, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Recompute disc positions
  let totalW = COLS * CELL;
  let totalH = ROWS * CELL;
  let startX = centerX - totalW / 2;
  let startY = centerY - totalH / 2;
  
  for (let i = 0; i < discs.length; i++) {
    discs[i].x = startX + discs[i].col * CELL;
    discs[i].y = startY + discs[i].row * CELL;
  }
}
