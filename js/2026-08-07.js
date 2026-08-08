// Norman World — 2026-08-07
// Theme: orbiting fragments, radiant loops, the quiet compulsion of wheels within wheels
let t = 0;

function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  const w = width;
  const h = height;
  
  // Midnight blue-black sky
  background(220, 30, 8);
  
  t += 0.006;
  
  // Radiant amber core glow — the center everyone orbits
  const cx = w * 0.5;
  const cy = h * 0.5;
  const coreRadius = min(w, h) * 0.22;
  
  // Soft glow halo
  for (let r = coreRadius * 3; r > 0; r -= 4) {
    const inter = r / (coreRadius * 3);
    const alpha = map(inter, 0, 1, 0, 40);
    const hue = map(inter, 0, 1, 35, 50);
    fill(hue, 60, 100, alpha);
    ellipse(cx, cy, r * 2, r * 2);
  }
  
  // Orbiting fragments — hamster wheel energy, loops within loops
  const numOrbits = 3;
  for (let orbit = 0; orbit < numOrbits; orbit++) {
    const orbitRadius = coreRadius * (1.4 + orbit * 0.7);
    const numFragments = 5 + orbit * 2;
    const orbitSpeed = (0.4 + orbit * 0.15) * (orbit % 2 === 0 ? 1 : -1);
    const orbitPhase = t * orbitSpeed + orbit * 1.1;
    
    for (let i = 0; i < numFragments; i++) {
      const angle = (TWO_PI / numFragments) * i + orbitPhase;
      const fx = cx + cos(angle) * orbitRadius;
      const fy = cy + sin(angle) * orbitRadius;
      const fragSize = (min(w, h) * 0.018) * pow(0.85, orbit);
      const hue = map(orbit, 0, numOrbits - 1, 38, 55);
      const sat = map(orbit, 0, numOrbits - 1, 65, 45);
      fill(hue, sat, 95, 90);
      ellipse(fx, fy, fragSize, fragSize);
      
      // Tiny trail — motion blur
      for (let trail = 1; trail <= 3; trail++) {
        const prevAngle = angle - (0.08 * trail);
        const tx = cx + cos(prevAngle) * orbitRadius;
        const ty = cy + sin(prevAngle) * orbitRadius;
        fill(hue, sat, 95, 30 - trail * 8);
        ellipse(tx, ty, fragSize * (1 - trail * 0.2), fragSize * (1 - trail * 0.2));
      }
    }
  }
  
  // Central bright core
  fill(42, 50, 100, 95);
  ellipse(cx, cy, coreRadius * 0.6, coreRadius * 0.6);
  fill(50, 30, 100, 80);
  ellipse(cx, cy, coreRadius * 0.3, coreRadius * 0.3);
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
