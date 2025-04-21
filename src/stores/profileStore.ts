import { create } from "zustand";
import { supabase } from "../supabase/client";
import { useAuthStore } from "./authStore";

interface ProfileState {
  avatarUrl: string | null;
  nickname: string;
  birthdate: string | null;
  character: string;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  setAvatarUrl: (url: string | null) => void;
  setNickname: (name: string) => void;
  setBirthdate: (date: string | null) => void;
  setCharacter: (character: string) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  avatarUrl: null,
  nickname: "사용자",
  birthdate: null,
  character: "basic",
  isLoading: false,

  loadProfile: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      // Supabase에서 사용자 프로필 데이터 조회
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("프로필 로드 에러:", error);
        return;
      }

      if (data) {
        // 프로필 데이터가 있는 경우
        set({
          nickname: data.nickname || "사용자",
          character: data.character_type || "basic",
          avatarUrl: data.avatar_url || null,
          birthdate: data.birthdate || null,
        });
      } else {
        // 프로필 데이터가 없는 경우 기본값 설정
        set({
          nickname: user.email ? user.email.split("@")[0] : "사용자",
          character: "basic",
          avatarUrl: null,
          birthdate: null,
        });
      }
    } catch (error) {
      console.error("프로필 로드 중 에러 발생:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setNickname: (name) => set({ nickname: name }),
  setBirthdate: (date) => set({ birthdate: date }),
  setCharacter: (character) => set({ character }),
}));
