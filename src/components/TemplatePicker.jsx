import { ArrowLeft, Crown, Flower2, Landmark, Moon, Sparkles } from "lucide-react";
import { themes } from "../lib/themes";

export default function TemplatePicker({ onSelect, onBack }) {
  const cards = [
    {
      id: 1,
      name: "Royal Arch",
      tagline: "Classic gold arch · Bismillah opening",
      themeName: "Royal Red & Gold",
      icon: <Crown size={16} style={{ color: "#FFD700" }} />,
      preview: (
        <div
          className="arch-shape relative w-full overflow-hidden flex flex-col items-center justify-center"
          style={{ aspectRatio: "9/16", background: "linear-gradient(180deg, #5A1220, #2B050B)" }}
        >
          <div className="geo-pattern absolute inset-0 opacity-[0.06]" />
          <div className="arch-inner absolute inset-[3px] border border-yellow-400/20" />
          <div className="relative text-center px-4">
            <div style={{ fontFamily: "'Amiri', serif", color: "#FFD700", fontSize: "0.7rem", opacity: 0.85 }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            <div className="gold-text mt-2" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.6rem" }}>
              Nikah
            </div>
            <div className="mt-1" style={{ fontFamily: "'Playfair Display', serif", color: "#FFD700", fontSize: "0.55rem", letterSpacing: "0.2em", opacity: 0.7 }}>
              CELEBRATION
            </div>
            <div className="mt-3 space-y-1">
              <div className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.75rem" }}>
                Muhammad Ali
              </div>
              <div style={{ color: "#FFD700", fontFamily: "'Great Vibes', cursive" }}>&amp;</div>
              <div className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.75rem" }}>
                Ayesha Fatima
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      name: "Couple Portrait",
      tagline: "Real couple PNG · Photo background · Elegant",
      themeName: "Royal Red & Gold",
      icon: <Sparkles size={16} style={{ color: "#FFD700" }} />,
      preview: (
        <div
          className="relative w-full overflow-hidden flex flex-col items-end justify-end"
          style={{ aspectRatio: "9/16", background: "linear-gradient(180deg, #4A0E17, #1A0305)" }}
        >
          <img
            src={new URL("../images/bg-royal.png", import.meta.url).href}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.5 }}
          />
          <img
            src={new URL("../images/couple.png", import.meta.url).href}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 bottom-[28%] w-[85%] object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,215,0,0.4))" }}
          />
          <div className="relative w-full text-center pb-6 px-4">
            <div style={{ fontFamily: "'Amiri', serif", color: "#FFD700", fontSize: "0.65rem", opacity: 0.85 }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            <div className="gold-text mt-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem" }}>
              Muhammad Ali &amp; Ayesha Fatima
            </div>
            <div className="mt-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFF8DC", fontSize: "0.6rem", opacity: 0.6, letterSpacing: "0.15em" }}>
              15 MARCH 2025 · LAHORE
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      name: "Masjid Nightscape",
      tagline: "Night sky · Mosque silhouette · Lanterns · Islamic greeting",
      themeName: "Royal Red & Gold",
      icon: <Landmark size={16} style={{ color: "#FFD700" }} />,
      preview: (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9/16", background: "linear-gradient(180deg, #0A1628, #13233F, #060B14)" }}>
          <svg viewBox="0 0 100 100" className="absolute" style={{ top: 8, right: 10, width: 26, height: 26, opacity: 0.9 }}>
            <path d="M62 8 A42 42 0 1 0 62 92 A33 33 0 1 1 62 8Z" fill="#FFD700" />
          </svg>
          <div className="absolute left-[18%] top-[14%] w-px h-8" style={{ background: "#FFD70066" }} />
          <div className="absolute left-[18%] top-[34%]" style={{ width: 8, height: 11, border: "1px solid #FFD700", borderRadius: "2px 2px 4px 4px", background: "#FFD70033", boxShadow: "0 0 10px #FFD70055" }} />
          <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-px h-10" style={{ background: "#FFD70066" }} />
          <div className="absolute left-1/2 -translate-x-1/2 top-[30%]" style={{ width: 10, height: 13, border: "1px solid #FFD700", borderRadius: "2px 2px 5px 5px", background: "#FFD70033", boxShadow: "0 0 12px #FFD70066" }} />
          <div className="absolute right-[18%] top-[14%] w-px h-8" style={{ background: "#FFD70066" }} />
          <div className="absolute right-[18%] top-[34%]" style={{ width: 8, height: 11, border: "1px solid #FFD700", borderRadius: "2px 2px 4px 4px", background: "#FFD70033", boxShadow: "0 0 10px #FFD70055" }} />
          <svg viewBox="0 0 300 120" className="absolute bottom-0 left-0 w-full">
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
            <path d="M110 60 Q150 10 190 60" fill="none" stroke="#FFD700" strokeWidth="1.2" opacity="0.55" />
          </svg>
          <div className="absolute inset-x-4 top-[45%] text-center">
            <div style={{ fontFamily: "'Amiri', serif", color: "#FFD700", fontSize: "0.55rem", lineHeight: 1.7 }}>السَّلَامُ عَلَيْكُمْ</div>
            <div className="gold-text mt-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.2rem" }}>Ali &amp; Ayesha</div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      name: "Emerald Geometry",
      tagline: "Islamic khatim pattern · Floral corners · Medallion",
      themeName: "Emerald & Gold",
      icon: <Flower2 size={16} style={{ color: "#FFD700" }} />,
      preview: (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9/16", background: "linear-gradient(150deg, #0A3B2C, #062018, #031A12)" }}>
          <div className="geo-pattern absolute inset-0 opacity-[0.1]" />
          <svg viewBox="0 0 100 100" className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" style={{ width: 110, height: 110, opacity: 0.4, animation: "spin 40s linear infinite" }}>
            <g fill="none" stroke="#FFD700" strokeWidth="1.2">
              <rect x="15" y="15" width="70" height="70" />
              <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="16" />
            </g>
          </svg>
          <svg viewBox="0 0 100 100" className="absolute" style={{ top: 6, left: 6, width: 34, height: 34 }}>
            <g fill="none" stroke="#FFD700" strokeWidth="1.6" opacity="0.7">
              <path d="M5 5 Q60 8 95 70" />
              <path d="M5 5 Q8 60 70 95" />
            </g>
            <g fill="#FFD700" opacity="0.75">
              <circle cx="78" cy="58" r="2.5" />
              <circle cx="58" cy="78" r="2.5" />
            </g>
          </svg>
          <svg viewBox="0 0 100 100" className="absolute" style={{ top: 6, right: 6, width: 34, height: 34, transform: "scaleX(-1)" }}>
            <g fill="none" stroke="#FFD700" strokeWidth="1.6" opacity="0.7">
              <path d="M5 5 Q60 8 95 70" />
              <path d="M5 5 Q8 60 70 95" />
            </g>
            <g fill="#FFD700" opacity="0.75">
              <circle cx="78" cy="58" r="2.5" />
              <circle cx="58" cy="78" r="2.5" />
            </g>
          </svg>
          <div className="absolute inset-x-5 top-[40%] text-center">
            <div style={{ fontFamily: "'Amiri', serif", color: "#FFD700", fontSize: "0.55rem", lineHeight: 1.7 }}>السَّلَامُ عَلَيْكُمْ</div>
            <div className="gold-text mt-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.2rem" }}>Ali &amp; Ayesha</div>
          </div>
          <div className="absolute inset-2 rounded-[10px] border border-yellow-400/25" />
        </div>
      ),
    },
    {
      id: 5,
      name: "Golden Crescent",
      tagline: "Grand crescent moon · Bokeh lights · Warm night",
      themeName: "Midnight Sapphire",
      icon: <Moon size={16} style={{ color: "#FFD700" }} />,
      preview: (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9/16", background: "linear-gradient(180deg, #1A0F3D, #120A2B, #070414)" }}>
          <svg viewBox="0 0 100 100" className="absolute left-1/2 -translate-x-1/2" style={{ top: "16%", width: 80, height: 80, filter: "drop-shadow(0 0 18px rgba(255,215,0,0.7))" }}>
            <path d="M62 8 A42 42 0 1 0 62 92 A33 33 0 1 1 62 8Z" fill="#FFD700" />
          </svg>
          <div className="absolute left-[14%] top-[12%] w-px h-7" style={{ background: "#FFD70066" }} />
          <div className="absolute left-[14%] top-[30%]" style={{ width: 8, height: 11, border: "1px solid #FFD700", borderRadius: "2px 2px 4px 4px", background: "#FFD70033", boxShadow: "0 0 10px #FFD70055" }} />
          <div className="absolute right-[14%] top-[12%] w-px h-7" style={{ background: "#FFD70066" }} />
          <div className="absolute right-[14%] top-[30%]" style={{ width: 8, height: 11, border: "1px solid #FFD700", borderRadius: "2px 2px 4px 4px", background: "#FFD70033", boxShadow: "0 0 10px #FFD70055" }} />
          <div className="absolute inset-x-4 top-[55%] text-center">
            <div style={{ fontFamily: "'Amiri', serif", color: "#FFD700", fontSize: "0.55rem", lineHeight: 1.7 }}>السَّلَامُ عَلَيْكُمْ</div>
            <div className="gold-text mt-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.2rem" }}>Ali &amp; Ayesha</div>
          </div>
          <div className="absolute inset-2 rounded-[10px] border border-yellow-400/25" />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #4A0E17 0%, #2B050B 50%, #1A0305 100%)" }}>
      <div className="fixed inset-0 geo-pattern opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80"
            style={{ color: "#FFD700", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", opacity: 0.7, background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        <div className="text-center mb-10 fade-in-up">
          <div className="flex justify-center mb-3">
            <Crown size={36} style={{ color: "#FFD700", filter: "drop-shadow(0 0 12px rgba(255,215,0,0.4))" }} />
          </div>
          <h1 className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 5vw, 2.6rem)", fontWeight: 800 }}>
            Choose Your Template
          </h1>
          <p className="mt-2 uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFD700", opacity: 0.6, fontSize: "0.8rem", letterSpacing: "0.25em" }}>
            Five cinematic designs · 30s HD video export
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, #FFD70066)" }} />
            <Flower2 size={14} style={{ color: "#FFD700", opacity: 0.6 }} />
            <div className="h-px w-20" style={{ background: "linear-gradient(270deg, transparent, #FFD70066)" }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => {
            const th = themes[card.themeName];
            return (
              <button
                key={card.id}
                onClick={() => onSelect(card.id)}
                className="group text-left rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] fade-in-up"
                style={{
                  background: th.panelBg,
                  border: `1.5px solid ${th.goldPrimary}30`,
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 10px 40px rgba(0,0,0,0.4)`,
                  animationDelay: `${card.id * 0.12}s`,
                  cursor: "pointer",
                }}
              >
                <div className="glow-pulse rounded-xl overflow-hidden mb-4" style={{ "--glow": th.glowColor, maxWidth: 220, margin: "0 auto" }}>
                  {card.preview}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {card.icon}
                    <span style={{ fontFamily: "'Playfair Display', serif", color: th.goldPrimary, fontSize: "1.1rem", fontWeight: 700 }}>
                      {card.name}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", color: th.textColor, opacity: 0.55, fontSize: "0.85rem" }}>
                    {card.tagline}
                  </div>
                  <div
                    className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition-all group-hover:gap-3"
                    style={{ background: `${th.goldPrimary}15`, border: `1px solid ${th.goldPrimary}40`, color: th.goldPrimary, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    Use This Template →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center mt-10" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFD700", opacity: 0.3, fontSize: "0.75rem", letterSpacing: "0.15em" }}>
          NOOR-E-NIKAH STUDIO © 2025 · CRAFTED WITH LOVE &amp; BARAKAH
        </p>
      </div>
    </div>
  );
}
