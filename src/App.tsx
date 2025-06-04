import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAuthStore } from "./stores/authStore";
import { AppleSignInButton } from "./components/auth";

export default function App() {
  const { initializeAuth, user, isLoading, appleAuthAvailable } =
    useAuthStore();

  useEffect(() => {
    // 앱 시작 시 자동으로 인증 초기화
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oh My Poop</Text>

      {user ? (
        // 로그인된 상태
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>환영합니다, {user.email}!</Text>
        </View>
      ) : (
        // 로그인 화면
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>로그인이 필요합니다</Text>

          {appleAuthAvailable && (
            <>
              <Text style={styles.loginSubText}>
                Apple ID로 간편하게 로그인하세요
              </Text>
              <AppleSignInButton />
            </>
          )}

          {!appleAuthAvailable && (
            <Text style={styles.errorText}>
              Apple ID 로그인을 사용할 수 없습니다. iOS 13+ 기기가 필요합니다.
            </Text>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loginSubText: {
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
});
