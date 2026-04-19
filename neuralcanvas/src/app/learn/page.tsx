// src/app/learn/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function LearnPage() {
    const levels = [
        {
            level: "Beginner",
            description: "Start your AI/ML journey from scratch. No prior experience needed!",
            icon: "🌱",
            href: "/learn/beginner",
            modules: 5,
            duration: "2 hours",
            color: "from-emerald-500/20 to-green-500/20",
            borderColor: "border-emerald-500/30",
            textColor: "text-emerald-400",
            badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        },
        {
            level: "Intermediate",
            description: "Deepen your understanding with advanced concepts and practical applications.",
            icon: "🚀",
            href: "/learn/intermediate",
            modules: 6,
            duration: "3 hours",
            color: "from-blue-500/20 to-purple-500/20",
            borderColor: "border-blue-500/30",
            textColor: "text-blue-400",
            badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
        },
        {
            level: "Advanced",
            description: "Master cutting-edge AI/ML techniques and become an expert practitioner.",
            icon: "🏆",
            href: "/learn/advanced",
            modules: 8,
            duration: "4 hours",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-500/30",
            textColor: "text-purple-400",
            badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
        }
    ];

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/50 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 pt-20 sm:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                            Learning Paths
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto">
                            Choose your level and start mastering AI/ML concepts with our structured curriculum
                        </p>
                    </div>

                    {/* Levels Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {levels.map((level, idx) => (
                            <motion.div
                                key={level.level}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={level.href}>
                                    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300" />

                                        <div className="relative z-10">
                                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{level.icon}</div>
                                            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 group-hover:${level.textColor} transition-colors`}>
                                                {level.level}
                                            </h2>
                                            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                                                {level.description}
                                            </p>

                                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">📚 Modules</span>
                                                    <span className="text-gray-300">{level.modules} modules</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">⏱️ Duration</span>
                                                    <span className="text-gray-300">{level.duration}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs px-3 py-1 rounded-full border ${level.badgeColor}`}>
                                                    Start Learning
                                                </span>
                                                <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
                                                    → Explore
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 sm:mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-full border border-white/10 flex-wrap justify-center">
                            <span className="text-sm text-gray-400">🎓</span>
                            <span className="text-sm text-gray-300">19 comprehensive modules</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-300">Earn points & badges</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-300">Track your progress</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}