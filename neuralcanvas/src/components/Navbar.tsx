"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
    const { scrollY } = useScroll();

    const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.6]);
    const blur = useTransform(scrollY, [0, 200], [0, 10]);
    const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

    return (
        <motion.div
            style={{
                backdropFilter: `blur(${blur.get()}px)`,
                backgroundColor: `rgba(0,0,0,${bgOpacity.get()})`,
                scale,
            }}
            className="fixed top-0 left-0 w-full z-50 flex justify-center border-b border-white/10"
        >
            <div className="w-full max-w-6xl px-6 py-4 flex items-center justify-between">

                <h1 className="text-2xl md:text-3xl font-bold tracking-wide 
                       bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                       bg-clip-text text-transparent">
                    NeuralCanvas
                </h1>

                <div className="text-sm text-zinc-300 hover:text-white transition cursor-pointer">
                    Explore
                </div>

            </div>
        </motion.div>
    );
}