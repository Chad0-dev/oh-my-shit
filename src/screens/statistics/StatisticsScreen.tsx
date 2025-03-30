import React from "react";
import { StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView, StyledScrollView } from "../../utils/styled";

export const StatisticsScreen: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <StyledScrollView
      className={`flex-1 ${isDark ? "bg-mossy-darkest" : "bg-white"}`}
    >
      <StyledView className="p-4">
        <StyledText
          className={`text-2xl font-bold mb-4 ${
            isDark ? "text-mossy-light" : "text-mossy-dark"
          }`}
        >
          배변 통계
        </StyledText>

        {/* 기간 선택 */}
        <StyledView className="flex-row mb-6">
          {["이번 주", "이번 달", "3개월", "6개월", "1년"].map(
            (period, index) => (
              <StyledView
                key={index}
                className={`flex-1 py-2 ${
                  index === 0
                    ? isDark
                      ? "bg-mossy-light border-b-2 border-mossy-light"
                      : "bg-white border-b-2 border-mossy-dark"
                    : isDark
                    ? "bg-mossy-darkest border-b border-mossy-dark/30"
                    : "bg-white border-b border-mossy-light/30"
                }`}
              >
                <StyledText
                  className={`text-center ${
                    index === 0
                      ? isDark
                        ? "text-mossy-darkest font-bold"
                        : "text-mossy-dark font-bold"
                      : isDark
                      ? "text-mossy-medium"
                      : "text-mossy-darkest opacity-60"
                  }`}
                >
                  {period}
                </StyledText>
              </StyledView>
            )
          )}
        </StyledView>

        {/* 주요 통계 */}
        <StyledView className={`flex-row flex-wrap justify-between mb-6`}>
          {/* 횟수 */}
          <StyledView
            className={`w-[48%] p-4 rounded-lg mb-4 ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledText
              className={`text-center text-xs mb-2 ${
                isDark ? "text-mossy-medium" : "text-mossy-dark"
              }`}
            >
              총 배변 횟수
            </StyledText>
            <StyledText
              className={`text-center text-3xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              12회
            </StyledText>
            <StyledText
              className={`text-center text-xs mt-1 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              평균: 1.7회/일
            </StyledText>
          </StyledView>

          {/* 시간 */}
          <StyledView
            className={`w-[48%] p-4 rounded-lg mb-4 ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledText
              className={`text-center text-xs mb-2 ${
                isDark ? "text-mossy-medium" : "text-mossy-dark"
              }`}
            >
              평균 소요 시간
            </StyledText>
            <StyledText
              className={`text-center text-3xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              5분
            </StyledText>
            <StyledText
              className={`text-center text-xs mt-1 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              전주 대비 -2분
            </StyledText>
          </StyledView>

          {/* 상태 */}
          <StyledView
            className={`w-[48%] p-4 rounded-lg mb-4 ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledText
              className={`text-center text-xs mb-2 ${
                isDark ? "text-mossy-medium" : "text-mossy-dark"
              }`}
            >
              가장 많은 상태
            </StyledText>
            <StyledText
              className={`text-center text-2xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              정상
            </StyledText>
            <StyledText
              className={`text-center text-xs mt-1 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              8회 (66%)
            </StyledText>
          </StyledView>

          {/* 시간대 */}
          <StyledView
            className={`w-[48%] p-4 rounded-lg mb-4 ${
              isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
            }`}
          >
            <StyledText
              className={`text-center text-xs mb-2 ${
                isDark ? "text-mossy-medium" : "text-mossy-dark"
              }`}
            >
              주요 시간대
            </StyledText>
            <StyledText
              className={`text-center text-2xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              오전
            </StyledText>
            <StyledText
              className={`text-center text-xs mt-1 ${
                isDark ? "text-mossy-light" : "text-mossy-dark"
              }`}
            >
              7-9시 (75%)
            </StyledText>
          </StyledView>
        </StyledView>

        {/* 그래프 영역 */}
        <StyledView
          className={`p-6 rounded-lg mb-4 items-center justify-center ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
          style={{ height: 200 }}
        >
          <StyledText
            className={`${isDark ? "text-mossy-light" : "text-mossy-dark"}`}
          >
            여기에 그래프가 표시됩니다
          </StyledText>
        </StyledView>

        {/* 분석 및 제안 */}
        <StyledView
          className={`p-4 rounded-lg ${
            isDark ? "bg-mossy-dark/50" : "bg-mossy-light/30"
          }`}
        >
          <StyledText
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-mossy-darkest"
            }`}
          >
            분석 결과
          </StyledText>
          <StyledText
            className={`mb-3 ${
              isDark ? "text-mossy-medium" : "text-mossy-darkest"
            }`}
          >
            지난 주에 비해 배변 규칙성이 향상되었습니다. 매일 일정한 시간에
            배변하는 습관이 형성되고 있습니다.
          </StyledText>
          <StyledText
            className={`font-medium ${
              isDark ? "text-mossy-light" : "text-mossy-dark"
            }`}
          >
            제안: 충분한 수분 섭취를 유지하세요.
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};
