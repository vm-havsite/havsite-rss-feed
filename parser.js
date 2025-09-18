const Parser = require("rss-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const parser = new Parser();

// Example multiple feeds by category
const FEEDS = {
  fun: "https://www.boredpanda.com/feed/",
  health: "https://www.healthline.com/rss",
  hobbies: "https://lifehacker.com/rss",
  relationships: "https://www.psychologytoday.com/us/blog/relationships/feed"
};

// Optional: endpoint per category
app.get("/feed/:category", async (req, res) => {
  const category = req.params.category;
  const feedUrl = FEEDS[category];

  if (!feedUrl) return res.status(404).json({ error: "Category not found" });

  try {
    const feed = await parser.parseURL(feedUrl);
    const items = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

// Optional: combined feed endpoint
app.get("/feed", async (req, res) => {
  try {
    const results = [];
    for (const url of Object.values(FEEDS)) {
      const feed = await parser.parseURL(url);
      feed.items.forEach(item => results.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        snippet: item.contentSnippet
      }));
    }
    // Optionally sort by pubDate
    results.sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feeds" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RSS feed server running on port ${PORT}`);
});
