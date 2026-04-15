// src/app/simulation/spam-detection/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SpamDetectionSimulation() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [prediction, setPrediction] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const examples = [
        { text: "Congratulations! You won $1,000,000! Click here to claim your prize.", type: "spam" },
        { text: "Hi John, can we meet tomorrow to discuss the project?", type: "ham" },
        { text: "URGENT: Your account has been compromised. Verify now!", type: "spam" },
        { text: "Thanks for your email. I'll get back to you soon.", type: "ham" },
    ];

    const checkSpam = () => {
        const spamKeywords = ["won", "prize", "urgent", "click here", "verify", "congratulations", "$", "claim"];
        const isSpam = spamKeywords.some(keyword => message.toLowerCase().includes(keyword));

        setPrediction(isSpam ? "spam" : "ham");

        if (!completed) {
            setScore(score + 50);
        }
    };

    const handleComplete = () => {
        setCompleted(true);
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
                                <h1 className="text-3xl font-bold mb-2">📧 Spam Detection</h1>
                                <p className="text-gray-400">Build a spam classifier using keyword detection</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Your Score</div>
                            </div>
                        </div>

                        {/* Example Messages */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-2">Try these examples:</h3>
                            <div className="flex flex-wrap gap-2">
                                {examples.map((ex, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMessage(ex.text)}
                                        className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
                                    >
                                        {ex.type === "spam" ? "📧" : "📨"} Example {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Input */}
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter an email message to classify..."
                            className="w-full h-32 p-4 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white mb-4"
                        />

                        {/* Classify Button */}
                        <button
                            onClick={checkSpam}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold mb-4"
                        >
                            Classify Message
                        </button>

                        {/* Prediction Result */}
                        {prediction && (
                            <div className={`p-4 rounded-lg mb-4 ${prediction === "spam" ? "bg-red-500/20 border border-red-500" : "bg-green-500/20 border border-green-500"
                                }`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{prediction === "spam" ? "⚠️" : "✅"}</span>
                                    <div>
                                        <div className="font-semibold">
                                            This message is {prediction === "spam" ? "SPAM" : "NOT SPAM"}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {prediction === "spam"
                                                ? "This contains suspicious keywords and may be harmful."
                                                : "This appears to be a legitimate message."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* How it works */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">🔍 How Spam Detection Works</h3>
                            <p className="text-sm text-gray-300">
                                This simulation uses keyword-based classification. Spam messages often contain words like
                                "winner", "prize", "urgent", or "verify". Real spam filters use more advanced techniques
                                like Naive Bayes or neural networks.
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