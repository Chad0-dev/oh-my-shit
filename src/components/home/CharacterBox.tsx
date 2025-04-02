import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useTimerStore } from "../../stores/timerStore";

const { width, height } = Dimensions.get("window");

export const CharacterBox = () => {
  const { isRunning } = useTimerStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRunning) {
      // 타이머가 실행 중일 때 약간의 펄스 애니메이션 적용
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
      // 타이머가 중지되면 애니메이션 중지
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isRunning]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "#4A90E2",
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 12,
  },
});
