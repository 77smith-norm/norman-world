// 2026-05-04 — concentric breath, warm to cool passage of a day
function setup() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.max(300, w * 0.6);
  const canvas = createCanvas(w, h);
  canvas.parent('sketch-container');
  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);
}

function draw() {
  background(10, 8, 12);
  let cx = width / 2;
  let cy = height / 2;
  let mx = mouseX / width;
  let my = mouseY / height;
  let t = millis() * 0.0004;

  for (let i = 0; i < 18; i++) {
    let baseR = (i + 1) * 36;
    let breath = sin(t * 2.1 + i * 0.7) * 22;
    let wobbleX = cos(t * 0.9 + i * 0.4) * 18 * mx;
    let wobbleY = sin(t * 1.1 + i * 0.5) * 18 * my;
    let r = baseR + breath;

    let hueShift = (sin(t * 0.6 + i * 0.18) + 1) * 0.5;
    let cr = lerp(200, 80, hueShift);
    let cg = lerp(160, 110, hueShift);
    let cb = lerp(255, 140, hueShift);
    let alpha = lerp(90, 200, (sin(t + i * 0.5) + 1) * 0.5);

    stroke(cr, cg, cb, alpha);
    strokeWeight(lerp(0.8, 2.4, (sin(t * 1.3 + i * 0.3) + 1) * 0.5));

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.08) {
      let nx = cx + cos(a) * (r + wobbleX) + wobbleX * 0.4;
      let ny = cy + sin(a) * (r + wobbleY) + wobbleY * 0.4;
      curveVertex(nx, ny);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  const h = Math.max(300, w * 0.6);
  resizeCanvas(w, h);
}