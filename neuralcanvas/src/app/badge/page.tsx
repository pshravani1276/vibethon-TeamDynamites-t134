// src/app/badge/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
    requirement: string;
    earned: boolean;
    earnedDate?: string;
    rarity: "common" | "rare" | "epic" | "legendary";
}

export default function BadgePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const allBadges: Badge[] = [
        // Learning Badges
        { id: "first-step", name: "First Step", icon: "🌱", description: "Complete your first module", category: "Learning", requirement: "Complete 1 module", earned: false, rarity: "common" },
        { id: "fast-learner", name: "Fast Learner", icon: "⚡", description: "Complete 3 modules", category: "Learning", requirement: "Complete 3 modules", earned: false, rarity: "common" },
        { id: "knowledge-seeker", name: "Knowledge Seeker", icon: "📚", description: "Complete all beginner modules", category: "Learning", requirement: "Complete beginner level", earned: false, rarity: "rare" },
        { id: "ml-explorer", name: "ML Explorer", icon: "🚀", description: "Complete all intermediate modules", category: "Learning", requirement: "Complete intermediate level", earned: false, rarity: "epic" },
        { id: "ai-master", name: "AI Master", icon: "🧠", description: "Complete all advanced modules", category: "Learning", requirement: "Complete advanced level", earned: false, rarity: "legendary" },
        // Quiz Badges
        { id: "quiz-whiz", name: "Quiz Whiz", icon: "📝", description: "Score 80%+ on any quiz", category: "Quiz", requirement: "Score 80%+ on a quiz", earned: false, rarity: "common" },
        { id: "perfect-score", name: "Perfect Score", icon: "💯", description: "Score 100% on any quiz", category: "Quiz", requirement: "Score 100% on a quiz", earned: false, rarity: "epic" },
        { id: "quiz-champion", name: "Quiz Champion", icon: "🏅", description: "Complete 10 quizzes", category: "Quiz", requirement: "Complete 10 quizzes", earned: false, rarity: "rare" },
        // Game Badges
        { id: "game-explorer", name: "Game Explorer", icon: "🎮", description: "Play your first game", category: "Games", requirement: "Play 1 game", earned: false, rarity: "common" },
        { id: "decision-tree-pro", name: "Decision Tree Pro", icon: "🌳", description: "Master the Decision Tree game", category: "Games", requirement: "Score 100+ on Decision Tree", earned: false, rarity: "rare" },
        { id: "neural-ninja", name: "Neural Ninja", icon: "🧠", description: "Master the Neural Network game", category: "Games", requirement: "Score 100+ on Neural Network", earned: false, rarity: "epic" },
        // Streak Badges
        { id: "3-day-streak", name: "3-Day Streak", icon: "🔥", description: "Maintain a 3-day learning streak", category: "Streak", requirement: "3-day streak", earned: false, rarity: "common" },
        { id: "7-day-streak", name: "7-Day Streak", icon: "🔥", description: "Maintain a 7-day learning streak", category: "Streak", requirement: "7-day streak", earned: false, rarity: "rare" },
        { id: "30-day-streak", name: "30-Day Streak", icon: "💎", description: "Maintain a 30-day learning streak", category: "Streak", requirement: "30-day streak", earned: false, rarity: "legendary" },
        // Social Badges
        { id: "top-10", name: "Top 10", icon: "🏆", description: "Reach top 10 on the leaderboard", category: "Social", requirement: "Reach top 10", earned: false, rarity: "epic" },
        { id: "code-master", name: "Code Master", icon: "💻", description: "Run 20 code snippets in playground", category: "Social", requirement: "Run 20 code snippets", earned: false, rarity: "rare" },
    ];

    useEffect(() => {
        const fetchBadges = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: userBadges } = await supabase
                .from("user_badges")
                .select("badge_id, earned_at")
                .eq("user_id", user.id);

            if (userBadges) {
                setEarnedBadgeIds(userBadges.map((b: any) => b.badge_id));
            }

            setLoading(false);
        };

        fetchBadges();
    }, [router]);

    const badges = allBadges.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.includes(badge.id),
    }));

    const categories = ["all", ...Array.from(new Set(allBadges.map(b => b.category)))];
    const filteredBadges = filterCategory === "all" ? badges : badges.filter(b => b.category === filterCategory);
    const earnedCount = badges.filter(b => b.earned).length;

    const getRarityStyle = (rarity: string) => {
        switch (rarity) {
            case "common": return { border: "border-gray-500/30", bg: "bg-gray-500/5", text: "text-gray-400", label: "Common" };
            case "rare": return { border: "border-blue-500/30", bg: "bg-blue-500/5", text: "text-blue-400", label: "Rare" };
            case "epic": return { border: "border-purple-500/30", bg: "bg-purple-500/5", text: "text-purple-400", label: "Epic" };
            case "legendary": return { border: "border-yellow-500/30", bg: "bg-yellow-500/5", text: "text-yellow-400", label: "Legendary" };
            default: return { border: "border-gray-500/30", bg: "bg-gray-500/5", text: "text-gray-400", label: "Common" };
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading badges...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 pt-20 sm:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-4">
                            Achievement Badges
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto">
                            Earn badges by completing challenges, quizzes, and reaching milestones
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10 mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-sm sm:text-base font-semibold">Badge Collection</span>
                            <span className="text-purple-400 text-sm sm:text-base font-bold">{earnedCount}/{badges.length}</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(earnedCount / badges.length) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 rounded-full"
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
                            <span>🟡 Common: {badges.filter(b => b.rarity === "common" && b.earned).length}/{badges.filter(b => b.rarity === "common").length}</span>
                            <span>🔵 Rare: {badges.filter(b => b.rarity === "rare" && b.earned).length}/{badges.filter(b => b.rarity === "rare").length}</span>
                            <span>🟣 Epic: {badges.filter(b => b.rarity === "epic" && b.earned).length}/{badges.filter(b => b.rarity === "epic").length}</span>
                            <span>🌟 Legendary: {badges.filter(b => b.rarity === "legendary" && b.earned).length}/{badges.filter(b => b.rarity === "legendary").length}</span>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${filterCategory === cat
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {filteredBadges.map((badge, idx) => {
                            const rarity = getRarityStyle(badge.rarity);
                            return (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-5 border transition-all ${badge.earned
                                        ? `${rarity.border} ${rarity.bg} hover:scale-[1.02]`
                                        : "border-white/5 bg-white/[0.02] opacity-50"
                                        }`}
                                >
                                    {badge.earned && badge.rarity === "legendary" && (
                                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 animate-pulse" />
                                    )}
                                    <div className="relative z-10 text-center">
                                        <div className={`text-3xl sm:text-5xl mb-2 sm:mb-3 ${badge.earned ? "" : "grayscale"}`}>
                                            {badge.icon}
                                        </div>
                                        <div className="font-bold text-xs sm:text-sm mb-1">{badge.name}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2">{badge.description}</div>
                                        <span className={`inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${rarity.border} ${rarity.text}`}>
                                            {rarity.label}
                                        </span>
                                        {badge.earned && (
                                            <div className="mt-2 text-[10px] sm:text-xs text-green-400">✅ Earned</div>
                                        )}
                                        {!badge.earned && (
                                            <div className="mt-2 text-[10px] sm:text-xs text-gray-600">{badge.requirement}</div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}