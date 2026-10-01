// 2026-09-30 — "Even in stillness the brain keeps its waves —
// nothing alive is ever truly quiet."
//
// Abstract p5 sketch. A dark pool rests under a slow field of concentric
// ripples. Two quiet sources keep emitting wavefronts that cross and interfere,
// bright where crests meet, dimming where they cancel. Nothing here is still:
// the calm surface is only the sum of motions that never stopped. The pointer
// adds a third source and the whole field listens to it. No figure is drawn —
// only rings, crossings, and the hush they travel through.

let sources = [];
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  noiseSeed(30);
  randomSeed(30);
  buildSources();
}

function buildSources() {
  sources = [
    { x: width * 0.32, y: height * 0.42, r: 0, rate: 1.05, hue: 0 },
    { x: width * 0.68, y: height * 0.6, r: 0, rate: 0.85, hue: 1 },
  ];
}

function draw() {
  background(8, 10, 15);
  t += 1;

  const hand = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
  if (hand) {
    sources[2] = { x: mouseX, y: mouseY, r: sources[2] ? sources[2].r : 0, rate: 1.2, hue: 2 };
  } else if (sources.length > 2) {
    sources.pop();
  }

  noFill();
  for (const s of sources) {
    s.r += s.rate;
    const ringGap = 34;
    // A slow breathing of visibility keeps the field alive between crests.
    const breath = 0.72 + 0.28 * sin(t * 0.01 + s.hue * 1.7);

    for (let k = 0; k < 26; k++) {
      const r = ((s.r + k * ringGap) % (ringGap * 26));
      const fade = 1 - r / (ringGap * 26);
      if (fade <= 0) continue;

      // Palette: cool teal for the first source, warm amber for the second,
      // pale rose for the pointer's third voice.
      let c;
      if (s.hue === 0) c = color(96, 196, 198);
      else if (s.hue === 1) c = color(238, 190, 120);
      else c = color(226, 150, 168);

      // Where wavefronts are nearest each other the field brightens —
      // the crossing points where crests add instead of cancel.
      let boost = 0;
      for (const o of sources) {
        if (o === s) continue;
        const dr = abs(r - dist(s.x, s.y, o.x, o.y) * 0);
        const dd = dist(s.x, s.y, o.x, o.y);
        const phase = abs(r - dd);
        boost = max(boost, max(0, 1 - phase / (ringGap * 1.2)));
      }

      c.setAlpha(6 + 40 * fade * breath + 26 * boost);
      stroke(c);
      strokeWeight(0.8 + 1.6 * boost);
      circle(s.x, s.y, r * 2);
    }
  }

  // The quiet core of attention where the cursor rests.
  if (hand) {
    noFill();
    stroke(255, 236, 214, 30);
    strokeWeight(1);
    circle(mouseX, mouseY, 10 + 4 * sin(t * 0.06));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildSources();
}
