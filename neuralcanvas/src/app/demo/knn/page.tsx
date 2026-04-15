"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const KNNDemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [kValue, setKValue] = useState(3);
    const [points, setPoints] = useState<{ x: number; y: number; label: number }[]>([]);
    const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
    const [prediction, setPrediction] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
            initializePoints();
        }
    }, [router]);

    const initializePoints = () => {
        const initialPoints = [];
        // Class 0 points (blue)
        for (let i = 0; i < 15; i++) {
            initialPoints.push({
                x: Math.random() * 300 + 50,
                y: Math.random() * 300 + 50,
                label: 0
            });
        }
        // Class 1 points (red)
        for (let i = 0; i < 15; i++) {
            initialPoints.push({
                x: Math.random() * 300 + 400,
                y: Math.random() * 300 + 50,
                label: 1
            });
        }
        setPoints(initialPoints);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Add new point with random label for demo
        const newLabel = Math.random() > 0.5 ? 1 : 0;
        setPoints([...points, { x, y, label: newLabel }]);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setHoverPoint({ x, y });

        // Calculate KNN prediction
        const distances = points.map(point => ({
            ...point,
            distance: Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2))
        }));

        distances.sort((a, b) => a.distance - b.distance);
        const kNearest = distances.slice(0, kValue);
        const sumLabels = kNearest.reduce((sum, p) => sum + p.label, 0);
        const prediction = sumLabels > kValue / 2 ? 1 : 0;
        setPrediction(prediction);
    };

    // Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();

            const y = (i / 10) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw all points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = point.label === 0 ? '#3b82f6' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw hover point and its k-nearest neighbors
        if (hoverPoint) {
            // Calculate distances
            const distances = points.map(point => ({
                ...point,
                distance: Math.sqrt(Math.pow(point.x - hoverPoint.x, 2) + Math.pow(point.y - hoverPoint.y, 2))
            }));

            distances.sort((a, b) => a.distance - b.distance);
            const kNearest = distances.slice(0, kValue);

            // Draw lines to k-nearest neighbors
            ctx.beginPath();
            kNearest.forEach(neighbor => {
                ctx.moveTo(hoverPoint.x, hoverPoint.y);
                ctx.lineTo(neighbor.x, neighbor.y);
            });
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Highlight k-nearest neighbors
            kNearest.forEach(neighbor => {
                ctx.beginPath();
                ctx.arc(neighbor.x, neighbor.y, 8, 0, 2 * Math.PI);
                ctx.strokeStyle = '#8b5cf6';
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            // Draw hover point
            ctx.beginPath();
            ctx.arc(hoverPoint.x, hoverPoint.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = prediction === 0 ? '#3b82f6' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw prediction text
            ctx.font = 'bold 16px monospace';
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 0;
            ctx.fillText(
                `Prediction: Class ${prediction}`,
                hoverPoint.x + 15,
                hoverPoint.y - 10
            );
        }

    }, [points, hoverPoint, kValue, prediction]);

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
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        K-Nearest Neighbors
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        Move your mouse to see how KNN classifies new points based on its neighbors
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2"
                    >
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={500}
                            onClick={handleCanvasClick}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setHoverPoint(null)}
                            className="w-full h-auto rounded-lg bg-black/50 border border-white/10 cursor-crosshair"
                        />
                        <p className="text-sm text-gray-400 mt-2 text-center">
                            💡 Click to add a new point | Hover to see KNN classification
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold mb-4">📊 Current Status</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total Points:</span>
                                    <span className="font-mono">{points.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Class 0 (Blue):</span>
                                    <span className="font-mono text-blue-400">{points.filter(p => p.label === 0).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Class 1 (Red):</span>
                                    <span className="font-mono text-red-400">{points.filter(p => p.label === 1).length}</span>
                                </div>
                                {prediction !== null && (
                                    <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                                        <span>Current Prediction:</span>
                                        <span className={`font-mono font-bold ${prediction === 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                            Class {prediction}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🎮 Controls</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        K Value: <span className="text-purple-400">{kValue}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="11"
                                        step="2"
                                        value={kValue}
                                        onChange={(e) => setKValue(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Odd numbers prevent ties
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={initializePoints}
                                        className="flex-1 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                                    >
                                        Reset Points 🔄
                                    </button>
                                    <button
                                        onClick={() => setPoints(points.slice(0, -1))}
                                        className="flex-1 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                                    >
                                        Undo Last ➖
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 How KNN Works</h3>
                            <p className="text-sm text-gray-300 mb-3">
                                KNN classifies a new point by looking at its K nearest neighbors
                                and taking a majority vote. The purple lines show connections to the
                                K nearest points.
                            </p>
                            <div className="text-xs text-gray-400 space-y-1">
                                <p>✓ K = {kValue} means looking at the {kValue} closest points</p>
                                <p>✓ Blue points are Class 0, Red points are Class 1</p>
                                <p>✓ Click anywhere to add a new point</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default KNNDemo;