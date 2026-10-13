import { Loader2, X } from "lucide-react";

export default function ExportModal({ isOpen, progress, frame, totalFrames = 450, duration = 30, theme, onCancel }) {
  if (!isOpen) return null;
  const pct = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div
        className="modal-in relative w-full max-w-sm rounded-2xl p-6 text-center overflow-hidden"
        style={{
          background: theme.panelBg,
          border: `1px solid ${theme.goldPrimary}40`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${theme.glowColor}`,
        }}
      >
        {/* geo pattern */}
        <div className="geo-pattern absolute inset-0 opacity-[0.04] pointer-events-none" />

        {/* close */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-colors hover:bg-white/10"
            style={{ color: theme.textColor, opacity: 0.5 }}
            aria-label="Cancel export"
          >
            <X size={16} />
          </button>
        )}

        <div className="relative">
          <Loader2 size={36} className="animate-spin mx-auto mb-4" style={{ color: theme.goldPrimary }} />

          <h3
            className="mb-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: theme.goldPrimary,
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            Rendering Your Video
          </h3>

          <p
            className="mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.textColor,
              opacity: 0.6,
              fontSize: "0.95rem",
            }}
          >
            Rendering frame {frame.toLocaleString()} / {totalFrames.toLocaleString()}… Please wait
          </p>

          {/* progress bar */}
          <div
            className="h-3 rounded-full overflow-hidden mb-3"
            style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${theme.goldPrimary}25` }}
          >
            <div
              className="h-full rounded-full progress-active transition-all duration-200"
              style={{
                width: `${Math.max(2, pct)}%`,
                background: `linear-gradient(90deg, ${theme.goldSecondary}, ${theme.goldPrimary}, ${theme.goldTertiary})`,
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          <div
            className="flex justify-between"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.textColor,
              opacity: 0.55,
              fontSize: "0.85rem",
            }}
          >
            <span>{pct}% complete</span>
            <span>1080 × 1920 · {duration}s · WebM</span>
          </div>

          <p
            className="mt-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.goldPrimary,
              opacity: 0.45,
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
            }}
          >
            Video will auto-download when ready — perfect for WhatsApp &amp; Instagram status
          </p>
        </div>
      </div>
    </div>
  );
}
