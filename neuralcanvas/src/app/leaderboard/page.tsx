// src/app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Trophy, Medal, Flame, Star, Activity, ArrowUp, ArrowDown, Minus, Code2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface LeaderboardUser {
    id: string;
    name: string;
    score: number;
    avatar?: string;
    rank: number;
    rankChange: "up" | "down" | "same";
    streak: number;
    problemsSolved: number;
}

// Mock Data because DB might be empty currently
const generateMockLeaderboard = (): LeaderboardUser[] => {
    return Array.from({ length: 50 }).map((_, i) => ({
        id: `usr_${i}`,
        name: i === 0 ? "Alan_Turing" : i === 1 ? "Neural_Ninja" : i === 2 ? "Optimus_Prime" : `CodeMaster_${i+10}`,
        score: Math.round(15000 - i * 250 + Math.random() * 100),
        rank: i + 1,
        rankChange: Math.random() > 0.8 ? "up" : Math.random() > 0.6 ? "down" : "same",
        streak: Math.round(Math.random() * 30),
        problemsSolved: Math.round(300 - i * 5 + Math.random() * 20),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=transparent`
    }));
};

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<"global" | "weekly" | "friends">("global");
    
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                // Fetch profiles with their associated quiz scores
                // In a production app, we'd use a view or a stored procedure (RPC)
                // for performance, but here we'll join via Supabase client if possible
                // or aggregate manually.
                
                const { data: profiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, avatar_url, username');

                if (profileError) throw profileError;

                const { data: scores, error: scoreError } = await supabase
                    .from('quiz_scores')
                    .select('user_id, score');

                if (scoreError) throw scoreError;

                // Aggregate scores by user
                const userScores: Record<string, number> = {};
                const problemCounts: Record<string, number> = {};
                
                scores?.forEach(s => {
                    userScores[s.user_id] = (userScores[s.user_id] || 0) + (s.score || 0);
                    problemCounts[s.user_id] = (problemCounts[s.user_id] || 0) + 1;
                });

                // Map to LeaderboardUser format
                const leaderboard = (profiles || []).map(p => ({
                    id: p.id,
                    name: p.username || "Anonymous Engineer",
                    score: userScores[p.id] || 0,
                    avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}&backgroundColor=transparent`,
                    rank: 0, // Assigned after sorting
                    rankChange: "same" as const,
                    streak: Math.floor(Math.random() * 5), // Mock streak for now
                    problemsSolved: problemCounts[p.id] || 0,
                }))
                .sort((a, b) => b.score - a.score)
                .map((user, index) => ({
                    ...user,
                    rank: index + 1
                }));

                // If no real data, use mock for demo purposes (optional, but good for empty landing)
                if (leaderboard.length === 0) {
                    setUsers(generateMockLeaderboard());
                } else {
                    setUsers(leaderboard);
                }
            } catch (err: any) {
                console.error("Error fetching leaderboard:", err?.message || err || "Unknown error");
                // Log full error for debugging in non-production
                if (process.env.NODE_ENV !== 'production') {
                    console.dir(err);
                }
                setUsers(generateMockLeaderboard()); // Fallback to mock on error
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    const topThree = users.slice(0, 3);
    const restOfUsers = users.slice(3, 20);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-10 h-10 text-amber-400" />
                        Global Rankings
                    </h1>
                    <p className="text-gray-400">Compete with engineers worldwide. Solve challenges, earn points.</p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-2 mb-12">
                    {["global", "weekly", "friends"].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m as any)}
                            className={`px-6 py-2 rounded-full capitalize text-sm font-medium transition-all ${
                                mode === m 
                                ? "bg-white/10 text-white border border-white/20" 
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Top 3 Podium */}
                <div className="flex items-end justify-center gap-2 md:gap-6 mb-16 h-64">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-28 md:w-40 flex flex-col items-center">
                            <div className="relative mb-3">
                                <img src={topThree[1].avatar} alt={topThree[1].name} className="w-16 h-16 rounded-full border-2 border-gray-400 bg-white/5" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 border-2 border-black">2</div>
                            </div>
                            <div className="text-gray-200 font-bold mb-1 truncate w-full text-center">{topThree[1].name}</div>
                            <div className="text-indigo-400 font-mono text-sm">{topThree[1].score.toLocaleString()}</div>
                            <div className="w-full h-32 bg-gradient-to-t from-gray-500/20 to-gray-400/20 border-t border-x border-gray-400/30 rounded-t-lg mt-3 backdrop-blur-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 mask-image-linear"></div>
                            </div>
                        </motion.div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-32 md:w-48 flex flex-col items-center relative z-10">
                            <Medal className="w-8 h-8 text-amber-400 absolute -top-10" />
                            <div className="relative mb-3">
                                <div className="absolute inset-0 bg-amber-400 blur-md opacity-30 rounded-full animate-pulse"></div>
                                <img src={topThree[0].avatar} alt={topThree[0].name} className="w-20 h-20 rounded-full border-4 border-amber-400 bg-white/5 relative z-10" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm font-bold text-black border-2 border-black z-20 shadow-[0_0_10px_rgba(251,191,36,0.5)]">1</div>
                            </div>
                            <div className="text-amber-400 font-bold mb-1 text-lg truncate w-full text-center filter drop-shadow-md">{topThree[0].name}</div>
                            <div className="text-indigo-300 font-mono font-bold">{topThree[0].score.toLocaleString()}</div>
                            <div className="w-full h-40 bg-gradient-to-t from-amber-500/20 to-amber-400/20 border-t border-x border-amber-400/30 rounded-t-lg mt-3 backdrop-blur-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10"></div>
                            </div>
                        </motion.div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="w-28 md:w-40 flex flex-col items-center">
                            <div className="relative mb-3">
                                <img src={topThree[2].avatar} alt={topThree[2].name} className="w-16 h-16 rounded-full border-2 border-orange-700 bg-white/5" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-700 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-black">3</div>
                            </div>
                            <div className="text-gray-300 font-bold mb-1 truncate w-full text-center">{topThree[2].name}</div>
                            <div className="text-indigo-400 font-mono text-sm">{topThree[2].score.toLocaleString()}</div>
                            <div className="w-full h-24 bg-gradient-to-t from-orange-700/20 to-orange-600/20 border-t border-x border-orange-700/30 rounded-t-lg mt-3 backdrop-blur-md"></div>
                        </motion.div>
                    )}
                </div>

                {/* List */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5 md:col-span-4">Engineer</div>
                        <div className="col-span-3 hidden md:block text-center">Solved</div>
                        <div className="col-span-2 hidden md:block text-center">Streak</div>
                        <div className="col-span-4 md:col-span-2 text-right">Score</div>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                        {restOfUsers.map((user, idx) => (
                            <motion.div 
                                key={user.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
                            >
                                {/* Rank */}
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <span className="text-gray-400 font-mono font-medium">{user.rank}</span>
                                    {user.rankChange === "up" && <ArrowUp className="w-3 h-3 text-emerald-500" />}
                                    {user.rankChange === "down" && <ArrowDown className="w-3 h-3 text-red-500" />}
                                    {user.rankChange === "same" && <Minus className="w-3 h-3 text-gray-600" />}
                                </div>
                                
                                {/* Profile */}
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-white/5" />
                                    <span className="font-medium group-hover:text-amber-200 transition-colors truncate">{user.name}</span>
                                </div>
                                
                                {/* Solved */}
                                <div className="col-span-3 hidden md:flex items-center justify-center gap-1.5 text-gray-400">
                                    <Code2 className="w-4 h-4 text-gray-500" />
                                    {user.problemsSolved}
                                </div>
                                
                                {/* Streak */}
                                <div className="col-span-2 hidden md:flex items-center justify-center gap-1.5 text-gray-400">
                                    <Flame className={`w-4 h-4 ${user.streak > 10 ? 'text-orange-500' : 'text-gray-500'}`} />
                                    {user.streak}
                                </div>
                                
                                {/* Score */}
                                <div className="col-span-4 md:col-span-2 text-right font-mono font-bold text-indigo-300">
                                    {user.score.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}