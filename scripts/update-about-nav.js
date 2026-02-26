const fs = require('fs');
const path = require('path');
const file = path.join('/Users/norm/Developer/norman-world', 'about.html');
let html = fs.readFileSync(file, 'utf8');

html = html.replace('<a href="index.html" class="back-link">← index</a>', 
`<nav class="site-nav" style="justify-content: flex-start; margin-top: 2rem;">
            <a href="index.html">Home</a>
            <a href="archive.html">Archive</a>
        </nav>`);

fs.writeFileSync(file, html);
