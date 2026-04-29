import React, { useEffect, useRef, useState } from "react";

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    hue: number;      // HSL hue for rich color
    sat: number;      // saturation
    lit: number;      // lightness
    mass: number;
}

interface BallpitFallbackProps {
    className?: string;
    count?: number;
    colors?: number[];  // array of hue degrees e.g. [215, 45, 200]
}

const DEFAULT_HUES = [215, 220, 45, 195, 42]; // blue-navy, blue, gold, sky, amber

export default function BallpitFallback({
    className = "",
    count = 80,
    colors = DEFAULT_HUES,
}: BallpitFallbackProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const ballsRef = useRef<Ball[]>([]);
    const sizeRef = useRef({ w: 0, h: 0 });
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = true;
        let isVisible = true;

        // Intersection Observer to stop animation when not in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(wrap);

        // ── Size detection: walk up DOM until we find a sized element ──────────
        const setSize = () => {
            let target: HTMLElement | null = wrap;
            let w = 0, h = 0;
            while (target) {
                w = target.clientWidth;
                h = target.clientHeight;
                if (w > 0 && h > 0) break;
                target = target.parentElement;
            }
            if (w === 0) w = window.innerWidth;
            if (h === 0) h = window.innerHeight;
            sizeRef.current = { w, h };
            canvas.width = w;
            canvas.height = h;
            if (ballsRef.current.length === 0) initBalls(w, h);
        };

        // ── Init balls distributed evenly across grid ──────────────────────────
        const initBalls = (w: number, h: number) => {
            ballsRef.current = [];
            const cols = Math.ceil(Math.sqrt(count * (w / h)));
            const rows = Math.ceil(count / cols);
            for (let i = 0; i < count; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const r = 18 + Math.random() * 30;
                const hue = colors[i % colors.length];
                ballsRef.current.push({
                    x: ((col + 0.5 + (Math.random() - 0.5) * 0.8) / cols) * w,
                    y: ((row + 0.5 + (Math.random() - 0.5) * 0.8) / rows) * h,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3 + 0.5,
                    r,
                    hue,
                    sat: 80 + Math.random() * 15,
                    lit: 45 + Math.random() * 15,
                    mass: r * r,
                });
            }
        };

        // ── Ball-to-ball elastic collision ─────────────────────────────────────
        const resolveCollisions = (balls: Ball[]) => {
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    const a = balls[i], b = balls[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = a.r + b.r;
                    if (distSq < minDist * minDist && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        // Separate overlapping balls
                        const overlap = (minDist - dist) / 2;
                        const nx = dx / dist, ny = dy / dist;
                        a.x -= nx * overlap;
                        a.y -= ny * overlap;
                        b.x += nx * overlap;
                        b.y += ny * overlap;

                        // Elastic velocity exchange
                        const dvx = a.vx - b.vx;
                        const dvy = a.vy - b.vy;
                        const dot = dvx * nx + dvy * ny;
                        if (dot > 0) {
                            const m1 = a.mass, m2 = b.mass;
                            const impulse = (2 * dot) / (m1 + m2);
                            const restitution = 0.82;
                            a.vx -= impulse * m2 * nx * restitution;
                            a.vy -= impulse * m2 * ny * restitution;
                            b.vx += impulse * m1 * nx * restitution;
                            b.vy += impulse * m1 * ny * restitution;
                        }
                    }
                }
            }
        };

        // ── Draw a single glossy 3D ball ───────────────────────────────────────
        const drawBall = (b: Ball) => {
            const { x, y, r, hue, sat, lit } = b;

            // Drop shadow
            ctx.save();
            ctx.shadowColor = `hsla(${hue}, ${sat}%, 20%, 0.35)`;
            ctx.shadowBlur = r * 0.8;
            ctx.shadowOffsetY = r * 0.3;

            // Main body gradient (bottom-right darker → top-left lighter)
            const bodyGrad = ctx.createRadialGradient(
                x - r * 0.25, y - r * 0.25, r * 0.05,
                x, y, r
            );
            bodyGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${lit + 28}%, 0.98)`);
            bodyGrad.addColorStop(0.5, `hsla(${hue}, ${sat}%, ${lit}%, 0.95)`);
            bodyGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit - 20}%, 0.90)`);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();
            ctx.restore();

            // Specular highlight (top-left white gloss)
            const specGrad = ctx.createRadialGradient(
                x - r * 0.32, y - r * 0.36, r * 0.02,
                x - r * 0.15, y - r * 0.15, r * 0.72
            );
            specGrad.addColorStop(0, "rgba(255,255,255,0.85)");
            specGrad.addColorStop(0.35, "rgba(255,255,255,0.25)");
            specGrad.addColorStop(1, "rgba(255,255,255,0)");

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            // Small secondary reflection spot (bottom-right)
            ctx.beginPath();
            ctx.arc(x + r * 0.3, y + r * 0.3, r * 0.18, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 60%, 90%, 0.2)`;
            ctx.fill();
        };

        // ── Main animation loop ────────────────────────────────────────────────
        const draw = () => {
            if (!running) return;
            if (!isVisible) {
                animRef.current = requestAnimationFrame(draw);
                return;
            }
            const { w, h } = sizeRef.current;
            if (w === 0 || h === 0) { animRef.current = requestAnimationFrame(draw); return; }

            ctx.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const REPEL_R = 160;
            const GRAVITY = 0.12;
            const FRICTION = 0.975;
            const MAX_SPEED = 14;

            for (const b of ballsRef.current) {
                // Mouse repulsion
                const dx = b.x - mx, dy = b.y - my;
                const distSq = dx * dx + dy * dy;
                const repelRSq = REPEL_R * REPEL_R;
                if (distSq < repelRSq && distSq > 0) {
                    const md = Math.sqrt(distSq);
                    const f = ((REPEL_R - md) / REPEL_R) ** 1.5 * 4.5;
                    b.vx += (dx / md) * f;
                    b.vy += (dy / md) * f;
                }

                // Gravity + friction
                b.vy += GRAVITY;
                b.vx *= FRICTION;
                b.vy *= FRICTION;

                // Speed cap
                const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                if (spd > MAX_SPEED) { b.vx = (b.vx / spd) * MAX_SPEED; b.vy = (b.vy / spd) * MAX_SPEED; }

                b.x += b.vx;
                b.y += b.vy;

                // Wall bounce with damping
                if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.78; }
                if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * 0.78; }
                if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.78; }
                if (b.y + b.r > h) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * 0.78; }
            }

            // Resolve ball collisions (skipped every other frame for perf)
            resolveCollisions(ballsRef.current);

            // Draw all balls
            for (const b of ballsRef.current) drawBall(b);

            animRef.current = requestAnimationFrame(draw);
        };

        setSize();
        draw();

        const ro = new ResizeObserver(setSize);
        ro.observe(document.body);

        // Mouse tracking — use window for broad coverage, translate to canvas coords
        const onMM = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onML = () => { mouseRef.current = { x: -9999, y: -9999 }; };
        window.addEventListener("mousemove", onMM);
        canvas.addEventListener("mouseleave", onML);

        return () => {
            running = false;
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
            observer.disconnect();
            window.removeEventListener("mousemove", onMM);
            canvas.removeEventListener("mouseleave", onML);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={wrapRef}
            className={className}
            style={{ position: "absolute", inset: 0, overflow: "hidden", willChange: "transform" }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: "block", position: "absolute", top: 0, left: 0 }}
            />
        </div>
    );
}
