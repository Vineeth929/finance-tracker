export default function SkeletonLoader({ width = 'w-full', height = 'h-4', count = 1, circle = false }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-shimmer bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg ${width} ${circle ? 'rounded-full' : ''} ${height}`}
        />
      ))}
    </>
  );
}
