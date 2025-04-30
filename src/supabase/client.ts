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

// 디버깅을 위한 로그 추가
console.log("[Supabase] 클라이언트 초기화:", {
  url: SUPABASE_URL,
  hasAnonKey: !!SUPABASE_ANON_KEY,
  storage: supabase.storage,
});

// 세션 상태 확인 함수
export const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("세션 확인 오류:", error.message);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error("세션 확인 중 예외 발생:", error);
    return false;
  }
};

// 세션 초기화 함수
export const resetSession = async () => {
  try {
    await supabase.auth.signOut();
    console.log("세션이 초기화되었습니다.");
    return true;
  } catch (error) {
    console.error("세션 초기화 중 오류 발생:", error);
    return false;
  }
};
