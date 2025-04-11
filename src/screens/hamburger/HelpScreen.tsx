import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText, StyledScrollView } from "../../utils/styled";

export const HelpScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <StyledScrollView
      className={`flex-1 p-4 ${
        isDark ? "bg-mossy-darkest" : "bg-mossy-lightest"
      }`}
    >
      <StyledText
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
        style={{ fontFamily: "Pattaya" }}
      >
        Help & FAQ
      </StyledText>

      <StyledView
        className={`rounded-lg p-4 mb-4 ${
          isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40"
        }`}
      >
        <StyledText
          className={`text-lg font-bold mb-3 ${
            isDark ? "text-white" : "text-mossy-darkest"
          }`}
        >
          자주 묻는 질문
        </StyledText>
        <StyledText
          className={`font-bold mb-2 ${
            isDark ? "text-gray-200" : "text-mossy-dark"
          }`}
        >
          Q: 앱을 어떻게 사용하나요?
        </StyledText>
        <StyledText
          className={`${isDark ? "text-gray-300" : "text-mossy-dark"} mb-3`}
        >
          A: 캘린더 화면에서 해당 날짜를 선택하고 + 버튼을 눌러 배변 기록을
          추가할 수 있습니다.
        </StyledText>

        <StyledText
          className={`font-bold mb-2 ${
            isDark ? "text-gray-200" : "text-mossy-dark"
          }`}
        >
          Q: 통계 화면은 어떻게 사용하나요?
        </StyledText>
        <StyledText
          className={`${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          A: 통계 화면에서는 설정한 기간 동안의 배변 활동 통계를 확인할 수
          있습니다. 더 자세한 도움말은 준비 중입니다.
        </StyledText>
      </StyledView>
    </StyledScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
