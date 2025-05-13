import React, { useEffect, useMemo, useCallback } from "react";
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
  const { isRunning, totalTime, getElapsed, resultState } = useTimerStore(
    (state) => ({
      isRunning: state.isRunning,
      totalTime: state.totalTime,
      getElapsed: state.getElapsed,
      resultState: state.resultState,
    })
  );
  const { isDark } = useThemeStore((state) => ({ isDark: state.isDark }));

  // 경과 시간 계산
  const elapsedSeconds = useMemo(() => getElapsed(), [getElapsed]);

  // 남은 시간 계산
  const remainingTime = useMemo(
    () => Math.max(0, totalTime - elapsedSeconds),
    [totalTime, elapsedSeconds]
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
