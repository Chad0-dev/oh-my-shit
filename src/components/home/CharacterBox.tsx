import React from "react";
import { View, StyleSheet, Dimensions, Animated, Image } from "react-native";
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
    >
      <Image
        source={require("../../../assets/images/pooping-cat.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "#F5F5F5",
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
