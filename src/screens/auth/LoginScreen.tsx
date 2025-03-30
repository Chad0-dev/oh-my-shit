import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
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
import { Loading } from "../../components/feedback/Loading";

interface LoginScreenProps {
  onSignUpPress: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignUpPress }) => {
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore();
  const { isDark } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (isRegister) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    clearError();
  };

  // 개발용 테스트 계정 자동 입력 (나중에 제거 예정)
  const fillTestAccount = () => {
    setEmail("test@test.com");
    setPassword("1234");
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

            {/* 개발 모드 테스트 계정 버튼 - 배포 전 제거 필요 */}
            <TouchableOpacity
              onPress={fillTestAccount}
              style={styles.testAccountButton}
            >
              <StyledText
                className={`text-xs italic text-center ${
                  isDark ? "text-mossy-medium" : "text-mossy-dark"
                }`}
              >
                {/* TODO: 배포 전 제거 - 개발용 테스트 계정 */}
                테스트 계정 자동 입력 (test@test.com/1234)
              </StyledText>
            </TouchableOpacity>
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
  testAccountButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
