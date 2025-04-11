import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText, StyledScrollView } from "../../utils/styled";

export const StoreScreen: React.FC = () => {
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
        Store
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
          준비 중인 기능입니다
        </StyledText>
        <StyledText
          className={`${isDark ? "text-gray-300" : "text-mossy-dark"}`}
        >
          곧 다양한 아이템과 테마가 제공될 예정입니다. 조금만 기다려주세요!
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
