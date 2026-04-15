// src/app/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("Learner");
    const [userEmail, setUserEmail] = useState("");
    const [userLevel, setUserLevel] = useState("Beginner");
    const [streak, setStreak] = useState(7);
    const [totalPoints, setTotalPoints] = useState(1250);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            const userData = JSON.parse(user);
            setUserName(userData.name || userData.email?.split("@")[0] || "Learner");
            setUserEmail(userData.email || "");
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [router]);

    // Progress data
    const modules = [
        { id: 1, name: "Introduction to AI/ML", progress: 100, completed: true, level: "Beginner", points: 100 },
        { id: 2, name: "Python for ML", progress: 100, completed: true, level: "Beginner", points: 100 },
        { id: 3, name: "Data Preprocessing", progress: 75, completed: false, level: "Beginner", points: 75 },
        { id: 4, name: "Linear Regression", progress: 40, completed: false, level: "Intermediate", points: 40 },
        { id: 5, name: "Decision Trees", progress: 20, completed: false, level: "Intermediate", points: 20 },
        { id: 6, name: "Neural Networks", progress: 0, completed: false, level: "Advanced", points: 0 },
    ];

    const badges = [
        { name: "First Step", icon: "🌱", earned: true, date: "2024-01-15" },
        { name: "Code Master", icon: "💻", earned: true, date: "2024-01-20" },
        { name: "Quiz Whiz", icon: "📝", earned: true, date: "2024-01-25" },
        { name: "7-Day Streak", icon: "🔥", earned: true, date: "2024-01-28" },
        { name: "ML Explorer", icon: "🚀", earned: false, date: null },
        { name: "Neural Ninja", icon: "🧠", earned: false, date: null },
    ];

    const recentActivities = [
        { id: 1, action: "Completed 'Python for ML' module", points: 100, time: "2 hours ago" },
        { id: 2, action: "Scored 85% on Data Preprocessing Quiz", points: 50, time: "5 hours ago" },
        { id: 3, action: "Earned '7-Day Streak' badge", points: 200, time: "1 day ago" },
        { id: 4, action: "Practiced Decision Tree game", points: 30, time: "2 days ago" },
    ];

    const leaderboardRank = 12;
    const totalLearners = 543;
    const completedModules = modules.filter(m => m.completed).length;
    const totalModules = modules.length;
    const overallProgress = Math.round((completedModules / totalModules) * 100);

    if (isLoading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading your dashboard...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Overlay for better readability */}
            <div className="fixed inset-0 bg-black/40 z-[5]" />

            {/* Navbar */}
            <div className="relative z-20">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">

                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Welcome back,{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {userName}
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Continue your journey to master AI & Machine Learning
                    </p>
                    {userEmail && (
                        <p className="text-gray-500 text-sm mt-1">{userEmail}</p>
                    )}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {/* Overall Progress */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Overall Progress</span>
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400">{overallProgress}%</div>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{completedModules}/{totalModules} modules</div>
                    </div>

                    {/* Current Level */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Current Level</span>
                            <span className="text-2xl">📚</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">{userLevel}</div>
                        <div className="text-sm text-gray-500 mt-2">Next: Advanced (40% complete)</div>
                    </div>

                    {/* Daily Streak */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Daily Streak</span>
                            <span className="text-2xl">🔥</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">{streak} days</div>
                        <div className="text-sm text-gray-500 mt-2">Keep it going!</div>
                    </div>

                    {/* Total Points */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Total Points</span>
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
                        <div className="text-sm text-gray-500 mt-2">Next badge at 1500 points</div>
                    </div>
                </motion.div>

                {/* Main Grid - Learning Modules & Progress */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">

                    {/* Learning Modules - 2 columns wide */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Your Learning Path</h2>
                                <Link href="/learn" className="text-purple-400 hover:text-purple-300 text-sm">
                                    View All →
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {modules.map((module, idx) => (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-black/30 rounded-lg p-4 border border-white/5 hover:border-purple-500/30 transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-1 rounded ${module.level === "Beginner" ? "bg-green-500/20 text-green-400" :
                                                    module.level === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/20 text-red-400"
                                                    }`}>
                                                    {module.level}
                                                </span>
                                                <h3 className="font-semibold">{module.name}</h3>
                                            </div>
                                            {module.completed && (
                                                <span className="text-green-400 text-sm">✓ Completed</span>
                                            )}
                                        </div>

                                        <div className="relative pt-1">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Progress</span>
                                                <span>{module.progress}%</span>
                                            </div>
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                                                <div
                                                    style={{ width: `${module.progress}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
                                                />
                                            </div>
                                        </div>

                                        {!module.completed && module.progress > 0 && (
                                            <Link
                                                href={`/learn/${module.id}`}
                                                className="inline-block mt-3 text-sm text-purple-400 hover:text-purple-300"
                                            >
                                                Continue Learning →
                                            </Link>
                                        )}

                                        {module.progress === 0 && !module.completed && (
                                            <Link
                                                href={`/learn/${module.id}`}
                                                className="inline-block mt-3 text-sm text-gray-400 hover:text-purple-300"
                                            >
                                                Start Module →
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar - Badges & Activities */}
                    <div className="space-y-8">

                        {/* Leaderboard Rank Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300">Global Rank</span>
                                <span className="text-2xl">🏆</span>
                            </div>
                            <div className="text-3xl font-bold text-green-400">#{leaderboardRank}</div>
                            <div className="text-sm text-gray-400 mt-2">
                                Top {Math.round((leaderboardRank / totalLearners) * 100)}% of {totalLearners} learners
                            </div>
                            <Link href="/leaderboard" className="inline-block mt-3 text-sm text-purple-400 hover:text-purple-300">
                                View Leaderboard →
                            </Link>
                        </motion.div>

                        {/* Badges Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Badges</h2>
                                <Link href="/badges" className="text-purple-400 hover:text-purple-300 text-sm">
                                    View All →
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {badges.map((badge, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-center p-3 rounded-lg transition-all ${badge.earned
                                            ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                                            : "bg-white/5 border border-white/10 opacity-40"
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{badge.icon}</div>
                                        <div className="text-xs font-medium">{badge.name}</div>
                                        {badge.earned && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {badge.date?.split("-")[2]}/{badge.date?.split("-")[1]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                        >
                            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex justify-between items-start text-sm">
                                        <div className="flex-1">
                                            <p className="text-gray-200">{activity.action}</p>
                                            <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                                        </div>
                                        <div className="text-green-400 font-semibold">+{activity.points}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
                        >
                            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/playground"
                                    className="text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                                >
                                    <div className="text-2xl mb-1">💻</div>
                                    <div className="text-sm">Code</div>
                                </Link>
                                <Link
                                    href="/games"
                                    className="text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                                >
                                    <div className="text-2xl mb-1">🎮</div>
                                    <div className="text-sm">Play</div>
                                </Link>
                                <Link
                                    href="/quiz"
                                    className="text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                                >
                                    <div className="text-2xl mb-1">📝</div>
                                    <div className="text-sm">Quiz</div>
                                </Link>
                                <Link
                                    href="/simulations"
                                    className="text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                                >
                                    <div className="text-2xl mb-1">🌍</div>
                                    <div className="text-sm">Simulate</div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Recommendation Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20"
                >
                    <h2 className="text-xl font-bold mb-3">📌 Recommended for You</h2>
                    <p className="text-gray-300 mb-4">
                        Based on your progress, we recommend focusing on <strong>Decision Trees</strong> next.
                        Complete this module to unlock Intermediate level content and earn 200 points!
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/learn/5"
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Continue Learning →
                        </Link>
                        <Link
                            href="/games/decision-tree"
                            className="px-6 py-2 border border-purple-500 rounded-lg font-semibold hover:bg-purple-500/20 transition-all"
                        >
                            Play Game 🎮
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}