import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import {
  StyledSafeAreaView,
  StyledText,
  StyledView,
  StyledKeyboardAvoidingView,
} from "../../utils/styled";
import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/InputField";
import { AppleSignInButton } from "../../components/auth/AppleSignInButton";
import * as Font from "expo-font";

interface LoginScreenProps {
  onSignUpPress: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignUpPress }) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const { isDark } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const loginBg = require("../../../assets/images/login_bg.jpg");

  // 폰트 로딩
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Pattaya: require("../../../assets/fonts/Pattaya-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleSubmit = async () => {
    clearError();

    if (!email || !password) {
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      console.error("로그인 처리 오류:", error);
    }
  };

  if (!fontsLoaded) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <StyledText>로딩 중...</StyledText>
      </StyledView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* 배경 이미지 */}
      <View style={styles.backgroundContainer}>
        <Image source={loginBg} style={styles.backgroundImage} />
      </View>

      {/* 콘텐츠 영역 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <StyledSafeAreaView style={{ flex: 1, width: "100%" }}>
          {/* 타이틀 영역 */}
          <View style={styles.titleContainer}>
            <StyledText
              className={`text-center ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
              style={styles.titleText}
            >
              Oh My Poop
            </StyledText>

            {/* 부제목 및 설명 */}
            <View style={styles.subtitleContainer}>
              <StyledText
                className={`text-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                style={styles.subtitleText}
              >
                Your Personal Health Companion
              </StyledText>
              <StyledText
                className={`text-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                style={styles.descriptionText}
              >
                Track your daily habits and monitor your wellness journey with
                precision and care
              </StyledText>
            </View>
          </View>

          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
            {/* Google 로그인 */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() =>
                Alert.alert("구글 로그인", "아직 미구현 기능입니다.")
              }
            >
              <View style={styles.googleTextContainer}>
                <StyledText
                  style={[styles.googleButtonText, { color: "#000" }]}
                >
                  Continue with{" "}
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#4285F4" }]}
                >
                  G
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#EA4335" }]}
                >
                  o
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#FBBC05" }]}
                >
                  o
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#4285F4" }]}
                >
                  g
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#34A853" }]}
                >
                  l
                </StyledText>
                <StyledText
                  style={[styles.googleButtonText, { color: "#EA4335" }]}
                >
                  e
                </StyledText>
              </View>
            </TouchableOpacity>

            {/* Apple 로그인 메인 */}
            <AppleSignInButton style={styles.appleButton} />

            {/* 다른 방법으로 로그인 토글 */}
            <TouchableOpacity
              style={styles.alternativeLoginToggle}
              onPress={() => setShowEmailLogin(!showEmailLogin)}
            >
              <StyledText
                className={`text-center ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
                style={styles.alternativeLoginText}
              >
                {showEmailLogin
                  ? "간단한 로그인으로 돌아가기"
                  : "다른 방법으로 로그인"}
              </StyledText>
            </TouchableOpacity>

            {/* 이메일/비밀번호 로그인 (접힘 가능) */}
            {showEmailLogin && (
              <>
                {/* 구분선 */}
                <View style={styles.dividerContainer}>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: isDark ? "#444" : "#E0E0E0" },
                    ]}
                  />
                  <StyledText
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                    style={styles.dividerText}
                  >
                    또는
                  </StyledText>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: isDark ? "#444" : "#E0E0E0" },
                    ]}
                  />
                </View>

                <InputField
                  label="이메일"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <InputField
                  label="비밀번호"
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  error={error || undefined}
                />

                <Button
                  title="로그인"
                  variant="primary"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                  fullWidth
                  style={styles.marginTop}
                />

                <Button
                  title="계정 만들기"
                  variant="outline"
                  onPress={onSignUpPress}
                  fullWidth
                  style={styles.marginTopSmall}
                />
              </>
            )}
          </View>
        </StyledSafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 80,
    marginTop: 40,
  },
  titleText: {
    fontFamily: "Pattaya",
    fontSize: 64,
    lineHeight: 80,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  marginTop: {
    marginTop: 16,
    zIndex: 1,
  },
  marginTopSmall: {
    marginTop: 8,
    zIndex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    height: 450,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleTextContainer: {
    flexDirection: "row",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  appleButton: {
    marginBottom: 6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
  },
  alternativeLoginToggle: {
    marginTop: 2,
    marginBottom: 16,
  },
  alternativeLoginText: {
    color: "#666",
  },
  subtitleContainer: {
    marginTop: 32,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
