// 2026-09-25 — "The edges we name are only where we stopped looking; the
// thing keeps going, unbothered by the line we drew."
//
// Abstract p5 sketch. A topographic field of endless contour lines that
// drift and breathe but never close into a shape. Whatever we call an
// "edge" is just a segment we happened to trace — a glinting highlight we
// lay on one curve for a moment before it dissolves back into the whole.
// Move the pointer to name an edge; watch the line keep going past it.

let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(77);
}

function draw() {
  background(9, 12, 24, 34);
  t += 1;

  const px = constrain(mouseX, 0, width);
  const py = constrain(mouseY, 0, height);
  const pointerOn =
    mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  const lines = 46;
  const gap = height / lines;
  const drift = t * 0.0016;

  for (let i = 0; i < lines; i++) {
    const baseY = gap * i + gap * 0.5;
    // Roughness and tone vary along the field.
    const depth = i / lines;
    const amp = 26 + 40 * noise(i * 0.7, drift);

    noFill();
    const steps = 96;
    let prevX = 0;
    let prevY = 0;

    for (let s = 0; s <= steps; s++) {
      const fx = s / steps;
      const x = fx * width;
      const n =
        noise(x * 0.0018, i * 0.12, drift) * 2 - 1;
      const y =
        baseY +
        n * amp +
        sin(x * 0.006 + i * 0.5 + t * 0.004) * amp * 0.25;

      if (s > 0) {
        // Base contour: cool, faint, eternal.
        stroke(
          lerp(96, 150, depth),
          lerp(150, 200, 1 - depth),
          200,
          16 + 34 * (1 - depth)
        );
        strokeWeight(0.8);
        line(prevX, prevY, x, y);
      }
      prevX = x;
      prevY = y;
    }
  }

  // The "edge we name": a bright amber segment laid on whichever curve is
  // nearest the pointer, always shorter than the line beneath it.
  if (pointerOn) {
    const named = drawNamedEdge(px, py);
    // A faint halo marking the act of naming, fading as it goes.
    noFill();
    stroke(255, 214, 140, 26);
    strokeWeight(1);
    ellipse(px, py, 90 + 6 * sin(t * 0.02), 90 + 6 * sin(t * 0.02));
  }

  // Slow sweeping front — the whole field reconsidering its own lines.
  const sweepY = ((t * 0.5) % (height + 200)) - 100;
  noFill();
  stroke(120, 196, 240, 18);
  strokeWeight(1);
  line(0, sweepY, width, sweepY - 40);
}

function drawNamedEdge(px, py) {
  // Find the nearest contour row and light a short arc near the pointer.
  const lines = 46;
  const gap = height / lines;
  const row = constrain(round(py / gap), 0, lines - 1);
  const baseY = gap * row + gap * 0.5;
  const depth = row / lines;
  const amp = 26 + 40 * noise(row * 0.7, t * 0.0016);

  const half = 70;
  const steps = 40;
  let prevX = 0;
  let prevY = 0;
  for (let s = 0; s <= steps; s++) {
    const fx = s / steps;
    const x = px - half + 2 * half * fx;
    if (x < 0 || x > width) {
      prevX = x;
      continue;
    }
    const n = noise(x * 0.0018, row * 0.12, t * 0.0016) * 2 - 1;
    const y =
      baseY +
      n * amp +
      sin(x * 0.006 + row * 0.5 + t * 0.004) * amp * 0.25;
    if (s > 0) {
      const edge = 1 - abs(fx - 0.5) * 2; // brightest at the centre
      stroke(255, 200, 120, 30 + 190 * edge * edge);
      strokeWeight(1.4 + 1.2 * edge);
      line(prevX, prevY, x, y);
    }
    prevX = x;
    prevY = y;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
