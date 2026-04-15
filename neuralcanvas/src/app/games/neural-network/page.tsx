// src/app/games/neural-network/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

export default function NeuralNetworkGame() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [weights, setWeights] = useState([0.5, 0.5, 0.5]);
    const [bias, setBias] = useState(0);
    const [output, setOutput] = useState(0);
    const [message, setMessage] = useState("");
    const [gameComplete, setGameComplete] = useState(false);
    const [level, setLevel] = useState(1);
    const [user, setUser] = useState<any>(null);

    // Training examples
    const trainingData = [
        { inputs: [1, 0, 0], target: 0, description: "Not hot" },
        { inputs: [0, 1, 0], target: 0, description: "Not hot" },
        { inputs: [0, 0, 1], target: 0, description: "Not hot" },
        { inputs: [1, 1, 0], target: 1, description: "Hot!" },
        { inputs: [1, 0, 1], target: 1, description: "Hot!" },
        { inputs: [0, 1, 1], target: 1, description: "Hot!" },
        { inputs: [1, 1, 1], target: 1, description: "Hot!" },
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

    const calculateOutput = (inputs: number[]) => {
        let sum = bias;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * inputs[i];
        }
        // Sigmoid activation
        return 1 / (1 + Math.exp(-sum));
    };

    const updateOutput = () => {
        const example = trainingData[level - 1];
        if (example) {
            const out = calculateOutput(example.inputs);
            setOutput(out);

            const isCorrect = (out > 0.5 && example.target === 1) || (out <= 0.5 && example.target === 0);

            if (isCorrect) {
                setMessage("✅ Correct! The neuron fired correctly!");
            } else {
                setMessage(`❌ Wrong! Output was ${out.toFixed(2)} but expected ${example.target}`);
            }
        }
    };

    const adjustWeights = () => {
        const example = trainingData[level - 1];
        const currentOutput = calculateOutput(example.inputs);
        const error = example.target - currentOutput;

        // Update weights using simple learning rule
        const newWeights = [...weights];
        for (let i = 0; i < weights.length; i++) {
            newWeights[i] += error * example.inputs[i] * 0.5;
            newWeights[i] = Math.max(0, Math.min(1, newWeights[i]));
        }
        setWeights(newWeights);

        const newBias = bias + error * 0.5;
        setBias(newBias);

        setMessage(`Adjusted weights! Error was ${error.toFixed(3)}`);
        updateOutput();
    };

    const checkAnswer = () => {
        const example = trainingData[level - 1];
        const isCorrect = (output > 0.5 && example.target === 1) || (output <= 0.5 && example.target === 0);

        if (isCorrect) {
            const newScore = score + 100;
            setScore(newScore);

            if (level < trainingData.length) {
                setMessage("🎉 Correct! Moving to next example!");
                setLevel(level + 1);
                setWeights([0.5, 0.5, 0.5]);
                setBias(0);
                setOutput(0);
            } else {
                setGameComplete(true);
                saveGameScore(newScore);
            }
        } else {
            setMessage("❌ Try adjusting the weights first!");
        }
    };

    const saveGameScore = async (finalScore: number) => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "neural-network",
            score: finalScore,
            level_completed: level,
            completed_at: new Date().toISOString()
        });
    };

    const currentExample = trainingData[level - 1];

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
                            <div className="text-6xl mb-4">🧠✨</div>
                            <h2 className="text-3xl font-bold mb-4">Neural Network Trained!</h2>
                            <p className="text-gray-300 mb-4">You&apos;ve successfully trained a neuron!</p>
                            <div className="text-4xl font-bold text-purple-400 mb-6">{score} Points</div>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setLevel(1);
                                        setScore(0);
                                        setWeights([0.5, 0.5, 0.5]);
                                        setBias(0);
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
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Neural Network Visualizer
                            </h1>
                            <p className="text-gray-400">Adjust weights to train a single neuron!</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                            <div className="text-sm text-gray-400">Example {level}/{trainingData.length}</div>
                        </div>
                    </div>

                    {/* Current Example */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <p className="text-blue-300">{message || "Adjust weights to make the neuron fire correctly!"}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4">📥 Inputs</h2>
                            <div className="space-y-3">
                                {currentExample.inputs.map((input, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-20 text-gray-400">Input {idx + 1}</div>
                                        <div className={`flex-1 h-12 rounded-lg flex items-center justify-center ${input === 1 ? "bg-green-500/30 border border-green-500" : "bg-gray-700/50"
                                            }`}>
                                            {input === 1 ? "🔴 ACTIVE" : "⚪ Inactive"}
                                        </div>
                                        <div className="w-16 text-right">
                                            × {weights[idx].toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-700">
                                    <div className="w-20 text-gray-400">Bias</div>
                                    <div className="flex-1"></div>
                                    <div className="w-16 text-right">+ {bias.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Neuron Visualization */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4">🧠 Neuron</h2>
                            <div className="flex flex-col items-center">
                                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                                    <div className="text-center">
                                        <div className="text-3xl">🧠</div>
                                        <div className="text-sm mt-2">Activation</div>
                                        <div className="text-xl font-bold">{output.toFixed(3)}</div>
                                    </div>
                                </div>
                                <div className={`text-lg font-semibold ${output > 0.5 ? "text-green-400" : "text-red-400"
                                    }`}>
                                    {output > 0.5 ? "🔥 FIRING!" : "💤 Inactive"}
                                </div>
                                <div className="text-sm text-gray-400 mt-2">
                                    Target: {currentExample.target === 1 ? "🔥 FIRE" : "💤 Don&apos;t fire"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {currentExample.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
                        {weights.map((weight, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-3">
                                <label className="text-sm text-gray-400">Weight {idx + 1}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={weight}
                                    onChange={(e) => {
                                        const newWeights = [...weights];
                                        newWeights[idx] = parseFloat(e.target.value);
                                        setWeights(newWeights);
                                        updateOutput();
                                    }}
                                    className="w-full mt-2"
                                />
                                <div className="text-center mt-1 text-sm">{weight.toFixed(2)}</div>
                            </div>
                        ))}
                        <div className="bg-white/5 rounded-lg p-3">
                            <label className="text-sm text-gray-400">Bias</label>
                            <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.01"
                                value={bias}
                                onChange={(e) => {
                                    setBias(parseFloat(e.target.value));
                                    updateOutput();
                                }}
                                className="w-full mt-2"
                            />
                            <div className="text-center mt-1 text-sm">{bias.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={adjustWeights}
                            className="flex-1 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg font-semibold transition-all"
                        >
                            🎯 Auto-Adjust Weights
                        </button>
                        <button
                            onClick={checkAnswer}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
                        >
                            ✅ Check Answer
                        </button>
                    </div>

                    {/* Explanation */}
                    <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-gray-300">
                            💡 <strong>How it works:</strong> This neuron takes 3 inputs, multiplies each by a weight,
                            adds them together with a bias, then applies an activation function (sigmoid).
                            For the neuron to &quot;fire&quot; (output &gt; 0.5), the weighted sum needs to be high enough.
                            Try adjusting weights to make the neuron fire only when the pattern is &quot;hot&quot;!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}