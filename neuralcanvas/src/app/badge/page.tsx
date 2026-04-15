// src/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
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
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Get quiz scores with user profiles
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
                        };
                    }
                    userScores[item.user_id].total_score += item.score || 0;
                    userScores[item.user_id].quiz_count += 1;
                });

                // Get badge counts
                const { data: badgeData } = await supabase
                    .from("user_badges")
                    .select("user_id");

                if (badgeData) {
                    badgeData.forEach((item: any) => {
                        if (userScores[item.user_id]) {
                            userScores[item.user_id].badge_count += 1;
                        }
                    });
                }

                // Convert to array and sort by total score
                const leaderboardArray = Object.values(userScores).sort(
                    (a, b) => b.total_score - a.total_score
                );

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
    }, []);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading leaderboard...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Global Leaderboard
                        </h1>
                        <p className="text-gray-300">Top learners ranked by total points</p>
                        {userRank && (
                            <div className="inline-block mt-4 px-6 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                                <span className="text-purple-400">🏆 Your Rank: #{userRank}</span>
                            </div>
                        )}
                    </div>

                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {leaderboard.slice(0, 3).map((entry, idx) => (
                            <motion.div
                                key={entry.user_id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`text-center p-6 rounded-xl border ${idx === 0 ? "bg-yellow-500/20 border-yellow-500/50" :
                                        idx === 1 ? "bg-gray-400/20 border-gray-400/50" :
                                            "bg-orange-500/20 border-orange-500/50"
                                    }`}
                            >
                                <div className="text-5xl mb-2">
                                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                </div>
                                <div className="text-2xl font-bold">{entry.full_name}</div>
                                <div className="text-purple-400 text-xl mt-2">{entry.total_score} pts</div>
                                <div className="text-sm text-gray-400 mt-2">
                                    {entry.quiz_count} quizzes • {entry.badge_count} badges
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Full Leaderboard Table */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Quizzes</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Badges</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, idx) => (
                                        <motion.tr
                                            key={entry.user_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-all ${currentUser?.id === entry.user_id ? "bg-purple-500/20" : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold">{entry.full_name}</div>
                                                    <div className="text-xs text-gray-500">{entry.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm">{entry.quiz_count}</td>
                                            <td className="px-6 py-4 text-center text-sm">{entry.badge_count}</td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-purple-400">
                                                {entry.total_score}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}