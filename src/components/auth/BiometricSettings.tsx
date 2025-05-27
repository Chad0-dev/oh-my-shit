import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useAuthStore } from "../../stores/authStore";

export const BiometricSettings: React.FC = () => {
  const { biometricAvailable, biometricEnabled, toggleBiometric } =
    useAuthStore();

  if (!biometricAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.unavailableText}>
          생체인증을 사용할 수 없습니다.
        </Text>
        <Text style={styles.subText}>
          설정에서 Face ID 또는 Touch ID를 활성화해주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>생체인증 로그인</Text>
          <Text style={styles.subtitle}>
            Face ID 또는 Touch ID로 빠르게 로그인하세요
          </Text>
        </View>
        <Switch
          value={biometricEnabled}
          onValueChange={toggleBiometric}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={biometricEnabled ? "#007AFF" : "#f4f3f4"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  unavailableText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});
