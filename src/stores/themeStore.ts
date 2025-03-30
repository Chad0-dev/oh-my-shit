import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  applySystemTheme: (isDarkMode: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system", // 기본값: 시스템 설정 따름
      isDark: false, // 기본값: 라이트 모드

      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
          isDark: state.mode === "light",
        })),

      setTheme: (mode) =>
        set({
          mode,
          isDark: mode === "dark" || (mode === "system" && false), // 시스템 모드일 경우 기본 값 유지
        }),

      applySystemTheme: (isDarkMode) =>
        set((state) => {
          if (state.mode === "system") {
            return { isDark: isDarkMode };
          }
          return {};
        }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
