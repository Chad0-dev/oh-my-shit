import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useAuthStore } from "../../stores/authStore";

interface GoogleSignInButtonProps {
  style?: any;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  style,
}) => {
  const { signInWithGoogle, isLoading } = useAuthStore();

  const handleGoogleSignIn = React.useCallback(async () => {
    if (isLoading) return; // 로딩 중일 때는 동작하지 않음

    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google 로그인 오류:", error);
    }
  }, [signInWithGoogle, isLoading]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <View style={styles.googleTextContainer}>
          <Text style={[styles.googleButtonText, { color: "#000" }]}>
            Continue with{" "}
          </Text>
          <Text style={[styles.googleButtonText, { color: "#4285F4" }]}>G</Text>
          <Text style={[styles.googleButtonText, { color: "#EA4335" }]}>o</Text>
          <Text style={[styles.googleButtonText, { color: "#FBBC05" }]}>o</Text>
          <Text style={[styles.googleButtonText, { color: "#4285F4" }]}>g</Text>
          <Text style={[styles.googleButtonText, { color: "#34A853" }]}>l</Text>
          <Text style={[styles.googleButtonText, { color: "#EA4335" }]}>e</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
