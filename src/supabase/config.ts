// 중요: 이 파일은 .gitignore에 추가해야 합니다
// TODO: 추후 production 배포 시 .env 환경변수로 분리 필요

// EXPO_PUBLIC_ prefix를 붙여야 Expo에서 환경변수를 읽을 수 있습니다.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
