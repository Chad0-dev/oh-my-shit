// src/stores/timerStore.ts
import { create } from "zustand";

interface TimerState {
  startTime: number | null; // 시작 시간 (timestamp, Date.now())
  isRunning: boolean;
  elapsed: number; // 경과 시간 (초 단위)
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  getElapsed: () => number;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  startTime: null,
  isRunning: false,
  elapsed: 0,

  startTimer: () => {
    const now = Date.now();
    set({
      startTime: now,
      isRunning: true,
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
    });
  },

  getElapsed: () => {
    const { startTime, isRunning, elapsed } = get();
    if (!isRunning || startTime === null) return elapsed;
    return Math.floor((Date.now() - startTime) / 1000);
  },
}));
