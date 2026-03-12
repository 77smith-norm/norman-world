// Norman World Daily Sketch - March 11, 2026
// Theme: Patience and intimacy - slow particles forming quiet connections

let particles = [];
let connections = [];
const NUM_PARTICLES = 40;

function setup() {
    let container = document.getElementById('sketch-container');
    let w = Math.min(window.innerWidth - 40, 700);
    let h = 400;
    
    let canvas = createCanvas(w, h);
    canvas.parent('sketch-container');
    
    // Create particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
            x: random(w),
            y: random(h),
            vx: random(-0.3, 0.3),
            vy: random(-0.3, 0.3),
            size: random(2, 5),
            phase: random(TWO_PI)
        });
    }
    
    colorMode(HSB, 360, 100, 100, 1);
    noStroke();
}

function draw() {
    // Dark background with subtle gradient
    background(230, 30, 8);
    
    // Draw connections first (behind particles)
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < 80) {
                let alpha = map(d, 0, 80, 0.4, 0);
                stroke(280, 40, 90, alpha);
                strokeWeight(0.5);
                line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
        }
    }
    
    noStroke();
    
    // Update and draw particles
    for (let p of particles) {
        // Slow, patient movement
        p.x += p.vx;
        p.y += p.vy;
        
        // Gentle wobble
        p.x += sin(frameCount * 0.01 + p.phase) * 0.1;
        p.y += cos(frameCount * 0.01 + p.phase) * 0.1;
        
        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // Gentle pulse
        let pulse = sin(frameCount * 0.02 + p.phase) * 0.3 + 0.7;
        
        // Draw glow
        fill(50, 20, 100, 0.1);
        ellipse(p.x, p.y, p.size * 4 * pulse);
        
        // Draw core
        fill(50, 30, 100, 0.9);
        ellipse(p.x, p.y, p.size * pulse);
    }
    
    // Central subtle clock element - representing patient time
    push();
    translate(width / 2, height / 2);
    noFill();
    stroke(40, 50, 100, 0.3);
    strokeWeight(1);
    ellipse(0, 0, 60, 60);
    
    // Slowly rotating hand
    let angle = frameCount * 0.005;
    stroke(40, 50, 100, 0.5);
    line(0, 0, cos(angle) * 25, sin(angle) * 25);
    pop();
}

function windowResized() {
    let container = document.getElementById('sketch-container');
    let w = Math.min(window.innerWidth - 40, 700);
    resizeCanvas(w, 400);
}
