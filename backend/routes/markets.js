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
    console.log('💹 FINNHUB_API_KEY configured:', !!apiKey);

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    console.log(`📡 Fetching ${INDIAN_STOCKS.length} stocks from Finnhub...`);

    // Fetch quotes for all stocks in parallel
    const quotes = await Promise.all(
      INDIAN_STOCKS.map(async (stock) => {
        try {
          // Try multiple formats to find one that works
          const formats = [
            `${stock.symbol}:NSE`,      // Try NSE first
            stock.symbol,                // Try plain symbol
            `${stock.symbol}.NS`         // Try .NS suffix
          ];

          for (const symbol of formats) {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
            console.log(`\n🔍 Trying ${stock.symbol} as "${symbol}"`);

            try {
              const response = await fetch(url);
              console.log(`   HTTP ${response.status}`);

              if (!response.ok) continue;

              const data = await response.json();
              console.log(`   FULL RESPONSE:`, JSON.stringify(data, null, 2));

              // Validate response has actual price data
              if (data.c && typeof data.c === 'number' && data.c > 0) {
                console.log(`   ✅ VALID: ${stock.symbol} = ₹${data.c} (${data.dp || 0}%)`);
                return {
                  symbol: stock.symbol,
                  name: stock.name,
                  c: data.c,
                  d: data.d,
                  dp: data.dp,
                  pc: data.pc,
                  h: data.h,
                  l: data.l
                };
              } else {
                console.warn(`   ❌ Invalid: c=${data.c}, d=${data.d}, pc=${data.pc}`);
              }
            } catch (err) {
              console.error(`   Error with ${symbol}:`, err.message);
            }
          }

          console.log(`❌ All formats failed for ${stock.symbol}`);
          return null;
        } catch (err) {
          console.error(`FATAL for ${stock.symbol}:`, err.message);
          return null;
        }
      })
    );

    console.log(`📊 Received ${quotes.length} responses, non-null: ${quotes.filter(q => q).length}`);

    // Filter and transform data - ONLY valid prices
    const stocks = quotes
      .filter(q => {
        if (!q || !q.c || q.c <= 0) {
          console.log(`⏭️  Skipping invalid data:`, q ? `c=${q.c}` : 'null');
          return false;
        }
        return true;
      })
      .slice(0, 20)
      .map(quote => {
        const stockIndex = INDIAN_STOCKS.findIndex(s => s.symbol === quote.symbol);

        // Use dp (percentage change) from Finnhub if available, otherwise calculate
        const percentChange = quote.dp !== undefined ? quote.dp :
                              (quote.d !== undefined && quote.pc ? (quote.d / quote.pc) * 100 : 0);

        const stock = {
          id: quote.symbol,
          symbol: quote.symbol,
          name: quote.name || quote.symbol,
          currentPrice: quote.c,
          change24h: percentChange,
          dayHigh: quote.h,
          dayLow: quote.l,
          previousClose: quote.pc,
          marketCapRank: stockIndex + 1,
          sparkline: []
        };

        console.log(`📊 Transformed: ${stock.symbol} ₹${stock.currentPrice} ${stock.change24h > 0 ? '📈' : '📉'} ${stock.change24h}%`);
        return stock;
      });

    console.log(`✅ Transformed ${stocks.length} valid stocks`);

    // ONLY cache if we got real data, don't cache empty results
    if (stocks.length > 0) {
      stocksCache = {
        cryptos: stocks,
        lastUpdated: new Date().toISOString()
      };
      cacheTimestamp = now;
      console.log('💾 Cached stock data');
    } else {
      console.warn('⚠️ No valid stocks received, NOT caching empty result');
      // Return test data temporarily to debug frontend
      const testData = [
        { id: 'INFY', symbol: 'INFY', name: 'Infosys', currentPrice: 1650, change24h: 2.5, marketCapRank: 1, sparkline: [] },
        { id: 'TCS', symbol: 'TCS', name: 'TCS', currentPrice: 3800, change24h: 1.2, marketCapRank: 2, sparkline: [] },
        { id: 'RELIANCE', symbol: 'RELIANCE', name: 'Reliance', currentPrice: 2850, change24h: -0.5, marketCapRank: 3, sparkline: [] },
      ];
      return res.json({
        cryptos: testData,
        cached: false,
        debug: 'RETURNING TEST DATA - Finnhub API not returning valid data'
      });
    }

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
