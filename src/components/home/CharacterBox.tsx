import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { Image } from "expo-image";
import { useTimerStore } from "../../stores/timerStore";
import { useCharacterStore } from "../../stores/characterStore";
import { getCharacterImageUrl } from "../../services/characterService";
import { useProfileStore } from "../../stores/profileStore";
import { getBlurredImageUrl } from "../../services/imagePreloadService";

const { width, height } = Dimensions.get("window");

// 캐릭터 상태 타입 정의
type CharacterState = "normal" | "pooping" | "success" | "fail";

export const CharacterBox = React.memo(() => {
  // 필요한 상태만 정확히 구독하여 불필요한 리렌더링 방지
  const { isRunning, resultState, setResultState } = useTimerStore((state) => ({
    isRunning: state.isRunning,
    resultState: state.resultState,
    setResultState: state.setResultState,
  }));

  const {
    selectedCharacter,
    characterImages,
    currentState,
    setCurrentState,
    isLoading: characterLoading,
    initializeImageUrls,
  } = useCharacterStore((state) => ({
    selectedCharacter: state.selectedCharacter,
    characterImages: state.characterImages,
    currentState: state.currentState,
    setCurrentState: state.setCurrentState,
    isLoading: state.isLoading,
    initializeImageUrls: state.initializeImageUrls,
  }));

  const profileCharacter = useProfileStore((state) => state.character);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(false);

  // 프로필의 캐릭터 정보로 characterStore 초기화 (의존성 배열 최적화)
  useEffect(() => {
    const initializeCharacter = async () => {
      setIsLoading(true);

      try {
        // 프로필에서 설정된 캐릭터 ID 확인
        const characterId = profileCharacter || "basic";

        // 현재 선택된 캐릭터가 없거나 다른 캐릭터인 경우에만 초기화
        if (!selectedCharacter || selectedCharacter.id !== characterId) {
          // 캐릭터 이미지 URL 가져오기
          const normalImageUrl = await getCharacterImageUrl(
            characterId,
            "normal"
          );

          // 캐릭터 스토어 업데이트
          const characterInfo = {
            id: characterId,
            name: characterId.charAt(0).toUpperCase() + characterId.slice(1),
            imageUrl: normalImageUrl,
          };

          // 기존 캐릭터 스토어에 캐릭터 설정
          useCharacterStore.getState().setSelectedCharacter(characterInfo);
        } else {
          // 이미 올바른 캐릭터가 선택되어 있으면 이미지만 초기화
          await initializeImageUrls();
        }
      } catch (error) {
        console.error("캐릭터 초기화 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCharacter();
  }, [profileCharacter]); // 프로필 캐릭터만 의존성으로 지정

  // 상태 변경 감지 및 characterStore 동기화 (의존성 배열 최적화)
  useEffect(() => {
    let newState: CharacterState = "normal";

    if (resultState === "success") {
      newState = "success";
    } else if (resultState === "fail") {
      newState = "fail";
    } else if (isRunning) {
      newState = "pooping";
    } else {
      newState = "normal";
    }

    // 현재 상태와 다를 때만 업데이트하여 불필요한 상태 변경 방지
    if (newState !== currentState) {
      setCurrentState(newState);
    }
  }, [isRunning, resultState, currentState, setCurrentState]);

  // 펄스 애니메이션 - 최적화 (useCallback 사용)
  const startPulseAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulseAnimation = useCallback(() => {
    pulseAnim.setValue(1);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).stop();
  }, [pulseAnim]);

  // 펄스 애니메이션 최적화
  useEffect(() => {
    if (isRunning) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }

    return () => {
      stopPulseAnimation();
    };
  }, [isRunning, startPulseAnimation, stopPulseAnimation]);

  // 캐릭터 클릭 핸들러 (useCallback으로 최적화)
  const handleCharacterPress = useCallback(() => {
    if (isRunning) {
      return;
    }

    setResultState(null);
    setCurrentState("normal");
  }, [isRunning, setResultState, setCurrentState]);

  // 현재 이미지 URL (useMemo로 최적화)
  const currentImageUrl = useMemo(
    () => characterImages?.[currentState] || "",
    [characterImages, currentState]
  );

  // 블러 이미지 URL
  const blurredImageUrl = useMemo(
    () => (currentImageUrl ? getBlurredImageUrl(currentImageUrl) : ""),
    [currentImageUrl]
  );

  const isLoadingState = isLoading || characterLoading || !currentImageUrl;

  return (
    <TouchableOpacity
      activeOpacity={isRunning ? 1 : 0.6}
      onPress={handleCharacterPress}
      disabled={isRunning}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {isLoadingState ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#636B2F" />
            <Text style={styles.loadingText}>캐릭터 로딩 중...</Text>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentImageUrl }}
              style={styles.image}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={300}
              recyclingKey={`${selectedCharacter?.id}-${currentState}`}
              priority="high"
              placeholder={{ uri: blurredImageUrl }}
              placeholderContentFit="contain"
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 15,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});
