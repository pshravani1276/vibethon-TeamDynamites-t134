// src/app/simulations/price-predictor/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function PricePredictorSimulation() {
    const router = useRouter();
    const [bedrooms, setBedrooms] = useState(3);
    const [sqft, setSqft] = useState(1500);
    const [location, setLocation] = useState("suburban");
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const predictPrice = () => {
        let basePrice = 200000;

        // Bedrooms effect
        basePrice += bedrooms * 30000;

        // Square footage effect
        basePrice += sqft * 150;

        // Location effect
        if (location === "urban") basePrice *= 1.5;
        if (location === "rural") basePrice *= 0.8;

        // Add random variation
        const price = Math.round(basePrice + (Math.random() - 0.5) * 20000);
        setPredictedPrice(price);

        if (!completed) {
            setScore(score + 50);
        }
    };

    const handleComplete = () => {
        setCompleted(true);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => router.push("/simulation")} className="mb-6 text-purple-400 hover:text-purple-300">
                        ← Back to Simulations
                    </button>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">🏠 Housing Price Predictor</h1>
                                <p className="text-gray-400">Predict house prices using regression</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Your Score</div>
                            </div>
                        </div>

                        {/* Input Controls */}
                        <div className="space-y-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Bedrooms: {bedrooms}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="6"
                                    value={bedrooms}
                                    onChange={(e) => setBedrooms(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Square Footage: {sqft} sq ft</label>
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="100"
                                    value={sqft}
                                    onChange={(e) => setSqft(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Location</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["rural", "suburban", "urban"].map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => setLocation(loc)}
                                            className={`py-2 rounded-lg capitalize ${location === loc
                                                ? "bg-purple-600"
                                                : "bg-white/10 hover:bg-white/20"
                                                }`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Predict Button */}
                        <button
                            onClick={predictPrice}
                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg font-semibold mb-4"
                        >
                            Predict Price
                        </button>

                        {/* Prediction Result */}
                        {predictedPrice && (
                            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4 text-center">
                                <div className="text-sm text-gray-300">Predicted Price</div>
                                <div className="text-3xl font-bold text-green-400">{formatPrice(predictedPrice)}</div>
                            </div>
                        )}

                        {/* How it works */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">📊 How Price Prediction Works</h3>
                            <p className="text-sm text-gray-300">
                                This simulation uses linear regression with features: bedrooms, square footage, and location.
                                Real models use hundreds of features including age, condition, nearby schools, and market trends.
                            </p>
                        </div>

                        {!completed && score >= 50 && (
                            <button
                                onClick={handleComplete}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold"
                            >
                                ✓ Complete Simulation & Earn Badge
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}