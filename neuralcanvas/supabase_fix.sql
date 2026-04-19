
-- Run this in your Supabase SQL Editor to fix the profiles table schema
-- This adds the missing full_name column and ensures the profiles table is correctly structured

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Recommended: also add avatar_url and username if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
