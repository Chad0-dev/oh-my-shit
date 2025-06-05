import React from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Text } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuthStore } from "../../stores/authStore";
import { isAppleAuthAvailable } from "../../utils/appleAuth";

interface AppleSignInButtonProps {
  style?: any;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  style,
}) => {
  const { signInWithApple, isLoading } = useAuthStore();
  const [isAvailable, setIsAvailable] = React.useState(false);

  const checkAvailability = React.useCallback(async () => {
    const available = await isAppleAuthAvailable();
    setIsAvailable(available);
  }, []);

  React.useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleAppleSignIn = React.useCallback(async () => {
    if (isLoading) return; // 로딩 중일 때는 동작하지 않음

    try {
      await signInWithApple();
    } catch (error: any) {
      console.error("Apple 로그인 오류:", error);

      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      if (
        error.message?.includes("Provider") &&
        error.message?.includes("not enabled")
      ) {
        errorMessage =
          "Apple 로그인이 현재 비활성화되어 있습니다.\n이메일/비밀번호 로그인을 사용해주세요.";
      } else if (error.message?.includes("authorization attempt failed")) {
        errorMessage = "Apple ID 인증이 취소되었습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Apple 로그인 오류", errorMessage);
    }
  }, [signInWithApple, isLoading]);

  // Apple 인증이 불가능한 경우에만 대체 버튼 표시
  if (!isAvailable) {
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "#000",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            },
          ]}
          onPress={() =>
            Alert.alert(
              "Apple 로그인 진단",
              `Apple 인증 가용성: ${isAvailable}\n플랫폼: iOS\n환경: ${
                __DEV__ ? "Development" : "Production"
              }\n\n가능한 원인:\n• Apple Developer Console에서 Sign In with Apple 미활성화\n• Services ID 설정 오류\n• Bundle ID 불일치`
            )
          }
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
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
  },
});
