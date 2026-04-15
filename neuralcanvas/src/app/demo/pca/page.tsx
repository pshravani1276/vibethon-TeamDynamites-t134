"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const PCADemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [numComponents, setNumComponents] = useState(2);
    const [varianceExplained, setVarianceExplained] = useState([0, 0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate 3D data points
    const [originalData, setOriginalData] = useState<number[][]>([]);
    const [transformedData, setTransformedData] = useState<number[][]>([]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
            generateData();
        }
    }, [router]);

    const generateData = () => {
        // Generate correlated 3D data
        const data = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 10;
            const y = x * 0.8 + Math.random() * 2;
            const z = x * 0.6 + y * 0.4 + Math.random() * 1.5;
            data.push([x, y, z]);
        }
        setOriginalData(data);

        // Simulate PCA transformation
        const transformed = data.map(point => {
            // Simplified PCA transformation
            const pc1 = point[0] * 0.7 + point[1] * 0.5 + point[2] * 0.3;
            const pc2 = point[0] * -0.3 + point[1] * 0.6 + point[2] * 0.7;
            const pc3 = point[0] * 0.2 - point[1] * 0.4 + point[2] * 0.5;

            if (numComponents === 1) return [pc1, 0];
            if (numComponents === 2) return [pc1, pc2];
            return [pc1, pc2, pc3];
        });
        setTransformedData(transformed);

        // Calculate variance explained
        const variances = [65, 25, 10];
        setVarianceExplained(variances.slice(0, numComponents));
    };

    useEffect(() => {
        generateData();
    }, [numComponents]);

    // Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || transformedData.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 600;
        canvas.height = 400;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, canvas.height / 2);
        ctx.lineTo(canvas.width - 50, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, 50);
        ctx.lineTo(canvas.width / 2, canvas.height - 50);
        ctx.stroke();

        // Find min/max for scaling
        const allX = transformedData.map(p => p[0]);
        const allY = transformedData.map(p => p[1]);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);

        // Draw points
        transformedData.forEach(point => {
            const x = 50 + ((point[0] - minX) / (maxX - minX)) * (canvas.width - 100);
            const y = canvas.height / 2 - ((point[1] - minY) / (maxY - minY)) * (canvas.height - 100);

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);

            // Color by original position
            const hue = (point[0] * 36) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.fill();
        });

        // Draw principal component directions
        if (numComponents >= 2) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2 - 50);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 - 30, canvas.height / 2 - 100);
            ctx.stroke();
        }

    }, [transformedData, numComponents]);

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
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        PCA Visualization
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        See how Principal Component Analysis reduces dimensionality while preserving variance
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
                            ref={canvasRef}
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-lg bg-black/50 mx-auto"
                        />
                        <p className="text-sm text-gray-400 text-center mt-4">
                            Data projected onto Principal Components (PC1 horizontal, PC2 vertical)
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold mb-4">📊 Variance Explained</h3>
                            <div className="space-y-3">
                                {varianceExplained.map((varExp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>PC{idx + 1}</span>
                                            <span>{varExp.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                style={{ width: `${varExp}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span>Total Preserved</span>
                                        <span className="text-purple-400">
                                            {varianceExplained.reduce((a, b) => a + b, 0).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🎮 Controls</h3>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Number of Components: {numComponents}
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setNumComponents(n)}
                                            className={`flex-1 py-2 rounded-lg font-semibold transition ${numComponents === n
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                : "bg-white/10 hover:bg-white/20"
                                                }`}
                                        >
                                            {n}D
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={generateData}
                                className="w-full mt-4 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                            >
                                Generate New Data 🔄
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 What is PCA?</h3>
                            <p className="text-sm text-gray-300">
                                PCA finds the directions (principal components) that maximize variance in your data.
                                By projecting onto these components, you can reduce dimensionality while
                                preserving the most important patterns. The colors represent the original
                                data structure!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PCADemo;