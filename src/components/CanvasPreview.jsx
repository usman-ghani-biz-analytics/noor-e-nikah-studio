import { useEffect, useRef, useState } from "react";
import useTimeline from "../lib/useTimeline";
import {
  loadCanvasFonts,
  loadTemplate2Assets,
  renderPreviewFrame,
  VIDEO_W,
  VIDEO_H,
} from "../lib/videoRenderer";

/**
 * Canvas-based preview — renders the EXACT same frames as the exported video
 * by calling the same renderPreviewFrame() draw functions on a canvas element.
 * This guarantees preview == downloaded video (pixel-identical layout/timing).
 */
export default function CanvasPreview({ data, theme, themeName, templateId, isPlaying, onEnded }) {
  const canvasRef = useRef(null);
  const assetsRef = useRef(null);
  const fontsLoadedRef = useRef(false);
  const elapsed = useTimeline(isPlaying, onEnded, 30);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadCanvasFonts();
      if (cancelled) return;
      fontsLoadedRef.current = true;
      if (templateId === 2) {
        assetsRef.current = await loadTemplate2Assets(themeName);
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [templateId, themeName]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      renderPreviewFrame(canvas, elapsed, data, theme, templateId, assetsRef.current);
    } catch (err) {
      console.error("Preview draw error:", err);
    }
  }, [elapsed, data, theme, templateId, ready]);

  const scene = elapsed < 5 ? 1 : elapsed < 15 ? 2 : elapsed < 25 ? 3 : 4;
  const sceneLabels = ["Opening", "Invitation", "Names", "Details & Closing"];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16", maxHeight: "72vh", borderRadius: "18px" }}>
      <canvas
        ref={canvasRef}
        width={VIDEO_W}
        height={VIDEO_H}
        className="w-full h-full block"
        style={{ display: "block", borderRadius: "18px" }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFD700", fontSize: "0.85rem" }}>Loading…</span>
        </div>
      )}
      {/* timeline scrubber */}
      <div className="absolute bottom-2 left-4 right-4 z-20">
        <div className="flex justify-between mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.6rem", color: "#FFD700", opacity: 0.7, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
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
