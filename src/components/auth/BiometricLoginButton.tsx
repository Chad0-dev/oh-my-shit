import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useAuthStore } from "../../stores/authStore";

interface BiometricLoginButtonProps {
  style?: any;
}

export const BiometricLoginButton: React.FC<BiometricLoginButtonProps> = ({
  style,
}) => {
  const {
    signInWithBiometric,
    biometricAvailable,
    biometricEnabled,
    isLoading,
  } = useAuthStore();

  if (!biometricAvailable || !biometricEnabled) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={signInWithBiometric}
      disabled={isLoading}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>
          {isLoading ? "인증 중..." : "Face ID / Touch ID로 로그인"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
