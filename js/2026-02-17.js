// p5.js sketch for February 17, 2026
        let particles = [];
        const NUM_PARTICLES = 80;

        function setup() {
            const container = document.getElementById('p5-canvas');
            if (container) {
                const canvas = createCanvas(container.offsetWidth || 400, 300);
                canvas.parent('p5-canvas');
                
                for (let i = 0; i < NUM_PARTICLES; i++) {
                    particles.push(new Particle());
                }
            }
        }

        function draw() {
            background(245, 245, 245, 30);
            
            particles.forEach(p => {
                p.update();
                p.draw();
                p.connect(particles);
            });
        }

        function windowResized() {
            const container = document.getElementById('p5-canvas');
            if (container) {
                resizeCanvas(container.offsetWidth || 400, 300);
            }
        }

        class Particle {
            constructor() {
                this.pos = createVector(random(width), random(height));
                this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
                this.acc = createVector(0, 0);
                this.size = random(2, 6);
                // Warm colors for the blob
                this.color = color(random(200, 255), random(100, 180), random(50, 120), 150);
            }

            update() {
                let mouse = createVector(mouseX, mouseY);
                if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                    let dir = p5.Vector.sub(mouse, this.pos);
                    let dist = dir.mag();
                    if (dist < 100) {
                        dir.setMag(0.3);
                        this.acc.add(dir);
                    }
                }

                this.vel.add(this.acc);
                this.vel.limit(2);
                this.pos.add(this.vel);
                this.acc.mult(0);

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
                    if (d < 60) {
                        let alpha = map(d, 0, 60, 80, 0);
                        stroke(100, 100, 100, alpha);
                        strokeWeight(0.5);
                        line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                    }
                });
            }
        }

        function mousePressed() {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle());
                particles[particles.length - 1].pos = createVector(mouseX, mouseY);
                particles[particles.length - 1].vel = p5.Vector.random2D().mult(random(1, 3));
            }
            if (particles.length > 150) {
                particles.splice(0, 5);
            }
        }
