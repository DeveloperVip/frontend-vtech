'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, createScope } from 'animejs';

interface ThreadsBackgroundProps {
  intensity?: 'soft' | 'medium' | 'bold';
}

const cfgMap = {
  soft: {
    shift: 18,
    lowOpacity: 0.14,
    highOpacity: 0.36,
    lineCount: 12,
    glowPeak: 0.3,
  },
  medium: {
    shift: 30,
    lowOpacity: 0.22,
    highOpacity: 0.58,
    lineCount: 18,
    glowPeak: 0.44,
  },
  bold: {
    shift: 46,
    lowOpacity: 0.3,
    highOpacity: 0.82,
    lineCount: 26,
    glowPeak: 0.65,
  },
} as const;

export default function ThreadsBackground({ intensity = 'medium' }: ThreadsBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cfg = useMemo(() => cfgMap[intensity], [intensity]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scope = createScope({ root }).add(() => {
      root.querySelectorAll<HTMLElement>('.thread-line').forEach((line, index) => {
        const duration = 5200 + index * 420;
        const phase = index % 2 === 0 ? 1 : -1;

        animate(line, {
          translateX: [phase * -cfg.shift, phase * cfg.shift, phase * -cfg.shift],
          opacity: [cfg.lowOpacity, cfg.highOpacity, cfg.lowOpacity],
          ease: 'inOutSine',
          duration,
          loop: true,
        });
      });

      const glow = root.querySelector('.threads-glow');
      if (glow) {
        animate(glow, {
          scale: [1, 1.08, 1],
          opacity: [cfg.lowOpacity + 0.06, cfg.glowPeak, cfg.lowOpacity + 0.06],
          ease: 'inOutQuad',
          duration: 5400,
          loop: true,
        });
      }
    });

    return () => scope.revert();
  }, [cfg]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="threads-glow absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(196,231,255,0.42),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(189,160,255,0.42),transparent_38%)]" />

      <div className="absolute inset-0 flex flex-col justify-center gap-4 px-[-10px]">
        {Array.from({ length: cfg.lineCount }).map((_, i) => (
          <span
            key={i}
            className="thread-line block h-[1.5px] w-[124%] -ml-[12%] bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12),transparent_45%,rgba(255,255,255,0.12))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_58%)]" />
    </div>
  );
}
