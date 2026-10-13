import { useEffect, useRef, useState } from "react";

export default function useTimeline(isPlaying, onEnded, duration = 30) {
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
      if (t >= duration) {
        setElapsed(duration);
        onEnded?.();
        return;
      }
      setElapsed(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, onEnded, duration]);

  return elapsed;
}
