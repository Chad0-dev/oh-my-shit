import "./global.css";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { useThemeStore } from "./src/stores/themeStore";
import { useAuthStore } from "./src/stores/authStore";
import { useProfileStore } from "./src/stores/profileStore";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { SignUpScreen } from "./src/screens/auth/SignUpScreen";
import { Loading } from "./src/components/feedback/Loading";
import { AppNavigation } from "./src/screens/AppNavigation";
import * as Font from "expo-font";

export default function App() {
  const colorScheme = useColorScheme();
  const { applySystemTheme } = useThemeStore();
  const { user, isLoading, error } = useAuthStore();
  const { loadProfile } = useProfileStore();
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // 폰트 로드
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Pattaya: require("./assets/fonts/Pattaya-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // 시스템 테마 변경 감지
  useEffect(() => {
    applySystemTheme(colorScheme === "dark");
  }, [colorScheme, applySystemTheme]);

  // 로그인 상태 변경 시 프로필 정보 로드
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // 폰트 로딩 중이거나 인증 로딩 중일 때 로딩 표시
  if (!fontsLoaded || isLoading) {
    return <Loading fullScreen />;
  }

  // 미로그인 시 로그인/회원가입 화면
  if (!user) {
    return (
      <SafeAreaProvider>
        {isLoginScreen ? (
          <LoginScreen onSignUpPress={() => setIsLoginScreen(false)} />
        ) : (
          <SignUpScreen onLoginPress={() => setIsLoginScreen(true)} />
        )}
      </SafeAreaProvider>
    );
  }

  // 로그인 시 메인 앱 화면
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  );
}
