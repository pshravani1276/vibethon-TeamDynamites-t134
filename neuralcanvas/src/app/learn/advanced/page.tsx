// src/app/learn/advanced/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";
import { modules as allModules } from "@/lib/data/modules";
import { Trophy, Star, Clock, CheckCircle2, Award, Zap, BrainCircuit } from "lucide-react";

export default function AdvancedLearningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
    
    const advancedModules = allModules.filter(m => m.level === "Advanced");

    useEffect(() => {
        const fetchUserAndProgress = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            // Fetch user's completed modules
            const { data: progress } = await supabase
                .from("user_progress")
                .select("module_id")
                .eq("user_id", currentUser.id)
                .eq("completed", true);

            if (progress) {
                setCompletedIds(new Set(progress.map((m: any) => m.module_id)));
            }
            setLoading(false);
        };

        fetchUserAndProgress();
    }, [router]);

    const completedCount = advancedModules.filter(m => completedIds.has(m.id)).length;
    const totalPointsEarned = advancedModules
        .filter(m => completedIds.has(m.id))
        .reduce((sum, m) => sum + m.points, 0);
    const progressPercent = Math.round((completedCount / advancedModules.length) * 100);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-4">
                            <BrainCircuit className="w-4 h-4" />
                            Advanced Level
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Expert Mastery: AI Mastery
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Master the architecture of modern AI. Deep Learning, CNNs, Transformers, and GenAI.
                        </p>
                    </div>

                    {/* Stats & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="md:col-span-3 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-gray-400 font-medium">Learning Path Progress</span>
                                <span className="text-2xl font-bold text-red-400">{progressPercent}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between mt-3 text-xs text-gray-500 font-mono">
                                <span>INTERMEDIATE</span>
                                <span>{completedCount} / {advancedModules.length} MODULES COMPLETED</span>
                                <span>EXPERT</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 flex flex-col items-center justify-center text-center">
                            <Award className="w-10 h-10 text-pink-400 mb-2" />
                            <div className="text-2xl font-bold text-white">{totalPointsEarned}</div>
                            <div className="text-xs text-pink-300 font-medium uppercase tracking-wider">XP Earned</div>
                        </div>
                    </div>

                    {/* Modules Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {advancedModules.map((module, idx) => {
                                const isCompleted = completedIds.has(module.id);
                                return (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => router.push(`/learn/${module.id}`)}
                                        className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all cursor-pointer overflow-hidden ${
                                            isCompleted
                                                ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
                                                : "border-white/10 hover:border-pink-500/40 hover:bg-white/10 shadow-xl hover:shadow-pink-500/5"
                                        }`}
                                    >
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Zap className="w-24 h-24" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-pink-400">+{module.points} XP</div>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                        <Clock className="w-3 h-3" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">{module.title}</h3>
                                            <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                {module.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className={`text-[10px] px-2 py-1 rounded-md border uppercase tracking-tighter font-black ${
                                                    isCompleted 
                                                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                                        : 'bg-white/5 border-white/10 text-gray-400'
                                                }`}>
                                                    {module.category}
                                                </span>
                                                <button className={`text-sm font-bold flex items-center gap-1 ${isCompleted ? 'text-green-400' : 'text-pink-400 group-hover:translate-x-1 transition-transform'}`}>
                                                    {isCompleted ? "Review" : "Start Now"} →
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Completion Reward */}
                    {completedCount === advancedModules.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-12 p-10 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 rounded-3xl border border-pink-500/30 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
                            <div className="text-6xl mb-4 animate-bounce">🏆</div>
                            <h3 className="text-3xl font-bold text-white mb-2">Grandmaster Achievement!</h3>
                            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                                You've reached the pinnacle of NeuralCanvas. You've demonstrated expertise across all major areas of Artificial Intelligence. Your journey to the top of the leaderboard starts now!
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <button className="px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl font-black text-white hover:scale-105 transition-all shadow-xl shadow-pink-500/20">
                                    CLAIM MASTER BADGE
                                </button>
                                <button 
                                    onClick={() => router.push("/leaderboard")}
                                    className="px-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10"
                                >
                                    VIEW RANKINGS →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}