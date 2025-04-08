import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTimerStore } from "../../stores/timerStore";

export const Timer = () => {
  const { isRunning, getElapsed, resetSignal, totalTime, setTimerComplete } =
    useTimerStore();
  const [displayTime, setDisplayTime] = useState("05:00");
  const [prevRemaining, setPrevRemaining] = useState(300);

  // resetSignal이 변경되면 타이머 표시 시간 초기화
  React.useEffect(() => {
    updateDisplayTime();
  }, [resetSignal]);

  // 타이머 표시 업데이트 함수
  const updateDisplayTime = () => {
    const totalSeconds = getElapsed();
    const remainingSeconds = Math.max(0, totalTime - totalSeconds);

    // 이전 남은 시간과 현재 남은 시간을 비교하여 0이 되었을 때 이벤트 발생
    if (prevRemaining > 0 && remainingSeconds === 0 && isRunning) {
      setTimerComplete(true);
    }

    setPrevRemaining(remainingSeconds);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    setDisplayTime(`${formattedMinutes}:${formattedSeconds}`);
  };

  // 타이머 실행 중일 때 1초마다 업데이트
  useEffect(() => {
    updateDisplayTime();

    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        updateDisplayTime();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, getElapsed, totalTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{displayTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#636B2F",
  },
});
