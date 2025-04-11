import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText, StyledScrollView } from "../../utils/styled";

export const ManualScreen: React.FC = () => {
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
        User Manual
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
          앱 사용 방법
        </StyledText>
        <StyledText
          className={`${isDark ? "text-gray-300" : "text-mossy-dark"} mb-3`}
        >
          Oh My Sh!t 앱은 당신의 배변 활동을 기록하고 건강 상태를 모니터링하는
          데 도움이 됩니다.
        </StyledText>
        <StyledText
          className={`${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          자세한 사용자 설명서는 현재 준비 중입니다. 조금만 기다려주세요!
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
