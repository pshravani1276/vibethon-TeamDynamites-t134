"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const DecisionTreeDemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDataset, setSelectedDataset] = useState("moon");
    const [maxDepth, setMaxDepth] = useState(3);
    const [minSamplesSplit, setMinSamplesSplit] = useState(2);
    const [predictions, setPredictions] = useState<number[]>([]);
    const [accuracy, setAccuracy] = useState(0);

    // Sample datasets
    const datasets = {
        moon: {
            name: "Moon Shapes",
            data: [
                { x: 1, y: 2, label: 0 }, { x: 2, y: 3, label: 0 }, { x: 3, y: 2, label: 0 },
                { x: 4, y: 5, label: 1 }, { x: 5, y: 6, label: 1 }, { x: 6, y: 5, label: 1 },
                { x: 2, y: 6, label: 0 }, { x: 3, y: 7, label: 0 }, { x: 5, y: 3, label: 1 },
                { x: 6, y: 2, label: 1 }, { x: 1, y: 7, label: 0 }, { x: 7, y: 4, label: 1 },
            ]
        },
        circles: {
            name: "Concentric Circles",
            data: [
                { x: 3, y: 3, label: 0 }, { x: 4, y: 4, label: 0 }, { x: 2, y: 2, label: 0 },
                { x: 5, y: 5, label: 1 }, { x: 6, y: 6, label: 1 }, { x: 4, y: 6, label: 1 },
                { x: 2, y: 5, label: 0 }, { x: 5, y: 2, label: 0 }, { x: 7, y: 3, label: 1 },
                { x: 3, y: 7, label: 1 }, { x: 1, y: 4, label: 0 }, { x: 8, y: 5, label: 1 },
            ]
        },
        xor: {
            name: "XOR Pattern",
            data: [
                { x: 2, y: 2, label: 0 }, { x: 7, y: 7, label: 0 }, { x: 2, y: 7, label: 1 },
                { x: 7, y: 2, label: 1 }, { x: 3, y: 3, label: 0 }, { x: 6, y: 6, label: 0 },
                { x: 3, y: 6, label: 1 }, { x: 6, y: 3, label: 1 }, { x: 4, y: 4, label: 0 },
                { x: 5, y: 5, label: 0 }, { x: 4, y: 5, label: 1 }, { x: 5, y: 4, label: 1 },
            ]
        }
    };

    const currentData = datasets[selectedDataset as keyof typeof datasets].data;

    // Simulate decision tree prediction
    useEffect(() => {
        // Simple decision tree simulation based on boundaries
        const newPredictions = currentData.map(point => {
            // Simulate tree splits based on depth and parameters
            let prediction = 0;

            if (maxDepth >= 1) {
                // First split based on x coordinate
                if (selectedDataset === "moon") {
                    const boundary = point.x + point.y > 8 ? 1 : 0;
                    prediction = boundary;
                } else if (selectedDataset === "circles") {
                    const distance = Math.sqrt(Math.pow(point.x - 4.5, 2) + Math.pow(point.y - 4.5, 2));
                    prediction = distance > 3 ? 1 : 0;
                } else {
                    prediction = (point.x > 4.5) !== (point.y > 4.5) ? 1 : 0;
                }
            }

            return prediction;
        });

        setPredictions(newPredictions);

        // Calculate accuracy
        const correct = newPredictions.filter((pred, i) => pred === currentData[i].label).length;
        setAccuracy((correct / currentData.length) * 100);
    }, [selectedDataset, maxDepth, minSamplesSplit, currentData]);

    // Canvas rendering
    useEffect(() => {
        const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * (width - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();

            const y = padding + (i / 10) * (height - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw decision boundaries
        if (selectedDataset === "moon") {
            ctx.beginPath();
            const x1 = padding;
            const y1 = height - padding - ((8 - 1) / 8) * (height - 2 * padding);
            const x2 = width - padding;
            const y2 = height - padding - ((8 - 10) / 8) * (height - 2 * padding);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (selectedDataset === "circles") {
            ctx.beginPath();
            const centerX = padding + (4.5 / 10) * (width - 2 * padding);
            const centerY = height - padding - (4.5 / 10) * (height - 2 * padding);
            const radius = (3 / 10) * Math.min(width - 2 * padding, height - 2 * padding);
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            // XOR boundaries
            const midX = padding + (4.5 / 10) * (width - 2 * padding);
            const midY = height - padding - (4.5 / 10) * (height - 2 * padding);

            ctx.beginPath();
            ctx.moveTo(padding, midY);
            ctx.lineTo(width - padding, midY);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(midX, padding);
            ctx.lineTo(midX, height - padding);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw data points
        currentData.forEach((point, i) => {
            const x = padding + (point.x / 10) * (width - 2 * padding);
            const y = height - padding - (point.y / 10) * (height - 2 * padding);

            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);

            const isCorrect = predictions[i] === point.label;
            if (predictions[i] === 1) {
                ctx.fillStyle = isCorrect ? '#10b981' : '#ef4444';
            } else {
                ctx.fillStyle = isCorrect ? '#3b82f6' : '#ef4444';
            }
            ctx.fill();

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

    }, [currentData, predictions, selectedDataset]);

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>;
    if (!isAuthenticated) return null;

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />

            <div className="relative z-20">
                <Navbar />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/demo" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
                        ← Back to Demos
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Decision Tree Explorer
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        See how decision trees create boundaries to classify data points
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                    >
                        <canvas
                            id="tree-canvas"
                            width={800}
                            height={500}
                            className="w-full h-auto rounded-lg bg-black/50"
                        />

                        <div className="flex gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-300">Class 0 (Correct)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-300">Class 1 (Correct)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                <span className="text-sm text-gray-300">Misclassified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-purple-500 border-dashed"></div>
                                <span className="text-sm text-gray-300">Decision Boundary</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Accuracy Card */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 text-center">
                            <div className="text-4xl font-bold text-purple-400 mb-2">
                                {accuracy.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-300">Classification Accuracy</div>
                            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${accuracy}%` }} />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🎮 Controls</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Dataset</label>
                                    <select
                                        value={selectedDataset}
                                        onChange={(e) => setSelectedDataset(e.target.value)}
                                        className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                                    >
                                        <option value="moon">Moon Shapes 🌙</option>
                                        <option value="circles">Concentric Circles ⭕</option>
                                        <option value="xor">XOR Pattern ❌</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Max Depth: <span className="text-purple-400">{maxDepth}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={maxDepth}
                                        onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Min Samples to Split: <span className="text-purple-400">{minSamplesSplit}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="10"
                                        value={minSamplesSplit}
                                        onChange={(e) => setMinSamplesSplit(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tree Visualization */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-3">🌳 Decision Tree Structure</h3>
                            <div className="space-y-2 text-sm font-mono">
                                <div className="text-purple-400">Root Node</div>
                                <div className="ml-4 text-gray-300">├── X₁ {"<"} threshold?</div>
                                {maxDepth >= 2 && (
                                    <>
                                        <div className="ml-8 text-gray-300">│   ├── X₂ {"<"} threshold?</div>
                                        <div className="ml-12 text-green-400">│   │   └── Class 0</div>
                                        <div className="ml-12 text-green-400">│   │   └── Class 1</div>
                                        <div className="ml-8 text-gray-300">│   └── X₂ ≥ threshold?</div>
                                        <div className="ml-12 text-green-400">│       └── Class 1</div>
                                    </>
                                )}
                                <div className="ml-4 text-gray-300">└── X₁ ≥ threshold?</div>
                                {maxDepth >= 2 && (
                                    <div className="ml-8 text-green-400">    └── Class 1</div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 How it works</h3>
                            <p className="text-sm text-gray-300">
                                Decision trees split data recursively based on feature values.
                                Each split aims to create pure subsets (all same class).
                                The tree depth controls complexity - deeper trees can capture more patterns but may overfit!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DecisionTreeDemo;