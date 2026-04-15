// src/app/games/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Game {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    href: string;
    bestScore?: number;
}

export default function GamesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [gameScores, setGameScores] = useState<{ [key: string]: number }>({});

    const games: Game[] = [
        {
            id: "decision-tree",
            title: "Decision Tree Builder",
            description: "Learn how decision trees work by building your own classification tree!",
            icon: "🌳",
            difficulty: "Beginner",
            href: "/games/decision-tree"
        },
        {
            id: "classification",
            title: "Classification Challenge",
            description: "Sort data points using different classification algorithms!",
            icon: "🎯",
            difficulty: "Beginner",
            href: "/games/classification"
        },
        {
            id: "neural-network",
            title: "Neural Network Visualizer",
            description: "Understand neural networks by adjusting weights and seeing activations!",
            icon: "🧠",
            difficulty: "Intermediate",
            href: "/games/neural-network"
        },
        {
            id: "pattern-recognition",
            title: "Pattern Recognition",
            description: "Train an AI to recognize patterns and make predictions!",
            icon: "🔍",
            difficulty: "Advanced",
            href: "/games/pattern-recognition"
        }
    ];

    useEffect(() => {
        const fetchUserAndScores = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            const { data: results } = await supabase
                .from("game_results")
                .select("game_type, score")
                .eq("user_id", currentUser.id);

            if (results) {
                const scores: { [key: string]: number } = {};
                results.forEach((result: any) => {
                    if (!scores[result.game_type] || result.score > scores[result.game_type]) {
                        scores[result.game_type] = result.score;
                    }
                });
                setGameScores(scores);
            }
        };

        fetchUserAndScores();
    }, [router]);

    const getDifficultyStyle = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Intermediate":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "Advanced":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/50 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Learn Through Play
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Interactive games that make complex AI/ML concepts fun and easy to understand
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">🎮</div>
                            <div className="text-2xl font-bold text-purple-400">{games.length}</div>
                            <div className="text-gray-400">Available Games</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">⭐</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {Object.keys(gameScores).length}
                            </div>
                            <div className="text-gray-400">Games Played</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">🏆</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {Object.values(gameScores).reduce((a, b) => a + b, 0)}
                            </div>
                            <div className="text-gray-400">Total Points</div>
                        </div>
                    </div>

                    {/* Games Grid - Clean, subtle cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {games.map((game, idx) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={game.href}>
                                    <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden">
                                        {/* Subtle gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300" />

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="text-5xl">{game.icon}</div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyStyle(game.difficulty)}`}>
                                                    {game.difficulty}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                                                {game.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                                {game.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {gameScores[game.id] && (
                                                    <span className="text-xs text-yellow-500/70">
                                                        Best: {gameScores[game.id]} pts
                                                    </span>
                                                )}
                                                <span className="text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
                                                    Play Now →
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