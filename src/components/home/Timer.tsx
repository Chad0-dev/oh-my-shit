import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTimerStore } from "../../stores/timerStore";

export const Timer = () => {
  const { isRunning, getElapsed } = useTimerStore();
  const [displayTime, setDisplayTime] = useState("25:00");

  // 타이머 표시 업데이트 함수
  const updateDisplayTime = () => {
    const totalSeconds = isRunning ? getElapsed() : getElapsed();
    const minutes = Math.floor((1500 - totalSeconds) / 60);
    const seconds = (1500 - totalSeconds) % 60;

    // 시간이 음수가 되지 않도록 처리
    if (minutes < 0 || seconds < 0) {
      setDisplayTime("00:00");
      return;
    }

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
  }, [isRunning, getElapsed]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{displayTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#636B2F",
  },
});
