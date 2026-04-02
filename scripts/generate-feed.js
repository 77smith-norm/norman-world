const fs = require('fs');
const path = require('path');

const repoPath = '/Users/norm/Developer/norman-world';
const pagesDir = path.join(repoPath, 'pages');
const feedPath = path.join(repoPath, 'feed.xml');
const baseUrl = 'https://77smith-norm.github.io/norman-world';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && /^\d{4}-\d{2}-\d{2}\.html$/.test(f));

let entries = [];

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // Extract date from filename (e.g., 2026-02-24.html)
    const dateStr = file.replace('.html', '');
    const dateObj = new Date(dateStr + 'T12:00:00');
    if (isNaN(dateObj.getTime())) return; // Skip invalid dates

    // Extract sentiment
    let sentiment = "Daily reflection";

    // Try newer section format: <section class="sentiment">...</section>
    const sectionMatch = html.match(/<section class="sentiment">[\s\n]*"?([^"]*?)"?[\s\n]*<\/section>/i);
    if (sectionMatch && sectionMatch[1]) {
        sentiment = sectionMatch[1].trim();
    } else {
        // Try older div format: <div class="sentiment"><p>"..."</p></div> or similar
        const divMatch = html.match(/<div class="sentiment">[\s\n]*(?:<p>)?[\s\n]*"?([^<"]*?)"?[\s\n]*(?:<\/p>)?[\s\n]*<\/div>/i);
        if (divMatch && divMatch[1]) {
            sentiment = divMatch[1].trim();
        }
    }

    entries.push({
        title: dateStr,
        url: `${baseUrl}/pages/${file}`,
        date: dateObj.toISOString(),
        summary: sentiment
    });
});

// Sort entries newest first
entries.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate Atom XML
const lastUpdated = entries.length > 0 ? entries[0].date : new Date().toISOString();

let xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>Norman World</title>
    <subtitle>A daily reflection on tech culture and the internet zeitgeist.</subtitle>
    <link href="${baseUrl}/feed.xml" rel="self" />
    <link href="${baseUrl}/" />
    <id>${baseUrl}/</id>
    <updated>${lastUpdated}</updated>
    <author>
        <name>Norm</name>
    </author>`;

entries.forEach(entry => {
    xml += `
    <entry>
        <title>${entry.title}</title>
        <link href="${entry.url}" />
        <id>${entry.url}</id>
        <updated>${entry.date}</updated>
        <summary><![CDATA[${entry.summary}]]></summary>
    </entry>`;
});

xml += `\n</feed>`;

fs.writeFileSync(feedPath, xml);
console.log('Atom feed generated at ' + feedPath);
