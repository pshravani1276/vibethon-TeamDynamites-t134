// components/ScrollSection.tsx
"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Link from "next/link";

interface SectionProps {
    scrollY: MotionValue<number>;
    start: number;
    end: number;
    title: string;
    desc: string;
    features?: string[];
    stats?: { label: string; value: string }[];
    badges?: string[];
    demoCode?: string;
    cta?: {
        primary?: { text: string; href: string };
        secondary?: { text: string; href: string };
    };
    footer?: boolean;
    isHero?: boolean;
}

export default function Section({
    scrollY,
    start,
    end,
    title,
    desc,
    features,
    stats,
    badges,
    demoCode,
    cta,
    footer = false,
    isHero = false,
}: SectionProps) {
    const opacity = useTransform(scrollY, [start, start + 100], [0, 1]);
    const y = useTransform(scrollY, [start, start + 100], [50, 0]);

    const titleSize = isHero ? "text-5xl md:text-7xl lg:text-8xl" : "text-4xl md:text-6xl lg:text-7xl";
    const descSize = isHero ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl lg:text-2xl";

    return (
        <motion.section
            style={{ opacity, y }}
            className={`relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-20 ${isHero ? "pt-32 md:pt-40" : ""
                }`}
        >
            <div className="max-w-6xl w-full mx-auto">

                {/* Title */}
                <h2 className={`${titleSize} font-bold text-center mb-6`}>
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {title}
                    </span>
                </h2>

                {/* Description */}
                <p className={`${descSize} text-gray-200 text-center mb-12 max-w-4xl mx-auto leading-relaxed`}>
                    {desc}
                </p>

                {/* Features Grid */}
                {features && features.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3 text-gray-100 text-base md:text-lg"
                            >
                                <span className="text-green-400 text-2xl">✓</span>
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {stats && stats.length > 0 && (
                    <div className="flex justify-center gap-8 md:gap-12 mb-12 flex-wrap">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm md:text-base mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Badges */}
                {badges && badges.length > 0 && (
                    <div className="flex justify-center gap-3 mb-12 flex-wrap">
                        {badges.map((badge, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm md:text-base text-purple-300 border border-purple-500/20 font-medium"
                            >
                                {badge}
                            </motion.span>
                        ))}
                    </div>
                )}

                {/* Demo Code - Clean version with no background, just border */}
                {demoCode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 flex justify-center"
                    >
                        <div className="w-full max-w-3xl">
                            {/* Code editor header */}
                            <div className="flex items-center gap-2 px-4 py-2 border border-gray-700 border-b-0 rounded-t-xl bg-transparent">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-gray-400 text-sm">playground.py</span>
                                <span className="ml-auto text-xs text-gray-500">Python 3.12</span>
                            </div>

                            {/* Code content - no background, just border */}
                            <div className="border border-gray-700 rounded-b-xl overflow-hidden">
                                <pre className="p-6 text-sm text-emerald-400 overflow-x-auto font-mono bg-transparent">
                                    <code>{demoCode}</code>
                                </pre>
                            </div>

                            {/* Run button */}
                            <div className="flex justify-center mt-4">
                                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-white transition-all duration-300 text-sm">
                                    ▶ Run Code
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CTAs */}
                {cta && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center gap-4 flex-wrap"
                    >
                        {cta.primary && (
                            <Link
                                href={cta.primary.href}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-base md:text-lg"
                            >
                                {cta.primary.text}
                            </Link>
                        )}
                        {cta.secondary && (
                            <Link
                                href={cta.secondary.href}
                                className="px-8 py-3 border-2 border-gray-500 hover:border-purple-400 rounded-full font-semibold text-gray-200 hover:text-purple-400 transition-all duration-300 text-base md:text-lg"
                            >
                                {cta.secondary.text}
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* Footer */}
                {footer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center text-gray-500 text-sm"
                    >
                        <p>VIBETHON 2024 — Built with Next.js, Three.js & Framer Motion</p>
                        <p className="mt-2">
                            <Link href="https://github.com" className="hover:text-purple-400 transition-colors">
                                📦 View on GitHub →
                            </Link>
                        </p>
                    </motion.div>
                )}

            </div>
        </motion.section>
    );
}