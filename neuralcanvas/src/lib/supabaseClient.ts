// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key';

if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
}

// Create a mock client if not configured (for demo mode)
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : {
        auth: {
            signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
            signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
            signOut: async () => ({ error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null }),
                }),
            }),
            insert: async () => ({ data: null, error: null }),
            upsert: async () => ({ data: null, error: null }),
        }),
    } as any;