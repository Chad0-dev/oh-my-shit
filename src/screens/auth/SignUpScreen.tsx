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

interface SignUpScreenProps {
  onLoginPress: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onLoginPress }) => {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { isDark } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // 생년월일 형식 검증 (YYYY-MM-DD 또는 YYYYMMDD)
  const isValidBirthDate = (date: string) => {
    // YYYYMMDD 형식인 경우 YYYY-MM-DD로 변환
    let formattedDate = date;
    if (/^\d{8}$/.test(date)) {
      formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(
        6,
        8
      )}`;
    }

    // YYYY-MM-DD 형식 검증
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(formattedDate)) return false;

    // 유효한 날짜인지 확인
    const parts = formattedDate.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 월은 0부터 시작
    const day = parseInt(parts[2], 10);

    const dateObj = new Date(year, month, day);

    // 현재보다 미래 날짜는 허용하지 않음
    const now = new Date();
    if (dateObj > now) return false;

    // 합리적인 과거 날짜인지 확인 (예: 120년 이상 전 날짜는 허용하지 않음)
    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 120);
    if (dateObj < minDate) return false;

    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month &&
      dateObj.getDate() === day
    );
  };

  // 생년월일을 나이대로 변환
  const getBirthYearGroup = (birthDate: string) => {
    let year: number;

    // YYYYMMDD 형식
    if (/^\d{8}$/.test(birthDate)) {
      year = parseInt(birthDate.slice(0, 4), 10);
    }
    // YYYY-MM-DD 형식
    else if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      year = parseInt(birthDate.split("-")[0], 10);
    } else {
      return undefined;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // 나이를 10대, 20대 등으로 그룹화
    if (age < 20) return 10;
    if (age < 30) return 20;
    if (age < 40) return 30;
    if (age < 50) return 40;
    return 50; // 50대 이상
  };

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
    if (!birthDate) {
      setValidationError("생년월일을 입력해주세요.");
      return false;
    }
    if (!isValidBirthDate(birthDate)) {
      setValidationError("유효한 생년월일 형식이 아닙니다. (YYYY-MM-DD)");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    clearError();
    setValidationError(null);

    if (!validateForm()) return;

    try {
      const ageGroup = getBirthYearGroup(birthDate);
      await signUp(email, password, ageGroup);
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  // 생년월일 입력 포맷팅 (자동으로 하이픈 추가)
  const handleBirthDateChange = (text: string) => {
    // 숫자와 하이픈만 허용
    let formatted = text.replace(/[^\d-]/g, "");

    // 하이픈 자동 추가 로직
    if (formatted.length === 4 && !formatted.includes("-")) {
      formatted += "-";
    } else if (formatted.length === 7 && formatted[6] !== "-") {
      formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
    }

    // 최대 10자리 (YYYY-MM-DD)로 제한
    if (formatted.length <= 10) {
      setBirthDate(formatted);
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

            <InputField
              label="생년월일"
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              value={birthDate}
              onChangeText={handleBirthDateChange}
            />
            <StyledText
              className={`text-sm mb-4 ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              연령대별 정보 제공을 위함
            </StyledText>

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
});
