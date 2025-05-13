// 중요: 이 파일은 .gitignore에 추가해야 합니다
// TODO: 추후 production 배포 시 .env 환경변수로 분리 필요

// EXPO_PUBLIC_ prefix를 붙여야 Expo에서 환경변수를 읽을 수 있습니다.

const FALLBACK_SUPABASE_URL = "https://ldoljkbbwgwtxxubrkbe.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2xqa2Jid2d3dHh4dWJya2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDM3NjAsImV4cCI6MjA1ODYxOTc2MH0.103QbyT6GshNZ6vfI5kfyVDKDIjACoZc7IVzAZSnNFM";

// 환경 변수가 없으면 폴백 값 사용 (개발 환경용)
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// 환경 변수 설정 상태 로깅
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn(
    "EXPO_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않아 기본값을 사용합니다."
  );
}
if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않아 기본값을 사용합니다."
  );
}
