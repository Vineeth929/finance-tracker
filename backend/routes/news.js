const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ]
  }
});

function extractImgFromHtml(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

// RSS feed sources
const feeds = {
  economictimes: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  moneycontrol: 'https://www.moneycontrol.com/rss/marketsinformation.xml',
  businessstandard: 'https://www.business-standard.com/rss/finance.rss'
};

// Cache for RSS data (30 minutes)
let newsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000;

// Helper to categorize news
function categorizeArticle(item) {
  const titleAndDesc = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();

  if (titleAndDesc.includes('crypto') || titleAndDesc.includes('bitcoin') || titleAndDesc.includes('ethereum')) {
    return 'crypto';
  } else if (titleAndDesc.includes('stock') || titleAndDesc.includes('sensex') || titleAndDesc.includes('nifty')) {
    return 'markets';
  } else if (titleAndDesc.includes('economy') || titleAndDesc.includes('inflation') || titleAndDesc.includes('gdp')) {
    return 'economy';
  } else if (titleAndDesc.includes('business') || titleAndDesc.includes('company') || titleAndDesc.includes('corporate')) {
    return 'business';
  }
  return 'general';
}

// GET all finance news (cached)
router.get('/', async (req, res) => {
  try {
    const now = Date.now();

    // Return cached data if still fresh
    if (newsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json({
        ...newsCache,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000)
      });
    }

    const allArticles = [];

    // Fetch from all sources
    for (const [source, feedUrl] of Object.entries(feeds)) {
      try {
        const feed = await parser.parseURL(feedUrl);

        feed.items.forEach((item) => {
          allArticles.push({
            id: `${source}_${item.guid || item.link}`,
            source: source.charAt(0).toUpperCase() + source.slice(1),
            title: item.title,
            description: item.contentSnippet || item.summary || '',
            link: item.link,
            imageUrl:
              item.mediaThumbnail?.$ ? item.mediaThumbnail.$.url :
              item.mediaThumbnail?.url ||
              item.mediaContent?.$ ? item.mediaContent.$.url :
              item.mediaContent?.url ||
              (item.enclosure?.type?.startsWith('image/') ? item.enclosure.url : null) ||
              extractImgFromHtml(item.content || item['content:encoded']) ||
              null,
            pubDate: item.pubDate,
            category: categorizeArticle(item)
          });
        });
      } catch (err) {
        console.warn(`Failed to fetch ${source}:`, err.message);
        // Continue with other sources if one fails
      }
    }

    // Sort by date (newest first)
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Limit to recent 50 articles
    const recentArticles = allArticles.slice(0, 50);

    // Cache the result
    newsCache = {
      articles: recentArticles,
      total: recentArticles.length,
      lastUpdated: new Date().toISOString()
    };
    cacheTimestamp = now;

    res.json({
      ...newsCache,
      cached: false
    });
  } catch (err) {
    console.error('News fetch error:', err.message);

    // Return fallback data
    res.json({
      articles: [],
      total: 0,
      error: 'Failed to fetch news. Please try again later.',
      fallback: true
    });
  }
});

// GET news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ['crypto', 'markets', 'economy', 'business', 'general'];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const now = Date.now();

    // Fetch fresh data if cache expired
    if (!newsCache || !cacheTimestamp || (now - cacheTimestamp) >= CACHE_DURATION) {
      // Trigger refresh in background
      router.get('/', () => {});
    }

    if (!newsCache) {
      return res.json({ articles: [], total: 0, message: 'No cached news available' });
    }

    const filtered = newsCache.articles.filter(article => article.category === category);

    res.json({
      articles: filtered,
      total: filtered.length,
      category: category
    });
  } catch (err) {
    console.error('Category filter error:', err.message);
    res.status(500).json({ error: 'Failed to filter news' });
  }
});

// Preload cache on startup (fetch news articles in background)
setTimeout(async () => {
  try {
    // Fetch all articles to populate cache on startup
    const allArticles = [];
    for (const [source, feedUrl] of Object.entries(feeds)) {
      try {
        const feed = await parser.parseURL(feedUrl);
        feed.items.forEach((item) => {
          allArticles.push({
            id: `${source}_${item.guid || item.link}`,
            source: source.charAt(0).toUpperCase() + source.slice(1),
            title: item.title,
            description: item.contentSnippet || item.summary || '',
            link: item.link,
            imageUrl:
              item.mediaThumbnail?.$ ? item.mediaThumbnail.$.url :
              item.mediaThumbnail?.url ||
              item.mediaContent?.$ ? item.mediaContent.$.url :
              item.mediaContent?.url ||
              (item.enclosure?.type?.startsWith('image/') ? item.enclosure.url : null) ||
              extractImgFromHtml(item.content || item['content:encoded']) ||
              null,
            pubDate: item.pubDate,
            category: categorizeArticle(item)
          });
        });
      } catch (err) {
        console.warn(`Failed to preload ${source}:`, err.message);
      }
    }

    if (allArticles.length > 0) {
      allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      newsCache = {
        articles: allArticles.slice(0, 50),
        total: allArticles.length,
        lastUpdated: new Date().toISOString()
      };
      cacheTimestamp = Date.now();
      console.log('✅ News cache preloaded on startup with', newsCache.articles.length, 'articles');
    }
  } catch (err) {
    console.warn('⚠️  News preload failed:', err.message);
  }
}, 2000);

module.exports = router;
