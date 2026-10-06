import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or localStorage
const getSavedCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('techdepan_supabase_url');
  const localKey = localStorage.getItem('techdepan_supabase_key');

  const url = (localUrl && localUrl.trim() !== '') ? localUrl : (envUrl && envUrl.trim() !== '' ? envUrl : '');
  const key = (localKey && localKey.trim() !== '') ? localKey : (envKey && envKey.trim() !== '' ? envKey : '');

  return { url, key };
};

let supabaseInstance: SupabaseClient | null = null;

export const initSupabase = (customUrl?: string, customKey?: string): SupabaseClient | null => {
  const { url, key } = customUrl && customKey 
    ? { url: customUrl, key: customKey }
    : getSavedCredentials();

  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Erreur lors de l\'initialisation de Supabase:', err);
      supabaseInstance = null;
    }
  }
  return null;
};

// Default singleton
supabaseInstance = initSupabase();

export const getSupabaseClient = () => supabaseInstance;

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSavedCredentials();
  return Boolean(url && key && url.startsWith('http') && !url.includes('example.supabase.co'));
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('techdepan_supabase_url', url.trim());
    localStorage.setItem('techdepan_supabase_key', key.trim());
    return initSupabase(url.trim(), key.trim());
  } else {
    localStorage.removeItem('techdepan_supabase_url');
    localStorage.removeItem('techdepan_supabase_key');
    supabaseInstance = null;
    return null;
  }
};
