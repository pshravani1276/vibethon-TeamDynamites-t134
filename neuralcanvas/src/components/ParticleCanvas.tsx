// src/components/ParticleCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();

        const PARTICLE_COUNT = 120;
        const MAX_DISTANCE = 200;
        const COLORS = [
            "59,130,246", // blue
            "139,92,246", // purple
            "236,72,153", // pink
            "16,185,129", // emerald
        ];

        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 3 + 1.5,
            opacity: Math.random() * 0.6 + 0.3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }));

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
                ctx.fill();

                // Draw connections
                particles.forEach(q => {
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MAX_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        const opacity = (1 - dist / MAX_DISTANCE) * 0.2;
                        ctx.strokeStyle = `rgba(${p.color},${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
                opacity: 0.8,
                zIndex: 1,
                pointerEvents: 'none'
            }}
        />
    );
}