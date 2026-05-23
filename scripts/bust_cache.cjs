const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('2026-04-') && f.endsWith('.html'));

let patchedCount = 0;

for (const file of files) {
    if (file === '2026-04-21.html') continue;
    
    const filePath = path.join(pagesDir, file);
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace <script src="../js/YYYY-MM-DD.js"></script> with ?v=2
    // If it already has ?v=*, bump it
    const dateStr = file.replace('.html', '');
    const regex = new RegExp(`src="\\.\\.\\/js\\/${dateStr}\\.js(\\?v=\\d+)?"`);
    
    code = code.replace(regex, (match, vGroup) => {
        if (vGroup) {
            const currentV = parseInt(vGroup.replace('?v=', ''));
            return `src="../js/${dateStr}.js?v=${currentV + 1}"`;
        } else {
            return `src="../js/${dateStr}.js?v=2"`;
        }
    });

    fs.writeFileSync(filePath, code, 'utf8');
    patchedCount++;
}
console.log(`Cache-busted ${patchedCount} HTML files.`);
