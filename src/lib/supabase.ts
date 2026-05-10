import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a valid dummy URL if the real one is missing to prevent the 'Invalid supabaseUrl' crash during initialization.
// The app will still function with fallback data, but won't crash on boot.
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder-project.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Settings menu.');
}

export const supabase = createClient(validUrl, validKey);
