import EditorShell from "./EditorShell";
import CanvasPreview from "./CanvasPreview";

export default function Template5({ onBack }) {
  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
          style={{
            background: "rgba(26,15,61,0.85)",
            border: "1px solid rgba(255,215,0,0.3)",
            color: "#FFD700",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.85rem",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ← Templates
        </button>
      )}
      <EditorShell
        templateId={5}
        renderPreview={({ data, theme, themeName, isPlaying, onEnded }) => (
          <CanvasPreview data={data} theme={theme} themeName={themeName} templateId={5} isPlaying={isPlaying} onEnded={onEnded} />
        )}
      />
    </div>
  );
}
