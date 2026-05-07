export default function GlassCard({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`glass p-6 cursor-default transition-all duration-300 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
