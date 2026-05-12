import React, { useEffect, useState, useMemo } from 'react';
import { createAPIClient } from '../api/client';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import GlassCard from '../components/ui/GlassCard';
import LiveMarketTicker from '../components/markets/LiveMarketTicker';
import MarketHero from '../components/markets/MarketHero';
import AdvancedChart from '../components/markets/AdvancedChart';
import MarketHeatmap from '../components/markets/MarketHeatmap';
import MarketInsights from '../components/markets/MarketInsights';
import CompactStockList from '../components/markets/CompactStockList';
import PremiumStockCardV2 from '../components/markets/PremiumStockCardV2';
import { TrendingUp, TrendingDown, Activity, BarChart3, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketsPage() {
  const apiClient = useMemo(() => createAPIClient(), []);
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
        apiClient.markets.crypto().catch(err => {
          console.error('Markets fetch error:', err);
          return { cryptos: [] };
        }),
        apiClient.markets.overview().catch(err => {
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

  const gainPercentage = getGainers().length > 0 ? Math.round((getGainers().length / stocks.length) * 100) : 0;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section-spacing"
    >
      {/* Page Header with Emotional Message */}
      <motion.div className="space-y-2 animate-fadeInDown">
        <h1 className="text-4xl font-display gradient-text">Global Markets</h1>
        <p className="text-lg text-secondary">
          {gainPercentage > 60 ? '📈 Markets are rallying strongly' : gainPercentage > 40 ? '➡️ Mixed market momentum' : '📉 Markets showing caution'}
        </p>
      </motion.div>

      {/* Live Ticker - Atmospheric Scrolling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LiveMarketTicker stocks={stocks.slice(0, 10)} />
      </motion.div>

      {/* Error State - Emotional Messaging */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="surface-expenses"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-heading" style={{ color: 'var(--emotion-expenses)' }}>Market Data Temporarily Unavailable</p>
              <p className="text-secondary text-sm mt-1">Using cached data • Refreshing in 30s</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Last Updated & Refresh - Subtle Controls */}
      {lastUpdated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 surface-interactive p-4"
        >
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: 'var(--emotion-analytics)' }} />
            <p className="text-sm text-secondary">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            onClick={fetchMarkets}
            className="px-4 py-2 rounded-lg surface-interactive hover:surface-interactive-hover font-medium text-sm flex items-center gap-2"
          >
            🔄 Refresh
          </motion.button>
        </motion.div>
      )}

      {/* Market Hero Section - Atmospheric Overview */}
      {overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <MarketHero overview={overview} />
        </motion.div>
      )}

      {/* Market Breadth & Indices - Narrative View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} style={{ color: 'var(--emotion-goals)' }} />
            <h3 className="text-xl font-heading">Market Breadth</h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-secondary font-medium">Advances</span>
                <span className="font-heading" style={{ color: 'var(--emotion-goals)' }}>1,250 (65%)</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: 'var(--surface-level-2)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--emotion-goals)' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-secondary font-medium">Declines</span>
                <span className="font-heading" style={{ color: 'var(--emotion-expenses)' }}>550 (35%)</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: 'var(--surface-level-2)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--emotion-expenses)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="surface-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} style={{ color: 'var(--emotion-analytics)' }} />
            <h3 className="text-xl font-heading">Market Indices</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'BSE 500', change: 1.2, changeType: 'positive' },
              { name: 'Midcap 150', change: 2.1, changeType: 'positive' },
              { name: 'Smallcap 250', change: -0.8, changeType: 'negative' },
            ].map((idx, i) => (
              <motion.div
                key={idx.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ background: 'var(--surface-level-2)' }}
              >
                <span className="font-medium">{idx.name}</span>
                <span
                  className="font-heading text-base"
                  style={{
                    color: idx.changeType === 'positive' ? 'var(--emotion-goals)' : 'var(--emotion-expenses)'
                  }}
                >
                  {idx.changeType === 'positive' ? '↑' : '↓'} {Math.abs(idx.change).toFixed(1)}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers - Emotional Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompactStockList title="Top Gainers" stocks={getGainers()} type="gainers" icon={TrendingUp} />
        <CompactStockList title="Top Losers" stocks={getLosers()} type="losers" icon={TrendingDown} />
        <div className="sm:col-span-2 lg:col-span-1">
          <CompactStockList title="Most Active" stocks={getMostActive()} type="movers" icon={Activity} />
        </div>
      </div>

      {/* Advanced Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="hidden sm:block"
      >
        <AdvancedChart stocks={stocks} />
      </motion.div>

      {/* Market Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="hidden md:block"
      >
        <MarketHeatmap />
      </motion.div>

      {/* Main Content Grid - Stocks + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-heading gradient-text mb-4">Market Watchlist</h2>
              {stocks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stocks.map((stock, idx) => (
                    <motion.div
                      key={stock.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.05) }}
                    >
                      <PremiumStockCardV2 stock={stock} index={idx} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="surface-card text-center py-12"
                >
                  <p className="text-lg text-secondary">📊 Loading market data...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Insights Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block"
        >
          <MarketInsights />
        </motion.div>
      </div>
    </motion.div>
  );
}
