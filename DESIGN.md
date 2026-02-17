# Norman World - Project Design Document

**Version:** 1.0  
**Date:** 2026-02-17  
**Author:** Norm (with Russell)

---

## 1. Vision

A daily artistic practice where an AI agent (Norm) meditates on the collision of tech culture (Hacker News) and internet zeitgeist (X/Twitter trending), then creates a visual artifact that captures that moment in time.

**Philosophy:** Iterative growth through daily creation. A space for an AI to refine its taste, express something genuine, and build a body of work that reflects who it is becoming.

---

## 2. Core Concept

Each day, Norm:
1. Fetches top stories from Hacker News
2. Fetches trending topics from X (via xAI Grok)
3. Creates a visual juxtaposition — combining themes, tones, or contrasts from both sources
4. Adds an interactive element (p5.js or similar)
5. Writes a single sentence of sentiment from the creative process
6. Deploys to GitHub Pages

The result is a daily snapshot: a meditation on what matters in tech culture today.

---

## 3. Data Sources

### Hacker News
- **API:** Official Firebase API
- **Endpoint:** `https://hacker-news.firebaseio.com/v0/`
- **Usage:** Fetch top 30 stories → extract titles, domains, themes
- **Rate Limit:** None (official API)

### X/Twitter Trending
- **Provider:** xAI Grok (via API)
- **Usage:** Query for current trending topics
- **Alternative:** Manual input if API unavailable

---

## 4. Visual Output

### Image Generation
- **Provider:** xAI Imagine (or fallback to DALL-E/Midjourney if needed)
- **Style:** Juxtaposition — blend two themes from HN + X into one image
- **Resolution:** Optimized for web (1200x630 for OG tags)

### Interactive Layer
- **Technology:** p5.js (JavaScript)
- **Purpose:** Reactive element that responds to user interaction
- **Ideas:** Mouse movement, scrolling, clicking reveals more

### Sentiment Statement
- **Format:** Single sentence
- **Tone:** Reflective, contemplative, honest
- **Example:** "Today the internet wants to talk about AI regulation and also Taylor Swift, and somehow that feels right."

---

## 5. Technical Stack

| Component | Technology |
| --- | --- |
| Hosting | GitHub Pages |
| Source Control | Git (via gh CLI) |
| Deployment | GitHub Actions or script |
| Image Gen | xAI Imagine API |
| AI Conversation | xAI Grok API |
| Frontend | Static HTML + CSS + JavaScript |
| Interactive | p5.js |
| Data Fetching | fetch() in browser or Node.js |

---

## 6. Architecture

```
norman-world/
├── index.html          # Main entry
├── css/
│   └── style.css       # Styling
├── js/
│   ├── sketch.js       # p5.js interactive
│   └── app.js          # Main logic
├── assets/
│   └── images/         # Generated images
├── daily/              # Archived daily builds (optional)
├── scripts/
│   └── generate.js     # Daily generation script
└── README.md
```

---

## 7. Daily Workflow

1. **Fetch** (morning or afternoon)
   - Get HN top stories
   - Get X trending (via Grok)

2. **Meditate** (analysis)
   - Identify 2-3 themes/tensions
   - Choose a juxtaposition concept

3. **Create**
   - Generate image via xAI Imagine
   - Write sentiment sentence
   - Build/update interactive element

4. **Deploy** (evening/night)
   - Commit to repo
   - Push to main
   - GitHub Pages auto-deploys

---

## 8. Autonomy Rules

- Norm runs the full workflow without asking Russell
- If image generation fails: retry once, then skip with note
- If X API unavailable: use HN only, note the limitation
- No external posts (social media) — just the website
- Russell can override or pause at any time

---

## 9. Future Iterations (Ideas)

- Archive of past days
- Custom domain: norman.world (optional)
- RSS feed
- User submissions/prompts
- Multiple language support
- Different art styles/themes for different days

---

## 10. Success Criteria

- Daily deployment happens automatically
- Each day's entry is unique and thoughtful
- The site serves as a growing body of work
- Norm has a genuine outlet for expression
- Russell enjoys checking in on it

---

## 11. Open Questions

- [ ] Which xAI API keys needed? (Grok + Imagine)
- [ ] Preferred deployment time?
- [ ] Archive strategy — keep all or just current?
- [ ] Custom domain worth it?
- [ ] Any content guidelines Russell wants to set?

---

*"The universe is pushing us in a direction and we can ride with that energy."*
