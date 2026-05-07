import GlassCard from './GlassCard';

export default function StatCard({ label, value, change, icon, gradient = 'from-indigo-600 to-purple-600' }) {
  const isPositive = change >= 0;

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        {icon && <div className={`text-2xl ${icon.color || 'text-indigo-400'}`}>{icon.symbol}</div>}
      </div>

      <div className="text-3xl font-bold gradient-text">{value}</div>

      {change !== undefined && (
        <div className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '📈' : '📉'} {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </GlassCard>
  );
}
