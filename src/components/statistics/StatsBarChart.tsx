import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";

interface Summary {
  totalCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
}

interface StatsBarChartProps {
  summary: Summary;
  chartTitle?: string;
}

export const StatsBarChart: React.FC<StatsBarChartProps> = ({
  summary,
  chartTitle = "성공/실패 기록",
}) => {
  const { isDark } = useThemeStore();
  const { totalCount, successCount, failureCount, successRate } = summary;

  // 화면 너비 계산 (패딩 고려)
  const screenWidth = Dimensions.get("window").width - 48;

  // 성공/실패 바 너비 계산
  const calculateWidth = (count: number) => {
    if (totalCount === 0) return 0;
    return (count / totalCount) * screenWidth;
  };

  // 성공/실패 색상
  const successColor = isDark ? "#4CAF50" : "#81C784";
  const failureColor = isDark ? "#F44336" : "#E57373";

  // 퍼센트 계산
  const getPercent = (count: number) => {
    if (totalCount === 0) return "0%";
    return `${Math.round((count / totalCount) * 100)}%`;
  };

  // 데이터가 없는 경우
  const isEmpty = totalCount === 0;

  return (
    <StyledView
      className={`rounded-lg p-4 mb-4 ${
        isDark ? "bg-mossy-dark/60" : "bg-mossy-light/60"
      }`}
      style={styles.container}
    >
      <StyledText
        className={`text-lg font-bold mb-3 ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
      >
        {chartTitle}
      </StyledText>

      {isEmpty ? (
        <StyledView className="items-center justify-center py-6">
          <StyledText
            className={`text-center ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            표시할 데이터가 없습니다.
          </StyledText>
        </StyledView>
      ) : (
        <StyledView>
          {/* 바 차트 */}
          <StyledView className="flex-row h-16 mb-3 bg-gray-200 rounded-lg overflow-hidden">
            {/* 성공 바 */}
            {successCount > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(successCount),
                  backgroundColor: successColor,
                }}
                className="justify-center px-2"
              >
                {successCount > totalCount * 0.15 && (
                  <StyledText
                    className="text-white font-bold"
                    numberOfLines={1}
                  >
                    {getPercent(successCount)}
                  </StyledText>
                )}
              </StyledView>
            )}

            {/* 실패 바 */}
            {failureCount > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(failureCount),
                  backgroundColor: failureColor,
                }}
                className="justify-center px-2"
              >
                {failureCount > totalCount * 0.15 && (
                  <StyledText
                    className="text-white font-bold"
                    numberOfLines={1}
                  >
                    {getPercent(failureCount)}
                  </StyledText>
                )}
              </StyledView>
            )}
          </StyledView>

          {/* 범례 */}
          <StyledView className="flex-row justify-around mt-2">
            {/* 성공 범례 */}
            <StyledView className="flex-row items-center">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: successColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                성공: {successCount}회 ({getPercent(successCount)})
              </StyledText>
            </StyledView>

            {/* 실패 범례 */}
            <StyledView className="flex-row items-center">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: failureColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                실패: {failureCount}회 ({getPercent(failureCount)})
              </StyledText>
            </StyledView>
          </StyledView>

          {/* 총 기록 */}
          <StyledText
            className={`text-center mt-4 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            총 {totalCount}회 기록
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
