import { create } from "zustand";
import {
  CharacterState,
  getAllCharacterImages,
  getCharacterStateFromTimerState,
} from "../services/characterService";

// 캐릭터 스토어 상태 인터페이스
export interface CharacterStoreState {
  // 캐릭터 상태
  currentState: CharacterState;
  // 각 상태별 이미지 URL
  imageUrls: Record<CharacterState, string | null>;
  // 이미지 로딩 상태
  isLoading: boolean;
  // 에러 메시지
  error: string | null;

  // 액션: 캐릭터 상태 설정
  setCharacterState: (state: CharacterState) => void;
  // 액션: 이미지 URL 설정
  setImageUrls: (urls: Record<CharacterState, string | null>) => void;
  // 액션: 이미지 로드 상태 설정
  setIsLoading: (isLoading: boolean) => void;
  // 액션: 에러 메시지 설정
  setError: (error: string | null) => void;
  // 액션: 이미지 URL 초기화
  initializeImageUrls: () => Promise<void>;
  // 액션: 타이머 상태에 따라 캐릭터 상태 업데이트
  updateCharacterFromTimerState: (
    timerComplete: boolean,
    isRunning: boolean,
    success?: boolean
  ) => void;
  // 액션: 캐릭터 상태를 normal로 초기화
  resetToNormal: () => void;
  // 액션: 성공 결과 표시
  showSuccessResult: () => void;
  // 액션: 실패 결과 표시
  showFailureResult: () => void;
  // 액션: 모든 이미지 URL 로드 (initializeImageUrls의 별칭)
  loadAllImageUrls: () => Promise<void>;
}

