import { create } from "zustand";
import { Character } from "../types/character";
import { getCharacterImageUrl } from "../services/characterService";

type CharacterStateType = "normal" | "pooping" | "success" | "fail";

// 디버깅용 상수
const DEBUG = false;

/**
 * 디버깅 로그를 출력하는 함수
 */
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG:CharacterStore] ${message}`, data || "");
  }
};

interface CharacterState {
  selectedCharacter: Character | null;
  characterImages: Record<CharacterStateType, string>;
  currentState: CharacterStateType;
  isLoading: boolean;
  error: string | null;
  setSelectedCharacter: (character: Character) => void;
  updateCharacterImages: (state: CharacterStateType) => Promise<void>;
  setCurrentState: (state: CharacterStateType) => void;
  initializeImageUrls: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  selectedCharacter: null,
  characterImages: {
    normal: "",
    pooping: "",
    success: "",
    fail: "",
  },
  currentState: "normal",
  isLoading: false,
  error: null,
  setSelectedCharacter: (character) => {
    set({ selectedCharacter: character });

    // 캐릭터가 변경되면 로딩 상태 초기화 및 즉시 이미지 초기화 시작
    set({ isLoading: true, error: null });

    // 기본 이미지 즉시 업데이트
    getCharacterImageUrl(character.id, "normal")
      .then((url) => {
        set((state) => ({
          characterImages: {
            ...state.characterImages,
            normal: url,
          },
        }));

        // 다른 상태의 이미지도 자동으로 초기화
        get().initializeImageUrls();
      })
      .catch((error) => {
        set({ isLoading: false, error: "이미지 로드 실패" });
      });
  },
  updateCharacterImages: async (state) => {
    const currentCharacter = useCharacterStore.getState().selectedCharacter;

    if (!currentCharacter) {
      return;
    }

    try {
      const imageUrl = await getCharacterImageUrl(currentCharacter.id, state);

      set((prev) => ({
        characterImages: { ...prev.characterImages, [state]: imageUrl },
      }));
    } catch (error) {
      // 에러 처리
    }
  },
  setCurrentState: (state) => {
    set({ currentState: state });
  },
  initializeImageUrls: async () => {
    set({ isLoading: true, error: null });

    try {
      const currentCharacter = useCharacterStore.getState().selectedCharacter;

      if (!currentCharacter) {
        const errorMsg = "선택된 캐릭터가 없습니다.";
        set({ isLoading: false, error: errorMsg });
        return;
      }

      const states: CharacterStateType[] = [
        "normal",
        "pooping",
        "success",
        "fail",
      ];
      const imageUrls: Record<CharacterStateType, string> = {
        normal: "",
        pooping: "",
        success: "",
        fail: "",
      };

      // 순차적으로 이미지 URL 가져오기
      for (const state of states) {
        try {
          const url = await getCharacterImageUrl(currentCharacter.id, state);
          imageUrls[state] = url;
        } catch (error) {
          // 개별 상태 실패 시 더미 URL 설정
          imageUrls[
            state
          ] = `https://placehold.co/400x400/FF6B6B/FFF?text=${currentCharacter.id}-${state}`;
        }
      }

      set({ characterImages: imageUrls, isLoading: false });
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "이미지 로딩 중 오류가 발생했습니다.";
      set({
        isLoading: false,
        error: errorMsg,
      });
    } finally {
      // 로딩 상태 강제 종료 (항상 로딩 완료되도록)
      setTimeout(() => {
        const { isLoading } = get();
        if (isLoading) {
          set({ isLoading: false });
        }
      }, 3000);
    }
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  clearError: () => {
    set({ error: null });
  },
}));
