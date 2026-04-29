'use client';

import { useEffect, useRef } from 'react';

interface PixelTrailBackgroundProps {
  pixelSize?: number;
  fadeMs?: number;
  density?: number;
}

export default function PixelTrailBackground({ pixelSize = 14, fadeMs = 820, density = 1 }: PixelTrailBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const queueRef = useRef<Array<{ x: number; y: number }>>([]);
  const previousCellRef = useRef<{ cx: number; cy: number } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const captureTarget = root.parentElement ?? root;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spawnPixel = (x: number, y: number) => {
      const pixel = document.createElement('span');
      pixel.className = 'absolute rounded-[3px] pointer-events-none pixel-trail-node';
      pixel.style.width = `${pixelSize}px`;
      pixel.style.height = `${pixelSize}px`;
      pixel.style.left = `${x - pixelSize / 2}px`;
      pixel.style.top = `${y - pixelSize / 2}px`;

      const palette = [
        'rgba(255,255,255,0.62)',
        'rgba(196,231,255,0.6)',
        'rgba(179,160,255,0.55)',
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];

      pixel.style.background = color;
      pixel.style.boxShadow = `0 0 18px ${color}`;
      pixel.style.opacity = '0.9';
      pixel.style.transform = 'scale(1)';
      pixel.style.transition = `opacity ${fadeMs}ms ease-out, transform ${fadeMs}ms ease-out`;

      root.appendChild(pixel);

      requestAnimationFrame(() => {
        pixel.style.opacity = '0';
        pixel.style.transform = 'scale(0.55)';
      });

      window.setTimeout(() => {
        pixel.remove();
      }, fadeMs + 80);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const cx = Math.floor(x / pixelSize);
      const cy = Math.floor(y / pixelSize);
      const previous = previousCellRef.current;

      if (!previous || previous.cx !== cx || previous.cy !== cy) {
        previousCellRef.current = { cx, cy };
        for (let i = 0; i < density; i += 1) {
          queueRef.current.push({
            x: x + (Math.random() - 0.5) * pixelSize * 0.7,
            y: y + (Math.random() - 0.5) * pixelSize * 0.7,
          });
        }
      }
    };

    const onLeave = () => {
      previousCellRef.current = null;
    };

    const loop = () => {
      const queued = queueRef.current;
      if (queued.length) {
        const batch = queued.splice(0, Math.min(4, queued.length));
        batch.forEach((point) => spawnPixel(point.x, point.y));
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    captureTarget.addEventListener('pointermove', onMove);
    captureTarget.addEventListener('pointerleave', onLeave);
    captureTarget.addEventListener('pointercancel', onLeave);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      captureTarget.removeEventListener('pointermove', onMove);
      captureTarget.removeEventListener('pointerleave', onLeave);
      captureTarget.removeEventListener('pointercancel', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, fadeMs, pixelSize]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.25))',
      }}
    />
  );
}
