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
        background: "rgba(0,0,0,0.4)",
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

function StarField({ count = 26 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 37 + 7) % 96}%`,
            top: `${(i * 53 + 3) % 55}%`,
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            background: "#FFF8DC",
            opacity: 0.3 + (i % 5) * 0.12,
            animation: `pulse ${2 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 4}s`,
          }}
        />
      ))}
    </>
  );
}

function Lantern({ theme, style }) {
  return (
    <div className="absolute" style={style}>
      <div style={{ width: 1, height: 34, background: `${theme.goldPrimary}66`, margin: "0 auto" }} />
      <div
        className="relative mx-auto"
        style={{
          width: 22,
          height: 30,
          border: `1.5px solid ${theme.goldPrimary}`,
          background: `linear-gradient(180deg, ${theme.goldPrimary}33, ${theme.goldPrimary}11)`,
          borderRadius: "4px 4px 8px 8px",
          boxShadow: `0 0 18px ${theme.goldPrimary}55`,
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: `${theme.goldPrimary}88` }} />
      </div>
      <div className="mx-auto" style={{ width: 10, height: 4, background: theme.goldPrimary, borderRadius: 2, marginTop: -1 }} />
    </div>
  );
}

export default function MosquePreview({ data, theme, isPlaying, onEnded }) {
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
      {/* night sky */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0A1628 0%, #13233F 45%, #060B14 100%)" }} />
      <StarField />
      {/* crescent moon */}
      <svg viewBox="0 0 100 100" className="absolute" style={{ top: "7%", right: "10%", width: 52, height: 52, opacity: 0.9, filter: `drop-shadow(0 0 14px ${theme.goldPrimary})` }}>
        <path d="M62 8 A42 42 0 1 0 62 92 A33 33 0 1 1 62 8Z" fill={theme.goldPrimary} />
      </svg>
      {/* lanterns */}
      <Lantern theme={theme} style={{ top: "12%", left: "14%" }} />
      <Lantern theme={theme} style={{ top: "8%", left: "50%", transform: "translateX(-50%) scale(1.2)" }} />
      <Lantern theme={theme} style={{ top: "13%", right: "14%" }} />

      {/* mosque silhouette */}
      <svg viewBox="0 0 300 120" className="absolute bottom-0 left-0 w-full" style={{ opacity: 0.95 }}>
        <g fill="#04070D">
          <rect x="90" y="60" width="120" height="60" />
          <path d="M110 60 Q150 10 190 60 Z" />
          <rect x="148" y="8" width="4" height="16" />
          <circle cx="150" cy="7" r="4" />
          <path d="M75 60 Q90 30 105 60 Z" />
          <path d="M195 60 Q210 30 225 60 Z" />
          <rect x="40" y="25" width="12" height="95" />
          <path d="M40 25 Q46 12 52 25 Z" />
          <rect x="248" y="25" width="12" height="95" />
          <path d="M248 25 Q254 12 260 25 Z" />
        </g>
        <g fill="none" stroke={theme.goldPrimary} strokeWidth="1" opacity="0.5">
          <path d="M138 120 L138 92 Q150 80 162 92 L162 120" />
          <path d="M100 120 L100 100 Q108 92 116 100 L116 120" />
          <path d="M184 120 L184 100 Q192 92 200 100 L200 120" />
        </g>
        <path d="M110 60 Q150 10 190 60" fill="none" stroke={theme.goldPrimary} strokeWidth="1.2" opacity="0.55" />
      </svg>

      {/* gold border */}
      <div className="absolute inset-2 rounded-[14px] pointer-events-none z-20" style={{ border: `2px solid ${theme.goldPrimary}66` }} />

      {/* ═══ SCENE 1: Greeting ═══ */}
      <div className={sceneCls(1)} style={{ justifyContent: "center", padding: "0 6%" }}>
        <CardFrame theme={theme} className="px-4 py-4" style={{ opacity: Math.min(1, s1 * 3), transform: `scale(${0.9 + s1 * 0.1})` }}>
          <div className="text-center" style={{ fontFamily: "'Amiri', serif", color: theme.goldPrimary, fontSize: "clamp(0.8rem, 3vw, 1.05rem)", lineHeight: 1.8 }}>
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
        <div className="text-center mb-2" style={{ fontFamily: "'Amiri', serif", color: theme.goldPrimary, fontSize: "clamp(0.85rem, 3.2vw, 1.1rem)", opacity: Math.min(1, s2 * 3), textShadow: "0 0 16px rgba(255,215,0,0.4)" }}>
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

      {/* ═══ SCENE 3: Names ═══ */}
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
