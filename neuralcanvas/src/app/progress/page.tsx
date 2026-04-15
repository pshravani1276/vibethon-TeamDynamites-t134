// src/app/progress/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface ProgressData {
    totalPoints: number;
    completedModules: number;
    totalModules: number;
    quizAverage: number;
    streak: number;
    badgesEarned: number;
    totalBadges: number;
    modulesByLevel: {
        beginner: { completed: number; total: number };
        intermediate: { completed: number; total: number };
        advanced: { completed: number; total: number };
    };
    recentActivity: {
        id: number;
        type: string;
        title: string;
        points: number;
        date: string;
    }[];
    weeklyPoints: number[];
}

export default function ProgressPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<ProgressData>({
        totalPoints: 0,
        completedModules: 0,
        totalModules: 19,
        quizAverage: 0,
        streak: 0,
        badgesEarned: 0,
        totalBadges: 6,
        modulesByLevel: {
            beginner: { completed: 0, total: 5 },
            intermediate: { completed: 0, total: 6 },
            advanced: { completed: 0, total: 8 }
        },
        recentActivity: [],
        weeklyPoints: [0, 0, 0, 0, 0, 0, 0]
    });

    useEffect(() => {
        const fetchProgress = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            // Fetch completed modules
            const { data: completedModules } = await supabase
                .from("user_progress")
                .select("module_id, points_earned, completed_at")
                .eq("user_id", currentUser.id)
                .eq("completed", true);

            // Fetch quiz scores
            const { data: quizScores } = await supabase
                .from("quiz_scores")
                .select("score, percentage")
                .eq("user_id", currentUser.id);

            // Fetch badges
            const { data: userBadges } = await supabase
                .from("user_badges")
                .select("badge_id")
                .eq("user_id", currentUser.id);

            // Calculate progress
            const completedCount = completedModules?.length || 0;
            const totalPoints = (completedModules || []).reduce((sum: number, m: any) => sum + (m.points_earned || 0), 0);
            // Calculate quiz average
            const avgPercentage = quizScores?.length
                ? quizScores.reduce((sum: number, q: any) => sum + (q.percentage || 0), 0) / quizScores.length
                : 0;

            // Calculate modules by level (assuming module_id 1-5 beginner, 6-11 intermediate, 12-19 advanced)
            const beginnerCompleted = completedModules?.filter((m: any) => m.module_id >= 1 && m.module_id <= 5).length || 0;
            const intermediateCompleted = completedModules?.filter((m: any) => m.module_id >= 6 && m.module_id <= 11).length || 0;
            const advancedCompleted = completedModules?.filter((m: any) => m.module_id >= 12 && m.module_id <= 19).length || 0;

            // Recent activity
            const recent = completedModules?.slice(-5).reverse().map((m: any, idx: number) => ({
                id: idx,
                type: "module",
                title: `Completed Module ${m.module_id}`,
                points: m.points_earned || 0,
                date: new Date(m.completed_at).toLocaleDateString()
            })) || [];
            setProgress({
                totalPoints,
                completedModules: completedCount,
                totalModules: 19,
                quizAverage: Math.round(avgPercentage),
                streak: 7,
                badgesEarned: userBadges?.length || 0,
                totalBadges: 6,
                modulesByLevel: {
                    beginner: { completed: beginnerCompleted, total: 5 },
                    intermediate: { completed: intermediateCompleted, total: 6 },
                    advanced: { completed: advancedCompleted, total: 8 }
                },
                recentActivity: recent,
                weeklyPoints: [120, 200, 150, 300, 250, 180, totalPoints % 500]
            });

            setLoading(false);
        };

        fetchProgress();
    }, [router]);

    const overallPercentage = (progress.completedModules / progress.totalModules) * 100;
    const beginnerPercentage = (progress.modulesByLevel.beginner.completed / progress.modulesByLevel.beginner.total) * 100;
    const intermediatePercentage = (progress.modulesByLevel.intermediate.completed / progress.modulesByLevel.intermediate.total) * 100;
    const advancedPercentage = (progress.modulesByLevel.advanced.completed / progress.modulesByLevel.advanced.total) * 100;

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading progress...</div>
            </div>
        );
    }

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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Your Learning Progress
                        </h1>
                        <p className="text-gray-300 text-lg">Track your journey to becoming an AI/ML expert</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">⭐</div>
                            <div className="text-2xl font-bold text-purple-400">{progress.totalPoints}</div>
                            <div className="text-gray-400 text-sm">Total Points</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">📚</div>
                            <div className="text-2xl font-bold text-purple-400">{progress.completedModules}/{progress.totalModules}</div>
                            <div className="text-gray-400 text-sm">Modules Completed</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">📝</div>
                            <div className="text-2xl font-bold text-purple-400">{progress.quizAverage}%</div>
                            <div className="text-gray-400 text-sm">Quiz Average</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-3xl mb-2">🔥</div>
                            <div className="text-2xl font-bold text-purple-400">{progress.streak}</div>
                            <div className="text-gray-400 text-sm">Day Streak</div>
                        </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-semibold">Overall Progress</span>
                            <span className="text-purple-400">{Math.round(overallPercentage)}%</span>
                        </div>
                        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${overallPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Level Progress Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🌱</span>
                                <h3 className="text-xl font-semibold">Beginner</h3>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-green-400">{progress.modulesByLevel.beginner.completed}/{progress.modulesByLevel.beginner.total}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${beginnerPercentage}%` }} />
                            </div>
                            {beginnerPercentage === 100 && (
                                <div className="text-green-400 text-sm flex items-center gap-1">✅ Complete!</div>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🚀</span>
                                <h3 className="text-xl font-semibold">Intermediate</h3>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-blue-400">{progress.modulesByLevel.intermediate.completed}/{progress.modulesByLevel.intermediate.total}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${intermediatePercentage}%` }} />
                            </div>
                            {intermediatePercentage === 100 && (
                                <div className="text-green-400 text-sm flex items-center gap-1">✅ Complete!</div>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🏆</span>
                                <h3 className="text-xl font-semibold">Advanced</h3>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-purple-400">{progress.modulesByLevel.advanced.completed}/{progress.modulesByLevel.advanced.total}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${advancedPercentage}%` }} />
                            </div>
                            {advancedPercentage === 100 && (
                                <div className="text-green-400 text-sm flex items-center gap-1">✅ Mastered!</div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Activity Chart */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                        <h3 className="text-xl font-semibold mb-4">📊 Weekly Activity</h3>
                        <div className="flex items-end justify-between gap-2 h-48">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                                <div key={day} className="flex-1 text-center">
                                    <div
                                        className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-lg transition-all duration-500 hover:opacity-80"
                                        style={{ height: `${(progress.weeklyPoints[idx] / 500) * 100}%`, minHeight: "4px" }}
                                    />
                                    <div className="text-xs text-gray-400 mt-2">{day}</div>
                                    <div className="text-xs text-purple-400">{progress.weeklyPoints[idx]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity & Badges */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4">🕐 Recent Activity</h3>
                            {progress.recentActivity.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No activity yet. Start learning!</p>
                            ) : (
                                <div className="space-y-3">
                                    {progress.recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                            <div>
                                                <div className="text-sm font-medium">{activity.title}</div>
                                                <div className="text-xs text-gray-500">{activity.date}</div>
                                            </div>
                                            <div className="text-green-400 font-semibold">+{activity.points}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Badges Progress */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4">🏅 Badges Earned</h3>
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-purple-400">{progress.badgesEarned}/{progress.totalBadges}</div>
                                <div className="text-gray-400 text-sm">Badges Collected</div>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                                    style={{ width: `${(progress.badgesEarned / progress.totalBadges) * 100}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div>🌱 First Step</div>
                                <div>💻 Code Master</div>
                                <div>📝 Quiz Whiz</div>
                            </div>
                        </div>
                    </div>

                    {/* Next Milestone */}
                    <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">🎯 Next Milestone</h3>
                                <p className="text-gray-300 text-sm">
                                    {progress.completedModules < 5
                                        ? "Complete Beginner level to unlock Intermediate modules"
                                        : progress.completedModules < 11
                                            ? "Complete Intermediate level to unlock Advanced modules"
                                            : progress.completedModules < 19
                                                ? "Complete all modules to become an AI/ML Master!"
                                                : "Congratulations! You're an AI/ML Master!"}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">
                                    {progress.completedModules < 5
                                        ? `${5 - progress.completedModules} left`
                                        : progress.completedModules < 11
                                            ? `${11 - progress.completedModules} left`
                                            : progress.completedModules < 19
                                                ? `${19 - progress.completedModules} left`
                                                : "🏆 Complete!"}
                                </div>
                                <div className="text-xs text-gray-400">to next level</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}