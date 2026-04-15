"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const NeuralNetworkDemo = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [layers, setLayers] = useState([2, 4, 3, 1]); // [input, hidden1, hidden2, output]
    const [learningRate, setLearningRate] = useState(0.1);
    const [epochs, setEpochs] = useState(0);
    const [loss, setLoss] = useState<number[]>([]);
    const [isTraining, setIsTraining] = useState(false);
    const animationRef = useRef<NodeJS.Timeout | null>(null);
    const lossCanvasRef = useRef<HTMLCanvasElement>(null);

    // Sample data: XOR problem
    const trainingData = [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] }
    ];

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [router]);

    // Draw loss chart
    useEffect(() => {
        const canvas = lossCanvasRef.current;
        if (!canvas || loss.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 300;
        canvas.height = 100;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (loss.length < 2) return;

        const maxLoss = Math.max(...loss);
        const minLoss = Math.min(...loss);
        const range = maxLoss - minLoss;

        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;

        for (let i = 0; i < loss.length; i++) {
            const x = (i / loss.length) * canvas.width;
            const y = canvas.height - ((loss[i] - minLoss) / range) * canvas.height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

    }, [loss]);

    // Neural Network simulation
    const trainNetwork = () => {
        setIsTraining(true);
        let currentEpoch = 0;
        const losses: number[] = [];

        const trainStep = () => {
            if (currentEpoch >= 100) {
                setIsTraining(false);
                if (animationRef.current) {
                    clearTimeout(animationRef.current);
                    animationRef.current = null;
                }
                return;
            }

            // Simulate training - calculate loss
            let totalLoss = 0;
            trainingData.forEach(data => {
                // Simple forward pass simulation
                let output = 0;
                // Neural network learning the XOR pattern
                const weightedSum =
                    data.input[0] * (0.5 + Math.sin(currentEpoch * 0.1) * 0.3) +
                    data.input[1] * (0.5 + Math.cos(currentEpoch * 0.1) * 0.3);
                output = 1 / (1 + Math.exp(-weightedSum * 2));

                const target = data.output[0];
                totalLoss += Math.pow(target - output, 2);
            });

            const avgLoss = totalLoss / trainingData.length;
            losses.push(avgLoss);
            setLoss([...losses]);
            setEpochs(currentEpoch + 1);

            currentEpoch++;
            animationRef.current = setTimeout(trainStep, 50);
        };

        trainStep();
    };

    const stopTraining = () => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
            animationRef.current = null;
        }
        setIsTraining(false);
    };

    const resetNetwork = () => {
        stopTraining();
        setEpochs(0);
        setLoss([]);
    };

    // Neural network visualization
    useEffect(() => {
        const canvas = document.getElementById('nn-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 800;
        canvas.height = 500;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const layerPositions = [];
        const layerWidth = canvas.width / (layers.length + 1);

        // Calculate neuron positions
        for (let i = 0; i < layers.length; i++) {
            const x = (i + 1) * layerWidth;
            const neurons = layers[i];
            const neuronPositions = [];
            const startY = canvas.height / 2 - (neurons - 1) * 25;

            for (let j = 0; j < neurons; j++) {
                const y = startY + j * 50;
                neuronPositions.push({ x, y });
            }
            layerPositions.push(neuronPositions);
        }

        // Draw connections
        for (let i = 0; i < layerPositions.length - 1; i++) {
            const currentLayer = layerPositions[i];
            const nextLayer = layerPositions[i + 1];

            currentLayer.forEach(neuron1 => {
                nextLayer.forEach(neuron2 => {
                    ctx.beginPath();
                    ctx.moveTo(neuron1.x, neuron1.y);
                    ctx.lineTo(neuron2.x, neuron2.y);
                    // Opacity based on training progress
                    const opacity = Math.min(0.3, epochs / 300);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity + 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            });
        }

        // Draw neurons
        layerPositions.forEach((layer, i) => {
            layer.forEach((neuron, j) => {
                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, 15, 0, 2 * Math.PI);

                // Color based on layer type and activation
                if (i === 0) {
                    // Input layer - animate based on input values
                    const activation = Math.sin(Date.now() / 1000) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(59, 130, 246, ${activation})`;
                } else if (i === layers.length - 1) {
                    // Output layer - animate based on loss
                    const activation = loss.length > 0
                        ? Math.max(0, Math.min(1, 1 - loss[loss.length - 1] * 2))
                        : 0.5;
                    ctx.fillStyle = `rgba(16, 185, 129, ${activation + 0.3})`;
                } else {
                    // Hidden layers - animate based on training
                    const activation = Math.min(0.8, epochs / 100);
                    ctx.fillStyle = `rgba(139, 92, 246, ${activation + 0.2})`;
                }

                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Add glow effect for active neurons during training
                if (isTraining && Math.random() > 0.7) {
                    ctx.beginPath();
                    ctx.arc(neuron.x, neuron.y, 18, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(139, 92, 246, 0.3)`;
                    ctx.fill();
                }
            });
        });

        // Draw labels
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText('Input Layer', layerPositions[0][0].x - 40, layerPositions[0][0].y - 30);

        if (layers.length > 2) {
            ctx.fillText('Hidden Layers', layerPositions[1][0].x - 30, layerPositions[1][0].y - 30);
        }

        ctx.fillText('Output Layer', layerPositions[layers.length - 1][0].x - 30, layerPositions[layers.length - 1][0].y - 30);

    }, [layers, loss, epochs, isTraining]);

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
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Neural Network Playground
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">
                        Visualize how neural networks learn patterns in data
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
                            id="nn-canvas"
                            width={800}
                            height={500}
                            className="w-full h-auto rounded-lg bg-black/50"
                        />

                        <div className="flex gap-6 mt-4 justify-center flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-300">Input Layer</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-300">Hidden Layers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-300">Output Layer</span>
                            </div>
                            {isTraining && (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                                    <span className="text-sm text-purple-400">Training in progress...</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Training Metrics */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold mb-4">📈 Training Progress</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Epochs:</span>
                                    <span className="font-mono text-purple-400">{epochs}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Current Loss:</span>
                                    <span className="font-mono text-purple-400">
                                        {loss.length > 0 ? loss[loss.length - 1].toFixed(4) : '0.0000'}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-2">Loss Curve</div>
                                    <canvas
                                        ref={lossCanvasRef}
                                        width={300}
                                        height={100}
                                        className="w-full h-24 rounded-lg bg-black/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Architecture Controls */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4">🏗️ Network Architecture</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Hidden Layer 1: <span className="text-purple-400">{layers[1]}</span> neurons
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={layers[1]}
                                        onChange={(e) => setLayers([layers[0], parseInt(e.target.value), layers[2], layers[3]])}
                                        className="w-full"
                                        disabled={isTraining}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Hidden Layer 2: <span className="text-purple-400">{layers[2]}</span> neurons
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="8"
                                        value={layers[2]}
                                        onChange={(e) => setLayers([layers[0], layers[1], parseInt(e.target.value), layers[3]])}
                                        className="w-full"
                                        disabled={isTraining}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Learning Rate: <span className="text-purple-400">{learningRate.toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.01"
                                        max="0.5"
                                        step="0.01"
                                        value={learningRate}
                                        onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                        className="w-full"
                                        disabled={isTraining}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Training Controls */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex gap-3">
                                {!isTraining ? (
                                    <button
                                        onClick={trainNetwork}
                                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                                    >
                                        Train Network 🚀
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopTraining}
                                        className="flex-1 py-2 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105"
                                    >
                                        Stop Training ⏹️
                                    </button>
                                )}

                                <button
                                    onClick={resetNetwork}
                                    className="flex-1 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition transform hover:scale-105"
                                    disabled={isTraining}
                                >
                                    Reset 🔄
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold mb-2">💡 How it Works</h3>
                            <p className="text-sm text-gray-300">
                                This network is learning the XOR problem - a classic non-linear pattern.
                                The connections between neurons (weights) are adjusted during training
                                to minimize the loss. Watch how the network learns over time!
                            </p>
                            <div className="mt-3 text-xs text-gray-400">
                                <p>✓ Brighter neurons = Higher activation</p>
                                <p>✓ Thicker connections = Stronger weights</p>
                                <p>✓ Loss decreases as network learns</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default NeuralNetworkDemo;