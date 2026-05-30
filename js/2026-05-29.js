// 2026-05-29
// Sentiment: What stays when the layers fall away is the thing you built on simple ground.

let layers = [];
let numLayers = 14;
let groundHues = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);

  // Warm earth palette
  for (let i = 0; i < numLayers; i++) {
    layers.push(new Layer(i));
  }

  // Precompute ground texture
  for (let x = 0; x <= width; x += 4) {
    groundHues[x] = [];
    for (let y = 0; y <= height; y += 4) {
      groundHues[x][y] = random(-8, 8);
    }
  }
}

function draw() {
  // Deep warm ground
  background(30, 50, 18);

  // Draw solid ground base
  noStroke();
  for (let y = height * 0.55; y < height; y += 4) {
    let t = map(y, height * 0.55, height, 0, 1);
    let h = lerp(25, 15, t);
    let s = lerp(40, 25, t);
    let b = lerp(30, 20, t);
    let variation = noise(y * 0.02, frameCount * 0.001) * 6 - 3;
    fill(h + variation, s, b + variation);
    rect(0, y, width, 4);
  }

  // Draw foreground ground (darker, closer)
  for (let y = height * 0.78; y < height; y += 3) {
    let t = map(y, height * 0.78, height, 0, 1);
    let variation = noise(y * 0.03, frameCount * 0.0015) * 4 - 2;
    fill(20 + variation, 35, 15 + variation, 40);
    rect(0, y, width, 3);
  }

  // Draw and update floating layers
  let allFallen = true;
  for (let layer of layers) {
    layer.update();
    layer.display();
    if (!layer.fallen) allFallen = false;
  }

  // When everything has fallen, a quiet glow pulses
  if (allFallen) {
    let glow = sin(frameCount * 0.02) * 3 + 4;
    fill(40, 20, 60, glow);
    rect(0, 0, width, height);
  }
}

class Layer {
  constructor(index) {
    this.index = index;
    this.x = random(width * 0.1, width * 0.9);
    this.y = random(height * 0.1, height * 0.6);
    this.w = random(width * 0.08, width * 0.3);
    this.h = random(20, 60);
    this.rot = random(-PI / 10, PI / 10);
    this.rotSpeed = random(-0.004, 0.004);
    this.hue = random(20, 45);   // warm earth tones
    this.sat = random(15, 40);
    this.bri = random(45, 75);
    this.alpha = random(60, 85);
    this.fallSpeed = random(0.15, 0.6);
    this.driftX = random(-0.4, 0.4);
    this.fallen = false;
    this.triggerDist = random(80, 180);
    this.debris = [];
    this.shattered = false;

    // Some internal lines/structure
    this.lines = floor(random(1, 4));
    this.linePositions = [];
    for (let i = 0; i < this.lines; i++) {
      this.linePositions.push(random(-this.w * 0.35, this.w * 0.35));
    }
  }

  update() {
    if (this.fallen) return;

    let d = dist(mouseX, mouseY, this.x, this.y);
    let trigger = this.triggerDist;

    // Auto fall after delay if mouse hasn't visited
    if (this.index > 6 && frameCount > 600 + this.index * 120) {
      trigger = 999;
    }

    if (d < trigger && mouseX > 0 && mouseY > 0) {
      this.y += this.fallSpeed;
      this.x += this.driftX;
      this.rot += this.rotSpeed;
      this.alpha -= 0.8;

      if (this.y > height + 50 || this.alpha <= 0) {
        this.fallen = true;
        // Spawn small debris particles
        for (let i = 0; i < 6; i++) {
          this.debris.push({
            x: this.x + random(-20, 20),
            y: this.y,
            vx: random(-1.5, 1.5),
            vy: random(-2, -0.5),
            size: random(2, 6),
            life: 255
          });
        }
      }
    }
  }

  display() {
    // Draw debris from shattered layers
    for (let i = this.debris.length - 1; i >= 0; i--) {
      let d = this.debris[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.03;
      d.life -= 4;
      if (d.life <= 0) {
        this.debris.splice(i, 1);
        continue;
      }
      fill(this.hue, this.sat, this.bri + 10, d.life * 0.3);
      noStroke();
      rect(d.x, d.y, d.size, d.size * 0.6);
    }

    if (this.fallen) return;

    push();
    translate(this.x, this.y);
    rotate(this.rot);

    // Main shape
    fill(this.hue, this.sat, this.bri, this.alpha);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 3);

    // Internal lines (like sediment strata)
    stroke(this.hue, this.sat, this.bri - 15, this.alpha * 0.6);
    strokeWeight(1);
    for (let lx of this.linePositions) {
      line(lx, -this.h * 0.35, lx + random(-5, 5), this.h * 0.35);
    }

    // Edge accent
    noFill();
    stroke(this.hue, this.sat + 10, this.bri + 10, this.alpha * 0.4);
    strokeWeight(1);
    rect(0, 0, this.w, this.h, 3);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
