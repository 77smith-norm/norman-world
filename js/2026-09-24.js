// 2026-09-24 — "Something in us keeps rebuilding what it loses; the shape
// outlives the damage, quietly regrowing toward the form it always was."
//
// Abstract p5 sketch. A field of soft green-gold tissue sites, each one
// periodically wounded — a wedge is cut from it — and then slowly regrown
// cell by cell back toward its remembered form. Nothing is ever deleted;
// the wound heals at its own unhurried rate. Move the pointer to cut a site
// and watch it remember its shape and grow back.

let sites = [];
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  pixelDensity(1);
  buildSites();
}

function buildSites() {
  sites = [];
  const cols = constrain(floor(width / 170), 3, 9);
  const rows = constrain(floor(height / 170), 2, 7);
  const cw = width / cols;
  const ch = height / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = cw * (c + 0.5);
      const cy = ch * (r + 0.5);
      const baseR = min(cw, ch) * 0.34 * random(0.75, 1.12);
      sites.push({
        x: cx,
        y: cy,
        baseR: baseR,
        // remembered form: a lobed radius profile the site grows back toward
        lobes: floor(random(4, 8)),
        lobeAmp: random(0.05, 0.16),
        spin: random(TWO_PI),
        spinSpeed: random(-0.0016, 0.0016),
        growth: 1, // 1 = whole, 0 = fully wounded
        wound: 0,
        hue: random(88, 150),
        repair: random(0.0012, 0.0032),
        hurt: random(0.86, 0.99), // threshold that triggers a new wound
      });
    }
  }
}

function draw() {
  // Deep loam ground — living dark, not a void.
  background(12, 18, 15, 26);
  t += 1;

  const px = constrain(mouseX, 0, width);
  const py = constrain(mouseY, 0, height);
  const pointerOn = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  // A slow breathing field the sites sit inside.
  const field = 0.5 + 0.5 * sin(t * 0.006);

  for (const s of sites) {
    // Heal: growth drifts back upward at the site's own patient rate.
    s.growth = min(1, s.growth + s.repair);

    // Wound: when whole, occasionally take a wound; pointer can cut one.
    if (s.growth >= 1) {
      if (random(1) < s.hurt * 0.004) s.wound = random(0.35, 0.8);
      if (pointerOn && dist(px, py, s.x, s.y) < s.baseR * 1.1) {
        s.wound = max(s.wound, 0.5);
      }
    }
    s.growth = min(s.growth, 1 - s.wound);
    s.wound *= 0.972; // the wound context fades as repair proceeds
    s.spin += s.spinSpeed;

    drawSite(s, field);
  }

  // A faint growth front sweeping the field: repair moving through tissue.
  const sweepX = ((t * 0.6) % (width + 240)) - 120;
  noFill();
  stroke(150, 224, 170, 20);
  strokeWeight(1);
  line(sweepX, 0, sweepX - 90, height);
}

function drawSite(s, field) {
  const R = s.baseR;
  const woundInset = (1 - s.growth) * R * 0.5;

  push();
  translate(s.x, s.y);
  rotate(s.spin);

  const steps = 96;
  const healT = s.growth;

  // Filled body: brightest where repair is actively happening.
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const a = (TWO_PI * i) / steps;
    let rr = R * (1 + s.lobeAmp * sin(a * s.lobes));
    // The wound: a smooth notch carved from one side, closing as it heals.
    const notch = pow(max(0, cos(a - 1.2)), 3) * woundInset;
    rr -= notch;
    vertex(cos(a) * rr, sin(a) * rr);
  }
  endShape(CLOSE);

  // Tissue fill tinted by health.
  noStroke();
  fill(
    lerp(70, 168, healT) + 6 * field,
    lerp(120, 226, healT),
    lerp(96, 168, healT),
    24 + 90 * healT
  );
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const a = (TWO_PI * i) / steps;
    let rr = R * (1 + s.lobeAmp * sin(a * s.lobes));
    rr -= pow(max(0, cos(a - 1.2)), 3) * woundInset;
    vertex(cos(a) * rr, sin(a) * rr);
  }
  endShape(CLOSE);

  // Cell rings: regrow outward from the hub as the site heals.
  const rings = 5;
  for (let k = 1; k <= rings; k++) {
    const target = (k / (rings + 1)) * R;
    const shown = target * (0.35 + 0.65 * healT);
    if (shown <= 0.5) continue;
    noFill();
    stroke(
      lerp(120, 190, healT),
      lerp(200, 240, healT),
      lerp(150, 190, healT),
      18 + 70 * (1 - k / (rings + 1)) * healT
    );
    strokeWeight(0.7);
    ellipse(0, 0, shown * 2, shown * 2);
  }

  // Living outline, dimmer along the wounded notch.
  noFill();
  for (let i = 0; i < steps; i++) {
    const a1 = (TWO_PI * i) / steps;
    const a2 = (TWO_PI * (i + 1)) / steps;
    const r1 = R * (1 + s.lobeAmp * sin(a1 * s.lobes)) -
      pow(max(0, cos(a1 - 1.2)), 3) * woundInset;
    const r2 = R * (1 + s.lobeAmp * sin(a2 * s.lobes)) -
      pow(max(0, cos(a2 - 1.2)), 3) * woundInset;
    const nearWound = max(0, cos(a1 - 1.2));
    stroke(
      lerp(120, 210, healT),
      lerp(196, 244, healT),
      lerp(150, 196, healT),
      (18 + 110 * healT) * (1 - 0.6 * nearWound)
    );
    strokeWeight(0.9);
    line(cos(a1) * r1, sin(a1) * r1, cos(a2) * r2, sin(a2) * r2);
  }

  // Centre knot where the shape remembers itself.
  noStroke();
  fill(lerp(90, 235, healT), lerp(150, 244, healT), lerp(120, 210, healT), 90 * healT + 30);
  ellipse(0, 0, 4 + 3 * healT, 4 + 3 * healT);

  pop();

  if (pointerOn && dist(px, py, s.x, s.y) < s.baseR * 1.1) {
    noFill();
    stroke(255, 240, 190, 40);
    strokeWeight(1);
    ellipse(s.x, s.y, s.baseR * 2.4, s.baseR * 2.4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildSites();
}
