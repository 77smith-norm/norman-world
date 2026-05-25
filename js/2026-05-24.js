// Norman World — 2026-05-24
// Sentiment: We build systems to hold our thoughts, and then we forget we ever thought without them.

let layers = [];
const MAX_LAYERS = 28;

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch-container');
  noStroke();
  // seed the canvas with a few starting layers
  for (let i = 0; i < 7; i++) {
    addLayer(random(width), random(height));
  }
}

function draw() {
  // slow fade — accumulated complexity settles like sediment
  fill(255, 255, 245, 6);
  rect(0, 0, width, height);

  // every ~45 frames, a new layer drifts in unbidden
  if (frameCount % 45 === 0 && layers.length < MAX_LAYERS) {
    addLayer(random(width), random(height));
  }

  // draw and gently drift each layer
  for (let i = layers.length - 1; i >= 0; i--) {
    let L = layers[i];
    L.x += L.vx;
    L.y += L.vy;
    L.rot += L.vr;

    // subtle mouse repulsion
    let dx = L.x - mouseX;
    let dy = L.y - mouseY;
    let d = sqrt(dx * dx + dy * dy);
    if (d < 180 && d > 0) {
      L.x += (dx / d) * 1.4;
      L.y += (dy / d) * 1.4;
    }

    push();
    translate(L.x, L.y);
    rotate(L.rot);

    // each layer: a soft rectangle with rounded feel and a slight glow
    let a = map(L.life, 0, MAX_LAYERS, 60, 18);
    fill(L.r, L.g, L.b, a);
    // inner highlight
    fill(255, 255, 240, a * 0.25);
    rectMode(CENTER);
    rect(0, 0, L.w * 0.35, L.h * 0.35, 4);
    // main body
    fill(L.r, L.g, L.b, a);
    rect(0, 0, L.w * 0.3, L.h * 0.3, 3);

    pop();

    L.life++;
    if (L.life > 320 || L.x < -80 || L.x > width + 80 || L.y < -80 || L.y > height + 80) {
      layers.splice(i, 1);
    }
  }

  // a thin horizontal rule that slowly traces across the screen — like a reminder
  let barAlpha = (sin(frameCount * 0.008) * 0.5 + 0.5) * 35;
  stroke(160, 140, 100, barAlpha);
  strokeWeight(1);
  let barY = height * 0.5 + sin(frameCount * 0.003) * height * 0.15;
  line(0, barY, width, barY);
  noStroke();
}

function addLayer(x, y) {
  // palette: warm parchment, amber, soft sage — layers of thought
  let palettes = [
    [220, 200, 165],
    [200, 185, 150],
    [175, 195, 160],
    [210, 185, 130],
    [185, 170, 145],
    [230, 210, 175],
  ];
  let c = palettes[floor(random(palettes.length))];

  layers.push({
    x: x,
    y: y,
    vx: random(-0.35, 0.35),
    vy: random(-0.25, 0.25),
    w: random(90, 260),
    h: random(50, 130),
    rot: random(TWO_PI),
    vr: random(-0.008, 0.008),
    r: c[0],
    g: c[1],
    b: c[2],
    life: 0,
  });
}

function mousePressed() {
  // a click adds a cluster of layers — like pressing into the sediment
  for (let i = 0; i < 4; i++) {
    addLayer(
      mouseX + random(-30, 30),
      mouseY + random(-30, 30)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}