import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { CharacterBox } from "../../components/home/CharacterBox";
import { Timer } from "../../components/home/Timer";
import { TimerButtons } from "../../components/home/TimerButtons";
import { InfoTicker } from "../../components/home/InfoTicker";
import { useTimerStore } from "../../stores/timerStore";
import { useProfileStore } from "../../stores/profileStore";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import { useCharacterStore } from "../../stores/characterStore";
import { preloadAppImages } from "../../services/imagePreloadService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 앱 세션 키
const APP_SESSION_KEY = "app_already_initialized";
const IMAGES_PRELOADED_KEY = "images_already_preloaded";

export const HomeScreen = () => {
  const { resetAllState } = useTimerStore();
  const { loadProfile, character } = useProfileStore();
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();
  const { selectedCharacter } = useCharacterStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // 앱 초기화 상태 확인 및 처리
  useEffect(() => {
    const checkAppInitialization = async () => {
      try {
        // 앱이 이미 초기화되었는지 확인
        const alreadyInitialized = await AsyncStorage.getItem(APP_SESSION_KEY);

        if (!alreadyInitialized) {
          // 앱이 아직 초기화되지 않은 경우
          resetAllState(); // 상태 초기화
          await AsyncStorage.setItem(APP_SESSION_KEY, "true"); // 초기화 완료 표시
        }

        // 유저가 로그인되어 있으면 프로필 로드
        if (user) {
          await loadProfile();
        }

        setIsInitialized(true);
      } catch (error) {
        // 오류 발생 시 안전하게 초기화
        resetAllState();
        setIsInitialized(true);
      }
    };

    checkAppInitialization();
  }, [resetAllState, user, loadProfile]);

  // 이미지 사전 로딩
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // 이미 이미지를 프리로드했는지 확인
        const imagesAlreadyPreloaded = await AsyncStorage.getItem(
          IMAGES_PRELOADED_KEY
        );

        // 선택된 캐릭터 ID 결정 (프로필에서 가져오거나 기본값 사용)
        const characterId = character || selectedCharacter?.id || "basic";

        // 이미지가 프리로드되지 않았거나 디버깅 중이면 프리로드 실행
        if (!imagesAlreadyPreloaded) {
          await preloadAppImages(characterId);
          await AsyncStorage.setItem(IMAGES_PRELOADED_KEY, "true");
        }
      } catch (error) {
        // 오류 발생 시 조용히 처리
      }
    };

    // 앱이 초기화되고 유저 프로필이 로드된 후에만 이미지 사전 로딩 시작
    if (isInitialized && user) {
      preloadImages();
    }
  }, [isInitialized, user, character, selectedCharacter]);

  // 유저 변경 시 프로필 다시 로드
  useEffect(() => {
    if (user && isInitialized) {
      loadProfile();
    }
  }, [user?.id]);

  // 초기화가 완료되기 전까지 화면을 렌더링하지 않음
  if (!isInitialized) {
    return null; // 또는 로딩 인디케이터 표시
  }

  return (
    <SafeAreaView
      style={[styles.container, isDark && { backgroundColor: "#3D4127" }]}
    >
      <InfoTicker />
      <CharacterBox />
      <Timer />
      <TimerButtons />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
