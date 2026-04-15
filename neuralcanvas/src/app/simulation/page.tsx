// src/app/simulation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Simulation {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    color: string;
    href: string;
    points: number;
}

export default function simulationPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    const simulation: Simulation[] = [
        {
            id: "spam-detection",
            title: "Spam Detection",
            description: "Build a classifier to detect spam emails using Naive Bayes",
            icon: "📧",
            difficulty: "Beginner",
            color: "from-blue-500 to-cyan-500",
            href: "/simulation/spam-detection",
            points: 100
        },
        {
            id: "image-classification",
            title: "Image Classification",
            description: "Train a CNN to recognize handwritten digits",
            icon: "🖼️",
            difficulty: "Intermediate",
            color: "from-purple-500 to-pink-500",
            href: "/simulation/image-classification",
            points: 150
        },
        {
            id: "sentiment-analysis",
            title: "Sentiment Analysis",
            description: "Analyze movie reviews and predict sentiment",
            icon: "💬",
            difficulty: "Intermediate",
            color: "from-green-500 to-emerald-500",
            href: "/simulation/sentiment-analysis",
            points: 150
        },
        {
            id: "price-predictor",
            title: "Housing Price Predictor",
            description: "Use regression to predict house prices based on features",
            icon: "🏠",
            difficulty: "Beginner",
            color: "from-orange-500 to-red-500",
            href: "/simulation/price-predictor",
            points: 100
        }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
        };
        fetchUser();
    }, [router]);

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
                            Real-World simulation
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Apply AI/ML concepts to solve practical real-world problems
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {simulation.map((sim, idx) => (
                            <motion.div
                                key={sim.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={sim.href}>
                                    <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full overflow-hidden">
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300" />

                                        <div className="relative z-10">
                                            <div className="text-5xl mb-4">{sim.icon}</div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{sim.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{sim.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs px-2 py-1 rounded-full ${sim.difficulty === "Beginner" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" :
                                                    "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                                    }`}>
                                                    {sim.difficulty}
                                                </span>
                                                <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
                                                    Try Simulation →
                                                </span>
                                            </div>
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