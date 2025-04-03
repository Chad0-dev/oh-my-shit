import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  AppState,
} from "react-native";
import { useTimerStore } from "../../stores/timerStore";

const { width } = Dimensions.get("window");

// 기본 문구 상수
const DEFAULT_INFO = "오늘의 목표: 배변 성공하기";

// 배변 관련 정보 배열
const constipationInfos = [
  "규칙적인 식사는 장 운동을 촉진시켜 변비 예방에 도움이 됩니다.",
  "하루 2리터의 물을 마시면 대변이 장내에서 부드럽게 이동하는데 도움이 됩니다.",
  "식이섬유가 풍부한 과일, 채소, 통곡물은 변비 예방에 효과적입니다.",
  "꾸준한 운동은 장 운동을 활성화시켜 배변을 촉진합니다.",
  "아침 식사 후 화장실에 가는 습관을 들이면 규칙적인 배변에 도움이 됩니다.",
  "의자에 너무 오래 앉아있지 말고 30분마다 일어나 움직이세요.",
  "스트레스는 장 기능에 악영향을 줄 수 있으니 적절한 스트레스 관리가 필요합니다.",
  "커피나 차는 장 운동을 촉진시키지만, 과도한 섭취는 오히려 변비를 악화시킬 수 있습니다.",
  "변의가 올 때 참지 말고 즉시 화장실을 이용하세요.",
  "배변을 위한 자세는 무릎이 엉덩이보다 높게 위치하는 것이 좋습니다.",
];

// 랜덤한 인덱스 생성 함수
const getRandomIndex = (max: number, exclude: number[] = []) => {
  if (exclude.length >= max) return 0; // 모든 인덱스가 제외된 경우

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * max);
  } while (exclude.includes(randomIndex)); // 제외 목록에 없는 값 선택
  return randomIndex;
};

export const InfoTicker = () => {
  const { isRunning, resetSignal } = useTimerStore();
  const [currentInfo, setCurrentInfo] = useState("");
  const appState = useRef(AppState.currentState);

  // 애니메이션 값
  const translateX = useRef(new Animated.Value(width)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // 애니메이션 및 상태 관리용 ref
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(isRunning);
  const usedIndicesRef = useRef<number[]>([]);
  const currentIndexRef = useRef(-1);

  // isRunning 값을 ref에 동기화
  useEffect(() => {
    isRunningRef.current = isRunning;

    if (isRunning) {
      // 타이머 시작 시 첫 번째 정보 표시
      startInfoCycle();
    } else {
      // 타이머 중지 시 애니메이션 리셋 및 기본 상태로 복귀
      resetAnimation();
      setCurrentInfo("");
    }

    return () => {
      // 클린업 함수
      cleanupTimeouts();
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [isRunning]);

  // 앱 상태 변경 감지 (백그라운드 <-> 포그라운드)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isRunningRef.current
      ) {
        // 백그라운드에서 포그라운드로 돌아왔을 때 애니메이션 재시작
        resetAnimation();
        startInfoCycle();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // resetSignal에 반응
  useEffect(() => {
    if (resetSignal) {
      resetAnimation();
      setCurrentInfo("");
      usedIndicesRef.current = [];
      currentIndexRef.current = -1;
    }
  }, [resetSignal]);

  // 클린업 함수
  const cleanupTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 애니메이션 리셋
  const resetAnimation = () => {
    cleanupTimeouts();

    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // 애니메이션 값 초기화
    translateX.setValue(width);
    opacity.setValue(1);
  };

  // 정보 순환 시작
  const startInfoCycle = () => {
    if (!isRunningRef.current) return;

    // 애니메이션 준비
    cleanupTimeouts();
    resetAnimation();

    // 첫 번째 정보 선택
    const firstIndex = getRandomIndex(constipationInfos.length);
    currentIndexRef.current = firstIndex;
    usedIndicesRef.current = [firstIndex];
    setCurrentInfo(constipationInfos[firstIndex]);

    // 짧은 지연 후 애니메이션 시작
    timeoutRef.current = setTimeout(() => {
      startAnimation();
    }, 100);
  };

  // 다음 표시할 정보 선택
  const selectNextInfo = () => {
    // 모든 정보를 표시했으면 초기화
    if (usedIndicesRef.current.length >= constipationInfos.length) {
      usedIndicesRef.current = [];
    }

    // 새 인덱스 선택
    const nextIndex = getRandomIndex(
      constipationInfos.length,
      usedIndicesRef.current
    );
    currentIndexRef.current = nextIndex;
    usedIndicesRef.current.push(nextIndex);

    setCurrentInfo(constipationInfos[nextIndex]);
  };

  // 애니메이션 시작
  const startAnimation = () => {
    if (!isRunningRef.current) return;

    // 화면 오른쪽에서 시작
    translateX.setValue(width);
    opacity.setValue(1);

    // 애니메이션 시퀀스 생성
    animationRef.current = Animated.sequence([
      // 1. 오른쪽에서 왼쪽으로 슬라이드
      Animated.timing(translateX, {
        toValue: 10,
        duration: 3000,
        useNativeDriver: true,
      }),

      // 2. 잠시 멈춤
      Animated.delay(2000),

      // 3. 페이드아웃과 함께 왼쪽으로 사라짐
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -width / 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // 애니메이션 시작 및 완료 콜백 설정
    animationRef.current.start(({ finished }) => {
      // 애니메이션이 정상적으로 완료되고 타이머가 실행 중이면 다음 사이클 시작
      if (finished && isRunningRef.current) {
        timeoutRef.current = setTimeout(() => {
          // 다음 정보 선택 후 새 애니메이션 시작
          selectNextInfo();
          startAnimation();
        }, 500);
      }
    });
  };

  // 언마운트 시 클린업
  useEffect(() => {
    return () => {
      cleanupTimeouts();
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tickerContainer}>
        {!isRunning ? (
          // 타이머 비활성화 상태 - 기본 문구 표시
          <Text style={styles.defaultText} numberOfLines={1}>
            {DEFAULT_INFO}
          </Text>
        ) : (
          // 타이머 활성화 상태 - 정보 문구와 애니메이션 표시
          <Animated.Text
            style={[
              styles.text,
              {
                transform: [{ translateX }],
                opacity,
              },
            ]}
            numberOfLines={1}
          >
            {currentInfo}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d4de95",
    padding: 12,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tickerContainer: {
    overflow: "hidden",
    height: 20,
    justifyContent: "center",
  },
  text: {
    color: "#000000",
    fontSize: 14,
    width: width * 2, // 긴 텍스트를 위해 넓게 설정
  },
  defaultText: {
    color: "#000000",
    fontSize: 14,
    textAlign: "center",
  },
});
