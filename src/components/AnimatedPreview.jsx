import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, MapPin, Moon, Star } from "lucide-react";
import GoldDivider from "./GoldDivider";
import { formatDate, formatTime } from "../lib/themes";

export const SCENE_LABELS = [
  { start: 0, end: 5, label: "Bismillah Opening" },
  { start: 5, end: 15, label: "Invitation Reveal" },
  { start: 15, end: 25, label: "Names & Family" },
  { start: 25, end: 30, label: "Details & Closing" },
];

export default function AnimatedPreview({ data, theme, isPlaying, onEnded }) {
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

  const sceneClass = (start, end) => {
    const active = elapsed >= start && elapsed < end;
    return `timeline-scene absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
      active ? "is-playing opacity-100" : "opacity-0"
    }`;
  };

  const scene1Progress = Math.min(1, elapsed / 5);
  const scene2Progress = Math.min(1, Math.max(0, (elapsed - 5) / 10));
  const scene3Progress = Math.min(1, Math.max(0, (elapsed - 15) / 10));
  const scene4Progress = Math.min(1, Math.max(0, (elapsed - 25) / 5));

  const currentScene =
    SCENE_LABELS.find((s) => elapsed >= s.start && elapsed < s.end) ||
    SCENE_LABELS[SCENE_LABELS.length - 1];

  return (
    <div
      className="relative w-full overflow-hidden arch-shape"
      style={{ aspectRatio: "9 / 16", maxHeight: "72vh" }}
    >
      {/* card background */}
      <div className="absolute inset-0 arch-shape" style={{ background: theme.cardBg }} />
      <div className="geo-pattern absolute inset-0 arch-shape opacity-[0.03]" />

      {/* arch inner border */}
      <div
        className="absolute inset-[3px] arch-inner pointer-events-none"
        style={{ border: `1px solid ${theme.goldPrimary}25` }}
      />

      {/* glow pulse border */}
      <div
        className="glow-pulse absolute inset-0 arch-shape pointer-events-none"
        style={{ "--glow": theme.glowColor }}
      />

      {/* ═══ SCENE 1: Bismillah (0–5s) ═══ */}
      <div className={sceneClass(0, 5)} style={{ padding: "8% 6%" }}>
        <div
          className="text-center transition-all duration-700"
          style={{
            fontFamily: "'Amiri', serif",
            color: theme.goldPrimary,
            fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
            opacity: scene1Progress < 0.05 ? 0 : Math.min(1, scene1Progress * 3),
            transform: `scale(${0.8 + scene1Progress * 0.2})`,
            filter: `blur(${Math.max(0, (1 - scene1Progress * 3) * 8)}px)`,
            textShadow: `0 0 20px ${theme.glowColor}`,
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        <div className="mt-3 opacity-80" style={{ opacity: Math.min(1, Math.max(0, (scene1Progress - 0.2) * 2.5)) }}>
          <GoldDivider theme={theme} />
        </div>

        <div
          className="flex justify-center gap-2 my-2"
          style={{ opacity: Math.min(1, Math.max(0, (scene1Progress - 0.35) * 2.5)) }}
        >
          <Star size={9} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
          <Star size={14} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.9 }} />
          <Star size={9} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
        </div>

        <div
          className="uppercase tracking-[0.35em] text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: theme.goldPrimary,
            opacity: 0.7 * Math.min(1, Math.max(0, (scene1Progress - 0.4) * 3)),
            fontSize: "clamp(0.5rem, 1.8vw, 0.65rem)",
          }}
        >
          The Holy Bond Of
        </div>

        <div
          className="gold-text text-center"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
            lineHeight: 1.2,
            opacity: Math.min(1, Math.max(0, (scene1Progress - 0.5) * 3)),
          }}
        >
          Nikah
        </div>

        <div
          className="uppercase tracking-[0.35em] text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: theme.goldPrimary,
            opacity: 0.7 * Math.min(1, Math.max(0, (scene1Progress - 0.6) * 3)),
            fontSize: "clamp(0.5rem, 1.8vw, 0.65rem)",
          }}
        >
          Celebration
        </div>

        <div className="mt-2 w-full opacity-80" style={{ opacity: Math.min(1, Math.max(0, (scene1Progress - 0.75) * 3)) }}>
          <GoldDivider theme={theme} />
        </div>
      </div>

      {/* ═══ SCENE 2: Invite + Names (5–15s) ═══ */}
      <div className={sceneClass(5, 15)} style={{ padding: "8% 6%" }}>
        <div
          className="text-center leading-relaxed mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: theme.textColor,
            opacity: 0.75,
            fontSize: "clamp(0.75rem, 2.8vw, 0.95rem)",
            transform: `translateY(${(1 - Math.min(1, scene2Progress * 3)) * 40}px)`,
          }}
        >
          With the blessings of Allah SWT,
          <br />
          we joyfully invite you to celebrate
          <br />
          the wedding of
        </div>

        <div
          className="gold-text text-center mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(1.1rem, 4.5vw, 1.55rem)",
            opacity: Math.min(1, Math.max(0, (scene2Progress - 0.2) * 3)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (scene2Progress - 0.2) * 3))) * 30}px)`,
          }}
        >
          {data.dulhaName || "Dulha Name"}
        </div>

        <div className="flex items-center justify-center gap-3 my-1" style={{ opacity: Math.min(1, Math.max(0, (scene2Progress - 0.4) * 3)) }}>
          <div className="h-px w-8" style={{ background: `${theme.goldPrimary}50` }} />
          <div style={{ fontFamily: "'Great Vibes', cursive", color: theme.goldPrimary, fontSize: "1.4rem" }}>&amp;</div>
          <div className="h-px w-8" style={{ background: `${theme.goldPrimary}50` }} />
        </div>

        <div
          className="gold-text text-center mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(1.1rem, 4.5vw, 1.55rem)",
            opacity: Math.min(1, Math.max(0, (scene2Progress - 0.5) * 3)),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, (scene2Progress - 0.5) * 3))) * 30}px)`,
          }}
        >
          {data.dulhanName || "Dulhan Name"}
        </div>

        <div
          className="text-center"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: theme.textColor,
            opacity: 0.65 * Math.min(1, Math.max(0, (scene2Progress - 0.65) * 3)),
            fontSize: "clamp(0.7rem, 2.5vw, 0.92rem)",
          }}
        >
          Daughter of{" "}
          <span className="font-semibold" style={{ color: theme.goldPrimary }}>
            {data.dulhanFather || "Father's Name"}
          </span>
        </div>

        <div className="mt-3 w-full opacity-80" style={{ opacity: Math.min(1, Math.max(0, (scene2Progress - 0.8) * 3)) }}>
          <GoldDivider theme={theme} />
        </div>
      </div>

      {/* ═══ SCENE 3: Details (15–25s) ═══ */}
      <div className={sceneClass(15, 25)} style={{ padding: "8% 6%" }}>
        <div className="space-y-4 w-full">
          {[
            { icon: Calendar, text: formatDate(data.nikahDate), delay: 0.1 },
            { icon: Clock, text: formatTime(data.nikahTime), delay: 0.3 },
            { icon: MapPin, text: data.venue || "Venue TBA", delay: 0.5 },
          ].map(({ icon: Icon, text, delay }, i) => {
            const itemP = Math.min(1, Math.max(0, (scene3Progress - delay) * 3));
            return (
              <div
                key={i}
                className="flex items-center justify-center gap-3"
                style={{
                  opacity: itemP,
                  transform: `scale(${0.85 + itemP * 0.15})`,
                }}
              >
                <Icon size={16} style={{ color: theme.goldPrimary, opacity: 0.8, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: theme.textColor,
                    fontSize: "clamp(0.8rem, 3vw, 1.02rem)",
                    opacity: 0.9,
                    textAlign: "center",
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 w-full opacity-80" style={{ opacity: Math.min(1, Math.max(0, (scene3Progress - 0.6) * 3)) }}>
          <GoldDivider theme={theme} />
        </div>

        <div
          className="gold-text text-center mt-3"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.2rem, 5vw, 1.7rem)",
            opacity: Math.min(1, Math.max(0, (scene3Progress - 0.7) * 3)),
          }}
        >
          Insha'Allah
        </div>

        <div
          className="text-center mt-1 uppercase"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: theme.textColor,
            opacity: 0.5 * Math.min(1, Math.max(0, (scene3Progress - 0.8) * 3)),
            fontSize: "clamp(0.55rem, 2vw, 0.75rem)",
            letterSpacing: "0.15em",
          }}
        >
          We await your gracious presence
        </div>

        <div
          className="flex justify-center items-center gap-2 mt-3"
          style={{ opacity: Math.min(1, Math.max(0, (scene3Progress - 0.9) * 3)) }}
        >
          <Moon size={14} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.6 }} />
          <Star size={9} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
        </div>
      </div>

      {/* ═══ SCENE 4: Grand closing flourish (25–30s) ═══ */}
      <div className={sceneClass(25, 30)} style={{ padding: "8% 6%" }}>
        <div
          className="text-center"
          style={{
            opacity: scene4Progress,
            transform: `scale(${0.7 + scene4Progress * 0.3})`,
          }}
        >
          <Moon size={32} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.8, transform: "rotate(-30deg)", filter: `drop-shadow(0 0 12px ${theme.glowColor})` }} className="mx-auto mb-3" />
          <div className="gold-text" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(1.8rem, 7vw, 2.6rem)" }}>
            Insha'Allah
          </div>
          <div
            className="uppercase tracking-[0.25em] mt-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: theme.textColor,
              opacity: 0.55,
              fontSize: "clamp(0.55rem, 2vw, 0.75rem)",
            }}
          >
            We await your gracious presence
          </div>
          <GoldDivider theme={theme} />
          <div
            className="uppercase"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: theme.goldPrimary,
              opacity: 0.6,
              fontSize: "clamp(0.55rem, 1.8vw, 0.68rem)",
              letterSpacing: "0.2em",
            }}
          >
            Noor-e-Nikah Studio
          </div>
        </div>

        {/* closing border flourish */}
        <div
          className="absolute inset-0 arch-shape pointer-events-none"
          style={{
            border: `2px solid ${theme.goldPrimary}`,
            opacity: scene4Progress * 0.7,
            boxShadow: `inset 0 0 40px ${theme.glowColor}, 0 0 30px ${theme.glowColor}`,
          }}
        />
      </div>

      {/* ═══ Timeline scrubber bar (bottom overlay) ═══ */}
      <div className="absolute bottom-3 left-4 right-4 z-10">
        <div className="flex justify-between mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.65rem", color: theme.goldPrimary, opacity: 0.6 }}>
          <span>{currentScene.label}</span>
          <span>
            {Math.floor(elapsed)}s / 30s
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${(elapsed / 30) * 100}%`,
              background: `linear-gradient(90deg, ${theme.goldSecondary}, ${theme.goldPrimary})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
