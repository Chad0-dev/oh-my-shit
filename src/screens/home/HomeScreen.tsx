import React from "react";
import { StyleSheet, Text } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";

export const HomeScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <StyledScrollView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      <StyledView className="p-4">
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Pattaya",
            color: isDark ? "#D4DE95" : "#636B2F",
            marginBottom: 16,
          }}
        >
          홈 페이지
        </Text>

        <StyledView
          className={`p-4 rounded-lg mb-4 ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Pattaya",
              color: isDark ? "#FFFFFF" : "#3D4127",
              marginBottom: 8,
            }}
          >
            오늘의 배변 현황
          </Text>
          <StyledText
            className={isDark ? "text-mossy-medium" : "text-mossy-darkest"}
          >
            아직 기록이 없습니다.
          </StyledText>
        </StyledView>

        <StyledView
          className={`p-4 rounded-lg mb-4 ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Pattaya",
              color: isDark ? "#FFFFFF" : "#3D4127",
              marginBottom: 8,
            }}
          >
            건강 팁
          </Text>
          <StyledText
            className={isDark ? "text-mossy-medium" : "text-mossy-darkest"}
          >
            매일 충분한 물을 마시는 것은 건강한 배변 활동에 도움이 됩니다.
          </StyledText>
        </StyledView>

        <StyledView
          className={`p-4 rounded-lg ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Pattaya",
              color: isDark ? "#FFFFFF" : "#3D4127",
              marginBottom: 8,
            }}
          >
            최근 기록
          </Text>
          <StyledView
            className={`p-3 mb-2 rounded ${
              isDark ? "bg-mossy-darkest" : "bg-white"
            }`}
          >
            <StyledText
              className={`font-medium ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              2024년 3월 30일 09:15
            </StyledText>
            <StyledText
              className={isDark ? "text-mossy-medium" : "text-mossy-dark"}
            >
              상태: 정상
            </StyledText>
          </StyledView>
          <StyledView
            className={`p-3 rounded ${
              isDark ? "bg-mossy-darkest" : "bg-white"
            }`}
          >
            <StyledText
              className={`font-medium ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              2024년 3월 29일 08:30
            </StyledText>
            <StyledText
              className={isDark ? "text-mossy-medium" : "text-mossy-dark"}
            >
              상태: 변비
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};
