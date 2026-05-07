const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Cache for CoinGecko data (5 minutes)
let cryptoCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

// GET top crypto prices (public - no auth required, rate limited)
router.get('/crypto', async (req, res) => {
  try {
    const now = Date.now();

    // Return cached data if still fresh
    if (cryptoCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return res.json({
        ...cryptoCache,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000)
      });
    }

    // Fetch from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?' +
      'vs_currency=inr&' +
      'order=market_cap_desc&' +
      'per_page=20&' +
      'sparkline=true&' +
      'price_change_percentage=24h,7d'
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform data for frontend
    const cryptos = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      marketCapRank: coin.market_cap_rank,
      change24h: coin.price_change_percentage_24h,
      change7d: coin.price_change_percentage_7d,
      sparkline: coin.sparkline_in_7d?.price || []
    }));

    // Cache the result
    cryptoCache = {
      cryptos,
      lastUpdated: new Date().toISOString()
    };
    cacheTimestamp = now;

    res.json({
      ...cryptoCache,
      cached: false
    });
  } catch (err) {
    console.error('CoinGecko API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch crypto data', details: err.message });
  }
});

// GET crypto details
router.get('/crypto/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?` +
      'localization=false&' +
      'tickers=false&' +
      'market_data=true&' +
      'community_data=false&' +
      'developer_data=false'
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Cryptocurrency not found' });
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const coin = await response.json();

    const coinData = {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image?.large,
      description: coin.description?.en,
      website: coin.links?.homepage?.[0],
      currentPrice: coin.market_data?.current_price?.inr,
      marketCap: coin.market_data?.market_cap?.inr,
      ath: coin.market_data?.ath?.inr,
      atl: coin.market_data?.atl?.inr,
      change24h: coin.market_data?.price_change_percentage_24h,
      change7d: coin.market_data?.price_change_percentage_7d,
      change30d: coin.market_data?.price_change_percentage_30d,
      circulatingSupply: coin.market_data?.circulating_supply,
      totalSupply: coin.market_data?.total_supply
    };

    res.json(coinData);
  } catch (err) {
    console.error('CoinGecko API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch coin details', details: err.message });
  }
});

// GET market overview
router.get('/overview', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/global'
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const overview = {
      totalMarketCap: data.total_market_cap?.inr,
      totalVolume: data.total_volume?.inr,
      btcDominance: data.btc_market_cap_percentage,
      ethDominance: data.eth_market_cap_percentage,
      activeCryptos: data.active_cryptocurrencies,
      markets: data.markets,
      change24h: data.market_cap_change_percentage_24h_usd
    };

    res.json(overview);
  } catch (err) {
    console.error('CoinGecko API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch market overview', details: err.message });
  }
});

module.exports = router;
