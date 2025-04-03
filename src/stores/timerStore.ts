// src/stores/timerStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TimerState {
  startTime: number | null; // 시작 시간 (timestamp, Date.now())
  isRunning: boolean;
  elapsed: number; // 경과 시간 (초 단위)
  resetSignal: boolean;
  buttonState: "play" | "plus" | "slash"; // 버튼 상태 추가
  totalTime: number; // 총 시간(초)
  timerComplete: boolean; // 타이머 완료 여부
  setButtonState: (state: "play" | "plus" | "slash") => void;
  toggleResetSignal: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  getElapsed: () => number;
  // Timer.tsx에서 추가하는 함수들
  addTime: (seconds: number) => void;
  resetTotalTime: () => void;
  setTimerComplete: (complete: boolean) => void; // 타이머 완료 설정 함수
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      startTime: null,
      isRunning: false,
      elapsed: 0,
      resetSignal: false,
      buttonState: "play", // 기본값은 'play'
      totalTime: 300, // 기본 5분(300초)
      timerComplete: false, // 타이머 완료 기본값

      setButtonState: (state) => set({ buttonState: state }),

      toggleResetSignal: () =>
        set((state) => ({ resetSignal: !state.resetSignal })),

      startTimer: () => {
        const now = Date.now();
        set({
          startTime: now,
          isRunning: true,
          timerComplete: false, // 타이머 시작 시 완료 상태 초기화
        });
      },

      stopTimer: () => {
        const { startTime } = get();
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          set({ isRunning: false, elapsed });
        }
      },

      resetTimer: () => {
        set({
          startTime: null,
          isRunning: false,
          elapsed: 0,
          buttonState: "play", // 타이머 리셋 시 버튼 상태도 초기화
          totalTime: 300, // 타이머 리셋 시 totalTime도 초기화
          timerComplete: false, // 타이머 리셋 시 완료 상태도 초기화
        });
      },

      getElapsed: () => {
        const { startTime, isRunning, elapsed } = get();
        if (!isRunning || startTime === null) return elapsed;
        return Math.floor((Date.now() - startTime) / 1000);
      },

      // 시간 추가 함수
      addTime: (seconds) => {
        set((state) => ({ totalTime: state.totalTime + seconds }));
      },

      // 시간 초기화 함수
      resetTotalTime: () => {
        set({ totalTime: 300 }); // 5분으로 초기화
      },

      // 타이머 완료 상태 설정 함수
      setTimerComplete: (complete) => {
        set({ timerComplete: complete });
      },
    }),
    {
      name: "timer-storage", // 스토리지 고유 이름
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
