import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, MapPin, Moon, Star } from "lucide-react";
import GoldDivider from "./GoldDivider";
import { formatDate, formatTime } from "../lib/themes";
import bgRoyal from "../images/bg-royal.png";
import bgEmerald from "../images/bg-emerald.png";
import bgSapphire from "../images/bg-sapphire.png";
import coupleImg from "../images/couple.png";
import goldCorner from "../images/gold-corner.png";

const bgMap = {
  "Royal Red & Gold": bgRoyal,
  "Emerald & Gold": bgEmerald,
  "Midnight Sapphire": bgSapphire,
};

/* ornamental glass card: dark fill + double gold border + corner dots */
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
        background: "rgba(0,0,0,0.34)",
        border: `2px solid ${theme.goldPrimary}`,
        boxShadow: "0 10px 34px rgba(0,0,0,0.45)",
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

/* line — diamond — line flourish */
function Flourish({ theme, style }) {
  return (
    <div className="flex items-center justify-center gap-2" style={style}>
      <span style={{ height: 1, width: 42, background: `${theme.goldPrimary}66` }} />
      <span style={{ width: 9, height: 9, background: theme.goldPrimary, transform: "rotate(45deg)" }} />
      <span style={{ height: 1, width: 42, background: `${theme.goldPrimary}66` }} />
    </div>
  );
}

