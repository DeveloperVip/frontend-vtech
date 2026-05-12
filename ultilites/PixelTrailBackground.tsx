'use client';

import { useEffect, useRef, useCallback } from 'react';

interface PixelTrailBackgroundProps {
  pixelSize?: number;
  fadeMs?: number;
  density?: number;
}

/**
 * Lightweight pixel trail effect using CSS transforms + opacity transitions.
 * Uses a pool of reusable DOM nodes to avoid constant createElement/remove churn.
 */
export default function PixelTrailBackground({ pixelSize = 14, fadeMs = 820, density = 1 }: PixelTrailBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; opacity: number; scale: number; color: string; born: number }>>([]);
  const previousCellRef = useRef<{ cx: number; cy: number } | null>(null);

  const palette = useRef([
    'rgba(255,255,255,0.55)',
    'rgba(196,231,255,0.50)',
    'rgba(179,160,255,0.45)',
  ]).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const captureTarget = canvas.parentElement ?? canvas;

    const resize = () => {
      const rect = captureTarget.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const cx = Math.floor(x / pixelSize);
      const cy = Math.floor(y / pixelSize);
      const previous = previousCellRef.current;

      if (!previous || previous.cx !== cx || previous.cy !== cy) {
        previousCellRef.current = { cx, cy };
        for (let i = 0; i < density; i += 1) {
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * pixelSize * 0.7,
            y: y + (Math.random() - 0.5) * pixelSize * 0.7,
            opacity: 0.85,
            scale: 1,
            color: palette[Math.floor(Math.random() * palette.length)],
            born: performance.now(),
          });
        }
      }
    };

    const onLeave = () => {
      previousCellRef.current = null;
    };

    let lastFrame = performance.now();
    const loop = (now: number) => {
      const dt = now - lastFrame;
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const fadeRate = 1 / fadeMs;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.born;
        const t = Math.min(age * fadeRate, 1);

        p.opacity = 0.85 * (1 - t);
        p.scale = 1 - 0.45 * t;

        if (p.opacity <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        const half = (pixelSize * p.scale) / 2;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(p.x - half, p.y - half, pixelSize * p.scale, pixelSize * p.scale, 3);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
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
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, fadeMs, pixelSize, palette]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.25))',
      }}
    />
  );
}
