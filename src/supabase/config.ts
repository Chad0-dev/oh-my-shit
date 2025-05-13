import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://ldoljkbbwgwtxxubrkbe.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2xqa2Jid2d3dHh4dWJya2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDM3NjAsImV4cCI6MjA1ODYxOTc2MH0.103QbyT6GshNZ6vfI5kfyVDKDIjACoZc7IVzAZSnNFM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
