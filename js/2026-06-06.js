// 2026-06-06 - Obscured code, quiet patterns
let chars = [];
let glyphs = [];
let reveal = 0;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  textFont('monospace');
  textSize(14);
  // Build a grid of obscured characters
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 35; col++) {
      let x = 20 + col * 22;
      let y = 30 + row * 28;
      let visible = random() < 0.4; // sparse — obscured
      chars.push({
        x, y,
        c: random(['{', '}', '(', ')', '[', ']', ';', ':', '.', ',', '#', '*', '+', '-', '/', '%', '&', '|', '!', '~', '^', '<', '>', '=', '?', '@', '$', '_']),
        visible,
        revealDelay: random(200, 800),
        phase: random(TWO_PI),
        speed: random(0.002, 0.008)
      });
    }
  }
  // Glyphs that drift through — shapes, not symbols
  for (let i = 0; i < 16; i++) {
    glyphs.push({
      x: random(width),
      y: random(height),
      size: random(15, 50),
      angle: random(TWO_PI),
      rotSpeed: random(-0.005, 0.005),
      driftX: random(-0.2, 0.2),
      driftY: random(-0.3, 0.3),
      alpha: random(30, 80)
    });
  }
}

function draw() {
  // Dark, deep background — like staring into a terminal at night
  background(20, 18, 22);
  
  reveal = (sin(frameCount * 0.008) + 1) * 0.5; // pulses between 0 and 1

  // Draw drifting glyphs first (behind the text)
  for (let g of glyphs) {
    push();
    translate(g.x, g.y);
    rotate(g.angle);
    g.angle += g.rotSpeed;
    g.x += g.driftX;
    g.y += g.driftY;
    if (g.x < -50) g.x = width + 50;
    if (g.x > width + 50) g.x = -50;
    if (g.y < -50) g.y = height + 50;
    if (g.y > height + 50) g.y = -50;
    noFill();
    stroke(100, 180, 200, g.alpha * 0.3);
    strokeWeight(1.5);
    rect(g.x - g.size / 2, g.y - g.size / 2, g.size, g.size, g.size * 0.15);
    pop();
  }

  // Draw the obscured code characters
  for (let c of chars) {
    let shouldShow = c.visible || (reveal > 0.7 && noise(c.x * 0.01, c.y * 0.01, frameCount * 0.005) > 0.4);
    if (shouldShow) {
      let alphaVal = map(sin(frameCount * c.speed + c.phase), -1, 1, 80, 220);
      let flicker = random() > 0.97 ? 40 : alphaVal; // occasional flicker
      // highlight some characters that might form hidden words
      let r = 180 + 75 * sin(frameCount * 0.01 + c.x * 0.05);
      let g = 220 + 35 * sin(frameCount * 0.015 + c.y * 0.05);
      let b = 200;
      fill(r, g, b, flicker);
      text(c.c, c.x, c.y);
    }
  }

  // Occasional cursor blink
  if (frameCount % 60 < 30) {
    fill(100, 220, 180, 150);
    rect(width - 40, height - 30, 12, 2);
  }
}

function windowResized() {
  resizeCanvas(800, 600);
}
