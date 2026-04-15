// src/app/games/pattern-recognition/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Pattern {
    id: number;
    pattern: number[];
    rule: string;
    nextNumber: number;
}

export default function PatternRecognitionGame() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [gameComplete, setGameComplete] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [user, setUser] = useState<any>(null);

    const patterns: Pattern[] = [
        { id: 1, pattern: [2, 4, 6, 8], rule: "Add 2 each time", nextNumber: 10 },
        { id: 2, pattern: [3, 6, 9, 12], rule: "Add 3 each time", nextNumber: 15 },
        { id: 3, pattern: [1, 4, 9, 16], rule: "Square numbers (1², 2², 3², 4²)", nextNumber: 25 },
        { id: 4, pattern: [1, 1, 2, 3, 5], rule: "Fibonacci sequence (add previous two)", nextNumber: 8 },
        { id: 5, pattern: [64, 32, 16, 8], rule: "Divide by 2 each time", nextNumber: 4 },
        { id: 6, pattern: [1, 3, 6, 10], rule: "Add increasing numbers (+2, +3, +4)", nextNumber: 15 },
        { id: 7, pattern: [2, 5, 10, 17], rule: "Add increasing odd numbers (+3, +5, +7)", nextNumber: 26 },
        { id: 8, pattern: [1, 8, 27, 64], rule: "Cube numbers (1³, 2³, 3³, 4³)", nextNumber: 125 },
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
        loadPattern();
    }, [router, level]);

    const loadPattern = () => {
        if (level <= patterns.length) {
            setCurrentPattern(patterns[level - 1]);
            setUserAnswer("");
            setMessage("");
        } else {
            setGameComplete(true);
            saveScore();
        }
    };

    const checkAnswer = () => {
        if (!currentPattern) return;

        const answer = parseInt(userAnswer);
        if (isNaN(answer)) {
            setMessage("Please enter a number!");
            return;
        }

        if (answer === currentPattern.nextNumber) {
            const pointsEarned = 50 + (level * 10);
            setScore(score + pointsEarned);
            setMessage(`✅ Correct! ${currentPattern.rule}`);

            setTimeout(() => {
                setLevel(level + 1);
            }, 1500);
        } else {
            setMessage(`❌ Wrong! The correct answer was ${currentPattern.nextNumber}. ${currentPattern.rule}`);
        }
    };

    const saveScore = async () => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "pattern-recognition",
            score: score,
            level_completed: level - 1,
            completed_at: new Date().toISOString()
        });
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setGameComplete(false);
        loadPattern();
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
                            <div className="text-6xl mb-4">🔍✨</div>
                            <h2 className="text-3xl font-bold mb-4">Pattern Master!</h2>
                            <p className="text-gray-300 mb-4">You've recognized all patterns!</p>
                            <div className="text-4xl font-bold text-purple-400 mb-6">{score} Points</div>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={resetGame}
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

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => router.push("/games")} className="mb-6 text-purple-400 hover:text-purple-300">
                        ← Back to Games
                    </button>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">🔍 Pattern Recognition</h1>
                                <p className="text-gray-400">Level {level}/{patterns.length}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Next level: +{50 + (level * 10)} pts</div>
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                            <p className="text-blue-300">{message || "Find the pattern and predict the next number!"}</p>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-sm text-gray-400 hover:text-white mt-2"
                            >
                                {showHint ? "Hide Hint" : "Show Hint"} 💡
                            </button>
                        </div>

                        {/* Pattern Display */}
                        <div className="text-center mb-8">
                            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
                                <div className="text-sm text-gray-400 mb-4">Pattern Sequence</div>
                                <div className="flex justify-center gap-4 flex-wrap">
                                    {currentPattern?.pattern.map((num, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="w-16 h-16 bg-purple-600/30 rounded-xl flex items-center justify-center text-2xl font-bold"
                                        >
                                            {num}
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-16 h-16 bg-purple-600/50 rounded-xl flex items-center justify-center text-2xl font-bold border-2 border-purple-400 border-dashed"
                                    >
                                        ?
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Hint Display */}
                        {showHint && currentPattern && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                                <p className="text-yellow-400 text-sm">
                                    💡 Hint: {currentPattern.rule}
                                </p>
                            </div>
                        )}

                        {/* Answer Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">What is the next number?</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                                    className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white text-center text-xl"
                                    placeholder="Enter number"
                                />
                                <button
                                    onClick={checkAnswer}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* How it works */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">🧠 How Pattern Recognition Works</h3>
                            <p className="text-sm text-gray-300">
                                Pattern recognition is fundamental to AI and machine learning. Models learn patterns from data
                                to make predictions. Common patterns include arithmetic sequences, geometric progressions,
                                and mathematical functions like squares or cubes.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                                <div>• Arithmetic: +2, +3, +5...</div>
                                <div>• Geometric: ×2, ×3...</div>
                                <div>• Squares: 1², 2², 3²...</div>
                                <div>• Cubes: 1³, 2³, 3³...</div>
                                <div>• Fibonacci: add previous two</div>
                                <div>• Prime numbers</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}