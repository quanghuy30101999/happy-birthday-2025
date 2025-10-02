export function Card({ className = "", children, ...props }) {
  return <div className={`rounded-3xl border border-white/10 bg-white/5 ${className}`} {...props}>{children}</div>;
}
export function CardHeader({ className = "", children }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
export function CardContent({ className = "", children }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}
