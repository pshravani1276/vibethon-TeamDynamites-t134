// src/app/simulation/image-classification/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

export default function ImageClassificationSimulation() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

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
        initCanvas();
    }, [router]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas background
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set drawing style
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setPrediction(null);
        setConfidence(null);
    };

    const classifyImage = () => {
        // Simulate CNN classification
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Count non-black pixels (simplified simulation)
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let drawnPixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] > 50) drawnPixels++;
        }

        // Simulate prediction based on drawing
        let predictedDigit = Math.floor(Math.random() * 10);
        let confidenceLevel = 50 + Math.min(drawnPixels / 200, 40);

        // If user selected a digit to draw, check if correct
        if (selectedDigit !== null) {
            const isCorrect = predictedDigit === selectedDigit;
            confidenceLevel = isCorrect ? 70 + Math.random() * 20 : 30 + Math.random() * 30;

            if (isCorrect && !completed) {
                setScore(score + 100);
                if (score + 100 >= 200) {
                    setCompleted(true);
                    saveScore(score + 100);
                }
            }
        }

        setPrediction(`Digit: ${predictedDigit}`);
        setConfidence(Math.round(confidenceLevel));
    };

    const saveScore = async (finalScore: number) => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "image-classification",
            score: finalScore,
            completed_at: new Date().toISOString()
        });
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => router.push("/simulation")} className="mb-6 text-purple-400 hover:text-purple-300">
                        ← Back to Simulations
                    </button>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">🖼️ Image Classification</h1>
                                <p className="text-gray-400">Draw a digit and let the CNN predict it!</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Your Score</div>
                            </div>
                        </div>

                        {/* Digit Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Draw this digit (optional):</label>
                            <div className="flex gap-2 flex-wrap">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                                    <button
                                        key={digit}
                                        onClick={() => setSelectedDigit(digit)}
                                        className={`w-12 h-12 rounded-lg text-xl font-bold transition-all ${selectedDigit === digit
                                                ? "bg-purple-600 border-2 border-purple-400"
                                                : "bg-white/10 hover:bg-white/20"
                                            }`}
                                    >
                                        {digit}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setSelectedDigit(null)}
                                    className="px-4 py-2 bg-red-600/20 rounded-lg text-sm"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Canvas Drawing Area */}
                        <div className="flex justify-center mb-6">
                            <canvas
                                ref={canvasRef}
                                width={280}
                                height={280}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="border-2 border-gray-600 rounded-lg bg-gray-900 cursor-crosshair touch-none"
                                style={{ touchAction: "none" }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={clearCanvas}
                                className="flex-1 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg font-semibold"
                            >
                                Clear Canvas
                            </button>
                            <button
                                onClick={classifyImage}
                                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                            >
                                Classify Image
                            </button>
                        </div>

                        {/* Prediction Result */}
                        {prediction && (
                            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4 text-center">
                                <div className="text-sm text-gray-300">CNN Prediction</div>
                                <div className="text-3xl font-bold text-green-400">{prediction}</div>
                                {confidence && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-300">Confidence</div>
                                        <div className="h-2 bg-gray-700 rounded-full mt-1">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${confidence}%` }} />
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{confidence}%</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* How it works */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">🧠 How CNN Image Classification Works</h3>
                            <p className="text-sm text-gray-300">
                                Convolutional Neural Networks (CNNs) process images through layers that detect edges, shapes, and patterns.
                                This simulation mimics how a CNN would recognize handwritten digits (like MNIST dataset).
                            </p>
                        </div>

                        {!completed && score >= 200 && (
                            <button className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold">
                                ✓ Complete Simulation & Earn Badge
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}