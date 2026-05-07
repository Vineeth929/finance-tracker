export default function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info',
  };

  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
}
