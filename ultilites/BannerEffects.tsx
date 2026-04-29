'use client';

import { useEffect, useMemo, useRef } from 'react';
import { animate, createScope } from 'animejs';

interface BannerEffectsProps {
  variant?: 'light' | 'image';
  intensity?: 'soft' | 'medium' | 'bold';
}

const intensityMap = {
  soft: {
    driftDistance: 12,
    driftDuration: 7600,
    beamOpacity: '0.16,0.34,0.16',
    // gridOpacityClass: 'opacity-[0.10]',
    blobScale: 'scale-100',
  },
  medium: {
    driftDistance: 18,
    driftDuration: 6100,
    beamOpacity: '0.2,0.48,0.2',
    // gridOpacityClass: 'opacity-[0.16]',
    blobScale: 'scale-110',
  },
  bold: {
    driftDistance: 26,
    driftDuration: 4900,
    beamOpacity: '0.28,0.65,0.28',
    // gridOpacityClass: 'opacity-[0.22]',
    blobScale: 'scale-125',
  },
} as const;

export default function BannerEffects({ variant = 'light', intensity = 'soft' }: BannerEffectsProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cursorGlowRef = useRef<HTMLDivElement | null>(null);
  const cursorHaloRef = useRef<HTMLDivElement | null>(null);

  const cfg = useMemo(() => intensityMap[intensity], [intensity]);
  const gridOpacityClass = intensity === 'soft' ? 'opacity-[0.10]' : intensity === 'medium' ? 'opacity-[0.16]' : 'opacity-[0.22]';

  useEffect(() => {
    const root = rootRef.current;
    const cursorGlow = cursorGlowRef.current;
    const cursorHalo = cursorHaloRef.current;
    if (!root || !cursorGlow || !cursorHalo) return;

    const captureTarget = root.parentElement ?? root;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId: number | null = null;
    const trailQueue: Array<{ x: number; y: number }> = [];
    let previousCell: { cx: number; cy: number } | null = null;
    const trailCellSize = 26;
    const trailFadeMs = 820;

    const spawnTrailPixel = (x: number, y: number) => {
      const pixel = document.createElement('span');
      pixel.className = 'absolute pointer-events-none rounded-[4px]';
      pixel.style.width = `${trailCellSize}px`;
      pixel.style.height = `${trailCellSize}px`;
      pixel.style.left = `${x - trailCellSize / 2}px`;
      pixel.style.top = `${y - trailCellSize / 2}px`;

      const palette = [
        'rgba(255,255,255,0.82)',
        'rgba(196,231,255,0.78)',
        'rgba(187,160,255,0.74)',
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];

      pixel.style.background = color;
      pixel.style.boxShadow = `0 0 18px ${color}`;
      pixel.style.opacity = '0.95';
      pixel.style.zIndex = '35';
      pixel.style.transform = 'scale(1)';
      pixel.style.transition = `opacity ${trailFadeMs}ms ease-out, transform ${trailFadeMs}ms ease-out`;

      root.appendChild(pixel);

      window.requestAnimationFrame(() => {
        pixel.style.opacity = '0';
        pixel.style.transform = 'scale(0.5)';
      });

      window.setTimeout(() => {
        pixel.remove();
      }, trailFadeMs + 80);
    };

    const setTransform = (x: number, y: number) => {
      cursorGlow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      cursorHalo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const setInitialPosition = () => {
      const rect = captureTarget.getBoundingClientRect();
      currentX = rect.width * 0.5;
      currentY = rect.height * 0.5;
      targetX = currentX;
      targetY = currentY;
      setTransform(currentX, currentY);
    };

    const animateFrame = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setTransform(currentX, currentY);

      if (trailQueue.length) {
        const batch = trailQueue.splice(0, Math.min(5, trailQueue.length));
        batch.forEach((point) => spawnTrailPixel(point.x, point.y));
      }

      rafId = window.requestAnimationFrame(animateFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      targetX = x;
      targetY = y;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const cx = Math.floor(x / trailCellSize);
      const cy = Math.floor(y / trailCellSize);

      if (!previousCell || previousCell.cx !== cx || previousCell.cy !== cy) {
        previousCell = { cx, cy };
        trailQueue.push(
          { x: x + (Math.random() - 0.5) * trailCellSize * 0.7, y: y + (Math.random() - 0.5) * trailCellSize * 0.7 },
          { x: x + (Math.random() - 0.5) * trailCellSize * 0.7, y: y + (Math.random() - 0.5) * trailCellSize * 0.7 },
        );
      }
    };

    const handlePointerLeave = () => {
      const rect = captureTarget.getBoundingClientRect();
      targetX = rect.width * 0.5;
      targetY = rect.height * 0.5;
      previousCell = null;
    };

    setInitialPosition();
    rafId = window.requestAnimationFrame(animateFrame);

    const scope = createScope({ root }).add(() => {
      root.querySelectorAll<HTMLElement>('.rb-float').forEach((el, index) => {
        const phase = index % 2 === 0 ? 1 : -1;
        const duration = cfg.driftDuration + index * 520;

        animate(el, {
          y: [0, phase * cfg.driftDistance, 0],
          x: [0, phase * (cfg.driftDistance * 0.55), 0],
          rotate: [0, phase * 2.2, 0],
          ease: 'inOutSine',
          duration,
          loop: true,
        });
      });

      const beam = root.querySelector('.rb-beam');
      const beamSecondary = root.querySelector('.rb-beam-secondary');
      const grid = root.querySelector('.rb-grid');
      const sweep = root.querySelector('.rb-sweep');

      if (beam) {
        const [beamLow, beamHigh, beamEnd] = cfg.beamOpacity.split(',').map(Number);

        animate(beam, {
          scaleX: [0.75, 1.08, 0.75],
          opacity: [beamLow, beamHigh, beamEnd],
          ease: 'inOutQuad',
          duration: 4200,
          loop: true,
        });
      }

      if (beamSecondary) {
        animate(beamSecondary, {
          scaleX: [0.88, 1.2, 0.88],
          opacity: [0.06, 0.2, 0.06],
          ease: 'inOutSine',
          duration: 5100,
          loop: true,
        });
      }

      if (grid) {
        animate(grid, {
          backgroundPosition: ['0px 0px', '48px 22px'],
          ease: 'linear',
          duration: 13000,
          loop: true,
        });
      }

      if (sweep) {
        animate(sweep, {
          translateX: ['-120%', '120%'],
          opacity: [0, 0.2, 0],
          ease: 'inOutSine',
          duration: 5600,
          delay: 800,
          loop: true,
        });
      }
    });

    captureTarget.addEventListener('pointermove', handlePointerMove);
    captureTarget.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', setInitialPosition);

    return () => {
      scope.revert();
      captureTarget.removeEventListener('pointermove', handlePointerMove);
      captureTarget.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', setInitialPosition);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [cfg]);

  const baseOverlay =
    variant === 'image'
      ? 'from-black/18 via-transparent to-black/32'
      : 'from-white/8 via-transparent to-black/12';

  const radialOverlay =
    variant === 'image'
      ? 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_45%)]'
      : 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_45%)]';

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${baseOverlay}`} />

      <div
        className={`rb-grid absolute -inset-20 ${gridOpacityClass}`}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      <div className="rb-beam absolute top-[18%] left-1/2 h-[2px] w-[56%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/95 to-transparent blur-[1px]" />
      <div className="rb-beam-secondary absolute top-[26%] left-[42%] h-[1px] w-[36%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100 to-transparent blur-[1px]" />

      <div className={`rb-float absolute -top-12 -left-12 h-52 w-52 rounded-full bg-cyan-300/28 blur-3xl ${cfg.blobScale}`} />
      <div className={`rb-float absolute top-1/3 right-[8%] h-40 w-40 rounded-full bg-violet-300/30 blur-3xl ${cfg.blobScale}`} />
      <div className={`rb-float absolute -bottom-14 left-1/3 h-44 w-44 rounded-full bg-blue-200/24 blur-3xl ${cfg.blobScale}`} />

      <div className="rb-sweep absolute top-[32%] h-[42%] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-xl" />

      <div
        ref={cursorHaloRef}
        className="absolute left-0 top-0 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),rgba(255,255,255,0.12)_42%,transparent_74%)] blur-2xl"
      />
      <div
        ref={cursorGlowRef}
        className="absolute left-0 top-0 h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.52),rgba(196,231,255,0.34)_36%,transparent_74%)] blur-xl"
      />

      <div className={`absolute inset-0 ${radialOverlay}`} />
    </div>
  );
}
