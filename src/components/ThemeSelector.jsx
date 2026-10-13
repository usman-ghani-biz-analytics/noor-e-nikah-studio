import { CheckCircle2, Palette } from "lucide-react";
import { themes } from "../lib/themes";

const swatches = {
  "Royal Red & Gold": ["#4A0E17", "#FFD700"],
  "Emerald & Gold": ["#0A3B2C", "#FFD700"],
  "Midnight Sapphire": ["#0F1B3D", "#FFD700"],
};

export default function ThemeSelector({ activeTheme, onSelect, theme }) {
  return (
    <div>
      <label
        className="flex items-center gap-2 mb-3 uppercase"
        style={{
          color: theme.goldPrimary,
          opacity: 0.85,
          fontFamily: "'Playfair Display', serif",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
        }}
      >
        <Palette size={13} strokeWidth={2.2} />
        Theme Selection
      </label>
      <div className="flex flex-col gap-2.5">
        {Object.keys(themes).map((name) => {
          const isActive = name === activeTheme;
          return (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left"
              style={{
                background: isActive ? `${theme.goldPrimary}15` : "rgba(255,255,255,0.03)",
                border: isActive
                  ? `1.5px solid ${theme.goldPrimary}80`
                  : "1.5px solid rgba(255,255,255,0.06)",
                boxShadow: isActive ? `0 4px 20px ${theme.glowColor}` : "none",
              }}
            >
              <div className="flex gap-1">
                <div
                  className="w-5 h-5 rounded-full border"
                  style={{ background: swatches[name][0], borderColor: "rgba(255,255,255,0.15)" }}
                />
                <div
                  className="w-5 h-5 rounded-full border -ml-2"
                  style={{ background: swatches[name][1], borderColor: "rgba(255,255,255,0.15)" }}
                />
              </div>
              <span
                className="font-medium tracking-wide"
                style={{
                  color: isActive ? theme.goldPrimary : theme.textColor,
                  opacity: isActive ? 1 : 0.65,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.05rem",
                }}
              >
                {name}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <CheckCircle2 size={18} style={{ color: theme.goldPrimary }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
