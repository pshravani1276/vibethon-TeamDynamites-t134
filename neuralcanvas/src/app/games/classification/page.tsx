// src/app/games/classification/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface DataPoint {
    x: number;
    y: number;
    label: "red" | "blue";
    predicted?: "red" | "blue";
}

interface LevelConfig {
    name: string;
    description: string;
    points: { x: number; y: number; label: "red" | "blue" }[];
    threshold: number;
}

export default function ClassificationChallenge() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<DataPoint[]>([]);
    const [decisionBoundary, setDecisionBoundary] = useState<number>(0.5);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [message, setMessage] = useState("");
    const [gameComplete, setGameComplete] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [accuracy, setAccuracy] = useState(0);

    // Level configurations
    const levels: Record<number, LevelConfig> = {
        1: {
            name: "Linear Separable",
            description: "Separate red and blue points with a vertical line",
            points: [
                { x: 0.2, y: 0.3, label: "red" },
                { x: 0.3, y: 0.5, label: "red" },
                { x: 0.25, y: 0.7, label: "red" },
                { x: 0.7, y: 0.4, label: "blue" },
                { x: 0.8, y: 0.6, label: "blue" },
                { x: 0.75, y: 0.2, label: "blue" },
            ],
            threshold: 0.5,
        },
        2: {
            name: "Diagonal Separation",
            description: "Separate points using a vertical line (simplified)",
            points: [
                { x: 0.2, y: 0.2, label: "red" },
                { x: 0.3, y: 0.3, label: "red" },
                { x: 0.25, y: 0.25, label: "red" },
                { x: 0.7, y: 0.8, label: "blue" },
                { x: 0.8, y: 0.7, label: "blue" },
                { x: 0.75, y: 0.85, label: "blue" },
                { x: 0.4, y: 0.6, label: "red" },
                { x: 0.6, y: 0.4, label: "blue" },
            ],
            threshold: 0.5,
        },
        3: {
            name: "Complex Boundary",
            description: "Create a non-linear boundary",
            points: [
                { x: 0.2, y: 0.2, label: "red" },
                { x: 0.3, y: 0.4, label: "red" },
                { x: 0.4, y: 0.3, label: "red" },
                { x: 0.6, y: 0.6, label: "blue" },
                { x: 0.7, y: 0.8, label: "blue" },
                { x: 0.8, y: 0.7, label: "blue" },
                { x: 0.5, y: 0.5, label: "blue" },
                { x: 0.35, y: 0.65, label: "red" },
                { x: 0.65, y: 0.35, label: "blue" },
            ],
            threshold: 0.5,
        },
    };

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

    useEffect(() => {
        loadLevel();
    }, [level]);

    useEffect(() => {
        drawCanvas();
        calculateAccuracy();
    }, [points, decisionBoundary]);

    const loadLevel = () => {
        const currentLevel = levels[level];
        if (currentLevel) {
            const typedPoints: DataPoint[] = currentLevel.points.map(p => ({
                x: p.x,
                y: p.y,
                label: p.label,
                predicted: undefined
            }));
            setPoints(typedPoints);
            setDecisionBoundary(currentLevel.threshold);
            setMessage(`Level ${level}: ${currentLevel.description}`);
        } else {
            setGameComplete(true);
            saveScore();
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, width, height);

        // Draw decision boundary
        ctx.beginPath();
        ctx.moveTo(decisionBoundary * width, 0);
        ctx.lineTo(decisionBoundary * width, height);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw points
        points.forEach(point => {
            const x = point.x * width;
            const y = point.y * height;

            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = point.label === "red" ? "#ef4444" : "#3b82f6";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // Draw prediction indicator
            if (point.predicted) {
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, Math.PI * 2);
                ctx.strokeStyle = point.predicted === point.label ? "#22c55e" : "#ef4444";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    };

    const calculateAccuracy = () => {
        if (points.length === 0) return;

        let correct = 0;
        points.forEach(point => {
            const predicted = point.x < decisionBoundary ? "red" : "blue";
            if (predicted === point.label) correct++;
        });

        const acc = (correct / points.length) * 100;
        setAccuracy(acc);

        if (acc === 100 && !gameComplete && level <= 3) {
            const pointsEarned = 100;
            setScore(prev => prev + pointsEarned);
            setMessage(`🎉 Perfect classification! +${pointsEarned} points! Moving to next level!`);
            setTimeout(() => {
                if (level < 3) {
                    setLevel(prev => prev + 1);
                } else {
                    setGameComplete(true);
                    saveScore();
                }
            }, 1500);
        }
    };

    const updateBoundary = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvas.width;
        const newBoundary = Math.max(0.1, Math.min(0.9, x));
        setDecisionBoundary(newBoundary);

        // Update predictions
        setPoints(prevPoints =>
            prevPoints.map(point => ({
                ...point,
                predicted: point.x < newBoundary ? "red" : "blue"
            }))
        );
    };

    const saveScore = async () => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "classification-challenge",
            score: score,
            level_completed: level,
            completed_at: new Date().toISOString()
        });
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setGameComplete(false);
        loadLevel();
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
                            <div className="text-6xl mb-4">🎯🏆</div>
                            <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
                            <p className="text-gray-300 mb-4">You've mastered classification!</p>
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

    const currentLevelData = levels[level];

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => router.push("/games")} className="mb-6 text-purple-400 hover:text-purple-300">
                        ← Back to Games
                    </button>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">🎯 Classification Challenge</h1>
                                <p className="text-gray-400">Level {level}/3: {currentLevelData?.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Accuracy: {Math.round(accuracy)}%</div>
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                            <p className="text-blue-300">{message || "Drag the white dashed line to separate red from blue dots!"}</p>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-sm text-gray-400 hover:text-white mt-2"
                            >
                                {showHint ? "Hide Hint" : "Show Hint"} 💡
                            </button>
                            {showHint && (
                                <p className="text-sm text-gray-300 mt-2">
                                    Move the vertical line to separate red dots from blue dots.
                                    Aim for 100% accuracy (all green rings) to advance to the next level!
                                </p>
                            )}
                        </div>

                        {/* Classification Canvas */}
                        <div className="flex justify-center mb-6">
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={400}
                                onMouseMove={updateBoundary}
                                onClick={updateBoundary}
                                className="border-2 border-gray-600 rounded-lg bg-gray-900 cursor-ew-resize"
                            />
                        </div>

                        {/* Instructions */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">📊 How Classification Works</h3>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500" />
                                    <span>Class A (Red)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                    <span>Class B (Blue)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-white border border-white border-dashed" />
                                    <span>Decision Boundary</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-green-500" />
                                    <span>Correctly Classified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-red-500" />
                                    <span>Misclassified</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-3">
                                Move the boundary line to separate the two classes. When all points have green rings (100% accuracy), you advance!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}