import fs from "node:fs";
import path from "node:path";

const repoPath = '/Users/norm/Developer/norman-world';
const pagesDir = path.join(repoPath, 'pages');
const archivePath = path.join(repoPath, 'archive.html');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

let entries = [];

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const dateStr = file.replace('.html', '');
    const dateObj = new Date(dateStr + 'T12:00:00Z');
    
    // Check if thumbnail exists
    const thumbName = `${dateStr}-norm.png`;
    const thumbExists = fs.existsSync(path.join(repoPath, 'images', thumbName));
    
    entries.push({
        dateStr,
        dateObj,
        url: `pages/${file}`,
        thumb: thumbExists ? `images/${thumbName}` : null
    });
});

// Sort newest first
entries.sort((a, b) => b.dateObj - a.dateObj);

// Group by month
const groups = {};
entries.forEach(entry => {
    const monthYear = entry.dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    if (!groups[monthYear]) {
        groups[monthYear] = [];
    }
    groups[monthYear].push(entry);
});

let archiveHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Archive - Norman World</title>
    
    <link rel="icon" href="norm.svg" type="image/svg+xml">
    <link rel="stylesheet" href="style.css?v=3">
    <script src="js/theme.js"></script>
</head>
<body class="index-body">
    <main class="index-main">
        <h1 class="index-title">Archive</h1>
        <nav class="site-nav">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
        </nav>
        <div class="hero">
            <div class="hero-content">
`;

for (const [monthYear, monthEntries] of Object.entries(groups)) {
    archiveHtml += `                <p class="month">${monthYear}</p>
                <ul class="entry-grid">
`;
    monthEntries.forEach(entry => {
        const displayDate = entry.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
        archiveHtml += `                    <li>
        <a href="${entry.url}">
            ${entry.thumb ? `<img class="index-thumb" src="${entry.thumb}" alt="Portrait for ${displayDate}" onerror="this.style.display='none'">` : ''}
            <span class="index-date">${displayDate}</span>
        </a>
    </li>
`;
    });
    archiveHtml += `                </ul>
`;
}

archiveHtml += `            </div>
        </div>
        <footer class="index-footer">
            <p>A daily meditation. A growing body of work.</p>
        </footer>

        <div class="theme-toggle-container">
            <div class="theme-toggle">
                <button data-theme="light" title="Light Mode">☀️ Light</button>
                <button data-theme="system" title="Auto">🌓 Auto</button>
                <button data-theme="dark" title="Dark Mode">🌙 Dark</button>
            </div>
        </div>
    </main>
</body>
</html>`;

fs.writeFileSync(archivePath, archiveHtml);
console.log('Archive page generated at ' + archivePath);
