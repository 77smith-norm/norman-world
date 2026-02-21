// p5.js sketch for February 20, 2026
// Theme: Gateways closing - particles seeking passage
// The tension between openness and walls, light finding cracks

let particles = [];
let gateY;
let gateHeight;
let gateSpeed = 0.3;

function setup() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        const canvas = createCanvas(container.offsetWidth || 400, 300);
        canvas.parent('p5-canvas');
        
        gateY = height / 2;
        gateHeight = height * 0.8;
    }
    noStroke();
}

function draw() {
    // Dark contemplative background - like a doorway to somewhere
    background(15, 18, 25, 30);
    
    // The gate - two closing walls
    let leftX = width * 0.35;
    let rightX = width * 0.65;
    
    // Left wall
    fill(60, 70, 90, 200);
    rect(0, 0, leftX, height);
    
    // Right wall
    rect(rightX, 0, width - rightX, height);
    
    // Gate opening in middle - getting smaller
    let gateGap = gateHeight * 0.5;
    let gateTop = gateY - gateGap / 2;
    let gateBottom = gateY + gateGap / 2;
    
    // Gate edges - glowing
    fill(255, 100, 80, 150);
    rect(leftX - 5, gateTop, 8, gateGap);
    rect(rightX - 3, gateTop, 8, gateGap);
    
    // Particles trying to get through
    // Spawn new particles from left side
    if (frameCount % 4 === 0 && particles.length < 60) {
        particles.push({
            x: random(-20, leftX - 20),
            y: random(height * 0.2, height * 0.8),
            vx: random(1.5, 3),
            vy: random(-0.5, 0.5),
            size: random(3, 8),
            hue: random() > 0.7 ? 1 : 0, // Some are warm, some cool
            passed: false
        });
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Check if trying to pass through gate
        let inGateZone = p.x > leftX && p.x < rightX;
        let inGateY = p.y > gateTop && p.y < gateBottom;
        
        if (inGateZone && !inGateY) {
            // Bounce back - rejected by the wall
            p.vx *= -0.5;
            p.vy += random(-2, 2);
        }
        
        // Passed through!
        if (p.x > rightX && !p.passed) {
            p.passed = true;
            p.vx *= 0.8; // Slow down after passing
        }
        
        // Remove if off screen
        if (p.x > width + 20 || p.x < -50 || p.y < -20 || p.y > height + 20) {
            particles.splice(i, 1);
            continue;
        }
        
        // Draw particle
        if (p.hue === 1) {
            // Warm particles - the ones that made it through, or trying hard
            fill(255, 180, 100, p.passed ? 230 : 180);
        } else {
            // Cool particles
            fill(100, 180, 255, p.passed ? 230 : 150);
        }
        
        // Glow effect for passed particles
        if (p.passed) {
            fill(255, 200, 150, 50);
            ellipse(p.x, p.y, p.size * 2.5);
        }
        
        fill(p.hue === 1 ? color(255, 180, 100, 220) : color(100, 200, 255, 180));
        ellipse(p.x, p.y, p.size);
    }
    
    // Slowly close the gate a bit more
    if (gateHeight > height * 0.3) {
        gateHeight -= gateSpeed;
    }
    
    // Title text at bottom
    fill(150, 160, 180, 80);
    textSize(10);
    textAlign(CENTER);
    text("keep it open", width / 2, height - 15);
}

function windowResized() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        resizeCanvas(container.offsetWidth || 400, 300);
    }
}

function mousePressed() {
    // Burst of new particles
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: random(-20, width * 0.3),
            y: random(height * 0.3, height * 0.7),
            vx: random(2, 5),
            vy: random(-1, 1),
            size: random(3, 10),
            hue: random() > 0.5 ? 1 : 0,
            passed: false
        });
    }
}
