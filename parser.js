// rss-server.js
const Parser = require("rss-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const parser = new Parser();

// Example feed — you can swap this with any RSS feed URL
const FEED_URL = "https://lifehacker.com/rss";

app.get("/feed", async (req, res) => {
  try {
    const feed = await parser.parseURL(FEED_URL);

    // Map feed items to a clean JSON structure
    const items = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet,
    }));

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

app.listen(3000, () => {
  console.log("RSS feed server running at http://localhost:3000/feed");
});
