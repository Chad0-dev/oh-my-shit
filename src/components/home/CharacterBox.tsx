import React, { useState, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");

// 캐릭터 상태 타입 정의
type CharacterState = "normal" | "pooping" | "success" | "fail";

export const CharacterBox = () => {
  // resultState 직접 구독 추가
  const { isRunning, buttonState, resultState, setResultState } =
    useTimerStore();
  const {
    selectedCharacter,
    characterImages,
    currentState,
    setCurrentState,
    isLoading: characterLoading,
    initializeImageUrls,
  } = useCharacterStore();
  const { character: profileCharacter } = useProfileStore();

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(true);

  // 프로필의 캐릭터 정보로 characterStore 초기화
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
          initializeImageUrls();
        }
      } catch (error) {
        // 오류 처리
      } finally {
        setIsLoading(false);
      }
    };

    initializeCharacter();
  }, [profileCharacter]);

  // 상태 변경 감지 및 characterStore 동기화
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

    // 캐릭터 스토어의 상태 업데이트
    setCurrentState(newState);
  }, [isRunning, resultState, buttonState]);

  // 펄스 애니메이션
  useEffect(() => {
    if (isRunning) {
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
    } else {
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isRunning]);

  // 캐릭터 클릭 핸들러
  const handleCharacterPress = () => {
    if (isRunning) {
      return;
    }

    setResultState(null);
    setCurrentState("normal");
  };

  // 현재 이미지 URL
  const currentImageUrl = characterImages?.[currentState] || "";
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
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

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
