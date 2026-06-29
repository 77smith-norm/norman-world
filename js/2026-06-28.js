// 2026-06-28 — "You were never the number they gave you — you were the thing that refused to fit."
let t = 0;
let bars = [];
let fragments = [];
let canvasW, canvasH;

function setup() {
  canvasW = min(windowWidth, 800);
  canvasH = min(windowHeight, 600);
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent('sketch-container');
  noStroke();

  // Generate rigid scoring bars that break apart
  for (let i = 0; i < 12; i++) {
    bars.push({
      x: canvasW * 0.15 + i * (canvasW * 0.7 / 12),
      w: canvasW * 0.04,
      targetH: random(canvasH * 0.3, canvasH * 0.7),
      broken: false,
      breakTime: random(0.3, 0.8),
      fragments: []
    });
  }

  // Floating fragments — pieces that escaped the grid
  for (let i = 0; i < 80; i++) {
    fragments.push({
      x: random(canvasW),
      y: random(canvasH),
      vx: random(-1.5, 1.5),
      vy: random(-2, -0.3),
      size: random(3, 12),
      rot: random(TWO_PI),
      rotSpeed: random(-0.05, 0.05),
      alpha: random(60, 200),
      hue: random(10, 50),
      life: random(0.2, 1)
    });
  }
}

function draw() {
  // Warm gradient — parchment breaking into light
  for (let y = 0; y < canvasH; y++) {
    let inter = map(y, 0, canvasH, 0, 1);
    let c = lerpColor(color(35, 25, 20), color(60, 45, 35), inter);
    stroke(c);
    line(0, y, canvasW, y);
  }
  noStroke();

  t += 0.006;

  // Base line where bars stand
  let baseY = canvasH * 0.82;

  // Draw rigid scoring bars — some intact, some shattering
  for (let i = 0; i < bars.length; i++) {
    let b = bars[i];
    let lifeProgress = t % 1.5;
    let barPhase = (lifeProgress - b.breakTime);

    if (barPhase < 0) {
      // Still intact — rigid, cold, amber
      let h = b.targetH * min(1, lifeProgress / b.breakTime);
      fill(200, 170, 100, 180);
      rect(b.x, baseY - h, b.w, h);

      // Score number on bar
      fill(255, 230, 180, 100);
      textSize(10);
      textAlign(CENTER);
      text(floor(random(60, 100)), b.x + b.w / 2, baseY - h + 15);
    } else if (barPhase < 0.4) {
      // Shattering phase
      let shatter = barPhase / 0.4;
      let h = b.targetH;
      let numFrags = 8;

      if (b.fragments.length === 0) {
        for (let j = 0; j < numFrags; j++) {
          b.fragments.push({
            x: b.x + random(b.w),
            y: baseY - random(h),
            vx: random(-3, 3),
            vy: random(-4, 1),
            size: random(4, 12),
            rot: random(TWO_PI),
            rotSpeed: random(-0.1, 0.1)
          });
        }
      }

      for (let f of b.fragments) {
        f.x += f.vx * shatter;
        f.y += f.vy * shatter + shatter * shatter * 2;
        f.rot += f.rotSpeed;
        let a = 180 * (1 - shatter);
        fill(200, 170, 100, a);
        push();
        translate(f.x, f.y);
        rotate(f.rot);
        rect(-f.size / 2, -f.size / 2, f.size, f.size * 0.6);
        pop();
      }
    } else {
      // Gone — bar has dissolved
      b.broken = true;
    }
  }

  // Reset bars periodically
  if (t % 3.0 < 0.01) {
    for (let b of bars) {
      b.fragments = [];
      b.broken = false;
    }
  }

  // Floating free fragments — the things that escaped measurement
  for (let f of fragments) {
    f.x += f.vx + sin(t * 1.5 + f.y * 0.008) * 0.8;
    f.y += f.vy;
    f.rot += f.rotSpeed;

    // Wrap
    if (f.y < -20) { f.y = canvasH + 20; f.x = random(canvasW); }
    if (f.x < -20) f.x = canvasW + 20;
    if (f.x > canvasW + 20) f.x = -20;

    // Pulsing life
    let pulse = sin(t * 2 + f.life * TWO_PI) * 0.3 + 0.7;
    let a = f.alpha * pulse;

    // Warm amber to soft gold gradient
    fill(f.hue * 4 + 120, f.hue * 3 + 80, f.hue * 1.5 + 30, a);
    push();
    translate(f.x, f.y);
    rotate(f.rot);
    if (f.size > 8) {
      // Larger pieces are irregular
      beginShape();
      vertex(-f.size / 2, -f.size / 3);
      vertex(f.size / 3, -f.size / 2);
      vertex(f.size / 2, f.size / 3);
      vertex(-f.size / 3, f.size / 2);
      endShape(CLOSE);
    } else {
      ellipse(0, 0, f.size, f.size * 0.7);
    }
    pop();
  }

  // Central warm glow — the unmeasured self
  let glowSize = 60 + sin(t * 0.8) * 20;
  for (let r = glowSize; r > 0; r -= 4) {
    let a = map(r, 0, glowSize, 80, 0);
    fill(255, 200, 120, a);
    ellipse(canvasW / 2, canvasH * 0.4, r * 2, r * 2);
  }

  // Subtle noise texture
  for (let i = 0; i < 200; i++) {
    let nx = random(canvasW);
    let ny = random(canvasH);
    fill(255, 255, 255, random(2, 8));
    ellipse(nx, ny, 1, 1);
  }
}

function windowResized() {
  canvasW = min(windowWidth, 800);
  canvasH = min(windowHeight, 600);
  resizeCanvas(canvasW, canvasH);
}
