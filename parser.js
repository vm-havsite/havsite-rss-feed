const Parser = require("rss-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const parser = new Parser();

// Example multiple feeds by category
const FEEDS = {
  fun: "https://www.boredpanda.com/feed/",
  science: "https://www.wired.com/feed/category/science/latest/rss",
  hobbies: "https://lifehacker.com/rss",
  relationships: "https://www.psychologytoday.com/us/blog/relationships/feed",
  // Added BuzzFeed categories
  buzzfeed_omg: "https://www.buzzfeed.com/in/omg.xml",
  buzzfeed_news: "https://www.buzzfeed.com/in/news.xml",
  buzzfeed_quizzes: "https://www.buzzfeed.com/in/quizzes.xml",
  buzzfeed_tasty: "https://www.buzzfeed.com/in/tasty.xml",
  buzzfeed_entertainment: "https://www.buzzfeed.com/in/entertainment.xml"
};

// Endpoint per category
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
      snippet: item.contentSnippet,
      description: item.description
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

// Combined feed endpoint
app.get("/feed", async (req, res) => {
  try {
    const results = [];
    for (const url of Object.values(FEEDS)) {
      const feed = await parser.parseURL(url);
      feed.items.forEach(item => results.push({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        snippet: item.contentSnippet,
        description: item.description
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
