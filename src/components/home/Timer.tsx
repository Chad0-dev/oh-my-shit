import React, { useEffect, useMemo, useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTimerStore } from "../../stores/timerStore";
import { useThemeStore } from "../../stores/themeStore";

// 시간을 포맷팅하는 함수
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
};

export const Timer = React.memo(() => {
  const { isRunning, totalTime, getElapsed, resultState, resetSignal } =
    useTimerStore((state) => ({
      isRunning: state.isRunning,
      totalTime: state.totalTime,
      getElapsed: state.getElapsed,
      resultState: state.resultState,
      resetSignal: state.resetSignal,
    }));
  const { isDark } = useThemeStore((state) => ({ isDark: state.isDark }));

  // 경과 시간을 상태로 관리하여 화면 갱신 유도
  const [currentElapsed, setCurrentElapsed] = useState(0);

  // resetSignal이 변경될 때 경과 시간 초기화
  useEffect(() => {
    setCurrentElapsed(0);
  }, [resetSignal]);

  // 타이머 실행 중일 때 시간 업데이트를 위한 useEffect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      // 첫 실행 시 바로 업데이트
      setCurrentElapsed(getElapsed());

      // 1초마다 경과 시간 업데이트
      intervalId = setInterval(() => {
        setCurrentElapsed(getElapsed());
      }, 1000);
    }

    // 컴포넌트 언마운트 또는 의존성 변경 시 인터벌 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, getElapsed]);

  // 남은 시간 계산
  const remainingTime = useMemo(
    () => Math.max(0, totalTime - currentElapsed),
    [totalTime, currentElapsed]
  );

  // 포맷된 시간을 메모이제이션
  const formattedTime = useMemo(
    () => formatTime(remainingTime),
    [remainingTime]
  );

  // 텍스트 색상
  const textColor = useMemo(() => (isDark ? "#FFFFFF" : "#636B2F"), [isDark]);

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, { color: textColor }]}>
        {formattedTime}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
  },
});
