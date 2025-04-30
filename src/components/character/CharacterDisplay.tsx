import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useCharacterStore } from "../../stores/characterStore";

type CharacterStateType = "normal" | "pooping" | "success" | "fail";

interface CharacterDisplayProps {
  size?: "small" | "medium" | "large";
  showState?: boolean;
  forceLoad?: boolean; // 강제 로드 여부
}

// 디버깅용 상수
const DEBUG = false;
const LOADING_TIMEOUT = 5000; // 5초 후 로딩 타임아웃

/**
 * 디버깅 로그를 출력하는 함수
 */
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG:CharacterDisplay] ${message}`, data || "");
  }
};

/**
 * 캐릭터 이미지를 표시하는 컴포넌트
 * 캐릭터의 상태에 따라 다른 이미지를 표시하고
 * 애니메이션을 적용합니다.
 */
export const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  size = "medium",
  showState = false,
  forceLoad = false,
}) => {
  // 캐릭터 스토어에서 상태 및 이미지 URL 가져오기
  const {
    currentState,
    characterImages,
    isLoading,
    error,
    initializeImageUrls,
    selectedCharacter,
    setLoading,
    clearError,
  } = useCharacterStore();

  // 로딩 타임아웃 상태
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  // 로컬 에러 상태
  const [localError, setLocalError] = useState<string | null>(null);
  // 초기화 완료 상태
  const [initialized, setInitialized] = useState(false);

  // 애니메이션 값 초기화
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 컴포넌트 마운트 시 이미지 URL 초기화
  useEffect(() => {
    loadImages();

    return () => {
      // 컴포넌트 언마운트 시 정리
      setLoadingTimedOut(false);
      setLocalError(null);
    };
  }, [selectedCharacter?.id, forceLoad]);

  // 이미지 로딩 함수
  const loadImages = () => {
    // 이미지 URL이 이미 있고 강제 로드가 아니면 로드하지 않음
    if (characterImages.normal && !forceLoad && initialized) {
      return;
    }

    setLocalError(null);
    setLoadingTimedOut(false);

    if (!selectedCharacter) {
      setLocalError("선택된 캐릭터가 없습니다.");
      return;
    }

    // 로딩 타임아웃 설정
    const timeoutId = setTimeout(() => {
      setLoadingTimedOut(true);
      setLocalError("이미지 로딩 시간이 초과되었습니다.");
      setLoading(false); // 스토어의 로딩 상태도 강제로 해제
    }, LOADING_TIMEOUT);

    try {
      initializeImageUrls()
        .then(() => {
          setInitialized(true);
          clearTimeout(timeoutId);
        })
        .catch((err) => {
          setLocalError(
            err instanceof Error
              ? err.message
              : "이미지 URL 초기화 중 오류 발생"
          );
          clearTimeout(timeoutId);
        });
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "이미지 URL 초기화 시도 중 오류 발생"
      );
      clearTimeout(timeoutId);
    }
  };

  // 로딩 상태 변경 감지
  useEffect(() => {
    // 로딩이 완료되면 초기화 완료 상태 설정
    if (!isLoading && initialized) {
      // 로딩 완료 처리
    }
  }, [isLoading, error]);

  // 현재 상태 변경 감지
  useEffect(() => {
    // 상태 변경 감지
  }, [currentState, characterImages]);

  // 상태 변경 시 애니메이션 적용
  useEffect(() => {
    if (isLoading) return;

    // 애니메이션 초기화
    bounceAnim.setValue(0);
    shakeAnim.setValue(0);
    scaleAnim.setValue(1);

    // 상태별 애니메이션 설정
    switch (currentState) {
      case "pooping":
        // 배변 중 - 약간의 바운스 애니메이션
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ).start();
        break;

      case "success":
        // 성공 - 확대 애니메이션
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        break;

      case "fail":
        // 실패 - 좌우 흔들림 애니메이션
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: -1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ).start();
        break;

      default:
        // 기본 상태 - 애니메이션 없음
        break;
    }
  }, [currentState, isLoading, bounceAnim, shakeAnim, scaleAnim]);

  // 애니메이션 스타일 계산
  const animatedStyle = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-5, 0, 5],
        }),
      },
      { scale: scaleAnim },
    ],
  };

  // 크기에 따른 스타일 결정
  const sizeStyle = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 180, height: 180 },
  }[size];

  // 현재 이미지 URL
  const currentImageUrl = characterImages[currentState];

  // 수동 리로드 핸들러
  const handleReload = () => {
    setLoadingTimedOut(false);
    setLocalError(null);
    setInitialized(false);
    clearError();
    loadImages();
  };

  // 이미지가 정상적으로 로드되었는지 확인
  const hasValidImage = currentImageUrl && currentImageUrl.length > 0;

  // 로딩 중이거나 오류 발생 시 표시할 내용
  if (
    (isLoading && !loadingTimedOut && !hasValidImage) ||
    (!hasValidImage && !loadingTimedOut && !localError && !error)
  ) {
    return (
      <View style={[styles.container, sizeStyle]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>캐릭터 로딩 중...</Text>
      </View>
    );
  }

  if (loadingTimedOut || localError || error || !hasValidImage) {
    return (
      <View style={[styles.container, sizeStyle]}>
        <Text style={styles.errorText}>이미지를 불러올 수 없습니다</Text>
        <Text style={styles.errorSubText}>
          {localError || error || "이미지가 없습니다"}
        </Text>
        <TouchableOpacity onPress={handleReload} style={styles.reloadButton}>
          <Text style={styles.reloadText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 캐릭터 상태에 따른 상태 텍스트
  const stateTextMap: Record<CharacterStateType, string> = {
    normal: "평소 상태",
    pooping: "배변 중...",
    success: "성공!",
    fail: "실패...",
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={{ uri: currentImageUrl }}
          style={[styles.image, sizeStyle]}
          resizeMode="contain"
        />
      </Animated.View>

      {showState && (
        <Text style={styles.stateText}>{stateTextMap[currentState]}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    // 크기는 props로 동적 설정
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 5,
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  reloadButton: {
    marginTop: 15,
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  reloadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
