import React from "react";
import { StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";

export interface StatsSummary {
  totalCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  averageDuration?: number;
  dailyAverage?: number;
  abnormalCount?: number;
  primaryTimeSlot?: { hour: number; count: number };
}

interface StatsSummaryCardProps {
  summary: StatsSummary;
}

export const StatsSummaryCard: React.FC<StatsSummaryCardProps> = ({
  summary,
}) => {
  const { isDark } = useThemeStore();
  const {
    totalCount,
    successCount,
    averageDuration,
    dailyAverage,
    abnormalCount,
  } = summary;

  // 데이터가 없는 경우
  const hasNoData = totalCount === 0;

  // 초 단위 시간을 "분 초" 형식으로 변환
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${seconds}초`;
  };

  return (
    <StyledView
      className={`rounded-lg p-3 h-full ${
        isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40"
      }`}
      style={styles.container}
    >
      <StyledText
        className={`text-lg font-bold mb-3 ${
          isDark ? "text-white" : "text-mossy-darkest"
        }`}
        style={{ fontFamily: "Pattaya" }}
      >
        Summary
      </StyledText>

      {hasNoData ? (
        <StyledView className="items-center justify-center flex-1">
          <StyledText
            className={`text-center ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            표시할 데이터가 없습니다.
          </StyledText>
        </StyledView>
      ) : (
        <StyledView className="flex-row flex-wrap flex-1 justify-between px-2">
          {/* 성공 횟수 */}
          <StyledView className="w-[48%] mb-3 px-1">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
              numberOfLines={1}
            >
              성공 횟수
            </StyledText>
            <StyledText
              className={`text-base font-bold mt-1 ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
              numberOfLines={1}
            >
              {successCount}회
            </StyledText>
          </StyledView>

          {/* 일 평균 */}
          <StyledView className="w-[48%] mb-3 px-1">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
              numberOfLines={1}
            >
              일 평균
            </StyledText>
            <StyledText
              className={`text-base font-bold mt-1 ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
              numberOfLines={1}
            >
              {dailyAverage}회
            </StyledText>
          </StyledView>

          {/* 평균 소요시간 */}
          <StyledView className="w-[48%] px-1">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
              numberOfLines={1}
            >
              평균
            </StyledText>
            <StyledText
              className={`text-sm font-bold mt-1 ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
              numberOfLines={1}
            >
              {formatDuration(averageDuration || 0)}
            </StyledText>
          </StyledView>

          {/* 이상 횟수 */}
          <StyledView className="w-[48%] px-1">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
              numberOfLines={1}
            >
              이상 횟수
            </StyledText>
            <StyledText
              className={`text-base font-bold mt-1 ${
                isDark ? "text-orange-400" : "text-orange-600"
              }`}
              numberOfLines={1}
            >
              {abnormalCount || 0}회
            </StyledText>
          </StyledView>
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
