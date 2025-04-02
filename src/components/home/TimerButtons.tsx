import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTimerStore } from "../../stores/timerStore";

export const TimerButtons = () => {
  const { startTimer, stopTimer, resetTimer, isRunning } = useTimerStore();

  const handlePlayPress = () => {
    if (!isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  const handleResultPress = () => {
    stopTimer();
    // 나중에 결과 입력 화면으로 이동하는 로직 추가
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePlayPress}>
        <Ionicons
          name={isRunning ? "pause" : "play"}
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleResultPress}>
        <MaterialCommunityIcons
          name="pencil-box-multiple"
          size={28}
          color="#636B2F"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginVertical: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
