// p5.js sketch for February 19, 2026
// Theme: Deferred completion - lines that sweep and resolve
// A departure from organic growth - geometric, purposeful, cleanup

let sweeps = [];
let resolved = [];
const MAX_SWEEPS = 8;

function setup() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        const canvas = createCanvas(container.offsetWidth || 400, 300);
        canvas.parent('p5-canvas');
        
        // Create initial sweeps
        for (let i = 0; i < 3; i++) {
            addSweep();
        }
    }
    noStroke();
}

function draw() {
    // Darker, more contemplative background
    background(20, 22, 28, 40);
    
    // Draw resolved/completed sweeps - they persist as marks
    resolved.forEach(r => {
        drawSweepLine(r.startX, r.startY, r.endX, r.endY, r.progress, r.color);
    });
    
    // Update and draw active sweeps
    for (let i = sweeps.length - 1; i >= 0; i--) {
        let s = sweeps[i];
        s.progress = lerp(s.progress, 1, 0.04);
        
        // Calculate current end point
        let currentX = lerp(s.startX, s.endX, s.progress);
        let currentY = lerp(s.startY, s.endY, s.progress);
        
        // Draw the sweep as it progresses
        drawSweepLine(s.startX, s.startY, currentX, currentY, s.progress, s.color);
        
        // Add trailing particles
        if (frameCount % 2 === 0) {
            s.particles.push({
                x: currentX + random(-3, 3),
                y: currentY + random(-3, 3),
                size: random(2, 6),
                alpha: 180
            });
        }
        
        // Update and draw particles
        for (let j = s.particles.length - 1; j >= 0; j--) {
            let p = s.particles[j];
            p.alpha -= 3;
            p.size *= 0.96;
            
            if (p.alpha > 0) {
                fill(red(s.color), green(s.color), blue(s.color), p.alpha);
                ellipse(p.x, p.y, p.size);
            } else {
                s.particles.splice(j, 1);
            }
        }
        
        // When sweep completes, move to resolved
        if (s.progress > 0.98) {
            resolved.push({
                startX: s.startX,
                startY: s.startY,
                endX: s.endX,
                endY: s.endY,
                progress: 1,
                color: s.color
            });
            sweeps.splice(i, 1);
            
            // Add new sweep to replace
            if (resolved.length < 25) {
                addSweep();
            }
        }
    }
    
    // Add a new sweep occasionally
    if (frameCount % 60 === 0 && sweeps.length < MAX_SWEEPS) {
        addSweep();
    }
}

function addSweep() {
    // Start from left side, sweep to right
    let startX = random(-50, 50);
    let startY = random(height);
    let endX = width + random(50, 100);
    let endY = startY + random(-80, 80);
    
    // Warm accent colors - amber, coral, soft gold
    let colors = [
        color(255, 180, 100, 200),   // amber
        color(255, 140, 120, 180),   // coral
        color(255, 220, 150, 160),   // soft gold
        color(180, 200, 255, 150),   // soft blue
    ];
    
    sweeps.push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        progress: 0,
        color: random(colors),
        particles: []
    });
}

function drawSweepLine(x1, y1, x2, y2, progress, col) {
    // Main line
    strokeWeight(2);
    stroke(red(col), green(col), blue(col), 200 * progress);
    line(x1, y1, x2, y2);
    
    // Subtle glow effect
    strokeWeight(6);
    stroke(red(col), green(col), blue(col), 40 * progress);
    line(x1, y1, x2, y2);
}

function windowResized() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        resizeCanvas(container.offsetWidth || 400, 300);
    }
}

function mousePressed() {
    // Add a burst of new sweeps from click point
    for (let i = 0; i < 3; i++) {
        let startX = mouseX + random(-20, 20);
        let startY = mouseY + random(-20, 20);
        let endX = startX + random(100, 200);
        let endY = startY + random(-100, 100);
        
        let colors = [
            color(255, 180, 100, 200),
            color(255, 140, 120, 180),
        ];
        
        sweeps.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            progress: 0,
            color: random(colors),
            particles: []
        });
    }
}
