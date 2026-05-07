import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import MiniSparkline from '../components/ui/MiniSparkline';

export default function MarketsPage() {
  const [cryptos, setCryptos] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const [cryptoData, overviewData] = await Promise.all([
        api.getMarkets(),
        api.getMarketOverview(),
      ]);
      setCryptos(cryptoData.cryptos || []);
      setOverview(overviewData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch markets:', err);
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
        <h1 className="text-3xl font-bold gradient-text">Crypto Markets</h1>
        <button onClick={fetchMarkets} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</p>
      )}

      {/* Market Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-gray-400 text-sm mb-2">Total Market Cap</p>
            <p className="text-2xl font-bold gradient-text">₹{(overview.totalMarketCap / 1e12).toFixed(2)}T</p>
            <p className={`text-xs mt-2 ${overview.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overview.change24h >= 0 ? '📈' : '📉'} {Math.abs(overview.change24h).toFixed(2)}% (24h)
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-gray-400 text-sm mb-2">BTC Dominance</p>
            <p className="text-2xl font-bold text-orange-400">{overview.btcDominance?.toFixed(1)}%</p>
          </GlassCard>
          <GlassCard>
            <p className="text-gray-400 text-sm mb-2">ETH Dominance</p>
            <p className="text-2xl font-bold text-purple-400">{overview.ethDominance?.toFixed(1)}%</p>
          </GlassCard>
        </div>
      )}

      {/* Crypto List */}
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <GlassCard key={crypto.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {crypto.image && (
                <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full" />
              )}
              <div>
                <h3 className="font-semibold">{crypto.name}</h3>
                <p className="text-xs text-gray-400">{crypto.symbol}</p>
              </div>
            </div>

            <div className="flex-1 mx-4 h-8">
              <MiniSparkline data={crypto.sparkline} color="#6366f1" />
            </div>

            <div className="text-right">
              <p className="font-bold">₹{crypto.currentPrice?.toLocaleString()}</p>
              <p className={`text-sm ${crypto.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {crypto.change24h >= 0 ? '📈' : '📉'} {Math.abs(crypto.change24h).toFixed(2)}%
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
