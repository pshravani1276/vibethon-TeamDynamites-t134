// src/app/leaderboard/challenges/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Code2, Brain, Zap, Target, ArrowRight, Activity, CircleCheckBig, Clock } from "lucide-react";

interface Challenge {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    acceptanceRate: number;
    completed?: boolean;
}

const CHALLENGES: Challenge[] = [
    { id: "two-sum", title: "Two Sum: Array Optimizer", difficulty: "Easy", category: "Arrays", acceptanceRate: 85, completed: true },
    { id: "linear-regression", title: "Implementing Linear Regression from Scratch", difficulty: "Medium", category: "Machine Learning", acceptanceRate: 64 },
    { id: "matrix-multiplication", title: "Matrix Dot Product Validation", difficulty: "Easy", category: "Linear Algebra", acceptanceRate: 91 },
    { id: "gradient-descent", title: "Optimize with Gradient Descent", difficulty: "Hard", category: "Optimization", acceptanceRate: 32 },
    { id: "kmeans-cluster", title: "K-Means Centroid Assignment", difficulty: "Medium", category: "Clustering", acceptanceRate: 55 },
    { id: "relu-activation", title: "ReLU Activation Function", difficulty: "Easy", category: "Neural Networks", acceptanceRate: 96 },
    { id: "decision-tree-split", title: "Calculate Information Gain", difficulty: "Medium", category: "Decision Trees", acceptanceRate: 48 },
    { id: "backpropagation-step", title: "Single Step Backpropagation", difficulty: "Hard", category: "Neural Networks", acceptanceRate: 21 },
];

export default function ChallengesPage() {
    const [filter, setFilter] = useState("All");

    const filteredChallenges = filter === "All" 
        ? CHALLENGES 
        : CHALLENGES.filter(c => c.difficulty === filter);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <Link href="/leaderboard" className="text-purple-400 hover:text-purple-300 text-sm font-medium mb-3 inline-flex items-center gap-1">
                            ← Back to Leaderboard
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                            <Target className="w-8 h-8 text-purple-400" />
                            Coding Challenges
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-2xl">
                            Solve practical AI/ML programming challenges to increase your rank on the leaderboard.
                        </p>
                    </div>
                    
                    <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                        {["All", "Easy", "Medium", "Hard"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    filter === f ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="glass p-5 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-lg mb-4">Your Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Easy</span>
                                        <span className="font-mono text-emerald-400">1/3</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full w-1/3"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Medium</span>
                                        <span className="font-mono text-amber-400">0/3</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full"><div className="h-full bg-amber-500 rounded-full w-0"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Hard</span>
                                        <span className="font-mono text-red-400">0/2</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full"><div className="h-full bg-red-500 rounded-full w-0"></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-5 rounded-2xl border border-white/10 bg-gradient-to-b from-purple-500/10 to-transparent">
                            <h3 className="font-bold text-sm text-purple-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                                <Zap className="w-4 h-4" /> Daily Goal
                            </h3>
                            <p className="text-xs text-gray-400 mb-3">Solve 2 challenges today to maintain your streak.</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
                                    <CircleCheckBig className="w-4 h-4" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-white/10 text-gray-500 flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Challenges List */}
                    <div className="lg:col-span-3 glass rounded-2xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <div className="col-span-7 md:col-span-6">Problem</div>
                            <div className="col-span-2 hidden md:block">Category</div>
                            <div className="col-span-3 md:col-span-2">Difficulty</div>
                            <div className="col-span-2 text-right">Acceptance</div>
                        </div>
                        
                        <div className="divide-y divide-white/5">
                            {filteredChallenges.map((challenge, idx) => (
                                <Link 
                                    key={challenge.id} 
                                    href={`/leaderboard/challenges/${challenge.id}`}
                                >
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        {/* Title */}
                                        <div className="col-span-7 md:col-span-6 flex items-center gap-3">
                                            {challenge.completed ? (
                                                <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Code2 className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                                            )}
                                            <span className="font-medium group-hover:text-purple-300 transition-colors">{challenge.title}</span>
                                        </div>
                                        
                                        {/* Category */}
                                        <div className="col-span-2 hidden md:flex items-center text-sm text-gray-400">
                                            {challenge.category}
                                        </div>
                                        
                                        {/* Difficulty */}
                                        <div className="col-span-3 md:col-span-2">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${
                                                challenge.difficulty === 'Easy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                challenge.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                                {challenge.difficulty}
                                            </span>
                                        </div>
                                        
                                        {/* Acceptance */}
                                        <div className="col-span-2 flex items-center justify-end text-sm font-mono text-gray-400">
                                            {challenge.acceptanceRate}%
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                            {filteredChallenges.length === 0 && (
                                <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 m-4 rounded-xl">
                                    No challenges found for the selected filter.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
