// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');

    // For development, you can use mock client (optional)
    if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock Supabase client for development');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);