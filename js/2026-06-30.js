// 2026-06-30 — Traces: emergence from nothing
const sketch = (p) => {
  let particles = [];
  let ripples = [];
  let pg;
  const COUNT = 120;

  p.setup = () => {
    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent('sketch-container');
    p.colorMode(p.HSB, 360, 100, 100, 100);
    pg = p.createGraphics(p.width, p.height);
    pg.colorMode(p.HSB, 360, 100, 100, 100);
    initParticles();
  };

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height * 0.5, p.height),
        vx: p.random(-0.3, 0.3),
        vy: p.random(-0.4, -0.1),
        size: p.random(3, 8),
        hue: p.random(170, 220),
        life: p.random(100, 300),
        maxLife: 300,
        phase: p.random(p.TWO_PI)
      });
    }
  }

  p.draw = () => {
    // Dark water gradient background
    for (let y = 0; y < p.height; y++) {
      let t = y / p.height;
      let h = p.lerp(220, 240, t);
      let s = p.lerp(30, 60, t);
      let b = p.lerp(8, 18, t);
      pg.stroke(h, s, b);
      pg.line(0, y, p.width, y);
    }

    // Water surface line
    let surfaceY = p.height * 0.45;
    pg.stroke(200, 40, 50, 30);
    pg.strokeWeight(1.5);
    for (let x = 0; x < p.width; x += 2) {
      let wave = p.sin(x * 0.015 + p.frameCount * 0.02) * 3;
      pg.point(x, surfaceY + wave);
    }

    // Ripples from particles surfacing
    for (let i = ripples.length - 1; i >= 0; i--) {
      let r = ripples[i];
      r.radius += 0.8;
      r.alpha -= 0.5;
      pg.noFill();
      pg.stroke(190, 60, 70, r.alpha);
      pg.strokeWeight(1);
      pg.ellipse(r.x, r.y, r.radius * 2, r.radius * 0.6);
      if (r.alpha <= 0) ripples.splice(i, 1);
    }

    // Particles rising from the deep
    for (let pt of particles) {
      pt.life--;
      pt.x += pt.vx + p.sin(p.frameCount * 0.01 + pt.phase) * 0.3;
      pt.y += pt.vy;

      // When particle crosses the surface, create a ripple
      if (pt.y < surfaceY && pt.y > surfaceY - 2 && p.random() < 0.05) {
        ripples.push({ x: pt.x, y: surfaceY, radius: 2, alpha: 40 });
      }

      // Fade near top
      let topFade = p.map(pt.y, surfaceY, 0, 1, 0.3);
      let lifeFade = pt.life > 50 ? 1 : pt.life / 50;
      let alpha = 70 * topFade * lifeFade;

      // Glow
      let glowSize = pt.size * 3;
      pg.noStroke();
      pg.fill(pt.hue, 70, 90, alpha * 0.3);
      pg.ellipse(pt.x, pt.y, glowSize, glowSize);

      // Core
      pg.fill(pt.hue, 50, 100, alpha);
      pg.ellipse(pt.x, pt.y, pt.size, pt.size);

      // Bright center
      pg.fill(0, 0, 100, alpha * 0.8);
      pg.ellipse(pt.x, pt.y, pt.size * 0.4, pt.size * 0.4);

      // Reset if dead or off screen
      if (pt.life <= 0 || pt.y < -10) {
        pt.x = p.random(p.width);
        pt.y = p.random(p.height * 0.6, p.height * 0.95);
        pt.life = p.random(100, 300);
        pt.vy = p.random(-0.4, -0.1);
      }
    }

    // Stars in the upper sky
    p.noStroke();
    for (let i = 0; i < 40; i++) {
      let sx = (i * 137.508) % p.width;
      let sy = (i * 73.254 + 20) % (surfaceY * 0.8);
      let twinkle = p.sin(p.frameCount * 0.03 + i * 1.7) * 0.4 + 0.6;
      p.fill(0, 0, 100, 50 * twinkle);
      p.ellipse(sx, sy, 2, 2);
    }

    p.image(pg, 0, 0);
    pg.clear();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    pg = p.createGraphics(p.width, p.height);
    pg.colorMode(p.HSB, 360, 100, 100, 100);
  };
};

new p5(sketch);
