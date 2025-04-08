import React from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { DEFAULT_INFO } from "../../data/constipationInfo";
import { useInfoTicker } from "../../hooks/useInfoTicker";

const { width } = Dimensions.get("window");

export const InfoTicker = () => {
  // 커스텀 훅 사용
  const { currentInfo, translateX, opacity, isRunning } = useInfoTicker(width);

  return (
    <View style={styles.container} testID="info-ticker-container">
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
