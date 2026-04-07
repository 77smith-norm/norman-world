// Norman World — April 6, 2026
// The small tools, the large powers.
// Warm islands in a cold architecture.

let clusters = [];
let t = 0;
const NUM_CLUSTERS = 5;

function setup() {
  const container = document.getElementById('sketch-container');
  const w = container.offsetWidth || 600;
  const h = Math.min(w * 0.72, 520);
  const cnv = createCanvas(w, h);
  cnv.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create warm glowing clusters scattered across the canvas
  for (let i = 0; i < NUM_CLUSTERS; i++) {
    clusters.push({
      cx: random(width * 0.1, width * 0.9),
      cy: random(height * 0.2, height * 0.8),
      baseX: 0,
      baseY: 0,
      particles: [],
      clusterHue: random(35, 55),
      radius: random(40, 80),
      birth: random(0, 1000)
    });
    clusters[i].baseX = clusters[i].cx;
    clusters[i].baseY = clusters[i].cy;
    
    // Each cluster has orbiting particles
    for (let j = 0; j < 18; j++) {
      clusters[i].particles.push({
        angle: random(TWO_PI),
        dist: random(10, clusters[i].radius),
        speed: random(0.005, 0.015) * random([1, -1]),
        size: random(1.5, 3.5),
        phase: random(TWO_PI),
        hueOff: random(-10, 10)
      });
    }
  }
}

function draw() {
  // Dark sky gradient
  background(230, 25, 6);
  
  t += 0.015;
  
  // Giant distant structure — looming corporate architecture
  let structCX = width * 0.82;
  let structCY = height * 0.38;
  let structW = width * 0.28;
  let structH = height * 0.78;
  
  // Building shadow/depth
  noStroke();
  fill(250, 40, 10, 40);
  rect(structCX - structW/2 + 8, structCY - structH/2 + 8, structW, structH, 2);
  
  // Building body
  fill(235, 30, 14, 85);
  stroke(260, 20, 22, 60);
  strokeWeight(1);
  rect(structCX - structW/2, structCY - structH/2, structW, structH, 2);
  
  // Window grid — distant, cold
  let cols = 8;
  let rows = 20;
  let cw = structW / cols;
  let rh = structH / rows;
  noStroke();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let wx = structCX - structW/2 + c * cw + cw * 0.2;
      let wy = structCY - structH/2 + r * rh + rh * 0.2;
      let ww = cw * 0.6;
      let wr = rh * 0.5;
      let cold = 220 + sin(r * 0.5 + t * 0.3) * 15;
      fill(cold, 15, 30, 40 + sin(t * 0.5 + r + c) * 20);
      rect(wx, wy, ww, wr, 1);
    }
  }
  
  // Building glow at top
  for (let r = structH * 0.5; r > 0; r -= 15) {
    fill(250, 40, 20, map(r, 0, structH * 0.5, 8, 0));
    ellipse(structCX, structCY - structH/2, structW * 0.8, r * 0.4);
  }
  
  // Warm glowing clusters — the local tools
  for (let cl of clusters) {
    // Drift slowly
    cl.cx = cl.baseX + sin(t * 0.2 + cl.birth) * 12;
    cl.cy = cl.baseY + cos(t * 0.15 + cl.birth) * 8;
    
    // Cluster glow
    noStroke();
    for (let r = cl.radius * 2; r > 0; r -= 8) {
      fill(cl.clusterHue, 70, 60, map(r, 0, cl.radius * 2, 12, 0));
      ellipse(cl.cx, cl.cy, r * 2, r * 2);
    }
    
    // Particles in orbit
    for (let p of cl.particles) {
      p.angle += p.speed;
      let px = cl.cx + cos(p.angle) * p.dist;
      let py = cl.cy + sin(p.angle) * p.dist;
      
      let pulse = 0.6 + sin(t * 2 + p.phase) * 0.4;
      let bri = 70 + sin(t * 1.5 + p.phase) * 25;
      
      noStroke();
      fill(cl.clusterHue + p.hueOff, 65, bri * pulse, 20);
      ellipse(px, py, p.size * 4, p.size * 4);
      fill(cl.clusterHue + p.hueOff, 50, bri * pulse, 60);
      ellipse(px, py, p.size * 2, p.size * 2);
      fill(cl.clusterHue + p.hueOff, 20, 95, 90);
      ellipse(px, py, p.size * 0.6, p.size * 0.6);
    }
    
    // Central spark
    fill(cl.clusterHue, 30, 100, 90);
    ellipse(cl.cx, cl.cy, 3, 3);
  }
  
  // Thin connection lines from clusters toward the building
  strokeWeight(0.3);
  for (let cl of clusters) {
    let dx = structCX - cl.cx;
    let dy = structCY - cl.cy;
    let d = sqrt(dx * dx + dy * dy);
    for (let p of cl.particles) {
      let px = cl.cx + cos(p.angle) * p.dist;
      let py = cl.cy + sin(p.angle) * p.dist;
      let alpha = map(sin(t + p.phase), -1, 1, 3, 12);
      stroke(cl.clusterHue, 40, 60, alpha);
      line(px, py, structCX, structCY);
    }
  }
}
