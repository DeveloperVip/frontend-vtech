'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, createScope } from 'animejs';

interface RippleGridBackgroundProps {
  intensity?: 'soft' | 'medium' | 'bold';
}

const cfgMap = {
  soft: {
    startScale: 0.8,
    endScale: 1.22,
    ringOpacity: 0.5,
    ringDuration: 2500,
    gridOpacityClass: 'opacity-[0.22]',
  },
  medium: {
    startScale: 0.7,
    endScale: 1.36,
    ringOpacity: 0.68,
    ringDuration: 2000,
    gridOpacityClass: 'opacity-[0.34]',
  },
  bold: {
    startScale: 0.62,
    endScale: 1.52,
    ringOpacity: 0.82,
    ringDuration: 1600,
    gridOpacityClass: 'opacity-[0.42]',
  },
} as const;

export default function RippleGridBackground({ intensity = 'medium' }: RippleGridBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cfg = useMemo(() => cfgMap[intensity], [intensity]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scope = createScope({ root }).add(() => {
      root.querySelectorAll<HTMLElement>('.ripple-ring').forEach((ring, index) => {
        animate(ring, {
          scale: [cfg.startScale, cfg.endScale],
          opacity: [cfg.ringOpacity, 0],
          ease: 'outQuad',
          duration: cfg.ringDuration,
          delay: index * 420,
          loop: true,
        });
      });

      const grid = root.querySelector('.ripple-grid');
      if (grid) {
        animate(grid, {
          backgroundPosition: ['0px 0px', '0px 36px'],
          ease: 'linear',
          duration: 10000,
          loop: true,
        });
      }
    });

    return () => scope.revert();
  }, [cfg]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`ripple-grid absolute inset-0 ${cfg.gridOpacityClass}`}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.46) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.46) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="ripple-ring absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
        <span className="ripple-ring absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/62" />
        <span className="ripple-ring absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/52" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.34),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
    </div>
  );
}
