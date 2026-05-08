export default function SkeletonLoader({ width = 'w-full', height = 'h-4', count = 1, circle = false }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-shimmer glass rounded-lg ${width} ${circle ? 'rounded-full' : ''} ${height}`}
        />
      ))}
    </>
  );
}
