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

// Create client with session persistence and auto-refresh
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'neuralcanvas-auth',
        },
    })
    : {
        auth: {
            signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
            signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: new Error('Supabase not configured') }),
            signOut: async () => ({ error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            resetPasswordForEmail: async () => ({ data: {}, error: null }),
            updateUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: (_event: string, _callback: any) => ({
                data: { subscription: { unsubscribe: () => {} } },
            }),
        },
        from: (table: string) => ({
            select: (columns?: string) => ({
                eq: (col: string, val: any) => ({
                    single: async () => ({ data: null, error: null }),
                    order: (col2: string, opts?: any) => ({
                        limit: (n: number) => ({ data: [], error: null }),
                        range: (from: number, to: number) => ({ data: [], error: null }),
                    }),
                    limit: (n: number) => ({ data: [], error: null }),
                    gte: (col2: string, val2: any) => ({ data: [], error: null }),
                    lte: (col2: string, val2: any) => ({ data: [], error: null }),
                }),
                order: (col: string, opts?: any) => ({
                    limit: (n: number) => ({ data: [], error: null }),
                    range: (from: number, to: number) => ({ data: [], error: null }),
                }),
                limit: (n: number) => ({ data: [], error: null }),
                gte: (col: string, val: any) => ({ data: [], error: null }),
                lte: (col: string, val: any) => ({ data: [], error: null }),
                in: (col: string, vals: any[]) => ({ data: [], error: null }),
            }),
            insert: async (data: any) => ({ data: null, error: null }),
            upsert: async (data: any) => ({ data: null, error: null }),
            update: (data: any) => ({
                eq: (col: string, val: any) => ({ data: null, error: null }),
                match: (criteria: any) => ({ data: null, error: null }),
            }),
            delete: () => ({
                eq: (col: string, val: any) => ({ data: null, error: null }),
            }),
        }),
        channel: (name: string) => ({
            on: (event: string, filter: any, callback: any) => ({
                subscribe: () => ({ unsubscribe: () => {} }),
            }),
        }),
        removeChannel: (channel: any) => {},
        rpc: async (fn: string, params?: any) => ({ data: null, error: null }),
    } as any;

export { isSupabaseConfigured };