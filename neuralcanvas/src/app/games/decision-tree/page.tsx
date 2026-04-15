// src/app/games/decision-tree/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface DataPoint {
    weight: number;
    texture: string;
    label: string;
}

export default function DecisionTreeGame() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [currentData, setCurrentData] = useState<DataPoint[]>([]);
    const [selectedSplit, setSelectedSplit] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [gameComplete, setGameComplete] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Training data for fruits
    const fruitsData: DataPoint[] = [
        { weight: 140, texture: "smooth", label: "apple" },
        { weight: 130, texture: "smooth", label: "apple" },
        { weight: 150, texture: "bumpy", label: "orange" },
        { weight: 170, texture: "bumpy", label: "orange" },
        { weight: 145, texture: "smooth", label: "apple" },
        { weight: 160, texture: "bumpy", label: "orange" },
        { weight: 135, texture: "smooth", label: "apple" },
        { weight: 155, texture: "bumpy", label: "orange" },
    ];

    const possibleSplits = [120, 130, 140, 150, 160, 170];

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
        loadLevel();
    }, [router, level]);

    const loadLevel = () => {
        if (level === 1) {
            setCurrentData(fruitsData.slice(0, 4));
            setMessage("Can you split the data to separate apples from oranges?");
        } else if (level === 2) {
            setCurrentData(fruitsData);
            setMessage("Now try with more data! Find the best weight threshold.");
        } else {
            setGameComplete(true);
            saveGameScore();
        }
    };

    const checkSplit = (threshold: number) => {
        const leftSide = currentData.filter(d => d.weight <= threshold);
        const rightSide = currentData.filter(d => d.weight > threshold);

        const leftApples = leftSide.filter(d => d.label === "apple").length;
        const leftOranges = leftSide.filter(d => d.label === "orange").length;
        const rightApples = rightSide.filter(d => d.label === "apple").length;
        const rightOranges = rightSide.filter(d => d.label === "orange").length;

        const isPure = (leftOranges === 0 || leftApples === 0) &&
            (rightOranges === 0 || rightApples === 0);

        if (isPure) {
            setScore(score + 100);
            setMessage("✅ Perfect! You found the perfect split!");
            setTimeout(() => {
                setLevel(level + 1);
                setSelectedSplit(null);
            }, 1500);
        } else {
            setMessage(`❌ Not quite. Left: ${leftApples} apples, ${leftOranges} oranges | Right: ${rightApples} apples, ${rightOranges} oranges. Try again!`);
        }
    };

    const saveGameScore = async () => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "decision-tree",
            score: score,
            level_completed: level - 1,
            completed_at: new Date().toISOString()
        });
    };

    if (gameComplete) {
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>

                <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl mx-4"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                            <div className="text-6xl mb-4">🌳✨</div>
                            <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
                            <p className="text-gray-300 mb-4">You&apos;ve mastered Decision Trees!</p>
                            <div className="text-4xl font-bold text-purple-400 mb-6">{score} Points</div>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setLevel(1);
                                        setScore(0);
                                        setGameComplete(false);
                                    }}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                                >
                                    Play Again
                                </button>
                                <button
                                    onClick={() => router.push("/games")}
                                    className="px-6 py-2 border border-gray-600 rounded-lg font-semibold hover:border-purple-400"
                                >
                                    Back to Games
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Decision Tree Builder
                            </h1>
                            <p className="text-gray-400">Learn to split data like a real ML algorithm!</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                            <div className="text-sm text-gray-400">Level {level}/3</div>
                        </div>
                    </div>

                    {/* Game Info */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <p className="text-blue-300">{message}</p>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-sm text-gray-400 hover:text-white mt-2"
                        >
                            {showHint ? "Hide Hint" : "Show Hint"} 💡
                        </button>
                        {showHint && (
                            <p className="text-sm text-gray-300 mt-2">
                                Hint: Apples are generally lighter and smooth, oranges are heavier and bumpy.
                                Try splitting around weight 145!
                            </p>
                        )}
                    </div>

                    {/* Data Points */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                        <h2 className="text-xl font-semibold mb-4">📊 Training Data</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {currentData.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg text-center ${item.label === "apple"
                                        ? "bg-red-500/20 border border-red-500/30"
                                        : "bg-orange-500/20 border border-orange-500/30"
                                        }`}
                                >
                                    <div className="text-2xl mb-1">
                                        {item.label === "apple" ? "🍎" : "🍊"}
                                    </div>
                                    <div className="text-sm">Weight: {item.weight}g</div>
                                    <div className="text-xs text-gray-400">Texture: {item.texture}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Split Threshold */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                        <h2 className="text-xl font-semibold mb-4">⚖️ Choose Split Threshold</h2>
                        <p className="text-gray-400 mb-4">
                            Select a weight value to split the data into left (≤ weight) and right (&gt; weight)
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {possibleSplits.map(threshold => (
                                <button
                                    key={threshold}
                                    onClick={() => {
                                        setSelectedSplit(threshold);
                                        checkSplit(threshold);
                                    }}
                                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg transition-all"
                                >
                                    ≤ {threshold}g
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Decision Tree Visualization */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h2 className="text-xl font-semibold mb-4">🌳 Your Decision Tree</h2>
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="text-center">
                                <div className="bg-purple-600/30 rounded-lg px-6 py-3 inline-block mb-4">
                                    Weight ≤ {selectedSplit || "?"}g
                                </div>
                                <div className="flex gap-20 justify-center">
                                    <div className="text-center">
                                        <div className="text-green-400">Yes</div>
                                        <div className="bg-green-600/20 rounded-lg px-4 py-2 mt-2">
                                            {selectedSplit ?
                                                currentData.filter(d => d.weight <= selectedSplit).length : 0
                                            } items
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-red-400">No</div>
                                        <div className="bg-red-600/20 rounded-lg px-4 py-2 mt-2">
                                            {selectedSplit ?
                                                currentData.filter(d => d.weight > selectedSplit).length : 0
                                            } items
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}