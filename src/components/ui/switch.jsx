export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      onClick={() => onCheckedChange?.(!checked)}
      className={`w-12 h-6 rounded-full relative transition ${checked ? "bg-[var(--accent,#ff4d6d)]" : "bg-white/20"}`}
      aria-pressed={checked}
      type="button"
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-6" : ""}`}/>
    </button>
  );
}
