import { create } from "zustand";
import { Character } from "../types/character";
import { getCharacterImageUrl } from "../services/characterService";
import { preloadCharacterStateImages } from "../services/imagePreloadService";

type CharacterStateType = "normal" | "pooping" | "success" | "fail";

// 캐릭터 이미지 로드 상태 추적
interface ImageLoadingState {
  [key: string]: boolean;
}

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

    // 캐릭터 변경 시 모든 이미지를 한 번에 로드하도록 변경
    get().initializeImageUrls();
  },
  updateCharacterImages: async (state) => {
    const currentCharacter = useCharacterStore.getState().selectedCharacter;

    if (!currentCharacter) {
      return;
    }

    try {
      const imageUrl = await getCharacterImageUrl(currentCharacter.id, state);

      // 이전 이미지와 같으면 업데이트하지 않음 (불필요한 리렌더링 방지)
      const prevImages = useCharacterStore.getState().characterImages;
      if (prevImages[state] === imageUrl) {
        return;
      }

      set((prev) => ({
        characterImages: { ...prev.characterImages, [state]: imageUrl },
      }));
    } catch (error) {
      // 조용히 오류 처리
    }
  },
  setCurrentState: (state) => {
    // 현재 상태와 같으면 업데이트하지 않음 (불필요한 리렌더링 방지)
    if (get().currentState === state) {
      return;
    }
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

      // 이제 preloadCharacterStateImages를 사용하여 이미지를 사전 로드
      const imageUrls = await preloadCharacterStateImages(currentCharacter.id);

      // 이전 이미지와 비교하여 변경되었을 때만 업데이트 (불필요한 리렌더링 방지)
      const prevImages = get().characterImages;
      let hasChanges = false;

      const states: CharacterStateType[] = [
        "normal",
        "pooping",
        "success",
        "fail",
      ];
      for (const state of states) {
        if (prevImages[state] !== imageUrls[state]) {
          hasChanges = true;
          break;
        }
      }

      if (hasChanges) {
        set({
          characterImages: imageUrls as Record<CharacterStateType, string>,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      // 오류 발생 시 조용히 처리하되, 상태는 업데이트
      set({
        isLoading: false,
        error: "이미지 로딩 중 오류가 발생했습니다.",
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
