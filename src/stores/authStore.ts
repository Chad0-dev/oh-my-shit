import { create } from "zustand";
import { supabase } from "../supabase/client";

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
}));