// 캐릭터 스토어 생성
export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  // 초기 상태
  currentState: "normal",
  imageUrls: {
    normal: null,
    pooping: null,
    success: null,
    fail: null,
  },
  isLoading: true,
  error: null,

  // 캐릭터 상태 설정 액션
  setCharacterState: (state: CharacterState) => {
    const currentState = get().currentState;
    console.log(
      `[characterStore] setCharacterState 호출됨: ${currentState} -> ${state}`
    );

    // 현재 상태와 동일하면 무시 (이 방어 로직 제거)
    // if (currentState === state) {
    //   console.log(`[characterStore] 이미 ${state} 상태입니다. 변경 무시`);
    //   return;
    // }

    // 상태 변경 전 추가 로깅
    console.log(`[characterStore] 상태 변경 적용 중: ${state}`);

    set((prevState) => {
      console.log(
        `[characterStore] 실제 상태 업데이트: ${prevState.currentState} -> ${state}`
      );
      return { currentState: state };
    });

    // 상태 변경 후 확인
    setTimeout(() => {
      const newState = get().currentState;
      console.log(`[characterStore] 상태 변경 확인: ${newState}`);
    }, 50);
  },

  // 이미지 URL 설정 액션
  setImageUrls: (urls: Record<CharacterState, string | null>) => {
    console.log("[characterStore] 이미지 URL 설정 시작:", urls);
    set({ imageUrls: urls });
    console.log("[characterStore] 이미지 URL 설정 완료");
  },

  // 로딩 상태 설정 액션
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // 에러 설정 액션
  setError: (error: string | null) => {
    if (error) {
      console.error("[characterStore] 오류 발생:", error);
    }
    set({ error });
  },

  // 이미지 URL 초기화 액션
  initializeImageUrls: async () => {
    const { setIsLoading, setImageUrls, setError } = get();

    try {
      console.log("[characterStore] 이미지 URL 초기화 시작");
      setIsLoading(true);
      setError(null);

      // 모든 캐릭터 이미지 URL 가져오기
      const imageUrls = await getAllCharacterImages();

      // 이미지 URL 유효성 검사
      const missingStates = Object.entries(imageUrls)
        .filter(([_, url]) => url === null)
        .map(([state]) => state);

      if (missingStates.length > 0) {
        console.warn(
          `[characterStore] 누락된 이미지 상태가 있습니다: ${missingStates.join(
            ", "
          )}`
        );
      }

      // 상태 업데이트
      setImageUrls(imageUrls);
      console.log("[characterStore] 이미지 URL 초기화 완료:", imageUrls);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("[characterStore] 이미지 URL 초기화 실패:", error);
      setError(`이미지 URL 초기화 중 오류: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  },

  // 타이머 상태에 따라 캐릭터 상태 업데이트 액션
  updateCharacterFromTimerState: (
    timerComplete: boolean,
    isRunning: boolean,
    success?: boolean
  ) => {
    const { setCharacterState } = get();

    // 타이머 상태에 따라 캐릭터 상태 결정
    const newState = getCharacterStateFromTimerState(
      timerComplete,
      isRunning,
      success
    );

    console.log(
      `[characterStore] 타이머 상태 변경에 따른 캐릭터 상태 업데이트:`,
      {
        타이머완료: timerComplete,
        실행중: isRunning,
        성공여부: success,
        새상태: newState,
      }
    );

    // 현재와 다른 상태일 경우에만 업데이트
    setCharacterState(newState);
  },

  // 캐릭터 상태를 normal로 초기화하는 액션
  resetToNormal: () => {
    console.log("[characterStore] 캐릭터 상태를 normal로 초기화 시작");
    const { setCharacterState } = get();
    setCharacterState("normal");
    console.log("[characterStore] 캐릭터 상태를 normal로 초기화 완료");
  },

  // 실패 결과 표시 액션
  showFailureResult: () => {
    console.log("=== [characterStore] showFailureResult 함수 호출됨 ===");

    // 기존 상태 로깅
    const prevState = get().currentState;
    console.log(
      `[characterStore] showFailureResult: 실패 표시 전 상태: ${prevState}`
    );

    // 강제로 상태 업데이트 (즉시 반영)
    set({ currentState: "fail" });

    // 업데이트 후 상태 로깅
    const newState = get().currentState;
    console.log(
      `[characterStore] showFailureResult: 실패 표시 후 상태: ${newState}`
    );

    // 추가 검증 - 실제로 상태가 변경되었는지 확인
    if (newState !== "fail") {
      console.error(
        "[characterStore] showFailureResult: 상태 변경 실패! 다시 시도합니다."
      );
      // 한번 더 시도
      set({ currentState: "fail" });
      console.log(
        `[characterStore] showFailureResult: 두 번째 시도 후 상태: ${
          get().currentState
        }`
      );
    }

    console.log(
      "[characterStore] showFailureResult: 실패 결과 표시 완료, 상태:",
      get().currentState
    );
    console.log("=== [characterStore] showFailureResult 함수 완료 ===");
  },

  // 성공 결과 표시 액션
  showSuccessResult: () => {
    console.log("=== [characterStore] showSuccessResult 함수 호출됨 ===");

    // 기존 상태 로깅
    const prevState = get().currentState;
    console.log(
      `[characterStore] showSuccessResult: 성공 표시 전 상태: ${prevState}`
    );

    // 강제로 상태 업데이트 (즉시 반영)
    set({ currentState: "success" });

    // 업데이트 후 상태 로깅
    const newState = get().currentState;
    console.log(
      `[characterStore] showSuccessResult: 성공 표시 후 상태: ${newState}`
    );

    // 추가 검증 - 실제로 상태가 변경되었는지 확인
    if (newState !== "success") {
      console.error(
        "[characterStore] showSuccessResult: 상태 변경 실패! 다시 시도합니다."
      );
      // 한번 더 시도
      set({ currentState: "success" });
      console.log(
        `[characterStore] showSuccessResult: 두 번째 시도 후 상태: ${
          get().currentState
        }`
      );
    }

    console.log(
      "[characterStore] showSuccessResult: 성공 결과 표시 완료, 상태:",
      get().currentState
    );
    console.log("=== [characterStore] showSuccessResult 함수 완료 ===");
  },

  // loadAllImageUrls는 initializeImageUrls의 별칭
  loadAllImageUrls: async () => {
    console.log(
      "[characterStore] loadAllImageUrls 호출 - initializeImageUrls 실행"
    );
    const { initializeImageUrls } = get();
    await initializeImageUrls();
    console.log("[characterStore] loadAllImageUrls 완료");
    return;
  },
}));
