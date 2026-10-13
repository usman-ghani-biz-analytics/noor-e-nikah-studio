import { useCallback, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Film,
  Heart,
  Loader2,
  MapPin,
  Moon,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Type,
  Users,
} from "lucide-react";
import GoldParticles from "./GoldParticles";
import GoldDivider from "./GoldDivider";
import InputField from "./InputField";
import ThemeSelector from "./ThemeSelector";
import ExportModal from "./ExportModal";
import { themes, defaultFormData } from "../lib/themes";
import { renderAndDownloadVideo } from "../lib/videoRenderer";

export default function EditorShell({ templateId, renderPreview }) {
  const templateNames = {
    1: "Royal Arch",
    2: "Couple Portrait",
    3: "Masjid Nightscape",
    4: "Emerald Geometry",
    5: "Golden Crescent",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [activeTheme, setActiveTheme] = useState("Royal Red & Gold");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [exportState, setExportState] = useState({ progress: 0, frame: 0 });
  const [exportError, setExportError] = useState(null);
  const exportRef = useRef(false);

  const theme = themes[activeTheme];

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsExported(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (exportRef.current) return;
    exportRef.current = true;
    setIsProcessing(true);
    setIsExported(false);
    setExportError(null);
    setExportState({ progress: 0, frame: 0 });
    try {
      await renderAndDownloadVideo(
        formData,
        theme,
        ({ progress, frame }) => {
          setExportState({ progress, frame });
        },
        { templateId, themeName: activeTheme }
      );
      setIsExported(true);
    } catch (err) {
      console.error("Video export failed:", err);
      setExportError(err?.message || "Export failed. Please use Chrome or Edge.");
    } finally {
      setIsProcessing(false);
      exportRef.current = false;
      setExportState({ progress: 0, frame: 0 });
    }
  }, [formData, theme, templateId, activeTheme]);

  const handlePreviewToggle = useCallback(() => setIsPreviewPlaying((p) => !p), []);
  const handlePreviewEnded = useCallback(() => setIsPreviewPlaying(false), []);
  const handlePreviewRestart = useCallback(() => {
    setIsPreviewPlaying(false);
    requestAnimationFrame(() => setIsPreviewPlaying(true));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.bgGradient }}>
      <div className="fixed inset-0 geo-pattern opacity-[0.03] pointer-events-none z-0" />
      <GoldParticles />
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)" }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-6 lg:py-10">
        {/* HEADER */}
        <header className="text-center mb-8 fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-14 sm:w-20" style={{ background: `linear-gradient(90deg, transparent, ${theme.goldPrimary}60)` }} />
            <div className="flex items-center gap-1.5">
              <Star size={8} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
              <Star size={12} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.8 }} />
              <Star size={8} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.5 }} />
            </div>
            <div className="h-px w-14 sm:w-20" style={{ background: `linear-gradient(270deg, transparent, ${theme.goldPrimary}60)` }} />
          </div>

          <div className="flex justify-center mb-3">
            <div className="relative flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: "50%", background: `radial-gradient(circle, ${theme.goldPrimary}18, transparent 70%)` }}>
              <Moon size={34} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, filter: `drop-shadow(0 0 12px ${theme.glowColor})`, transform: "rotate(-30deg)" }} />
              <Star size={14} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, position: "absolute", top: 11, right: 12, filter: `drop-shadow(0 0 6px ${theme.glowColor})` }} />
            </div>
          </div>

          <h1 className="gold-text leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0.06em", textShadow: `0 0 40px ${theme.glowColor}` }}>
            Noor-e-Nikah Studio
          </h1>

          <p className="mt-1.5 uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.goldPrimary, opacity: 0.65, fontSize: "clamp(0.68rem, 1.5vw, 0.85rem)", letterSpacing: "0.28em" }}>
            Template · {templateNames[templateId] || "Royal Arch"} · Cinematic Invitations
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(90deg, transparent, ${theme.goldPrimary}45)` }} />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full" style={{ background: theme.goldPrimary, opacity: 0.5 }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.goldPrimary, opacity: 0.7 }} />
              <div className="w-1 h-1 rounded-full" style={{ background: theme.goldPrimary, opacity: 0.5 }} />
            </div>
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(270deg, transparent, ${theme.goldPrimary}45)` }} />
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* LEFT: FORM */}
          <div
            className="fade-in-up rounded-2xl p-5 sm:p-7 order-2 lg:order-1"
            style={{
              background: theme.panelBg,
              border: `1px solid ${theme.goldPrimary}18`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 ${theme.goldPrimary}10`,
              animationDelay: "0.15s",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: `${theme.goldPrimary}12`, border: `1px solid ${theme.goldPrimary}30` }}>
                <Type size={16} strokeWidth={2} style={{ color: theme.goldPrimary }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: theme.goldPrimary, fontSize: "1.15rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Customize Your Invitation
                </h2>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.5, fontSize: "0.85rem", marginTop: 1 }}>
                  Fill in the details to personalize your nikah card
                </p>
              </div>
            </div>

            <GoldDivider theme={theme} />

            <div className="space-y-4 mt-5">
              <InputField label="Custom Greeting (optional)" icon={Sparkles} value={formData.customGreeting} onChange={(v) => handleChange("customGreeting", v)} placeholder='e.g. "Assalam o Alikum Ahmed Bhai" — leave blank for default' theme={theme} />
              <InputField label="Dulha Name (Groom)" icon={Users} value={formData.dulhaName} onChange={(v) => handleChange("dulhaName", v)} placeholder="Enter groom's name" theme={theme} />
              <InputField label="Dulhan Name (Bride)" icon={Heart} value={formData.dulhanName} onChange={(v) => handleChange("dulhanName", v)} placeholder="Enter bride's name" theme={theme} />
              <InputField label="Dulhan's Father's Name" icon={Users} value={formData.dulhanFather} onChange={(v) => handleChange("dulhanFather", v)} placeholder="Enter father's name" theme={theme} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Nikah Date" icon={Calendar} value={formData.nikahDate} onChange={(v) => handleChange("nikahDate", v)} type="date" theme={theme} />
                <InputField label="Nikah Time" icon={Clock} value={formData.nikahTime} onChange={(v) => handleChange("nikahTime", v)} type="time" theme={theme} />
              </div>
              <InputField label="Venue" icon={MapPin} value={formData.venue} onChange={(v) => handleChange("venue", v)} placeholder="Enter venue location" theme={theme} />
            </div>

            <GoldDivider theme={theme} />

            <div className="mt-5">
              <ThemeSelector activeTheme={activeTheme} onSelect={setActiveTheme} theme={theme} />
            </div>

            <GoldDivider theme={theme} />

            {/* EXPORT BAR */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handlePreviewToggle}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `${theme.goldPrimary}10`,
                    border: `1.5px solid ${theme.goldPrimary}35`,
                    color: theme.goldPrimary,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Play size={16} fill={theme.goldPrimary} />
                  {isPreviewPlaying ? "Pause Preview" : "Play 30s Preview"}
                </button>
                <button
                  onClick={handlePreviewRestart}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    color: theme.textColor,
                    opacity: 0.7,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  title="Restart preview"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02] active:scale-[0.98] glow-pulse"
                style={{
                  background: `linear-gradient(135deg, ${theme.goldSecondary}, ${theme.goldPrimary}, ${theme.goldSecondary})`,
                  backgroundSize: "200% 200%",
                  border: "2px solid rgba(255,255,255,0.25)",
                  color: "#1a0a02",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  "--glow": theme.glowColor,
                  boxShadow: `0 6px 30px ${theme.glowColor}, 0 2px 10px rgba(0,0,0,0.3)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)",
                    backgroundSize: "200% 100%",
                    animation: "goldShimmer 2s ease-in-out infinite",
                  }}
                />
                <div className="sparkle-dot" style={{ top: -2, left: "15%", animationDelay: "0s" }} />
                <div className="sparkle-dot" style={{ top: -2, right: "20%", animationDelay: "0.4s" }} />
                <div className="sparkle-dot" style={{ bottom: -2, left: "25%", animationDelay: "0.8s" }} />
                <div className="sparkle-dot" style={{ bottom: -2, right: "12%", animationDelay: "1.2s" }} />

                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Rendering… {Math.round(exportState.progress * 100)}%</span>
                  </>
                ) : isExported ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Exported!</span>
                  </>
                ) : (
                  <>
                    <Film size={20} />
                    <span>Convert &amp; Download 30s Video</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `${theme.goldPrimary}10`,
                  border: `1.5px solid ${theme.goldPrimary}35`,
                  color: theme.goldPrimary,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  opacity: isProcessing ? 0.5 : 1,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                }}
              >
                <Download size={16} />
                Download HD (1080×1920 WebM)
              </button>

              {isExported && (
                <div className="text-center fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.25)" }}>
                    <CheckCircle2 size={14} style={{ color: "#4ADE80" }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4ADE80", fontSize: "0.85rem" }}>
                      30s video downloaded — share on WhatsApp / Instagram!
                    </span>
                  </div>
                </div>
              )}

              {exportError && (
                <div className="text-center fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F87171", fontSize: "0.85rem" }}>
                      {exportError}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ background: theme.goldPrimary, opacity: i === 2 ? 0.7 : 0.25 }} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="fade-in-up flex flex-col items-center order-1 lg:order-2" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80", boxShadow: "0 0 8px rgba(74,222,128,0.5)" }} />
              <span className="uppercase" style={{ fontFamily: "'Playfair Display', serif", color: theme.goldPrimary, opacity: 0.6, fontSize: "0.65rem", letterSpacing: "0.22em" }}>
                {isPreviewPlaying ? "Playing 30s Animation" : "Live Preview"}
              </span>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.goldPrimary, opacity: 0.5 }} />
            </div>

            <div
              className={!isPreviewPlaying ? "card-float" : ""}
              style={{
                transition: "all 0.5s ease",
                filter: isPreviewPlaying ? `drop-shadow(0 0 25px ${theme.glowColor})` : "none",
                width: "100%",
                maxWidth: 340,
              }}
            >
              {renderPreview({ data: formData, theme, themeName: activeTheme, isPlaying: isPreviewPlaying, onEnded: handlePreviewEnded })}
            </div>

            <div className="mt-3 text-center" style={{ fontFamily: "'Playfair Display', serif", color: theme.goldPrimary, opacity: 0.4, fontSize: "0.6rem", letterSpacing: "0.2em" }}>
              9 : 16 MOBILE · 1080 × 1920 · FULL-SCREEN READY
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 pb-6 text-center fade-in-up" style={{ animationDelay: "0.6s" }}>
          <GoldDivider theme={theme} />
          <div className="flex items-center justify-center gap-2 mt-3">
            <Moon size={13} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.35, transform: "rotate(-25deg)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.goldPrimary, opacity: 0.35, fontSize: "0.78rem", letterSpacing: "0.2em" }}>
              CRAFTED WITH LOVE &amp; BARAKAH
            </span>
            <Moon size={13} fill={theme.goldPrimary} style={{ color: theme.goldPrimary, opacity: 0.35, transform: "rotate(25deg)" }} />
          </div>
          <p className="mt-1.5" style={{ fontFamily: "'Cormorant Garamond', serif", color: theme.textColor, opacity: 0.25, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
            NOOR-E-NIKAH STUDIO © 2025 · ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>

      <ExportModal isOpen={isProcessing} progress={exportState.progress} frame={exportState.frame} theme={theme} />
    </div>
  );
}
