import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  StatusBar,
  ScrollView,
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
          </View>

          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
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
    marginBottom: 10,
    marginTop: 20,
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
});
