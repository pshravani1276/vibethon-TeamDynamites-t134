// src/lib/db.ts
import { supabase } from './supabaseClient';

// Define types
interface QuizScore {
    score: number;
}

interface UserProgress {
    id: string;
    user_id: string;
    module_id: number;
    module_name: string;
    completed: boolean;
    points_earned: number;
    completed_at: string;
}

interface GameResult {
    game_type: string;
    score: number;
}

// ============ USER PROGRESS ============

export async function getUserProgress(userId: string) {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return { data: data as UserProgress[], error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export async function completeModule(userId: string, moduleId: number, moduleName: string, points: number) {
    try {
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .single();

        if (existing) {
            return { success: true, error: null, message: 'Already completed' };
        }

        const { error } = await supabase
            .from('user_progress')
            .insert({
                user_id: userId,
                module_id: moduleId,
                module_name: moduleName,
                completed: true,
                points_earned: points,
                completed_at: new Date().toISOString(),
            });

        if (error) throw error;

        await addQuizScore(userId, `module_${moduleId}`, points, 1, 100);

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTotalPoints(userId: string) {
    try {
        const { data, error } = await supabase
            .from('quiz_scores')
            .select('score')
            .eq('user_id', userId);

        if (error) throw error;

        // FIXED: Properly typed reduce
        const total = (data as QuizScore[] | null)?.reduce((sum: number, item: QuizScore) => sum + (item.score || 0), 0) || 0;
        return { total, error: null };
    } catch (error: any) {
        return { total: 0, error: error.message };
    }
}

// ============ QUIZ SCORES ============

export async function addQuizScore(userId: string, quizId: string, score: number, totalQuestions: number, percentage: number) {
    try {
        const { error } = await supabase
            .from('quiz_scores')
            .insert({
                user_id: userId,
                quiz_id: quizId,
                score: score,
                total_questions: totalQuestions,
                percentage: percentage,
                completed_at: new Date().toISOString(),
            });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUserQuizStats(userId: string) {
    try {
        const { data, error } = await supabase
            .from('quiz_scores')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        // FIXED: Properly typed reduce with explicit types
        const avgPercentage = data && data.length > 0
            ? (data as QuizScore[]).reduce((sum: number, q: QuizScore) => sum + (q.score || 0), 0) / data.length
            : 0;

        return {
            totalQuizzes: data?.length || 0,
            averageScore: Math.round(avgPercentage),
            totalPoints: (data as QuizScore[] | null)?.reduce((sum: number, q: QuizScore) => sum + (q.score || 0), 0) || 0,
            error: null
        };
    } catch (error: any) {
        return { totalQuizzes: 0, averageScore: 0, totalPoints: 0, error: error.message };
    }
}

// ============ GAME RESULTS ============

export async function saveGameResult(userId: string, gameType: string, score: number, levelCompleted: number) {
    try {
        const { error } = await supabase
            .from('game_results')
            .insert({
                user_id: userId,
                game_type: gameType,
                score: score,
                level_completed: levelCompleted,
                completed_at: new Date().toISOString(),
            });

        if (error) throw error;

        await addQuizScore(userId, `game_${gameType}`, score, 1, 100);

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBestGameScores(userId: string) {
    try {
        const { data, error } = await supabase
            .from('game_results')
            .select('game_type, score')
            .eq('user_id', userId);

        if (error) throw error;

        const bestScores: { [key: string]: number } = {};
        (data as GameResult[] | null)?.forEach((game: GameResult) => {
            if (!bestScores[game.game_type] || game.score > bestScores[game.game_type]) {
                bestScores[game.game_type] = game.score;
            }
        });

        return { bestScores, error: null };
    } catch (error: any) {
        return { bestScores: {}, error: error.message };
    }
}

// ============ BADGES ============

export async function getAllBadges() {
    try {
        const { data, error } = await supabase
            .from('badges')
            .select('*')
            .order('required_points', { ascending: true });

        if (error) throw error;
        return { badges: data || [], error: null };
    } catch (error: any) {
        return { badges: [], error: error.message };
    }
}

export async function getUserBadges(userId: string) {
    try {
        const { data, error } = await supabase
            .from('user_badges')
            .select('*, badges(*)')
            .eq('user_id', userId);

        if (error) throw error;
        return { badges: data || [], error: null };
    } catch (error: any) {
        return { badges: [], error: error.message };
    }
}

// ============ LEADERBOARD ============

export async function getLeaderboard(limit: number = 100) {
    try {
        const { data, error } = await supabase
            .from('quiz_scores')
            .select(`
        score,
        user_id,
        profiles!inner (
          full_name,
          email
        )
      `);

        if (error) throw error;

        const userScores: { [key: string]: any } = {};

        // FIXED: Added proper types for the loop
        (data as any[] | null)?.forEach((item: any) => {
            if (!userScores[item.user_id]) {
                userScores[item.user_id] = {
                    user_id: item.user_id,
                    email: item.profiles.email,
                    full_name: item.profiles.full_name || item.profiles.email.split('@')[0],
                    total_score: 0,
                    quiz_count: 0,
                };
            }
            userScores[item.user_id].total_score += item.score || 0;
            userScores[item.user_id].quiz_count += 1;
        });

        const leaderboard = Object.values(userScores)
            .sort((a: any, b: any) => b.total_score - a.total_score)
            .slice(0, limit)
            .map((entry: any, idx: number) => ({ ...entry, rank: idx + 1 }));

        return { leaderboard, error: null };
    } catch (error: any) {
        return { leaderboard: [], error: error.message };
    }
}

export async function getUserRank(userId: string) {
    const { leaderboard } = await getLeaderboard(1000);
    const rank = (leaderboard as any[]).findIndex((entry: any) => entry.user_id === userId) + 1;
    return rank > 0 ? rank : null;
}