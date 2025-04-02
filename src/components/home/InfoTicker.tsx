import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export const InfoTicker = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="clip">
        오늘의 목표: 4개의 뽀모도로 완료하기
      </Text>
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
  text: {
    color: "#000000",
    fontSize: 14,
    textAlign: "center",
  },
});
