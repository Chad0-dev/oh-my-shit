import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import {
  StyledSafeAreaView,
  StyledText,
  StyledView,
  StyledKeyboardAvoidingView,
  StyledScrollView,
} from "../../utils/styled";
import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/InputField";

// 나이대 옵션
const AGE_GROUPS = [
  { label: "10대", value: 10 },
  { label: "20대", value: 20 },
  { label: "30대", value: 30 },
  { label: "40대", value: 40 },
  { label: "50대 이상", value: 50 },
];

interface SignUpScreenProps {
  onLoginPress: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onLoginPress }) => {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { isDark } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<number | undefined>(
    undefined
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email) {
      setValidationError("이메일을 입력해주세요.");
      return false;
    }
    if (!password) {
      setValidationError("비밀번호를 입력해주세요.");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (selectedAgeGroup === undefined) {
      setValidationError("나이대를 선택해주세요.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    clearError();
    setValidationError(null);

    if (!validateForm()) return;

    try {
      await signUp(email, password, selectedAgeGroup);
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <StyledSafeAreaView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <StyledScrollView className="flex-1 px-6">
          <StyledView className="pt-10 pb-5">
            <StyledText
              className={`text-3xl font-bold text-center mb-10 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              회원가입
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
            />

            <InputField
              label="비밀번호 확인"
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <StyledView className="mb-4">
              <StyledText
                className={`mb-1 font-medium ${
                  isDark ? "text-white" : "text-mossy-darkest"
                }`}
              >
                나이대
              </StyledText>
              <StyledView className="flex-row flex-wrap">
                {AGE_GROUPS.map((ageGroup) => (
                  <TouchableOpacity
                    key={ageGroup.value}
                    onPress={() => setSelectedAgeGroup(ageGroup.value)}
                    style={[
                      styles.ageGroupButton,
                      selectedAgeGroup === ageGroup.value &&
                        styles.selectedAgeGroup,
                      isDark && styles.ageGroupButtonDark,
                      selectedAgeGroup === ageGroup.value &&
                        isDark &&
                        styles.selectedAgeGroupDark,
                    ]}
                  >
                    <StyledText
                      className={`text-center ${
                        selectedAgeGroup === ageGroup.value
                          ? isDark
                            ? "text-mossy-darkest"
                            : "text-white"
                          : isDark
                          ? "text-white"
                          : "text-mossy-darkest"
                      }`}
                    >
                      {ageGroup.label}
                    </StyledText>
                  </TouchableOpacity>
                ))}
              </StyledView>
            </StyledView>

            {(validationError || error) && (
              <StyledText className="text-red-500 mb-4">
                {validationError || error}
              </StyledText>
            )}

            <Button
              title="가입하기"
              variant="primary"
              onPress={handleSignUp}
              isLoading={isLoading}
              fullWidth
              style={styles.marginTop}
            />

            <Button
              title="이미 계정이 있으신가요?"
              variant="outline"
              onPress={onLoginPress}
              fullWidth
              style={styles.marginTopSmall}
            />
          </StyledView>
        </StyledScrollView>
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
  ageGroupButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedAgeGroup: {
    backgroundColor: "#636B2F", // mossy-dark
    borderColor: "#636B2F",
  },
  ageGroupButtonDark: {
    backgroundColor: "#3D4127", // mossy-darkest
    borderColor: "#BAC095", // mossy-medium
  },
  selectedAgeGroupDark: {
    backgroundColor: "#D4DE95", // mossy-light
    borderColor: "#D4DE95",
  },
});
