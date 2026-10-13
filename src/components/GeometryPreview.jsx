import { Calendar, Clock, MapPin } from "lucide-react";
import useTimeline from "../lib/useTimeline";
import GoldDivider from "./GoldDivider";
import { formatDate, formatTime } from "../lib/themes";

const GREETING_AR = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةِ اللهِ وَبَرَكَاتُهُ";
const GREETING_EN = "As-Salamu Alaykum wa Rahmatullahi wa Barakatuh";

function CardFrame({ theme, className = "", style, children }) {
  const dots = [
    { top: 5, left: 5 },
    { top: 5, right: 5 },
    { bottom: 5, left: 5 },
    { bottom: 5, right: 5 },
  ];
  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{
        background: "rgba(0,0,0,0.42)",
        border: `2px solid ${theme.goldPrimary}`,
        boxShadow: "0 10px 34px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <div className="absolute inset-[6px] rounded-xl pointer-events-none" style={{ border: `1px solid ${theme.goldPrimary}44` }} />
      {dots.map((pos, i) => (
        <span key={i} className="absolute rounded-full" style={{ ...pos, width: 7, height: 7, background: theme.goldPrimary }} />
      ))}
      {children}
    </div>
  );
}

function Flourish({ theme, style }) {
  return (
    <div className="flex items-center justify-center gap-2" style={style}>
      <span style={{ height: 1, width: 40, background: `${theme.goldPrimary}66` }} />
      <span style={{ width: 9, height: 9, background: theme.goldPrimary, transform: "rotate(45deg)" }} />
      <span style={{ height: 1, width: 40, background: `${theme.goldPrimary}66` }} />
    </div>
  );
}

function Khatim({ theme, size = 90, style }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, ...style }}>
      <g fill="none" stroke={theme.goldPrimary} strokeWidth="1.4" opacity="0.65">
        <rect x="15" y="15" width="70" height="70" />
        <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="18" />
      </g>
    </svg>
  );
}

function FloralCorner({ theme, style }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: 64, height: 64, ...style }}>
      <g fill="none" stroke={theme.goldPrimary} strokeWidth="1.6" opacity="0.7">
        <path d="M5 5 Q60 8 95 70" />
        <path d="M5 5 Q8 60 70 95" />
      </g>
      <g fill={theme.goldPrimary} opacity="0.75">
        <ellipse cx="32" cy="12" rx="7" ry="3" transform="rotate(20 32 12)" />
        <ellipse cx="12" cy="32" rx="7" ry="3" transform="rotate(70 12 32)" />
        <ellipse cx="55" cy="42" rx="7" ry="3" transform="rotate(35 55 42)" />
        <circle cx="78" cy="58" r="3" />
        <circle cx="58" cy="78" r="3" />
        <circle cx="88" cy="88" r="2.5" />
      </g>
    </svg>
  );
}

