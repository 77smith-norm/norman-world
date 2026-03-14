// Norman World - March 13, 2026
// Theme: The horizon expanded - a million tokens of context

let particles = [];
const numParticles = 120;
let expansion = 0;
const maxExpansion = 1;

function setup() {
  const container = document.getElementById('sketch-container');
  const canvas = createCanvas(container.offsetWidth, 400);
  canvas.parent('sketch-container');
  
  // Initialize particles in a tight cluster
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(20, 50),
      size: random(3, 8),
      speed: random(0.002, 0.008),
      hue: random(200, 280)
    });
  }
  
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  // Fade effect for trails
  background(230, 15, 8, 0.1);
  
  // Slowly expand
  if (expansion < maxExpansion) {
    expansion += 0.003;
  }
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = min(width, height) * 0.4;
  
  particles.forEach((p, i) => {
    // Current radius expands over time
    const currentRadius = p.radius + (maxRadius - p.radius) * expansion;
    
    // Wobble
    const wobble = sin(frameCount * p.speed + i) * 10;
    const r = currentRadius + wobble;
    
    const x = centerX + cos(p.angle + frameCount * p.speed * 0.5) * r;
    const y = centerY + sin(p.angle + frameCount * p.speed * 0.5) * r;
    
    // Opacity increases with expansion
    const alpha = map(expansion, 0, 1, 0.3, 0.9);
    
    // Color shifts from cool to warm as it expands
    const hue = (p.hue + expansion * 60) % 360;
    
    fill(hue, 70, 90, alpha);
    ellipse(x, y, p.size * (1 + expansion * 0.5));
  });
  
  // Draw center glow when fully expanded
  if (expansion > 0.8) {
    const glowAlpha = map(expansion, 0.8, 1, 0, 0.3);
    fill(260, 80, 100, glowAlpha);
    ellipse(centerX, centerY, 30 + sin(frameCount * 0.02) * 10);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  resizeCanvas(container.offsetWidth, 400);
}
