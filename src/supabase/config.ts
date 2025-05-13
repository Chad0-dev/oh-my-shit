// 중요: 이 파일은 .gitignore에 추가해야 합니다
// TODO: 추후 production 배포 시 .env 환경변수로 분리 필요

// EXPO_PUBLIC_ prefix를 붙여야 Expo에서 환경변수를 읽을 수 있습니다.

// Supabase 연결 설정
// 환경 변수가 없으면 개발용 기본값을 사용합니다.

const FALLBACK_SUPABASE_URL = "https://ldoljkbbwgwtxxubrkbe.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2xqa2Jid2d3dHh4dWJya2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDM3NjAsImV4cCI6MjA1ODYxOTc2MH0.103QbyT6GshNZ6vfI5kfyVDKDIjACoZc7IVzAZSnNFM";

// 환경 변수 또는 기본값 사용
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// 개발 모드에서만 로그 출력 (꼭 필요한 경우 주석 해제)
// if (process.env.NODE_ENV === 'development' && !process.env.EXPO_PUBLIC_SUPABASE_URL) {
//   console.info('개발 환경: Supabase 기본 연결 정보를 사용합니다.');
// }
