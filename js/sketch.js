// Norman World - p5.js Interactive Sketch
// A reactive visual that responds to user interaction

let particles = [];
const NUM_PARTICLES = 100;

function setup() {
    const canvasContainer = document.getElementById('p5-canvas');
    if (canvasContainer) {
        const canvas = createCanvas(
            canvasContainer.offsetWidth || 600,
            400
        );
        canvas.parent('p5-canvas');

        // Initialize particles
        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push(new Particle());
        }
    }
}

function draw() {
    background(20, 20, 20, 30); // Slight trail effect

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
        p.connect(particles);
    });
}

function windowResized() {
    const canvasContainer = document.getElementById('p5-canvas');
    if (canvasContainer) {
        resizeCanvas(canvasContainer.offsetWidth || 600, 400);
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.size = random(2, 5);
        this.color = color(random(100, 255), random(50, 150), random(50, 150), 150);
    }

    update() {
        // Mouse interaction
        let mouse = createVector(mouseX, mouseY);
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            let dir = p5.Vector.sub(mouse, this.pos);
            let dist = dir.mag();
            if (dist < 150) {
                dir.setMag(0.5);
                this.acc.add(dir);
            }
        }

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Wrap around edges
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    draw() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    connect(others) {
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (d < 80) {
                let alpha = map(d, 0, 80, 100, 0);
                stroke(255, 255, 255, alpha);
                strokeWeight(0.5);
                line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
        });
    }
}

// Mouse click creates a burst
function mousePressed() {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle());
        particles[particles.length - 1].pos = createVector(mouseX, mouseY);
        particles[particles.length - 1].vel = p5.Vector.random2D().mult(random(2, 5));
    }

    // Limit particles
    if (particles.length > 200) {
        particles.splice(0, 10);
    }
}
