const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Cache for stock data (5 minutes)
let stocksCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

// Major Indian stocks (Nifty 50 selection)
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy' },
  { symbol: 'HDFC', name: 'HDFC Bank' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'SBIN', name: 'State Bank' },
  { symbol: 'WIPRO', name: 'Wipro' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki' },
  { symbol: 'HCLTECH', name: 'HCL Technologies' },
  { symbol: 'AXISBANK', name: 'Axis Bank' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma' },
  { symbol: 'LT', name: 'Larsen & Toubro' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints' },
  { symbol: 'DMART', name: 'DMart' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel' },
  { symbol: 'NESTLEIND', name: 'Nestlé India' },
  { symbol: 'KOTAKBANK', name: 'Kotak Bank' },
  { symbol: 'COALINDIA', name: 'Coal India' },
  { symbol: 'HINDALCO', name: 'Hindalco' },
  { symbol: 'POWERGRID', name: 'Power Grid' }
];

// GET top Indian stocks (public - no auth required, rate limited)
router.get('/crypto', async (req, res) => {
  try {
    const now = Date.now();

    // Return cached data if still fresh
    if (stocksCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json({
        ...stocksCache,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000)
      });
    }

    // Fetch stock quotes from Finnhub
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    // Fetch quotes for all stocks in parallel
    const quotes = await Promise.all(
      INDIAN_STOCKS.map(async (stock) => {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${apiKey}`
          );
          if (!response.ok) return null;
          const data = await response.json();
          return { symbol: stock.symbol, name: stock.name, ...data };
        } catch (err) {
          console.error(`Failed to fetch ${stock.symbol}:`, err.message);
          return null;
        }
      })
    );

    // Filter out failed requests and transform data
    const stocks = quotes
      .filter(q => q && q.c)
      .slice(0, 20) // Limit to 20 stocks
      .map(quote => {
        const stockIndex = INDIAN_STOCKS.findIndex(s => s.symbol === quote.symbol);
        return {
          id: quote.symbol,
          symbol: quote.symbol,
          name: quote.name || quote.symbol,
          currentPrice: quote.c,
          change24h: quote.d !== undefined ? (quote.d / quote.pc) * 100 : 0,
          marketCapRank: stockIndex + 1,
          sparkline: []
        };
      });

    // Cache the result
    stocksCache = {
      cryptos: stocks, // Keep 'cryptos' key for frontend compatibility
      lastUpdated: new Date().toISOString()
    };
    cacheTimestamp = now;

    res.json({
      ...stocksCache,
      cached: false
    });
  } catch (err) {
    console.error('Finnhub API error:', err.message);
    // If cache exists but is stale, return it with a warning
    if (stocksCache) {
      console.warn('Returning stale cache due to API error');
      return res.json({
        ...stocksCache,
        cached: true,
        stale: true,
        cacheAge: Math.floor((Date.now() - cacheTimestamp) / 1000),
        error: 'Showing cached data due to API unavailability'
      });
    }
    res.status(500).json({ error: 'Failed to fetch stock data', details: err.message });
  }
});

// GET stock details
router.get('/crypto/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    // Fetch stock quote from Finnhub
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const quote = await response.json();

    const stockData = {
      id: symbol,
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      currentPrice: quote.c,
      change24h: quote.d !== undefined ? (quote.d / quote.pc) * 100 : 0,
      dayHigh: quote.h,
      dayLow: quote.l,
      open: quote.o,
      previousClose: quote.pc
    };

    res.json(stockData);
  } catch (err) {
    console.error('Finnhub API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stock details', details: err.message });
  }
});

// GET market overview (Indian stock market)
router.get('/overview', async (req, res) => {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    // Fetch indices from Finnhub
    const [nifty50, sensex, niftyBank] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=NIFTY50&token=${apiKey}`).then(r => r.json()),
      fetch(`https://finnhub.io/api/v1/quote?symbol=SENSEX&token=${apiKey}`).then(r => r.json()),
      fetch(`https://finnhub.io/api/v1/quote?symbol=NIFTYBANK&token=${apiKey}`).then(r => r.json())
    ]);

    const overview = {
      totalMarketCap: null,
      totalVolume: null,
      btcDominance: nifty50.c ? ((nifty50.d / nifty50.pc) * 100).toFixed(2) : 0,
      ethDominance: sensex.c ? ((sensex.d / sensex.pc) * 100).toFixed(2) : 0,
      activeCryptos: INDIAN_STOCKS.length,
      markets: 2,
      change24h: nifty50.c ? ((nifty50.d / nifty50.pc) * 100).toFixed(2) : 0,
      nifty50: nifty50.c || 0,
      sensex: sensex.c || 0,
      niftyBank: niftyBank.c || 0
    };

    res.json(overview);
  } catch (err) {
    console.error('Finnhub API error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch market overview',
      details: err.message,
      overview: {
        totalMarketCap: null,
        totalVolume: null,
        btcDominance: null,
        ethDominance: null,
        activeCryptos: INDIAN_STOCKS.length,
        markets: 2,
        change24h: null
      }
    });
  }
});

module.exports = router;
