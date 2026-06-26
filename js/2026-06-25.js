// 2026-06-25 — "Beneath the ash of centuries, a voice still waits to be heard."
// Inspired by: An entire Herculaneum scroll has been read for the first time
// Layers of sediment peel away to reveal hidden glyphs of light.

let particles = [];
let scrollY = 0;
let revealDepth = 0;
let glyphs = [];
const NUM_PARTICLES = 120;
const NUM_GLYPHS = 30;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  generateGlyphs();
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle());
  }
}

function generateGlyphs() {
  glyphs = [];
  for (let i = 0; i < NUM_GLYPHS; i++) {
    glyphs.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.1, height * 0.9),
      size: random(8, 24),
      char: String.fromCharCode(0x0370 + floor(random(88))), // Greek-inspired
      alpha: 0,
      drift: random(-0.3, 0.3),
      phase: random(TWO_PI),
    });
  }
}

function createParticle() {
  return {
    x: random(width),
    y: random(-height, height),
    size: random(2, 6),
    speed: random(0.3, 1.5),
    drift: random(-0.5, 0.5),
    hue: random(20, 45), // warm amber to ochre
    alpha: random(20, 60),
  };
}

function draw() {
  // Dark parchment base with warm undertone
  let baseHue = 28;
  let baseSat = map(sin(frameCount * 0.005), -1, 1, 15, 25);
  background(baseHue, baseSat, 8);

  // Scroll reveals over time
  revealDepth = map(sin(frameCount * 0.008), -1, 1, 0.2, 1.0);

  // Sediment layers — horizontal bands that peel apart
  for (let i = 5; i >= 0; i--) {
    let layerY = map(i, 0, 5, height * 0.1, height * 0.9);
    let separation = revealDepth * 30 * (5 - i);
    let y = layerY + sin(frameCount * 0.01 + i) * 8 - separation;
    let layerAlpha = map(revealDepth, 0.2, 1.0, 40, 15);
    let layerHue = map(i, 0, 5, 20, 35);
    fill(layerHue, 50, 20, layerAlpha);
    rect(0, y - 20, width, 40);

    // Cracks in the sediment
    stroke(layerHue, 40, 30, layerAlpha * 0.8);
    strokeWeight(1);
    for (let j = 0; j < 3; j++) {
      let crackX = (width / 4) * (j + 0.5) + sin(frameCount * 0.003 + j) * 20;
      let crackLen = 40 + sin(frameCount * 0.006 + j * 2) * 20;
      line(crackX, y - crackLen / 2, crackX + random(-8, 8), y + crackLen / 2);
    }
    noStroke();
  }

  // Ash particles drifting upward
  for (let p of particles) {
    p.y -= p.speed;
    p.x += p.drift + sin(frameCount * 0.02 + p.x * 0.01) * 0.3;
    if (p.y < -20) {
      p.y = height + 20;
      p.x = random(width);
    }
    fill(p.hue, 40, 60, p.alpha * revealDepth);
    ellipse(p.x, p.y, p.size);
  }

  // Hidden glyphs revealed by scroll depth
  for (let g of glyphs) {
    g.alpha = map(revealDepth, 0.3, 0.9, 0, 70);
    g.alpha = constrain(g.alpha, 0, 70);
    g.x += g.drift;
    if (g.alpha > 5) {
      let glow = sin(frameCount * 0.03 + g.phase) * 15 + 55;
      fill(38, 30, glow, g.alpha);
      textSize(g.size);
      textAlign(CENTER, CENTER);
      text(g.char, g.x, g.y + sin(frameCount * 0.015 + g.phase) * 6);
    }
  }

  // Warm light beam from above — the reading light
  let beamAlpha = map(sin(frameCount * 0.007), -1, 1, 5, 20);
  for (let r = 0; r < 5; r++) {
    let beamW = width * 0.3 + r * 40;
    let beamH = height * 0.6;
    fill(40, 20, 50, beamAlpha * (1 - r * 0.18));
    ellipse(width / 2, height * 0.15, beamW, beamH);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateGlyphs();
}
