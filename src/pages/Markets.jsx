import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import MiniSparkline from '../components/ui/MiniSparkline';

export default function MarketsPage() {
  const [stocks, setStocks] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stocksData, overviewData] = await Promise.all([
        api.getMarkets(),
        api.getMarketOverview(),
      ]);
      setStocks(stocksData?.cryptos || []); // API still uses 'cryptos' key for compatibility
      setOverview(overviewData || null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError('Unable to fetch market data. Please try again.');
      setStocks([]);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-32" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Indian Stock Market</h1>
        <button onClick={fetchMarkets} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <GlassCard className="p-4 border border-rose-500/50 bg-rose-500/10">
          <p className="text-rose-400">⚠️ {error}</p>
        </GlassCard>
      )}

      {lastUpdated && (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>
      )}

      {/* Market Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Nifty 50</p>
            <p className="text-2xl font-bold gradient-text">₹{overview.nifty50 ? Math.round(overview.nifty50).toLocaleString() : '—'}</p>
            <p className={`text-xs mt-2 ${(overview.change24h || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {(overview.change24h || 0) >= 0 ? '📈' : '📉'} {Math.abs(overview.change24h || 0).toFixed(2)}% (24h)
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Sensex</p>
            <p className="text-2xl font-bold text-orange-400">₹{overview.sensex ? Math.round(overview.sensex).toLocaleString() : '—'}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Nifty Bank</p>
            <p className="text-2xl font-bold text-purple-400">₹{overview.niftyBank ? Math.round(overview.niftyBank).toLocaleString() : '—'}</p>
          </GlassCard>
        </div>
      )}

      {!overview && !error && !loading && (
        <GlassCard className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
          <p>Market data unavailable. Please try again later.</p>
        </GlassCard>
      )}

      {/* Stock List */}
      <div className="space-y-3">
        {stocks.length > 0 ? (
          stocks.map((stock) => (
            <GlassCard key={stock.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--glass-hover-bg)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-brand-primary)' }}>📈</span>
                </div>
                <div>
                  <h3 className="font-semibold">{stock.symbol}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>NSE Stock</p>
                </div>
              </div>

              <div className="flex-1 mx-4 h-8">
                <MiniSparkline data={stock.sparkline || []} color="#6366f1" />
              </div>

              <div className="text-right">
                <p className="font-bold">₹{stock.currentPrice ? Math.round(stock.currentPrice).toLocaleString() : '—'}</p>
                <p className={`text-sm ${(stock.change24h || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {(stock.change24h || 0) >= 0 ? '📈' : '📉'} {Math.abs(stock.change24h || 0).toFixed(2)}%
                </p>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            <p>No stock data available. Waiting for market data to load...</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
