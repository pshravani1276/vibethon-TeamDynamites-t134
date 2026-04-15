// src/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface LeaderboardEntry {
    user_id: string;
    email: string;
    full_name: string;
    total_score: number;
    quiz_count: number;
    badge_count: number;
    module_count: number;
    rank: number;
}

export default function LeaderboardPage() {
    const router = useRouter();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [timeFrame, setTimeFrame] = useState<"all" | "month" | "week">("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setCurrentUser(user);

            // Fetch quiz scores with user profiles
            const { data: quizData } = await supabase
                .from("quiz_scores")
                .select(`
          score,
          user_id,
          profiles!inner (
            full_name,
            email
          )
        `);

            // Fetch user badges count
            const { data: badgeData } = await supabase
                .from("user_badges")
                .select("user_id");

            // Fetch completed modules
            const { data: moduleData } = await supabase
                .from("user_progress")
                .select("user_id")
                .eq("completed", true);

            if (quizData) {
                // Aggregate scores by user
                const userScores: { [key: string]: LeaderboardEntry } = {};

                quizData.forEach((item: any) => {
                    if (!userScores[item.user_id]) {
                        userScores[item.user_id] = {
                            user_id: item.user_id,
                            email: item.profiles.email,
                            full_name: item.profiles.full_name || item.profiles.email.split("@")[0],
                            total_score: 0,
                            quiz_count: 0,
                            badge_count: 0,
                            module_count: 0,
                            rank: 0
                        };
                    }
                    userScores[item.user_id].total_score += item.score || 0;
                    userScores[item.user_id].quiz_count += 1;
                });

                // Add badge counts
                if (badgeData) {
                    const badgeCounts: { [key: string]: number } = {};
                    badgeData.forEach((item: any) => {
                        badgeCounts[item.user_id] = (badgeCounts[item.user_id] || 0) + 1;
                    });

                    Object.keys(userScores).forEach(userId => {
                        userScores[userId].badge_count = badgeCounts[userId] || 0;
                    });
                }

                // Add module counts
                if (moduleData) {
                    const moduleCounts: { [key: string]: number } = {};
                    moduleData.forEach((item: any) => {
                        moduleCounts[item.user_id] = (moduleCounts[item.user_id] || 0) + 1;
                    });

                    Object.keys(userScores).forEach(userId => {
                        userScores[userId].module_count = moduleCounts[userId] || 0;
                    });
                }

                // Convert to array and sort by total score
                const leaderboardArray = Object.values(userScores).sort(
                    (a, b) => b.total_score - a.total_score
                );

                // Add ranks
                leaderboardArray.forEach((entry, idx) => {
                    entry.rank = idx + 1;
                });

                setLeaderboard(leaderboardArray);

                // Find current user's rank
                if (user) {
                    const rank = leaderboardArray.findIndex(entry => entry.user_id === user.id) + 1;
                    setUserRank(rank > 0 ? rank : null);
                }
            }

            setLoading(false);
        };

        fetchLeaderboard();
    }, [router]);

    const filteredLeaderboard = leaderboard.filter(entry =>
        entry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const top3 = filteredLeaderboard.slice(0, 3);
    const rest = filteredLeaderboard.slice(3);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading leaderboard...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Global Leaderboard
                        </h1>
                        <p className="text-gray-300">Top learners ranked by total points</p>
                        {userRank && (
                            <div className="inline-block mt-4 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                                <span className="text-purple-400">🏆 Your Rank: #{userRank}</span>
                            </div>
                        )}
                    </div>

                    {/* Time Frame Filter */}
                    <div className="flex justify-center gap-2 mb-8">
                        {["all", "month", "week"].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeFrame(tf as any)}
                                className={`px-4 py-2 rounded-lg capitalize transition-all ${timeFrame === tf
                                        ? "bg-purple-600 text-white"
                                        : "bg-white/10 text-gray-400 hover:bg-white/20"
                                    }`}
                            >
                                {tf === "all" ? "All Time" : tf === "month" ? "This Month" : "This Week"}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md mx-auto block px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 text-center"
                        />
                    </div>

                    {/* Top 3 Podium */}
                    {top3.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {/* 2nd Place */}
                            {top3[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="order-2 md:order-1 text-center"
                                >
                                    <div className="bg-gradient-to-b from-gray-400/20 to-gray-600/20 rounded-2xl p-6 border border-gray-500/30 h-full">
                                        <div className="text-5xl mb-3">🥈</div>
                                        <div className="text-2xl font-bold">{top3[1].full_name}</div>
                                        <div className="text-3xl font-bold text-purple-400 mt-2">{top3[1].total_score}</div>
                                        <div className="text-sm text-gray-400 mt-2">points</div>
                                        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                                            <span>📚 {top3[1].module_count} modules</span>
                                            <span>🏅 {top3[1].badge_count} badges</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {top3[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0 }}
                                    className="order-1 md:order-2 text-center -mt-4 md:-mt-8"
                                >
                                    <div className="bg-gradient-to-b from-yellow-500/30 to-yellow-600/20 rounded-2xl p-6 border border-yellow-500/50 shadow-xl shadow-yellow-500/20">
                                        <div className="text-6xl mb-3">👑</div>
                                        <div className="text-3xl font-bold text-yellow-400">{top3[0].full_name}</div>
                                        <div className="text-4xl font-bold text-yellow-400 mt-2">{top3[0].total_score}</div>
                                        <div className="text-sm text-gray-300 mt-2">points</div>
                                        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                                            <span>📚 {top3[0].module_count} modules</span>
                                            <span>🏅 {top3[0].badge_count} badges</span>
                                        </div>
                                        <div className="mt-3 text-xs text-yellow-500/80">🏆 Top Learner 🏆</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {top3[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-3 md:order-3 text-center"
                                >
                                    <div className="bg-gradient-to-b from-orange-500/20 to-orange-700/20 rounded-2xl p-6 border border-orange-500/30 h-full">
                                        <div className="text-5xl mb-3">🥉</div>
                                        <div className="text-2xl font-bold">{top3[2].full_name}</div>
                                        <div className="text-3xl font-bold text-purple-400 mt-2">{top3[2].total_score}</div>
                                        <div className="text-sm text-gray-400 mt-2">points</div>
                                        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                                            <span>📚 {top3[2].module_count} modules</span>
                                            <span>🏅 {top3[2].badge_count} badges</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Full Leaderboard Table */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10 border-b border-white/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold hidden sm:table-cell">Modules</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold hidden sm:table-cell">Badges</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold hidden md:table-cell">Quizzes</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rest.map((entry, idx) => (
                                        <motion.tr
                                            key={entry.user_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-all ${currentUser?.id === entry.user_id ? "bg-purple-500/20" : ""
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-semibold">{entry.full_name}</div>
                                                    <div className="text-xs text-gray-500 hidden sm:block">{entry.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm hidden sm:table-cell">{entry.module_count}</td>
                                            <td className="px-4 py-3 text-center text-sm hidden sm:table-cell">{entry.badge_count}</td>
                                            <td className="px-4 py-3 text-center text-sm hidden md:table-cell">{entry.quiz_count}</td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-purple-400">
                                                {entry.total_score}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredLeaderboard.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏆</div>
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-gray-400">Try a different search term</p>
                        </div>
                    )}

                    {/* Stats Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>🏆 Top 3 earn special badges and recognition</p>
                        <p className="mt-1">⭐ Points are earned from completing modules, quizzes, and games</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}