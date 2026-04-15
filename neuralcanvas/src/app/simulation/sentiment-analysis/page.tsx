// src/app/simulation/sentiment-analysis/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

export default function SentimentAnalysisSimulation() {
    const router = useRouter();
    const [review, setReview] = useState("");
    const [sentiment, setSentiment] = useState<"positive" | "negative" | "neutral" | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showWordImportance, setShowWordImportance] = useState(false);

    // Sample reviews for quick testing
    const sampleReviews = [
        { text: "This movie was absolutely amazing! I loved every minute of it.", sentiment: "positive" },
        { text: "Terrible acting, boring story, waste of money.", sentiment: "negative" },
        { text: "It was okay, nothing special but not terrible either.", sentiment: "neutral" },
        { text: "Best film I've seen all year! Highly recommend!", sentiment: "positive" },
        { text: "Disappointing and overhyped. Don't waste your time.", sentiment: "negative" },
    ];

    // Positive and negative word lists for simulation
    const positiveWords = ["amazing", "loved", "best", "great", "excellent", "fantastic", "wonderful", "awesome", "brilliant", "perfect", "enjoyed", "recommend", "beautiful", "incredible", "favorite"];
    const negativeWords = ["terrible", "boring", "waste", "disappointing", "overhyped", "horrible", "awful", "bad", "worst", "hate", "dislike", "poor", "mediocre", "useless", "annoying"];

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

    const analyzeSentiment = () => {
        if (!review.trim()) return;

        const words = review.toLowerCase().split(/\s+/);
        let positiveScore = 0;
        let negativeScore = 0;
        let importantWords: { word: string; type: string }[] = [];

        words.forEach(word => {
            if (positiveWords.includes(word)) {
                positiveScore++;
                importantWords.push({ word, type: "positive" });
            } else if (negativeWords.includes(word)) {
                negativeScore++;
                importantWords.push({ word, type: "negative" });
            }
        });

        const total = positiveScore + negativeScore;
        let detectedSentiment: "positive" | "negative" | "neutral";
        let confidenceLevel = 0;

        if (positiveScore > negativeScore) {
            detectedSentiment = "positive";
            confidenceLevel = Math.min(50 + (positiveScore / (total || 1)) * 40, 95);
        } else if (negativeScore > positiveScore) {
            detectedSentiment = "negative";
            confidenceLevel = Math.min(50 + (negativeScore / (total || 1)) * 40, 95);
        } else {
            detectedSentiment = "neutral";
            confidenceLevel = 60;
        }

        setSentiment(detectedSentiment);
        setConfidence(Math.round(confidenceLevel));

        // Award points for analysis
        if (!completed) {
            setScore(score + 25);
            if (score + 25 >= 100) {
                setCompleted(true);
                saveScore(score + 25);
            }
        }
    };

    const saveScore = async (finalScore: number) => {
        if (!user) return;

        await supabase.from("game_results").insert({
            user_id: user.id,
            game_type: "sentiment-analysis",
            score: finalScore,
            completed_at: new Date().toISOString()
        });
    };

    const loadSampleReview = (reviewText: string) => {
        setReview(reviewText);
        setSentiment(null);
    };

    const clearReview = () => {
        setReview("");
        setSentiment(null);
    };

    const getSentimentColor = () => {
        switch (sentiment) {
            case "positive": return "text-green-400 bg-green-500/20 border-green-500";
            case "negative": return "text-red-400 bg-red-500/20 border-red-500";
            case "neutral": return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
            default: return "";
        }
    };

    const getSentimentEmoji = () => {
        switch (sentiment) {
            case "positive": return "😊";
            case "negative": return "😞";
            case "neutral": return "😐";
            default: return "🤔";
        }
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
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">💬 Sentiment Analysis</h1>
                                <p className="text-gray-400">Analyze movie reviews using NLP</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">{score} pts</div>
                                <div className="text-sm text-gray-400">Your Score</div>
                            </div>
                        </div>

                        {/* Sample Reviews */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Try a sample review:</label>
                            <div className="flex flex-wrap gap-2">
                                {sampleReviews.map((sample, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => loadSampleReview(sample.text)}
                                        className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition"
                                    >
                                        {sample.sentiment === "positive" ? "😊" : sample.sentiment === "negative" ? "😞" : "😐"} Sample {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Movie Review:</label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Enter a movie review to analyze sentiment..."
                                className="w-full h-32 p-4 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={clearReview}
                                className="flex-1 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg font-semibold"
                            >
                                Clear
                            </button>
                            <button
                                onClick={analyzeSentiment}
                                disabled={!review.trim()}
                                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold disabled:opacity-50"
                            >
                                Analyze Sentiment
                            </button>
                        </div>

                        {/* Sentiment Result */}
                        {sentiment && (
                            <div className={`p-4 rounded-lg mb-4 border ${getSentimentColor()}`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">{getSentimentEmoji()}</div>
                                    <div>
                                        <div className="font-semibold text-lg">
                                            Sentiment: {sentiment.toUpperCase()}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Confidence: {confidence}%
                                        </div>
                                        <div className="h-1 bg-gray-700 rounded-full mt-2 w-32">
                                            <div
                                                className={`h-1 rounded-full ${sentiment === "positive" ? "bg-green-500" :
                                                        sentiment === "negative" ? "bg-red-500" : "bg-yellow-500"
                                                    }`}
                                                style={{ width: `${confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Word Importance Toggle */}
                        <button
                            onClick={() => setShowWordImportance(!showWordImportance)}
                            className="text-sm text-purple-400 hover:text-purple-300 mb-4"
                        >
                            {showWordImportance ? "Hide" : "Show"} How it works →
                        </button>

                        {showWordImportance && (
                            <div className="bg-black/30 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold mb-2">📊 Word Importance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-green-400 text-sm mb-2">Positive words detected:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {positiveWords.map(word => (
                                                <span key={word} className="text-xs px-2 py-1 bg-green-500/20 rounded">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-red-400 text-sm mb-2">Negative words detected:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {negativeWords.map(word => (
                                                <span key={word} className="text-xs px-2 py-1 bg-red-500/20 rounded">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* How it works */}
                        <div className="bg-black/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">🔍 How Sentiment Analysis Works</h3>
                            <p className="text-sm text-gray-300">
                                This simulation uses a bag-of-words model to detect sentiment. Real sentiment analysis uses
                                advanced NLP techniques like LSTM, Transformers, or BERT to understand context, sarcasm,
                                and nuanced emotions in text.
                            </p>
                        </div>

                        {!completed && score >= 100 && (
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