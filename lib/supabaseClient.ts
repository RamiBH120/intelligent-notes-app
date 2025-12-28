"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase instance. Uses NEXT_PUBLIC_* env vars which are
// injected at build time and safe to use on the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in development if env vars are missing
  // eslint-disable-next-line no-console
  console.warn("Supabase client not configured. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
}

const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;
