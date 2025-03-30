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

      // TODO: 배포 전 제거 - 개발용 테스트 계정 하드코딩
      if (email === "test@test.com" && password === "1234") {
        // 테스트 계정으로 자동 인증
        set({
          user: {
            id: "test-user-id-123456",
            email: "test@test.com",
            age_group: 30,
          },
          isLoading: false,
        });
        return;
      }

      // 실제 인증 로직
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
      set({ error: error.message, isLoading: false });
    }
  },

  signUp: async (email, password, age_group) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 추가 정보를 users 테이블에 저장
        const { error: profileError } = await supabase.from("users").upsert({
          id: data.user.id,
          email: data.user.email,
          age_group: age_group,
        });

        if (profileError) {
          console.error("사용자 정보 저장 실패:", profileError);
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
        set({ isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
