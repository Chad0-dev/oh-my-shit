import { create } from "zustand";
import { supabase } from "../supabase/client";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../supabase/config";
import { Alert } from "react-native";

interface User {
  id: string;
  email: string;
  age_group?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    age_group?: number
  ) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // 사용자 추가 정보 가져오기
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          console.error("사용자 정보 조회 실패:", userError);
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email || "",
            age_group: userData?.age_group,
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      // 한글 에러 메시지 처리
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage =
          "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
      }

      set({ error: errorMessage, isLoading: false });
    }
  },

  signUp: async (email, password, age_group) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // 추가 정보를 users 테이블에 저장
        const { error: profileError } = await supabase.from("users").upsert({
          id: data.user.id,
          email: data.user.email,
          age_group: age_group,
        });

        if (profileError) {
          console.error("사용자 프로필 저장 실패:", profileError);
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email || "",
            age_group: age_group,
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      // 한글 에러 메시지 처리
      let errorMessage = error.message;
      if (error.message.includes("User already registered")) {
        errorMessage = "이미 가입된 이메일입니다.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
      } else if (error.message.includes("Email invalid")) {
        errorMessage = "유효하지 않은 이메일 형식입니다.";
      }

      set({ error: errorMessage, isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  // 계정 삭제(회원 탈퇴)
  deleteAccount: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("로그인 정보가 없습니다.");

      const userId = user.id;
      console.log("계정 처리 프로세스 시작 - 사용자 ID:", userId);

      try {
        // 생성한 보안 정의자 함수를 호출하여 계정 삭제 시도
        const { data, error } = await supabase.rpc("delete_user_account");

        if (error) {
          console.error("계정 삭제 실패:", error);

          // 오류 발생 시 기존 방식으로 폴백 - 앱 데이터만 삭제
          console.log("기존 방식으로 계정 처리 진행");

          // 1단계: 사용자의 기록(데이터) 삭제
          try {
            console.log("1. 기록 데이터 삭제 시도");
            const { error: recordsError } = await supabase
              .from("shit_records")
              .delete()
              .eq("user_id", userId);

            if (recordsError) {
              console.error("기록 삭제 실패:", recordsError);
            } else {
              console.log("기록 삭제 성공");
            }
          } catch (e) {
            console.error("기록 삭제 시도 중 오류:", e);
          }

          // 2단계: users 테이블 삭제 시도 (실패하더라도 계속 진행)
          try {
            console.log("2. 사용자 데이터 삭제 시도");
            const { error: deleteUserError } = await supabase
              .from("users")
              .delete()
              .eq("id", userId);

            if (deleteUserError) {
              console.error("사용자 삭제 실패:", deleteUserError);
            } else {
              console.log("사용자 삭제 성공");
            }
          } catch (e) {
            console.error("사용자 삭제 시도 중 오류:", e);
          }

          // 사용자에게 부분 성공 알림
          Alert.alert(
            "처리 완료",
            "계정 처리가 완료되었습니다.\n" +
              "- 로그아웃 처리 완료\n" +
              "- 앱 데이터가 삭제되었습니다.\n\n" +
              "⚠️ 계정 정보 완전 삭제를 원하시면 고객센터로 문의해주세요."
          );
        } else {
          console.log("계정 완전 삭제 성공");
          // 사용자에게 성공 알림
          Alert.alert(
            "처리 완료",
            "계정이 완전히 삭제되었습니다.\n" +
              "그동안 서비스를 이용해 주셔서 감사합니다."
          );
        }
      } catch (e) {
        console.error("계정 삭제 프로세스 오류:", e);
        // 오류 발생 시 사용자에게 알림
        Alert.alert(
          "오류 발생",
          "계정 처리 중 문제가 발생했습니다.\n다시 시도하거나 고객센터로 문의해주세요."
        );
      }

      // 3단계: 로그아웃 처리 (무조건 진행)
      console.log("3. 로그아웃 처리");
      await supabase.auth.signOut();

      // 로컬 상태 초기화
      set({ user: null, isLoading: false });

      return { success: true };
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
