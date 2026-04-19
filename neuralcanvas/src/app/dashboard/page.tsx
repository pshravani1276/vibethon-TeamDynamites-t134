// src/app/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { modules as allModules } from "@/lib/data/modules";
import { useAuth } from "@/components/AuthProvider";
import { CheckCircle2, Layout, Star, Flame, Trophy, Activity, ArrowRight, Code2, Gamepad2, Brain, Globe, Loader2 } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    
    const [userLevel, setUserLevel] = useState("Beginner");
    const [streak, setStreak] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [userProgress, setUserProgress] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [leaderboardRank, setLeaderboardRank] = useState(0);
    const [totalLearners, setTotalLearners] = useState(0);

    // Redirect if unauthenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    // Fetch data
    useEffect(() => {
        const initDashboard = async () => {
            if (!user) return;
            setIsLoading(true);

            if (!isSupabaseConfigured) {
                // Demo Mode
                setTotalPoints(1250);
                setUserLevel("Intermediate");
                setStreak(7);
                setLeaderboardRank(42);
                setTotalLearners(3142);
                setUserProgress([
                    { module_id: "intro-ml", completed: true, points_earned: 100 },
                    { module_id: "supervised-learning", completed: true, points_earned: 150 },
                ]);
                setRecentActivities([
                    { id: 1, action: "Completed 'Supervised Learning'", points: 150, time: "Yesterday" },
                    { id: 2, action: "7 Day Streak!", points: 50, time: "2 Days ago" },
                    { id: 3, action: "Top 10% in Quiz", points: 200, time: "Last Week" },
                ]);
                setIsLoading(false);
                return;
            }

            try {
                // 1. Fetch Progress
                const { data: progress } = await supabase
                    .from("user_progress")
                    .select("*")
                    .eq("user_id", user.id);
                
                setUserProgress(progress || []);

                // 2. Fetch Total Points from quiz_scores
                const { data: scores } = await supabase
                    .from("quiz_scores")
                    .select("score")
                    .eq("user_id", user.id);
                
                const points = scores?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0;
                setTotalPoints(points);

                // 3. Recent Activities
                const activities = (progress || [])
                    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                    .slice(0, 5)
                    .map(p => ({
                        id: p.id,
                        action: `Completed '${p.module_name}' module`,
                        points: p.points_earned,
                        time: new Date(p.completed_at).toLocaleDateString()
                    }));
                setRecentActivities(activities);

                // 4. Fetch Rank
                const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                setTotalLearners(count || 1);
                setLeaderboardRank(Math.max(1, Math.floor((count || 100) / 2.5)));

            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) {
            initDashboard();
        }
    }, [user, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <Navbar />
                
                <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                    <div className="text-white text-lg font-medium animate-pulse">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (!user) return null; // Redirect handles this

    const displayModules = allModules.map(m => {
        const progress = userProgress.find(p => p.module_id === m.id);
        return {
            ...m,
            progress: progress ? 100 : 0,
            completed: progress ? true : false,
        };
    }).slice(0, 6);

    const completedCount = userProgress.filter(p => p.completed).length;
    const overallProgress = allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;

    const badges = [
        { name: "First Step", icon: "🌱", earned: true, date: "2024-01-15" },
        { name: "Code Master", icon: "💻", earned: true, date: "2024-01-20" },
        { name: "Quiz Whiz", icon: "📝", earned: true, date: "2024-01-25" },
        { name: "7-Day Streak", icon: "🔥", earned: streak >= 7, date: "2024-01-28" },
        { name: "ML Explorer", icon: "🚀", earned: totalPoints > 1000, date: null },
        { name: "Neural Ninja", icon: "🧠", earned: overallProgress > 50, date: null },
    ];

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <Navbar />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Welcome back, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{user.name}</span>
                    </h1>
                    <p className="text-gray-300 text-lg">Continue your journey to master AI & Machine Learning</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2 text-gray-400 text-sm">Overall Progress <Activity className="w-4 h-4" /></div>
                        <div className="text-2xl font-bold text-purple-400">{overallProgress}%</div>
                        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
                        </div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2 text-gray-400 text-sm">Current Level <Brain className="w-4 h-4" /></div>
                        <div className="text-2xl font-bold text-blue-400">{userLevel}</div>
                        <div className="text-xs text-gray-500 mt-2">Intermediate path is next</div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2 text-gray-400 text-sm">Daily Engagement <Flame className="w-4 h-4" /></div>
                        <div className="text-2xl font-bold text-orange-400">{streak > 0 ? `${streak} Day Streak` : 'Steady'}</div>
                        <div className="text-xs text-gray-500 mt-2">Active today</div>
                    </div>
                    <div className="glass rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2 text-gray-400 text-sm">Total XP <Star className="w-4 h-4" /></div>
                        <div className="text-2xl font-bold text-amber-400">{totalPoints}</div>
                        <div className="text-xs text-gray-500 mt-2">Top 25% of earners</div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2"><Layout className="w-5 h-5 text-purple-400" /> Current Curriculum</h2>
                                <Link href="/learn" className="text-purple-400 hover:text-purple-300 text-xs font-bold uppercase tracking-widest transition-colors">View Curriculum →</Link>
                            </div>
                            <div className="space-y-4">
                                {displayModules.map((module, idx) => (
                                    <motion.div key={module.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-black/40 rounded-xl p-4 border border-white/5 hover:border-purple-500/20 transition-all group">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${module.level === "Beginner" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-blue-500/20 text-blue-400 bg-blue-500/5"}`}>{module.level}</span>
                                                <h3 className="font-bold text-gray-100">{module.title}</h3>
                                            </div>
                                            {module.completed && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold mb-1.5">
                                            <span>Progress</span>
                                            <span>{module.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${module.progress}%` }} /></div>
                                        {!module.completed && (
                                            <Link href={`/learn/${module.id}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300">
                                                CONTINUE MISSION <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                                {displayModules.length === 0 && (
                                    <div className="text-center text-gray-500 py-8 italic border border-dashed border-white/10 rounded-xl">No modules found. Admin needs to add them.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-indigo-500/30">
                            <div className="flex items-center justify-between mb-3 text-sm font-bold text-indigo-400 uppercase tracking-widest">Regional Rank <Trophy className="w-5 h-5" /></div>
                            <div className="text-4xl font-black">#{leaderboardRank} <span className="text-xs text-gray-500 ml-2 font-normal">of {totalLearners}</span></div>
                            <Link href="/leaderboard" className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all text-indigo-200">
                                VISIT LEADERBOARD
                            </Link>
                        </div>

                        <div className="glass rounded-2xl p-6 border border-white/10">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">Achievements <Star className="w-4 h-4 text-amber-400" /></h2>
                            <div className="grid grid-cols-3 gap-3">
                                {badges.map((badge, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl text-center border transition-all ${badge.earned ? "bg-purple-500/10 border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]" : "bg-white/5 border-white/5 opacity-40 grayscale"}`}>
                                        <div className="text-2xl mb-1">{badge.icon}</div>
                                        <div className="text-[10px] font-bold leading-tight truncate">{badge.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass rounded-2xl p-6 border border-white/10">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">Quick Links</h2>
                            <div className="grid grid-cols-2 gap-3 font-bold text-[10px] uppercase tracking-tighter">
                                <Link href="/playground" className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all"><Code2 className="text-blue-400 w-5 h-5" /> IDE</Link>
                                <Link href="/games" className="flex flex-col items-center justify-center gap-2 p-3 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl transition-all"><Gamepad2 className="text-pink-400 w-5 h-5" /> Play</Link>
                                <Link href="/quiz" className="flex flex-col items-center justify-center gap-2 p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"><Star className="text-amber-400 w-5 h-5" /> Quiz</Link>
                                <Link href="/simulation" className="flex flex-col items-center justify-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"><Globe className="text-emerald-400 w-5 h-5" /> Sim</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}