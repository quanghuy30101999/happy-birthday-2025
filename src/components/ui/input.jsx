export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 ${className}`}
      {...props}
    />
  );
}
