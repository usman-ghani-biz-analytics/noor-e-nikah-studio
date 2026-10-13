import { useMemo } from "react";

export default function GoldParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 5 + 1.5,
        duration: Math.random() * 22 + 18,
        delay: Math.random() * 22,
        opacity: Math.random() * 0.45 + 0.25,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--p-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}
