-- Add user intent column to profiles table for segmentation
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_intent text CHECK (user_intent IN ('browse', 'create', 'both')) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS full_name text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone text DEFAULT NULL;