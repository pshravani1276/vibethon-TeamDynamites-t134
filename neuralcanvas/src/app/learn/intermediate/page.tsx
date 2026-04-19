// src/app/learn/intermediate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";
import { modules as allModules } from "@/lib/data/modules";
import { Rocket, Star, Clock, CheckCircle2, Award, ArrowUpCircle } from "lucide-react";

export default function IntermediateLearningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
    
    const intermediateModules = allModules.filter(m => m.level === "Intermediate");

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

    const completedCount = intermediateModules.filter(m => completedIds.has(m.id)).length;
    const totalPointsEarned = intermediateModules
        .filter(m => completedIds.has(m.id))
        .reduce((sum, m) => sum + m.points, 0);
    const progressPercent = Math.round((completedCount / intermediateModules.length) * 100);

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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
                            <Rocket className="w-4 h-4" />
                            Intermediate Level
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Practical Machine Learning
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Go beyond the basics. Master data cleaning, feature engineering, and core classification algorithms.
                        </p>
                    </div>

                    {/* Stats & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="md:col-span-3 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-gray-400 font-medium">Learning Path Progress</span>
                                <span className="text-2xl font-bold text-blue-400">{progressPercent}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between mt-3 text-xs text-gray-500 font-mono">
                                <span>BASICS</span>
                                <span>{completedCount} / {intermediateModules.length} MODULES COMPLETED</span>
                                <span>ADVANCED</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 flex flex-col items-center justify-center text-center">
                            <Award className="w-10 h-10 text-blue-400 mb-2" />
                            <div className="text-2xl font-bold text-white">{totalPointsEarned}</div>
                            <div className="text-xs text-blue-300 font-medium uppercase tracking-wider">XP Earned</div>
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
                            {intermediateModules.map((module, idx) => {
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
                                                : "border-white/10 hover:border-blue-500/40 hover:bg-white/10 shadow-xl hover:shadow-blue-500/5"
                                        }`}
                                    >
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Rocket className="w-24 h-24" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-blue-400">+{module.points} XP</div>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                        <Clock className="w-3 h-3" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{module.title}</h3>
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
                                                <button className={`text-sm font-bold flex items-center gap-1 ${isCompleted ? 'text-green-400' : 'text-blue-400 group-hover:translate-x-1 transition-transform'}`}>
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
                    {completedCount === intermediateModules.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl border border-blue-500/30 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Intermediate Path Complete!</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                You've mastered the core tools of a Data Scientist. Now it's time to dive into Deep Learning and Neural Networks!
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                                    Claim Badge
                                </button>
                                <button 
                                    onClick={() => router.push("/learn/advanced")}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                                >
                                    Advanced Path →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Prerequisites Note */}
                <div className="mt-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 text-xl flex-shrink-0">⚠️</div>
                    <div>
                        <h4 className="font-bold text-yellow-400 mb-1">Prerequisites Check</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            We recommend completing the <Link href="/learn/beginner" className="text-yellow-400/80 hover:text-yellow-400 underline">Beginner Path</Link> first. 
                            Ensure you have a basic understanding of Python, NumPy, and Pandas before starting these modules.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}