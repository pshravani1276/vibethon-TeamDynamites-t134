"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let currentFrame = 0;
        const totalFrames = 120;
        const images: HTMLImageElement[] = [];

        let loadedImages = 0;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalFrames) {
                    renderFrame(0);
                }
            };

            images.push(img);
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const renderFrame = (index: number) => {
            if (!images[index]) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
        };

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const maxScroll =
                document.body.scrollHeight - window.innerHeight;

            const scrollFraction = scrollTop / maxScroll;
            const targetFrame = Math.floor(scrollFraction * totalFrames);

            currentFrame += (targetFrame - currentFrame) * 0.1;

            renderFrame(Math.floor(currentFrame));
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full"
        />
    );
}