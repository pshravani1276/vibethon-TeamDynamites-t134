// src/lib/auth.ts
import { supabase } from './supabaseClient';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
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

// Sign in user
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Store user in localStorage for demo
        if (data.user) {
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || email.split('@')[0],
            }));
        }

        return { user: data.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

// Sign out user
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        localStorage.removeItem('user');
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

// Create user profile
async function createUserProfile(userId: string, fullName: string, email: string) {
    try {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                full_name: fullName,
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