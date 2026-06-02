import React, { useEffect, useRef } from "react";

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    hue: number;
    sat: number;
    lit: number;
    alpha: number;
    blur: number;
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

        const initBalls = (w: number, h: number) => {
            ballsRef.current = [];
            const footerBand = h * 0.32;
            const gap = Math.max(34, w / Math.max(count, 1));

            for (let i = 0; i < count; i++) {
                const r = 18 + Math.random() * 26;
                const hue = colors[i % colors.length];
                const baseX = gap * (i + 0.5);

                ballsRef.current.push({
                    x: Math.min(w - r, Math.max(r, baseX + (Math.random() - 0.5) * gap * 0.72)),
                    y: h - footerBand * (0.15 + Math.random() * 0.52) + Math.sin(i * 1.7) * 10,
                    vx: (Math.random() - 0.5) * 0.9,
                    vy: (Math.random() - 0.5) * 0.7,
                    r,
                    hue,
                    sat: 48 + Math.random() * 14,
                    lit: 74 + Math.random() * 8,
                    alpha: 0.44 + Math.random() * 0.18,
                    blur: Math.random() < 0.16 ? 5 + Math.random() * 6 : 0,
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

        const drawBall = (b: Ball) => {
            const { x, y, r, hue, sat, lit, alpha, blur } = b;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.filter = blur ? `blur(${blur}px)` : "none";
            ctx.shadowColor = `hsla(${hue}, ${sat}%, 48%, 0.24)`;
            ctx.shadowBlur = r * 0.62;
            ctx.shadowOffsetY = r * 0.2;

            const bodyGrad = ctx.createRadialGradient(
                x - r * 0.24, y - r * 0.34, r * 0.08,
                x + r * 0.12, y + r * 0.22, r * 1.14
            );
            bodyGrad.addColorStop(0, `hsla(${hue}, ${sat}%, 98%, 0.72)`);
            bodyGrad.addColorStop(0.45, `hsla(${hue}, ${sat}%, ${lit}%, 0.58)`);
            bodyGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit - 18}%, 0.5)`);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = Math.min(0.9, alpha * 1.55);
            const rimGrad = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
            rimGrad.addColorStop(0, "rgba(255,255,255,0.62)");
            rimGrad.addColorStop(0.55, "rgba(255,255,255,0.16)");
            rimGrad.addColorStop(1, `hsla(${hue}, ${sat}%, 50%, 0.34)`);
            ctx.lineWidth = Math.max(1.2, r * 0.045);
            ctx.strokeStyle = rimGrad;
            ctx.beginPath();
            ctx.arc(x, y, r - ctx.lineWidth, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = Math.min(0.55, alpha * 0.9);
            ctx.lineWidth = Math.max(1, r * 0.02);
            ctx.strokeStyle = "rgba(255,255,255,0.48)";
            ctx.beginPath();
            ctx.arc(x - r * 0.18, y - r * 0.22, r * 0.5, Math.PI * 1.05, Math.PI * 1.62);
            ctx.stroke();
            ctx.restore();
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
            const REPEL_R = 130;
            const GRAVITY = 0.035;
            const FRICTION = 0.988;
            const MAX_SPEED = 5.5;

            for (const b of ballsRef.current) {
                // Mouse repulsion
                const dx = b.x - mx, dy = b.y - my;
                const distSq = dx * dx + dy * dy;
                const repelRSq = REPEL_R * REPEL_R;
                if (distSq < repelRSq && distSq > 0) {
                    const md = Math.sqrt(distSq);
                    const f = ((REPEL_R - md) / REPEL_R) ** 1.8 * 1.6;
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

                const minY = h * 0.56;
                if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.64; }
                if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * 0.64; }
                if (b.y - b.r < minY) { b.y = minY + b.r; b.vy = Math.abs(b.vy) * 0.58; }
                if (b.y + b.r > h + b.r * 0.28) { b.y = h + b.r * 0.28 - b.r; b.vy = -Math.abs(b.vy) * 0.58; }
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
