// js/2026-08-08.js
// Sentiment: We are the curators now of machines we did not build, keeping old light alive in new glass.
p5.prototype.setup = function () {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
};

let offset = 0;

p5.prototype.draw = function () {
  background(20, 15, 8);
  offset += 0.003;

  var count = 0;
  var spacing = Math.min(width, height) / 7;

  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 8; col++) {
      var x = col * spacing + spacing / 2;
      var y = row * spacing + spacing / 2;
      var distFromCenter = Math.abs(col - 3.5) + Math.abs(row - 3.5);
      var phase = offset + distFromCenter * 0.4;
      var pulse = Math.sin(phase * TWO_PI);
      var flicker = 0.5 + 0.5 * Math.sin(phase * 7.3 + 1.1);

      var radius = spacing * 0.3 * (0.6 + 0.4 * pulse);
      var alpha = 70 + 30 * flicker;

      // warm amber phosphor glow — vintage terminal palette
      var hue = 35 + 8 * Math.sin(phase * 0.5);
      fill(hue, 45, 70, alpha);

      ellipse(x, y, radius * 2, radius * 2);

      // inner bright core
      fill(40, 20, 100, 40 * flicker);
      ellipse(x, y, radius * 0.5, radius * 0.5);
    }
  }
};

p5.prototype.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
