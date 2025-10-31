import React, { useEffect, useMemo, useState } from 'react';

type Flake = {
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
};

// Lightweight, pointer-events-none floating snowflakes overlay
interface Props {
  position?: 'fixed' | 'absolute';
  zIndex?: number;
}

export default function Snowfall({ position = 'fixed', zIndex = 0 }: Props) {
  const getBaseCount = () => {
    if (typeof window === 'undefined') return 24;
    const w = window.innerWidth;
    if (w < 640) return 16; // phones (lighter)
    if (w < 1024) return 34; // tablets
    return 60; // desktop
  };

  const [count, setCount] = useState<number>(getBaseCount());
  const [paused, setPaused] = useState<boolean>(false);

  // Adapt density on resize and hardware capacity
  useEffect(() => {
    const apply = () => {
      let c = getBaseCount();
      const hc = (navigator as any).hardwareConcurrency || 4;
      if (hc <= 4) c = Math.round(c * 0.7);
      setCount(c);
    };
    apply();
    window.addEventListener('resize', apply, { passive: true });
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Pause when tab not visible
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const flakes = useMemo<Flake[]>(() => {
    const arr: Flake[] = [];
    const flakeCount = count;
    for (let i = 0; i < flakeCount; i++) {
      arr.push({
        left: `${Math.random() * 100}%`,
        size: Math.floor(8 + Math.random() * 10),
        duration: 14 + Math.random() * 18, // slower for smoother motion
        delay: Math.random() * 10,
        opacity: 0.55 + Math.random() * 0.3,
        drift: Math.random() * 48 - 24,
      });
    }
    return arr;
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-0 ${paused ? 'snow-paused' : ''}`}
      style={{
        zIndex,
      }}
    >
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: f.left as any,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            // Custom property used for horizontal drift
            // @ts-ignore
            '--drift': `${f.drift}px`,
          } as React.CSSProperties}
        >
          ❄
        </span>
      ))}
    </div>
  );
}


