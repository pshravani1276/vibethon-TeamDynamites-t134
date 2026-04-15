"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const ClusteringDemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [algorithm, setAlgorithm] = useState("kmeans");
    const [numClusters, setNumClusters] = useState(3);
    const [points, setPoints] = useState<{ x: number; y: number; cluster: number }[]>([]);
    const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const newPoints = [];
        // Generate clusters
        for (let c = 0; c < numClusters; c++) {
            const centerX = Math.random() * 600 + 100;
            const centerY = Math.random() * 400 + 50;

            for (let i = 0; i < 30; i++) {
                newPoints.push({
                    x: centerX + (Math.random() - 0.5) * 80,
                    y: centerY + (Math.random() - 0.5) * 80,
                    cluster: c
                });
            }
        }
        setPoints(newPoints);

        // Initialize centroids
        const newCentroids = [];
        for (let i = 0; i < numClusters; i++) {
            newCentroids.push({
                x: Math.random() * 800,
                y: Math.random() * 500
            });
        }
        setCentroids(newCentroids);
    };

    const runClustering = () => {
        if (algorithm === "kmeans") {
            // Simulate K-Means clustering
            let maxIterations = 10;
            let currentPoints = [...points];
            let currentCentroids = [...centroids];

            for (let iter = 0; iter < maxIterations; iter++) {
                // Assign points to nearest centroid
                currentPoints = currentPoints.map(point => {
                    let minDist = Infinity;
                    let bestCluster = 0;
                    currentCentroids.forEach((centroid, idx) => {
                        const dist = Math.sqrt(
                            Math.pow(point.x - centroid.x, 2) +
                            Math.pow(point.y - centroid.y, 2)
                        );
                        if (dist < minDist) {
                            minDist = dist;
                            bestCluster = idx;
                        }
                    });
                    return { ...point, cluster: bestCluster };
                });

                // Update centroids
                const newCentroids = currentCentroids.map((_, idx) => {
                    const clusterPoints = currentPoints.filter(p => p.cluster === idx);
                    if (clusterPoints.length === 0) return { x: Math.random() * 800, y: Math.random() * 500 };
                    const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                    const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
                    return { x: avgX, y: avgY };
                });

                currentCentroids = newCentroids;
            }

            setPoints(currentPoints);
            setCentroids(currentCentroids);
        }
    };

    // Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || points.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 500;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Colors for clusters
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        // Draw points
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = colors[point.cluster % colors.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw centroids
        if (algorithm === "kmeans") {
            centroids.forEach((centroid, idx) => {
                ctx.beginPath();
                ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI);
                ctx.fillStyle = colors[idx % colors.length];
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Draw cross in centroid
                ctx.beginPath();
                ctx.moveTo(centroid.x - 8, centroid.y);
                ctx.lineTo(centroid.x + 8, centroid.y);
                ctx.moveTo(centroid.x, centroid.y - 8);
                ctx.lineTo(centroid.x, centroid.y + 8);
                ctx.stroke();
            });
        }

    }, [points, centroids, algorithm]);

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
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                        Clustering Algorithms
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        Compare different clustering algorithms on synthetic datasets
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
                            width={800}
                            height={500}
                            className="w-full h-auto rounded-lg bg-black/50"
                        />
                        <p className="text-sm text-gray-400 text-center mt-4">
                            Each color represents a different cluster | Large circles are cluster centers (K-Means)
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold mb-4">📊 Cluster Statistics</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Total Points:</span>
                                    <span className="font-mono">{points.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Number of Clusters:</span>
                                    <span className="font-mono">{numClusters}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Algorithm:</span>
                                    <span className="font-mono capitalize">{algorithm}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🎮 Controls</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Algorithm</label>
                                    <div className="flex gap-2">
                                        {["kmeans", "dbscan", "hierarchical"].map(algo => (
                                            <button
                                                key={algo}
                                                onClick={() => setAlgorithm(algo)}
                                                className={`flex-1 py-2 rounded-lg font-semibold transition capitalize ${algorithm === algo
                                                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                        : "bg-white/10 hover:bg-white/20"
                                                    }`}
                                                disabled={algo !== "kmeans"} // Only K-Means implemented for demo
                                            >
                                                {algo}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Number of Clusters: {numClusters}
                                    </label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="6"
                                        value={numClusters}
                                        onChange={(e) => {
                                            setNumClusters(parseInt(e.target.value));
                                            generateData();
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={generateData}
                                        className="flex-1 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                                    >
                                        New Data 🔄
                                    </button>
                                    <button
                                        onClick={runClustering}
                                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition"
                                    >
                                        Run K-Means 🎯
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 Clustering Explained</h3>
                            <p className="text-sm text-gray-300">
                                <strong>K-Means</strong> groups points by finding cluster centers that minimize
                                within-cluster distances. The algorithm alternates between assigning points
                                to the nearest center and updating center positions.
                            </p>
                            <div className="mt-3 text-xs text-gray-400">
                                <p>✓ Large circles = Cluster centers (centroids)</p>
                                <p>✓ Colors = Different clusters</p>
                                <p>✓ Try changing number of clusters!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ClusteringDemo;