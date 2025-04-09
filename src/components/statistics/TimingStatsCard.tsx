import React from "react";
import { StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";

interface TimingStats {
  avgDuration: number; // 평균 소요 시간 (초)
  minDuration: number; // 최소 소요 시간 (초)
  maxDuration: number; // 최대 소요 시간 (초)
  totalRecords: number; // 통계 계산에 사용된 기록 수
}

interface TimingStatsCardProps {
  timingStats: TimingStats;
}

export const TimingStatsCard: React.FC<TimingStatsCardProps> = ({
  timingStats,
}) => {
  const { isDark } = useThemeStore();
  const { avgDuration, minDuration, maxDuration, totalRecords } = timingStats;

  // 초를 분:초 형식으로 변환하는 함수
  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0초";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) return `${remainingSeconds}초`;
    if (remainingSeconds === 0) return `${minutes}분`;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  // 데이터가 없는 경우
  const hasNoData = totalRecords === 0;

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
        소요 시간 통계
      </StyledText>

      {hasNoData ? (
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
        <StyledView className="flex-row flex-wrap">
          {/* 평균 시간 */}
          <StyledView className="w-1/2 mb-3">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
            >
              평균 소요 시간
            </StyledText>
            <StyledText
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              {formatTime(avgDuration)}
            </StyledText>
          </StyledView>

          {/* 총 기록 수 */}
          <StyledView className="w-1/2 mb-3">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
            >
              분석된 기록
            </StyledText>
            <StyledText
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
            >
              {totalRecords}회
            </StyledText>
          </StyledView>

          {/* 최소 시간 */}
          <StyledView className="w-1/2">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
            >
              최소 소요 시간
            </StyledText>
            <StyledText
              className={`text-xl font-bold ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {formatTime(minDuration)}
            </StyledText>
          </StyledView>

          {/* 최대 시간 */}
          <StyledView className="w-1/2">
            <StyledText
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-mossy-dark"
              }`}
            >
              최대 소요 시간
            </StyledText>
            <StyledText
              className={`text-xl font-bold ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {formatTime(maxDuration)}
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
