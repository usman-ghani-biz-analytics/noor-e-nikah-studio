export default function GoldDivider({ width = "100%", theme }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4" style={{ width }}>
      <div
        className="h-px flex-1"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.goldPrimary}66, transparent)` }}
      />
      <div className="flex gap-1.5 items-center">
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: theme.goldPrimary, opacity: 0.7 }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.goldPrimary, opacity: 0.9 }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: theme.goldPrimary, opacity: 0.7 }} />
      </div>
      <div
        className="h-px flex-1"
        style={{ background: `linear-gradient(270deg, transparent, ${theme.goldPrimary}66, transparent)` }}
      />
    </div>
  );
}
