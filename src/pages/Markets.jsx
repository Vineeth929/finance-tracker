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
        api.getMarkets().catch(err => {
          console.error('Markets fetch error:', err);
          return { cryptos: [] };
        }),
        api.getMarketOverview().catch(err => {
          console.error('Overview fetch error:', err);
          return null;
        }),
      ]);
      setStocks(stocksData?.cryptos || []);
      setOverview(overviewData || null);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError('Market data temporarily unavailable. Using cached data.');
      setStocks([]);
      setOverview(null);
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
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Live Ticker */}
      <LiveMarketTicker stocks={stocks.slice(0, 10)} />

      {/* Error State */}
      {error && (
        <GlassCard className="p-3 sm:p-4 border-l-4 border-rose-500 bg-rose-500/10">
          <p className="text-rose-400 text-xs sm:text-sm">⚠️ {error}</p>
        </GlassCard>
      )}

      {/* Last Updated & Refresh */}
      {lastUpdated && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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

      {/* Advanced Chart Section - Hide on small mobile for performance */}
      <div className="hidden sm:block">
        <AdvancedChart stocks={stocks} />
      </div>

      {/* Top Performers Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <CompactStockList title="Top Gainers" stocks={getGainers()} type="gainers" icon={TrendingUp} />
        <CompactStockList title="Top Losers" stocks={getLosers()} type="losers" icon={TrendingDown} />
        <div className="sm:col-span-2 lg:col-span-1">
          <CompactStockList title="Most Active" stocks={getMostActive()} type="movers" icon={Activity} />
        </div>
      </div>

      {/* Market Heatmap - Hide on small screens */}
      <div className="hidden md:block">
        <MarketHeatmap />
      </div>

      {/* Main Content Grid - Stocks + Insights (Responsive) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stock Grid */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Market Watchlist</h2>
            {stocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {stocks.map((stock, idx) => (
                  <PremiumStockCardV2 key={stock.id} stock={stock} index={idx} />
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 sm:p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                <p className="text-sm sm:text-base">Loading market data...</p>
              </GlassCard>
            )}
          </motion.div>
        </div>

        {/* Insights Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <MarketInsights />
        </div>
      </div>

      {/* Market News & Analytics - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 sm:p-6 rounded-2xl"
        >
          <h3 className="font-bold gradient-text mb-3 sm:mb-4 text-sm sm:text-base">Market News</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              'RBI keeps rates steady at 6.5%',
              'Nifty breaks 21,000 resistance',
              'Rupee strengthens against dollar'
            ].map((news, idx) => (
              <div key={idx} className="text-xs sm:text-sm p-2 sm:p-3 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{news}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 sm:p-6 rounded-2xl"
        >
          <h3 className="font-bold gradient-text mb-3 sm:mb-4 text-sm sm:text-base">Market Breadth</h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-xs sm:text-sm">
                <span>Advance</span>
                <span className="text-emerald-400 font-semibold">1,250</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-xs sm:text-sm">
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
          className="glass p-4 sm:p-6 rounded-2xl sm:col-span-2 lg:col-span-1"
        >
          <h3 className="font-bold gradient-text mb-3 sm:mb-4 text-sm sm:text-base">Market Indices</h3>
          <div className="space-y-2 text-xs sm:text-sm">
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
