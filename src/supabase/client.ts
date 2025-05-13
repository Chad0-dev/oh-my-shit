import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

// Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-client-info": "supabase-js-react-native",
    },
  },
});

// 클라이언트 액세스 테스트 (로그 없이 실행)
supabase.auth.getSession().then(({ data, error }) => {
  // 세션 확인만 하고 로그는 출력하지 않음
});

// 세션 상태 확인 함수
export const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return false;
    }
    return !!data.session;
  } catch (error) {
    return false;
  }
};

// 세션 초기화 함수
export const resetSession = async () => {
  try {
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    return false;
  }
};
