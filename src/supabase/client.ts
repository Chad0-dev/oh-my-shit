import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// 실제 배포 시에는 환경 변수로 관리되어야 합니다
const supabaseUrl = "https://uwxuxhgozgbmnuexivdj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eHV4aGdvemdibW51ZXhpdmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwMjQyMDUsImV4cCI6MjAyNjYwMDIwNX0.5ZJlNNGUBpL_YfYBhO47zAAkr4HlIV4OvVgV5KgSiS0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
