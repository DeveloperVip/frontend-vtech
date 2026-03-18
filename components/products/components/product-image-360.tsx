'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface Three360Props {
  images360: string[];
}

const ProductImage360: React.FC<Three360Props> = ({ images360 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const autoplayRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Preload all images to prevent flickering and ensure smooth rotation
  useEffect(() => {
    if (!images360 || images360.length === 0) return;

    // We preload them into browser cache simply by instantiating Image objects
    images360.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images360]);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;

    // Change frame every ~60ms (adjustable speed for auto-rotation)
    if (deltaTime > 100) {
      setCurrentFrame((prev) => (prev + 1) % images360.length);
      lastTimeRef.current = time;
    }

    if (isAutoPlaying && !isDragging) {
      autoplayRef.current = requestAnimationFrame(animate);
    }
  }, [images360.length, isAutoPlaying, isDragging]);

  useEffect(() => {
    if (isAutoPlaying && !isDragging && images360.length > 0) {
      autoplayRef.current = requestAnimationFrame(animate);
    } else {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
    }

    return () => {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
    };
  }, [isAutoPlaying, isDragging, animate, images360.length]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    startXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || images360.length === 0) return;

    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 5; // Drag sensitivity: lower means faster rotation per pixel dragged

    if (Math.abs(deltaX) > sensitivity) {
      const framesToMove = Math.floor(deltaX / sensitivity);
      setCurrentFrame((prev) => {
        let newFrame = (prev + framesToMove) % images360.length;
        if (newFrame < 0) newFrame += images360.length;
        return newFrame;
      });
      startXRef.current = e.clientX; // Reset start point for continuous smooth dragging
    }
  };

  // Resume autoplay after user is inactive for a while
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isDragging && !isAutoPlaying) {
      timeoutId = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 3000); // 3 seconds idle before autoplay resumes
    }
    return () => clearTimeout(timeoutId);
  }, [isDragging, isAutoPlaying]);

  if (!images360 || images360.length === 0) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500 text-sm font-medium">Không có ảnh 360°</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square md:aspect-[4/3] bg-transparent rounded-2xl flex items-center justify-center overflow-hidden touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } group`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        if (!isDragging) setIsAutoPlaying(true);
      }}
    >
      <img
        src={images360[currentFrame]}
        alt={`Product 360 view - frame ${currentFrame}`}
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl transition-opacity duration-75"
        draggable={false}
      />

      {/* Embedded Hint for interaction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white/90 px-4 py-2.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 pointer-events-none backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0">
        <MoveHorizontal className="w-4 h-4 animate-pulse" />
        Kéo để xoay 360°
      </div>
    </div>
  );
};

export default ProductImage360;