import EditorShell from "./EditorShell";
import CanvasPreview from "./CanvasPreview";

export default function Template2({ onBack }) {
  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
          style={{
            background: "rgba(43,5,11,0.8)",
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
        templateId={2}
        renderPreview={({ data, theme, themeName, isPlaying, onEnded }) => (
          <CanvasPreview data={data} theme={theme} themeName={themeName} templateId={2} isPlaying={isPlaying} onEnded={onEnded} />
        )}
      />
    </div>
  );
}
