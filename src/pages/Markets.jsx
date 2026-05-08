import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import GlassCard from '../components/ui/GlassCard';
import LiveMarketTicker from '../components/markets/LiveMarketTicker';
import MarketHero from '../components/markets/MarketHero';
import AdvancedChart from '../components/markets/AdvancedChart';
import MarketHeatmap from '../components/markets/MarketHeatmap';
import MarketInsights from '../components/markets/MarketInsights';
import CompactStockList from '../components/markets/CompactStockList';
import PremiumStockCardV2 from '../components/markets/PremiumStockCardV2';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketsPage() {
  const [stocks, setStocks] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarkets = async () => {
    try {
      const [stocksData, overviewData] = await Promise.all([
        api.getMarkets(),
        api.getMarketOverview(),
      ]);
      setStocks(stocksData?.cryptos || []);
      setOverview(overviewData || null);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError('Unable to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  const getGainers = () => stocks.slice().sort((a, b) => (b.change24h || 0) - (a.change24h || 0)).slice(0, 5);
  const getLosers = () => stocks.slice().sort((a, b) => (a.change24h || 0) - (b.change24h || 0)).slice(0, 5);
  const getMostActive = () => stocks.slice().sort((a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0)).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-20" count={1} />
        <SkeletonLoader height="h-96" count={1} />
        <SkeletonLoader height="h-64" count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Live Ticker */}
      <LiveMarketTicker stocks={stocks.slice(0, 10)} />

      {/* Error State */}
      {error && (
        <GlassCard className="p-4 border-l-4 border-rose-500 bg-rose-500/10">
          <p className="text-rose-400 text-sm">⚠️ {error}</p>
        </GlassCard>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex justify-between items-center">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <motion.button
            whileHover={{ rotate: 180 }}
            onClick={fetchMarkets}
            className="p-2 rounded-lg glass hover:bg-white/10"
          >
            🔄
          </motion.button>
        </div>
      )}

      {/* Market Hero Section */}
      {overview && <MarketHero overview={overview} />}

      {/* Advanced Chart Section */}
      <AdvancedChart stocks={stocks} />

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CompactStockList title="Top Gainers" stocks={getGainers()} type="gainers" icon={TrendingUp} />
        <CompactStockList title="Top Losers" stocks={getLosers()} type="losers" icon={TrendingDown} />
        <CompactStockList title="Most Active" stocks={getMostActive()} type="movers" icon={Activity} />
      </div>

      {/* Market Heatmap */}
      <MarketHeatmap />

      {/* Main Content Grid - Stocks + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stock Grid - Takes 3 columns */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-4">Market Watchlist</h2>
              {stocks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stocks.map((stock, idx) => (
                    <PremiumStockCardV2 key={stock.id} stock={stock} index={idx} />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                  <p>Loading market data...</p>
                </GlassCard>
              )}
            </div>
          </motion.div>
        </div>

        {/* Insights Sidebar - Takes 1 column */}
        <div className="lg:col-span-1">
          <MarketInsights />
        </div>
      </div>

      {/* Market News & Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="font-bold gradient-text mb-4">Market News</h3>
          <div className="space-y-3">
            {[
              'RBI keeps rates steady at 6.5%',
              'Nifty breaks 21,000 resistance',
              'Rupee strengthens against dollar'
            ].map((news, idx) => (
              <div key={idx} className="text-sm p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{news}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="font-bold gradient-text mb-4">Market Breadth</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Advance</span>
                <span className="text-emerald-400 font-semibold">1,250</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Decline</span>
                <span className="text-rose-400 font-semibold">550</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="font-bold gradient-text mb-4">Market Indices</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>BSE 500</span>
              <span className="text-emerald-400 font-semibold">+1.2%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Midcap 150</span>
              <span className="text-emerald-400 font-semibold">+2.1%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Smallcap 250</span>
              <span className="text-rose-400 font-semibold">-0.8%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
