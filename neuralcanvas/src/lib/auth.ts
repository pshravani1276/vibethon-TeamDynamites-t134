// src/lib/auth.ts
import { supabase } from './supabaseClient';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: string;
}

// Sign up new user
export async function signUp(email: string, password: string, fullName: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    display_name: fullName.split(' ')[0],
                },
                emailRedirectTo: `${window.location.origin}/login?verified=true`,
            },
        });

        if (error) throw error;

        // Create profile entry
        if (data.user) {
            await createUserProfile(data.user.id, fullName, email);
        }

        return { user: data.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

// Sign in with email/password
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Store user in localStorage
        if (data.user) {
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || email.split('@')[0],
            }));
        }

        return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
        return { user: null, session: null, error: error.message };
    }
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
    try {
        console.log("Initiating Google Sign-In with redirect to:", `${window.location.origin}/dashboard`);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            console.error("Supabase OAuth Error:", error);
            return { error: error.message };
        }
        return { data, error: null };
    } catch (error: any) {
        console.error("Critical Google Sign-In Error:", error);
        return { data: null, error: error.message || "An unexpected error occurred during Google Sign-In" };
    }
}

// Sign out user
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('neuralcanvas-theme');
        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

// Get current session
export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session, error: null };
    } catch (error: any) {
        return { session: null, error: error.message };
    }
}

// Password reset - send email
export async function resetPassword(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Update password (after reset or in settings)
export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Delete account
export async function deleteAccount(userId: string) {
    try {
        // Delete user profile first
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.from('user_progress').delete().eq('user_id', userId);
        await supabase.from('quiz_scores').delete().eq('user_id', userId);
        await supabase.from('game_results').delete().eq('user_id', userId);
        await supabase.from('user_badges').delete().eq('user_id', userId);
        await supabase.from('user_activity').delete().eq('user_id', userId);

        // Sign out
        await supabase.auth.signOut();
        localStorage.removeItem('user');

        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Create user profile
async function createUserProfile(userId: string, fullName: string, email: string) {
    try {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                username: email.split('@')[0],
                created_at: new Date().toISOString(),
            });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}

// Check if user is authenticated (client-side)
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('user') !== null;
}

// Get user from localStorage (client-side)
export function getLocalUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

// Password strength checker
export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
    return { score, label: 'Very Strong', color: 'bg-emerald-500' };
}