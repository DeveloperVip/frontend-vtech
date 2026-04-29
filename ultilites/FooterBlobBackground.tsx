'use client';

import { useEffect, useRef } from 'react';

type FooterBlobBackgroundProps = {
  className?: string;
};

export default function FooterBlobBackground({ className = '' }: FooterBlobBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const blob = blobRef.current;
    const glow = glowRef.current;
    const aura = auraRef.current;
    const eventTarget = root?.parentElement;

    if (!root || !blob || !glow || !aura || !eventTarget) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isPointerInside = false;

    const setTransform = (x: number, y: number) => {
      blob.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      aura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const setInitialPosition = () => {
      const rect = eventTarget.getBoundingClientRect();
      currentX = rect.width * 0.72;
      currentY = rect.height * 0.28;
      targetX = currentX;
      targetY = currentY;
      setTransform(currentX, currentY);
    };

    const animateFrame = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      setTransform(currentX, currentY);
      rafRef.current = window.requestAnimationFrame(animateFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = eventTarget.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      if (!isPointerInside) {
        isPointerInside = true;
        root.style.setProperty('--footer-blob-opacity', '1');
      }
    };

    const handlePointerLeave = () => {
      const rect = eventTarget.getBoundingClientRect();
      targetX = rect.width * 0.82;
      targetY = rect.height * 0.2;
      isPointerInside = false;
      root.style.setProperty('--footer-blob-opacity', '0.92');
    };

    setInitialPosition();
    root.style.setProperty('--footer-blob-opacity', '0.92');
    rafRef.current = window.requestAnimationFrame(animateFrame);

    eventTarget.addEventListener('pointermove', handlePointerMove);
    eventTarget.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', setInitialPosition);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      eventTarget.removeEventListener('pointermove', handlePointerMove);
      eventTarget.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', setInitialPosition);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden [--footer-blob-opacity:0.92] ${className}`}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.48),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,236,210,0.18))]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.14),transparent_30%,transparent_66%,rgba(236,72,153,0.16))]" />

      <div
        ref={glowRef}
        className="absolute left-0 top-0 z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.42),rgba(251,146,60,0.28)_30%,rgba(236,72,153,0.24)_56%,rgba(168,85,247,0.2)_72%,transparent_82%)] blur-3xl transition-opacity duration-300"
        style={{ opacity: 'calc(var(--footer-blob-opacity) * 0.98)' }}
      />

      <div
        ref={auraRef}
        className="absolute left-0 top-0 z-20 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98),rgba(255,247,237,0.92)_14%,rgba(254,215,170,0.74)_34%,rgba(251,146,60,0.48)_58%,rgba(236,72,153,0.34)_76%,transparent_86%)] blur-2xl transition-opacity duration-300"
        style={{ opacity: 'calc(var(--footer-blob-opacity) * 0.92)' }}
      />

      <div
        ref={blobRef}
        className="absolute left-0 top-0 z-30 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_34%_34%,rgba(255,255,255,1),rgba(255,251,235,0.96)_8%,rgba(254,215,170,0.92)_20%,rgba(251,146,60,0.74)_44%,rgba(244,63,94,0.54)_66%,rgba(168,85,247,0.38)_78%,transparent_88%)] shadow-[0_0_160px_rgba(249,115,22,0.42)] mix-blend-multiply blur-[0.5px] transition-opacity duration-300"
        style={{ opacity: 'var(--footer-blob-opacity)' }}
      />

      <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.3),transparent_16%),radial-gradient(circle_at_78%_26%,rgba(255,237,213,0.2),transparent_14%),radial-gradient(circle_at_62%_78%,rgba(251,146,60,0.12),transparent_14%)] opacity-90" />
    </div>
  );
}
