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
            description: "Start your AI/ML journey from scratch",
            icon: "🌱",
            color: "from-green-500 to-emerald-500",
            href: "/learn/beginner",
            modules: 5,
            duration: "2 hours"
        },
        {
            level: "Intermediate",
            description: "Deepen your understanding with advanced concepts",
            icon: "🚀",
            color: "from-blue-500 to-purple-500",
            href: "/learn/intermediate",
            modules: 6,
            duration: "3 hours"
        },
        {
            level: "Advanced",
            description: "Master complex AI/ML algorithms and techniques",
            icon: "🏆",
            color: "from-purple-500 to-pink-500",
            href: "/learn/advanced",
            modules: 8,
            duration: "4 hours"
        }
    ];

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Learning Paths
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Choose your level and start mastering AI/ML concepts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {levels.map((level, idx) => (
                            <motion.div
                                key={level.level}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={level.href}>
                                    <div className={`bg-gradient-to-br ${level.color} bg-opacity-10 rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                                        <div className="text-6xl mb-4">{level.icon}</div>
                                        <h2 className="text-2xl font-bold mb-2">{level.level}</h2>
                                        <p className="text-gray-200 mb-4">{level.description}</p>
                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div>📚 {level.modules} modules</div>
                                            <div>⏱️ {level.duration}</div>
                                        </div>
                                        <div className="mt-6 flex items-center text-white/80">
                                            <span>Start Learning →</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}