export default function GeometryPreview({ data, theme, isPlaying, onEnded }) {
  const elapsed = useTimeline(isPlaying, onEnded, 30);
  const scene = elapsed < 5 ? 1 : elapsed < 15 ? 2 : elapsed < 25 ? 3 : 4;
  const s1 = Math.min(1, elapsed / 5);
  const s2 = Math.min(1, Math.max(0, (elapsed - 5) / 10));
  const s3 = Math.min(1, Math.max(0, (elapsed - 15) / 10));
  const s4 = Math.min(1, Math.max(0, (elapsed - 25) / 5));

  const sceneCls = (n) =>
    `absolute inset-0 flex flex-col transition-opacity duration-700 ${scene === n ? "opacity-100 z-10" : "opacity-0 z-0"}`;
  const sceneLabels = ["Islamic Greeting", "Bismillah & Invitation", "Couple Names", "Details & Closing"];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16", maxHeight: "72vh", borderRadius: "18px" }}>
      {/* emerald gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, #0A3B2C 0%, #062018 50%, #031A12 100%)" }} />
      {/* geometric pattern */}
      <div className="geo-pattern absolute inset-0" style={{ opacity: 0.08 }} />
      {/* floral corners */}
      <FloralCorner theme={theme} style={{ position: "absolute", top: 8, left: 8 }} />
      <FloralCorner theme={theme} style={{ position: "absolute", top: 8, right: 8, transform: "scaleX(-1)" }} />
      <FloralCorner theme={theme} style={{ position: "absolute", bottom: 8, left: 8, transform: "scaleY(-1)" }} />
      <FloralCorner theme={theme} style={{ position: "absolute", bottom: 8, right: 8, transform: "scale(-1,-1)" }} />

      {/* central rotating medallion */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.4, animation: "spin 40s linear infinite" }}>
        <Khatim theme={theme} size={220} />
      </div>
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.3, animation: "spin 28s linear infinite reverse" }}>
        <Khatim theme={theme} size={160} />
      </div>

      {/* gold border */}
      <div className="absolute inset-2 rounded-[14px] pointer-events-none z-20" style={{ border: `2px solid ${theme.goldPrimary}66` }} />

      {/* ═══ SCENE 1: Greeting ═══ */}
      <div className={sceneCls(1)} style={{ justifyContent: "center", padding: "0 6%" }}>
        <CardFrame theme={theme} className="px-4 py-4" style={{ opacity: Math.min(1, s1 * 3), transform: `scale(${0.9 + s1 * 0.1})` }}>
          <div className="text-center" style={{ fontFamily: "'Amiri', serif", color: theme.goldPrimary, fontSize: "clamp(0.78rem, 2.9vw, 1rem)", lineHeight: 1.8 }}>
            {GREETING_AR}
          </div>
          <div className="text-center mt-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.8, fontSize: "clamp(0.55rem, 1.8vw, 0.7rem)", letterSpacing: "0.05em" }}>
            {GREETING_EN}
          </div>
        </CardFrame>
        <Flourish theme={theme} style={{ marginTop: 12, opacity: Math.min(1, Math.max(0, (s1 - 0.5) * 3)) }} />
      </div>

      {/* ═══ SCENE 2: Bismillah + invitation ═══ */}
      <div className={sceneCls(2)} style={{ justifyContent: "flex-end", padding: "0 6% 8%" }}>
        <div className="text-center mb-2" style={{ fontFamily: "'Amiri', serif", color: theme.goldPrimary, fontSize: "clamp(0.82rem, 3vw, 1.05rem)", opacity: Math.min(1, s2 * 3), textShadow: "0 0 16px rgba(255,215,0,0.4)" }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>
        <CardFrame theme={theme} className="px-4 py-3" style={{ opacity: Math.min(1, Math.max(0, (s2 - 0.1) * 3)) }}>
          <div className="text-center" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.85, fontSize: "clamp(0.65rem, 2.3vw, 0.82rem)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            With the blessings of Allah SWT, we joyfully invite you
            <br />
            to celebrate the wedding of
          </div>
          <div className="gold-text text-center mt-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(1.05rem, 4.2vw, 1.45rem)" }}>
            {data.dulhaName || "Groom"} &amp; {data.dulhanName || "Bride"}
          </div>
        </CardFrame>
      </div>

      {/* ═══ SCENE 3: Names in medallion ═══ */}
      <div className={sceneCls(3)} style={{ justifyContent: "center", padding: "0 6%" }}>
        <CardFrame theme={theme} className="px-4 py-4" style={{ opacity: Math.min(1, s3 * 3) }}>
          <div className="gold-text text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(0.95rem, 3.8vw, 1.3rem)" }}>
            {data.dulhaName || "Dulha Name"}
          </div>
          <Flourish theme={theme} style={{ margin: "6px 0" }} />
          <div className="gold-text text-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(0.95rem, 3.8vw, 1.3rem)" }}>
            {data.dulhanName || "Dulhan Name"}
          </div>
          <div className="text-center mt-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.goldPrimary, opacity: 0.85, fontSize: "clamp(0.6rem, 2.2vw, 0.78rem)" }}>
            D/O {data.dulhanFather || "Father's Name"}
          </div>
        </CardFrame>
      </div>

      {/* ═══ SCENE 4: Details ═══ */}
      <div className={sceneCls(4)} style={{ justifyContent: "center", padding: "0 6%" }}>
        <CardFrame theme={theme} className="px-4 py-4" style={{ opacity: Math.min(1, s4 * 3) }}>
          <div className="space-y-2.5">
            {[
              { icon: Calendar, text: formatDate(data.nikahDate), d: 0.1 },
              { icon: Clock, text: formatTime(data.nikahTime), d: 0.25 },
              { icon: MapPin, text: data.venue || "Venue TBA", d: 0.4 },
            ].map(({ icon: Icon, text, d }, i) => {
              const p = Math.min(1, Math.max(0, (s4 - d) * 4));
              return (
                <div key={i} className="flex items-center justify-center gap-2.5" style={{ opacity: p, transform: `scale(${0.85 + p * 0.15})` }}>
                  <Icon size={14} style={{ color: theme.goldPrimary, opacity: 0.85, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, fontSize: "clamp(0.7rem, 2.6vw, 0.9rem)", textShadow: "0 1px 6px rgba(0,0,0,0.6)", textAlign: "center" }}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </CardFrame>
        <div className="gold-text text-center mt-3" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)", opacity: Math.min(1, Math.max(0, (s4 - 0.55) * 4)) }}>
          Insha'Allah
        </div>
        <div className="text-center mt-1 uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.5 * Math.min(1, Math.max(0, (s4 - 0.7) * 4)), fontSize: "0.55rem", letterSpacing: "0.15em" }}>
          We await your gracious presence
        </div>
      </div>

      {/* timeline scrubber */}
      <div className="absolute bottom-2 left-4 right-4 z-20">
        <div className="flex justify-between mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.6rem", color: theme.goldPrimary, opacity: 0.7, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
          <span>{sceneLabels[scene - 1]}</span>
          <span>{Math.floor(elapsed)}s / 30s</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="h-full rounded-full transition-all duration-100" style={{ width: `${(elapsed / 30) * 100}%`, background: `linear-gradient(90deg, ${theme.goldSecondary}, ${theme.goldPrimary})` }} />
        </div>
      </div>
    </div>
  );
}
