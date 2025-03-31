import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import {
  StyledSafeAreaView,
  StyledText,
  StyledView,
  StyledImage,
  StyledKeyboardAvoidingView,
} from "../../utils/styled";
import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/InputField";

interface LoginScreenProps {
  onSignUpPress: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignUpPress }) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const { isDark } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <StyledSafeAreaView className={`flex-1`}>
      {/* 배경 이미지 */}
      <StyledImage
        source={require("../../../assets/images/login_bg.jpg")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      {/* 반투명 오버레이 */}
      <StyledView
        className={`absolute w-full h-full ${
          isDark ? "bg-mossy-darkest/70" : "bg-white/50"
        }`}
      />

      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 z-10"
      >
        {/* 로그인 폼 */}
        <StyledView className="flex-1 justify-center px-6 pt-12">
          <StyledView
            className={`p-6 rounded-lg ${
              isDark ? "bg-mossy-darkest/80" : "bg-white/80"
            }`}
          >
            <StyledText
              className={`text-3xl font-bold text-center mb-10 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              Oh My Sh!t
            </StyledText>

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
          </StyledView>
        </StyledView>
      </StyledKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 16,
  },
  marginTopSmall: {
    marginTop: 8,
  },
});
