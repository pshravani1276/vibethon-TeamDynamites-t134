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
    color: string;
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
            color: "from-green-500 to-emerald-500",
            href: "/games/decision-tree"
        },
        {
            id: "neural-network",
            title: "Neural Network Visualizer",
            description: "Understand neural networks by adjusting weights and seeing activations!",
            icon: "🧠",
            difficulty: "Intermediate",
            color: "from-purple-500 to-pink-500",
            href: "/games/neural-network"
        },
        {
            id: "classification",
            title: "Classification Challenge",
            description: "Sort data points using different classification algorithms!",
            icon: "🎯",
            difficulty: "Beginner",
            color: "from-blue-500 to-cyan-500",
            href: "/games/classification"
        },
        {
            id: "pattern-recognition",
            title: "Pattern Recognition",
            description: "Train an AI to recognize patterns and make predictions!",
            icon: "🔍",
            difficulty: "Advanced",
            color: "from-orange-500 to-red-500",
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

            // Fetch game results
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
                            <div className="text-gray-400">Games Completed</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">🏆</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {Object.values(gameScores).reduce((a, b) => a + b, 0)}
                            </div>
                            <div className="text-gray-400">Total Points</div>
                        </div>
                    </div>

                    {/* Games Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {games.map((game, idx) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={game.href}>
                                    <div className={`bg-gradient-to-br ${game.color} bg-opacity-10 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                                        <div className="text-6xl mb-4">{game.icon}</div>
                                        <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                                        <p className="text-gray-200 mb-4">{game.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-1 rounded-full ${game.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                                                    game.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/20 text-red-400"
                                                }`}>
                                                {game.difficulty}
                                            </span>
                                            {gameScores[game.id] && (
                                                <span className="text-sm text-yellow-400">
                                                    Best Score: {gameScores[game.id]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center text-sm text-white/70">
                                            <span>Play Now →</span>
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