// components/HeroCanvas.tsx (Simpler version without Three.js)
"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        // Create particles
        const particles: Array<{
            x: number;
            y: number;
            radius: number;
            angle: number;
            speed: number;
            color: string;
        }> = [];

        const particleCount = 100;
        const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.005,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Create geometric shapes
        let rotation = 0;

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            time += 0.01;
            rotation += 0.005;

            // Draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw animated particles
            particles.forEach(p => {
                p.x += Math.cos(p.angle + time) * p.speed * 2;
                p.y += Math.sin(p.angle + time * 0.5) * p.speed * 2;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Add glow effect
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}20`;
                ctx.fill();
            });

            // Draw animated geometric shapes in center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const size = Math.min(canvas.width, canvas.height) * 0.15;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            // Draw rotating hexagon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = "#6366f1";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "rgba(99, 102, 241, 0.1)";
            ctx.fill();

            // Draw inner rotating square
            ctx.rotate(rotation * 2);
            ctx.beginPath();
            const squareSize = size * 0.6;
            ctx.rect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
            ctx.strokeStyle = "#8b5cf6";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
            ctx.fill();

            // Draw connecting lines
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const angle = (i * Math.PI * 2) / 3 + rotation;
                const x = Math.cos(angle) * size * 1.2;
                const y = Math.sin(angle) * size * 1.2;
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 + Math.sin(time + i) * 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.restore();

            // Draw floating orbs
            for (let i = 0; i < 5; i++) {
                const angle = time * 0.5 + i;
                const radius = Math.min(canvas.width, canvas.height) * 0.25;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle * 0.7) * radius * 0.6;

                ctx.beginPath();
                ctx.arc(x, y, 50, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${0.05 + Math.sin(time + i) * 0.02})`;
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.8 }}
        />
    );
}