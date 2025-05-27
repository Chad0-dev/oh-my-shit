import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAuthStore } from "./stores/authStore";
import { BiometricLoginButton, BiometricSettings } from "./components/auth";

export default function App() {
  const { initializeAuth, user, isLoading } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 자동으로 인증 초기화 (생체인증 포함)
    initializeAuth();
  }, []);

  if (isLoading) {
    return <View style={styles.container}>{/* 로딩 화면 */}</View>;
  }

  return (
    <View style={styles.container}>
      {/* 개발용 디버그 정보 - 프로덕션에서는 제거 */}
      {/* <BiometricDebug /> */}

      {user ? (
        // 로그인된 상태
        <View>
          {/* 메인 앱 화면 */}
          <BiometricSettings />
        </View>
      ) : (
        // 로그인 화면
        <View>
          {/* 일반 로그인 폼 */}
          <BiometricLoginButton />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
});
