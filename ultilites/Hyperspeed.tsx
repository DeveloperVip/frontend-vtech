"use client";
import React, { useEffect, useRef } from "react";

interface HyperspeedProps {
    color?: string;
    className?: string;
}

export default function Hyperspeed({
    color = "rgba(59, 130, 246, 0.4)",
    className = "",
}: HyperspeedProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let isVisible = true;

        // Stop animation when not visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        const lines: { x: number; y: number; z: number; speed: number; length: number }[] = [];
        const count = 100;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        // Initialize lines
        for (let i = 0; i < count; i++) {
            lines.push({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: Math.random(),
                speed: 0.001 + Math.random() * 0.002,
                length: 0.01 + Math.random() * 0.002,
            });
        }

        const draw = () => {
            if (!ctx || !canvas) return;
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;

            lines.forEach((line) => {
                // Move line closer
                line.z -= line.speed;
                if (line.z <= 0) {
                    line.z = 1;
                    line.x = (Math.random() - 0.5) * 2;
                    line.y = (Math.random() - 0.5) * 2;
                }

                // Project 3D coordinates to 2D
                const startScale = 1 / line.z;
                const endScale = 1 / (line.z + line.length);

                const x1 = centerX + line.x * startScale * centerX;
                const y1 = centerY + line.y * startScale * centerY;
                const x2 = centerX + line.x * endScale * centerX;
                const y2 = centerY + line.y * endScale * centerY;

                const opacity = (1 - line.z) * 0.8;
                ctx.globalAlpha = opacity;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, [color]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
            style={{ willChange: "transform" }}
        />
    );
}
