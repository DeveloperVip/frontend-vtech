'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, createScope } from 'animejs';

interface OrbBackgroundProps {
  intensity?: 'soft' | 'medium' | 'bold';
}

const cfgMap = {
  soft: {
    shiftX: 14,
    shiftY: 22,
    scalePeak: 1.06,
    haloDuration: 23000,
    nodeOpacityClass: 'opacity-90',
  },
  medium: {
    shiftX: 24,
    shiftY: 34,
    scalePeak: 1.12,
    haloDuration: 17000,
    nodeOpacityClass: 'opacity-100',
  },
  bold: {
    shiftX: 32,
    shiftY: 46,
    scalePeak: 1.18,
    haloDuration: 12000,
    nodeOpacityClass: 'opacity-100',
  },
} as const;

export default function OrbBackground({ intensity = 'medium' }: OrbBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cfg = useMemo(() => cfgMap[intensity], [intensity]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scope = createScope({ root }).add(() => {
      root.querySelectorAll<HTMLElement>('.orb-node').forEach((el, index) => {
        const phase = index % 2 === 0 ? 1 : -1;
        animate(el, {
          x: [0, phase * (cfg.shiftX + index * 4), 0],
          y: [0, phase * (cfg.shiftY + index * 5), 0],
          scale: [1, cfg.scalePeak, 1],
          ease: 'inOutSine',
          duration: 6200 + index * 900,
          loop: true,
        });
      });

      const halo = root.querySelector('.orb-halo');
      if (halo) {
        animate(halo, {
          rotate: [0, 360],
          ease: 'linear',
          duration: cfg.haloDuration,
          loop: true,
        });
      }
    });

    return () => scope.revert();
  }, [cfg]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.36),transparent_45%),radial-gradient(circle_at_75%_30%,rgba(189,224,255,0.34),transparent_42%),radial-gradient(circle_at_65%_75%,rgba(193,179,255,0.3),transparent_48%)]" />

      <div className="orb-halo absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="orb-halo absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/25" />

      <div className={`orb-node absolute left-[10%] top-[14%] h-48 w-48 rounded-full bg-cyan-200/45 blur-3xl ${cfg.nodeOpacityClass}`} />
      <div className={`orb-node absolute right-[12%] top-[14%] h-56 w-56 rounded-full bg-violet-200/42 blur-3xl ${cfg.nodeOpacityClass}`} />
      <div className={`orb-node absolute left-[34%] bottom-[2%] h-48 w-48 rounded-full bg-blue-100/44 blur-3xl ${cfg.nodeOpacityClass}`} />
      <div className={`orb-node absolute right-[24%] bottom-[6%] h-36 w-36 rounded-full bg-white/34 blur-2xl ${cfg.nodeOpacityClass}`} />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_40%,rgba(255,255,255,0.08))]" />
    </div>
  );
}
