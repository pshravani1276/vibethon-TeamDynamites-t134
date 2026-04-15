// src/components/AnimatedBackground.tsx
"use client";

import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
            {/* Particle Canvas Background - lowest layer */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <ParticleCanvas />
            </div>

            {/* Gradient Orbs - middle layer */}
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
                <motion.div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Grid Pattern - top layer */}
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:60px_60px]"
                style={{ zIndex: 3 }}
            />
        </div>
    );
}