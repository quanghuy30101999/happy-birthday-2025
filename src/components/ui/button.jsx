export function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium transition active:scale-95";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  const variants = {
    default: "bg-[var(--accent,#ff4d6d)] text-white hover:opacity-90",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    icon: "p-2"
  };
  return (
    <button className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}