export default function CouplePreview({ data, theme, themeName, isPlaying, onEnded }) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    const loop = () => {
      const t = (performance.now() - startRef.current) / 1000;
      if (t >= 30) {
        setElapsed(30);
        onEnded?.();
        return;
      }
      setElapsed(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, onEnded]);

  const bg = bgMap[themeName] || bgRoyal;
  const scene = elapsed < 5 ? 1 : elapsed < 15 ? 2 : elapsed < 25 ? 3 : 4;
  const s1 = Math.min(1, elapsed / 5);
  const s2 = Math.min(1, Math.max(0, (elapsed - 5) / 10));
  const s3 = Math.min(1, Math.max(0, (elapsed - 15) / 10));
  const s4 = Math.min(1, Math.max(0, (elapsed - 25) / 5));

  const sceneCls = (n) =>
    `absolute inset-0 flex flex-col transition-opacity duration-700 ${
      scene === n ? "opacity-100 z-10" : "opacity-0 z-0"
    }`;

  const sceneLabels = ["Bismillah Opening", "Invitation & Couple", "Names & Family", "Details & Closing"];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16", maxHeight: "72vh", borderRadius: "18px" }}>
      {/* photo background */}
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* dark overlay for readability */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />

      {/* gold corners */}
      <img src={goldCorner} alt="" className="absolute top-0 left-0 w-16 opacity-70" />
      <img src={goldCorner} alt="" className="absolute top-0 right-0 w-16 opacity-70" style={{ transform: "scaleX(-1)" }} />
      <img src={goldCorner} alt="" className="absolute bottom-0 left-0 w-16 opacity-70" style={{ transform: "scaleY(-1)" }} />
      <img src={goldCorner} alt="" className="absolute bottom-0 right-0 w-16 opacity-70" style={{ transform: "scale(-1,-1)" }} />

      {/* gold inner border */}
      <div className="absolute inset-2 rounded-[14px] pointer-events-none" style={{ border: `1.5px solid ${theme.goldPrimary}40`, boxShadow: `inset 0 0 30px ${theme.glowColor}` }} />

      {/* floating gold dust */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="particle z-[5]"
          style={{
            left: `${(i * 8.3 + 5) % 95}%`,
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            animationDuration: `${6 + (i % 5) * 2}s`,
            animationDelay: `${(i * 0.9) % 8}s`,
            "--p-opacity": 0.45 + (i % 4) * 0.12,
          }}
        />
      ))}

      {/* couple image in ornamental framed card */}
      <div
        className="absolute left-1/2 z-[6] transition-all duration-1000"
        style={{
          bottom: "37%",
          width: "74%",
          opacity: scene >= 2 ? 1 : 0.25,
          transform: `translateX(-50%) translateY(${scene >= 2 ? 0 : 40}px) scale(${scene >= 2 ? 1 : 0.85})`,
        }}
      >
        <CardFrame theme={theme} className="p-[7px]">
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.goldPrimary}55` }}>
            <img src={coupleImg} alt="Wedding couple" className="w-full block object-contain" style={{ maxHeight: "32vh" }} />
          </div>
        </CardFrame>
        <Flourish theme={theme} style={{ marginTop: 10, opacity: scene >= 2 ? 0.9 : 0 }} />
      </div>

      {/* ═══ SCENE 1: Bismillah (0–5s) ═══ */}
      <div className={sceneCls(1)} style={{ justifyContent: "flex-start", padding: "12% 6% 0" }}>
        <div
          className="text-center transition-all duration-700"
          style={{
            fontFamily: "'Amiri', serif",
            color: theme.goldPrimary,
            fontSize: "clamp(0.95rem, 3.5vw, 1.3rem)",
            opacity: Math.min(1, s1 * 3),
            transform: `scale(${0.8 + s1 * 0.2})`,
            textShadow: "0 0 20px rgba(255,215,0,0.5)",
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>
        <div className="w-full mt-3" style={{ opacity: Math.min(1, Math.max(0, (s1 - 0.3) * 3)) }}>
          <GoldDivider theme={theme} />
        </div>
        <div className="flex justify-center gap-2 mt-1" style={{ opacity: Math.min(1, Math.max(0, (s1 - 0.5) * 3)) }}>
          <Star size={9} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
          <Star size={14} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.9 }} />
          <Star size={9} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
        </div>
      </div>

      {/* ═══ SCENE 2: Invite + couple spotlight (5–15s) ═══ */}
      <div className={sceneCls(2)} style={{ justifyContent: "flex-end", padding: "0 6% 6%" }}>
        <CardFrame theme={theme} className="px-4 py-3 mb-2" style={{ opacity: Math.min(1, s2 * 3), transform: `translateY(${(1 - Math.min(1, s2 * 3)) * 30}px)` }}>
          <div
            className="text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.textColor,
              opacity: 0.85,
              fontSize: "clamp(0.72rem, 2.6vw, 0.9rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            With the blessings of Allah SWT, we joyfully invite you
            <br />
            to celebrate the wedding of
          </div>
          <div
            className="gold-text text-center"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(1.2rem, 5vw, 1.7rem)",
              marginTop: 4,
            }}
          >
            {data.dulhaName || "Groom"} &amp; {data.dulhanName || "Bride"}
          </div>
        </CardFrame>
      </div>

      {/* ═══ SCENE 3: Names + family (15–25s) ═══ */}
      <div className={sceneCls(3)} style={{ justifyContent: "flex-end", padding: "0 6% 6%" }}>
        <div className="w-full mb-2" style={{ opacity: Math.min(1, s3 * 3) }}>
          <GoldDivider theme={theme} />
        </div>
        <CardFrame theme={theme} className="px-4 py-3" style={{ opacity: Math.min(1, s3 * 3) }}>
          <div
            className="gold-text text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(1rem, 4vw, 1.4rem)",
            }}
          >
            {data.dulhaName || "Dulha Name"}
          </div>
          <div className="flex items-center justify-center gap-3 my-1" style={{ opacity: Math.min(1, Math.max(0, (s3 - 0.25) * 3)) }}>
            <div className="h-px w-8" style={{ background: `${theme.goldPrimary}50` }} />
            <div style={{ fontFamily: "'Great Vibes', cursive", color: theme.goldPrimary, fontSize: "1.3rem" }}>&amp;</div>
            <div className="h-px w-8" style={{ background: `${theme.goldPrimary}50` }} />
          </div>
          <div
            className="gold-text text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(1rem, 4vw, 1.4rem)",
            }}
          >
            {data.dulhanName || "Dulhan Name"}
          </div>
          <div
            className="text-center mt-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.textColor,
              opacity: 0.7 * Math.min(1, Math.max(0, (s3 - 0.55) * 3)),
              fontSize: "clamp(0.68rem, 2.4vw, 0.88rem)",
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            D/O{" "}
            <span className="font-semibold" style={{ color: theme.goldPrimary }}>
              {data.dulhanFather || "Father's Name"}
            </span>
          </div>
        </CardFrame>
      </div>

      {/* ═══ SCENE 4: Details + closing (25–30s) ═══ */}
      <div className={sceneCls(4)} style={{ justifyContent: "flex-end", padding: "0 6% 7%" }}>
        <div
          className="gold-text text-center mb-2"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
            opacity: Math.min(1, Math.max(0, (s4 - 0.55) * 4)),
          }}
        >
          Insha'Allah
        </div>
        <div className="w-full mb-3" style={{ opacity: Math.min(1, s4 * 3) }}>
          <GoldDivider theme={theme} />
        </div>
        <CardFrame theme={theme} className="px-4 py-3" style={{ opacity: Math.min(1, s4 * 3) }}>
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
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: theme.textColor,
                      fontSize: "clamp(0.75rem, 2.8vw, 0.95rem)",
                      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                      textAlign: "center",
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </CardFrame>
        <Flourish theme={theme} style={{ marginTop: 10, opacity: Math.min(1, Math.max(0, (s4 - 0.6) * 4)) }} />
        <div className="flex justify-center items-center gap-2 mt-1" style={{ opacity: Math.min(1, Math.max(0, (s4 - 0.7) * 4)) }}>
          <Moon size={12} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.6 }} />
          <span
            className="uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.5, fontSize: "0.55rem", letterSpacing: "0.15em" }}
          >
            We await your presence
          </span>
          <Moon size={12} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.6 }} />
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
