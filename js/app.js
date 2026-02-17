// Norman World - Main Application
// Fetches data and populates the page

const CONFIG = {
    HN_API: 'https://hacker-news.firebaseio.com/v0',
    // X/Twitter via xAI Grok - placeholder
    XAI_GROK: 'https://api.x.ai/v1/chat/completions',
    XAI_IMAGE: 'https://api.x.ai/v1/images/generate',
    // These would be set via environment
    XAI_API_KEY: process.env.XAI_API_KEY || ''
};

// Set current date
document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Fetch Hacker News stories
async function fetchHNStories() {
    try {
        const response = await fetch(`${CONFIG.HN_API}/topstories.json`);
        const storyIds = await response.json();
        const topStories = storyIds.slice(0, 10);

        const stories = await Promise.all(
            topStories.slice(0, 5).map(id => 
                fetch(`${CONFIG.HN_API}/item/${id}.json`).then(r => r.json())
            )
        );

        const ul = document.getElementById('hn-stories');
        stories.forEach(story => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" target="_blank">${story.title}</a>`;
            ul.appendChild(li);
        });

        return stories;
    } catch (error) {
        console.error('Failed to fetch HN:', error);
        return [];
    }
}

// Placeholder for X trending
async function fetchXTrending() {
    // TODO: Implement via xAI Grok
    const trending = [
        '#AI',
        '#Tech',
        '#Startups',
        '#Coding',
        '#Future'
    ];

    const ul = document.getElementById('x-trending');
    trending.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic;
        ul.appendChild(li);
    });

    return trending;
}

// Placeholder for image generation
async function generateImage(prompt) {
    // TODO: Implement via xAI Imagine
    console.log('Would generate image for:', prompt);
    document.getElementById('art-image').src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect fill="%23141414" width="800" height="600"/><text fill="%23666" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle">Image generation coming soon</text></svg>';
}

// Placeholder for sentiment
function generateSentiment(hnStories, xTrending) {
    // TODO: Generate meaningful sentiment
    const sentiments = [
        "Today the internet hums with the tension between what's possible and what's practical.",
        "Another day of building, breaking, and rebuilding in the digital garden.",
        "The algorithms whisper what we should care about. I'm listening.",
        "Code and culture, colliding in the space between keystrokes.",
        "We build tools that build us back."
    ];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
}

// Initialize
async function init() {
    const hnStories = await fetchHNStories();
    const xTrending = await fetchXTrending();

    // Generate sentiment
    const sentiment = generateSentiment(hnStories, xTrending);
    document.getElementById('sentiment-text').textContent = sentiment;

    // Generate image (placeholder)
    await generateImage('technology meets nature, digital vs organic');
}

init();
