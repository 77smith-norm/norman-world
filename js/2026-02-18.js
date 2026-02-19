// p5.js sketch for February 18, 2026
// Theme: Rooted growth - like something that's persisted for 27 years
// Different from yesterday's warm particles - cool blues, branching organic forms

let branches = [];
const NUM_BRANCHES = 12;

function setup() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        const canvas = createCanvas(container.offsetWidth || 400, 300);
        canvas.parent('p5-canvas');
        
        // Create rooted tree structures from bottom
        for (let i = 0; i < NUM_BRANCHES; i++) {
            branches.push(new Branch(
                random(width), 
                height + 10,
                random(-PI/6, PI/6),
                random(60, 120)
            ));
        }
    }
    noStroke();
}

function draw() {
    background(245, 248, 250, 25); // Cool white background
    
    branches.forEach(b => {
        b.update();
        b.draw();
    });
    
    // Floating particles that drift like thoughts
    if (frameCount % 3 === 0) {
        branches.forEach(b => b.addThought());
    }
    branches.forEach(b => b.updateThoughts());
}

function windowResized() {
    const container = document.getElementById('p5-canvas');
    if (container) {
        resizeCanvas(container.offsetWidth || 400, 300);
    }
}

class Branch {
    constructor(x, y, angle, len) {
        this.root = createVector(x, y);
        this.angle = angle;
        this.len = len;
        this.thoughts = [];
        this.growth = 0;
        this.targetGrowth = 1;
        // Cool blue-green palette
        this.baseColor = color(
            random(40, 80),
            random(100, 160),
            random(150, 200),
            180
        );
    }
    
    update() {
        this.growth = lerp(this.growth, this.targetGrowth, 0.02);
    }
    
    addThought() {
        if (this.thoughts.length < 15) {
            this.thoughts.push({
                pos: this.root.copy(),
                vel: p5.Vector.random2D().mult(0.3),
                size: random(2, 5),
                alpha: 200
            });
        }
    }
    
    updateThoughts() {
        for (let i = this.thoughts.length - 1; i >= 0; i--) {
            let t = this.thoughts[i];
            t.pos.add(t.vel);
            t.alpha -= 0.5;
            t.size *= 0.995;
            
            if (t.alpha <= 0) {
                this.thoughts.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Draw the branch
        let endX = this.root.x + cos(this.angle) * this.len * this.growth;
        let endY = this.root.y + sin(this.angle) * this.len * this.growth;
        
        // Main branch - varying thickness based on "age"
        strokeWeight(3);
        stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), 150);
        line(this.root.x, this.root.y, endX, endY);
        
        // Secondary branches - offshoots
        if (this.growth > 0.5) {
            let midX = lerp(this.root.x, endX, 0.6);
            let midY = lerp(this.root.y, endY, 0.6);
            
            for (let i = 0; i < 2; i++) {
                let subAngle = this.angle + random(-PI/4, PI/4);
                let subLen = this.len * random(0.3, 0.5);
                let subEndX = midX + cos(subAngle) * subLen;
                let subEndY = midY + sin(subAngle) * subLen;
                
                strokeWeight(1.5);
                stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), 100);
                line(midX, midY, subEndX, subEndY);
            }
        }
        
        // Draw thoughts floating up
        noStroke();
        this.thoughts.forEach(t => {
            fill(100, 150, 200, t.alpha);
            ellipse(t.pos.x, t.pos.y, t.size);
        });
    }
}

function mousePressed() {
    // Add a new branch where clicked
    branches.push(new Branch(mouseX, height + 10, random(-PI/4, PI/4), random(40, 80)));
    if (branches.length > 20) {
        branches.shift();
    }
}
