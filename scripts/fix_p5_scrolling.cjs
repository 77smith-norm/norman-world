const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '../js');
const files = fs.readdirSync(jsDir).filter(f => f.startsWith('2026-04-') && f.endsWith('.js'));

let patchedCount = 0;

for (const file of files) {
    if (file === '2026-04-21.js') continue; // already fixed manually
    
    const filePath = path.join(jsDir, file);
    let code = fs.readFileSync(filePath, 'utf8');
    
    let modified = false;

    // 1. Check if it already has previousWidth
    if (!code.includes('let previousWidth = 0;')) {
        // Find the first function definition (usually setup) to insert previousWidth right before it
        code = code.replace(/function setup\s*\(\)\s*\{/, "let previousWidth = 0;\n\nfunction setup() {");
        modified = true;
    }

    // 2. Fix createCanvas in setup
    if (code.includes('createCanvas(windowWidth, windowHeight)')) {
        const setupReplacement = `const container = document.getElementById('sketch-container');
  const w = container ? container.offsetWidth : windowWidth;
  const h = Math.max(400, windowHeight * 0.6);
  previousWidth = w;
  let cnv = createCanvas(w, h);
  if (cnv && cnv.parent) cnv.parent('sketch-container');`;
        
        // Handle variations
        code = code.replace(/let \w+\s*=\s*createCanvas\(windowWidth, windowHeight\);\s*(\w+\.parent\('sketch-container'\);)?/g, setupReplacement);
        code = code.replace(/const \w+\s*=\s*createCanvas\(windowWidth, windowHeight\);\s*(\w+\.parent\('sketch-container'\);)?/g, setupReplacement);
        code = code.replace(/createCanvas\(windowWidth, windowHeight\);\s*(cnv\.parent\('sketch-container'\);)?/g, setupReplacement);
        modified = true;
    }

    // 3. Fix windowResized
    if (code.includes('function windowResized() {') && !code.includes('abs(w - previousWidth) > 10')) {
        const resizeRegex = /function windowResized\(\)\s*\{([\s\S]*?)\}/;
        const match = code.match(resizeRegex);
        if (match) {
            let innerContent = match[1];
            // Remove the old resizeCanvas call from inner content
            innerContent = innerContent.replace(/resizeCanvas\(windowWidth, windowHeight\);/g, '');
            
            const newResize = `function windowResized() {
  const container = document.getElementById('sketch-container');
  if (!container) return;
  const w = container.offsetWidth;
  if (abs(w - previousWidth) > 10) {
    const h = Math.max(400, windowHeight * 0.6);
    resizeCanvas(w, h);
    previousWidth = w;${innerContent}
  }
}`;
            code = code.replace(resizeRegex, newResize);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, code, 'utf8');
        patchedCount++;
    }
}

console.log(`Patched ${patchedCount} JS files.`);
