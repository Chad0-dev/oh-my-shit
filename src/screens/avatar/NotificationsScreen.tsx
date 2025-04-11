import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";

export const NotificationsScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#000000" }]}>
        알림
      </Text>
      <View style={styles.content}>
        <Text style={[styles.text, { color: isDark ? "#FFFFFF" : "#000000" }]}>
          알림 페이지 준비 중입니다.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});
