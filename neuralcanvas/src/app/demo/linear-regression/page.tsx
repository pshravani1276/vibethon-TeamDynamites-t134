"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const LinearRegressionDemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Demo state
    const [slope, setSlope] = useState(1);
    const [intercept, setIntercept] = useState(0);
    const [noise, setNoise] = useState(0.2);
    const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);
    const [predictions, setPredictions] = useState<number[]>([]);
    const [mse, setMse] = useState(0);
    const [r2, setR2] = useState(0);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [router]);

    // Generate synthetic data
    const generateData = useCallback(() => {
        const newData = [];
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 10;
            const trueY = 2 * x + 3; // True relationship: y = 2x + 3
            const noisyY = trueY + (Math.random() - 0.5) * noise * 10;
            newData.push({ x, y: noisyY });
        }
        setDataPoints(newData);
    }, [noise]);

    // Calculate predictions and metrics
    useEffect(() => {
        const preds = dataPoints.map(point => slope * point.x + intercept);
        setPredictions(preds);

        if (dataPoints.length > 0) {
            const actualYs = dataPoints.map(p => p.y);
            const ssRes = actualYs.reduce((sum, y, i) => sum + Math.pow(y - preds[i], 2), 0);
            const ssTot = actualYs.reduce((sum, y) => sum + Math.pow(y - actualYs.reduce((a, b) => a + b, 0) / actualYs.length, 2), 0);
            setMse(ssRes / dataPoints.length);
            setR2(1 - ssRes / ssTot);
        }
    }, [slope, intercept, dataPoints]);

    useEffect(() => {
        generateData();
    }, [generateData]);

    // Canvas rendering
    useEffect(() => {
        const canvas = document.getElementById('regression-canvas') as HTMLCanvasElement;
        if (!canvas || dataPoints.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Get min/max values
        const xs = dataPoints.map(p => p.x);
        const ys = [...dataPoints.map(p => p.y), ...predictions];
        const minX = Math.min(...xs, 0);
        const maxX = Math.max(...xs, 10);
        const minY = Math.min(...ys, 0);
        const maxY = Math.max(...ys, 15);

        // Scale functions
        const scaleX = (x: number) => padding + (x - minX) / (maxX - minX) * (width - 2 * padding);
        const scaleY = (y: number) => height - padding - (y - minY) / (maxY - minY) * (height - 2 * padding);

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const x = scaleX(i);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();

            const y = scaleY(i);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw regression line
        ctx.beginPath();
        const startX = scaleX(minX);
        const startY = scaleY(slope * minX + intercept);
        const endX = scaleX(maxX);
        const endY = scaleY(slope * maxX + intercept);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw data points
        dataPoints.forEach((point, i) => {
            const x = scaleX(point.x);
            const y = scaleY(point.y);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = predictions[i] > point.y ? '#ef4444' : '#10b981';
            ctx.fill();

            // Draw residual line
            const predY = scaleY(predictions[i]);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, predY);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        });

    }, [dataPoints, predictions, slope, intercept]);

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
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/demo" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
                        ← Back to Demos
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Linear Regression Visualizer
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        Adjust the line parameters to fit the data points. Watch how the error metrics change in real-time.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visualization Canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                    >
                        <canvas
                            id="regression-canvas"
                            width={800}
                            height={500}
                            className="w-full h-auto rounded-lg bg-black/50"
                        />

                        {/* Legend */}
                        <div className="flex gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-300">Data Points (Under-predicted)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm text-gray-300">Data Points (Over-predicted)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-purple-500"></div>
                                <span className="text-sm text-gray-300">Regression Line</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Metrics Card */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold mb-4">📊 Model Metrics</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Mean Squared Error (MSE)</span>
                                        <span className="font-mono">{mse.toFixed(4)}</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full" style={{ width: `${Math.min(mse / 10 * 100, 100)}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">R² Score</span>
                                        <span className="font-mono">{r2.toFixed(4)}</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${r2 * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🎮 Controls</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Slope (m): <span className="text-purple-400">{slope.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="-3"
                                        max="5"
                                        step="0.01"
                                        value={slope}
                                        onChange={(e) => setSlope(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Intercept (b): <span className="text-purple-400">{intercept.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="-2"
                                        max="8"
                                        step="0.01"
                                        value={intercept}
                                        onChange={(e) => setIntercept(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Noise Level: <span className="text-purple-400">{noise.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={noise}
                                        onChange={(e) => setNoise(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <button
                                    onClick={generateData}
                                    className="w-full py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                                >
                                    Generate New Data 🔄
                                </button>

                                <button
                                    onClick={() => {
                                        setSlope(2);
                                        setIntercept(3);
                                    }}
                                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition"
                                >
                                    Reset to True Line (y = 2x + 3)
                                </button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 What's happening?</h3>
                            <p className="text-sm text-gray-300">
                                Linear regression finds the best-fitting line through your data points.
                                The line is defined by <span className="font-mono text-purple-400">y = mx + b</span>,
                                where <span className="font-mono">m</span> is the slope and <span className="font-mono">b</span> is the intercept.
                                The green/red colors show whether the prediction is below (green) or above (red) the actual value.
                                Try to adjust the slope and intercept to minimize the MSE!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LinearRegressionDemo;