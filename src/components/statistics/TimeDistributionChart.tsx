import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";

interface TimeDistribution {
  morning: number; // 오전 (05:00 ~ 11:59)
  afternoon: number; // 오후 (12:00 ~ 16:59)
  evening: number; // 저녁 (17:00 ~ 20:59)
  night: number; // 밤 (21:00 ~ 04:59)
}

interface TimeDistributionChartProps {
  distribution: TimeDistribution;
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({
  distribution,
}) => {
  const { isDark } = useThemeStore();
  const { morning, afternoon, evening, night } = distribution;

  const totalRecords = morning + afternoon + evening + night;

  // 비율 계산 (디스플레이 너비에 맞게 조정)
  const screenWidth = Dimensions.get("window").width - 48; // 패딩 고려

  const calculateWidth = (count: number) => {
    if (totalRecords === 0) return 0;
    return (count / totalRecords) * screenWidth;
  };

  // 시간대별 색상
  const morningColor = isDark ? "#F9A825" : "#FFC107"; // 오전 - 노란색
  const afternoonColor = isDark ? "#FB8C00" : "#FF9800"; // 오후 - 주황색
  const eveningColor = isDark ? "#C62828" : "#E53935"; // 저녁 - 빨간색
  const nightColor = isDark ? "#1A237E" : "#303F9F"; // 밤 - 파란색

  // 비율을 백분율로 변환
  const getPercent = (count: number) => {
    if (totalRecords === 0) return "0%";
    return `${Math.round((count / totalRecords) * 100)}%`;
  };

  // 데이터가 없는 경우
  const isEmpty = totalRecords === 0;

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
        시간대별 분포
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
          {/* 시간대별 분포 바 차트 */}
          <StyledView className="flex-row h-10 mb-3 bg-gray-200 rounded-lg overflow-hidden">
            {/* 오전 */}
            {morning > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(morning),
                  backgroundColor: morningColor,
                }}
              />
            )}
            {/* 오후 */}
            {afternoon > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(afternoon),
                  backgroundColor: afternoonColor,
                }}
              />
            )}
            {/* 저녁 */}
            {evening > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(evening),
                  backgroundColor: eveningColor,
                }}
              />
            )}
            {/* 밤 */}
            {night > 0 && (
              <StyledView
                style={{
                  width: calculateWidth(night),
                  backgroundColor: nightColor,
                }}
              />
            )}
          </StyledView>

          {/* 범례 */}
          <StyledView className="flex-row flex-wrap justify-between mt-2">
            {/* 오전 범례 */}
            <StyledView className="w-1/2 flex-row items-center mb-2">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: morningColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                오전 ({morning}회, {getPercent(morning)})
              </StyledText>
            </StyledView>

            {/* 오후 범례 */}
            <StyledView className="w-1/2 flex-row items-center mb-2">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: afternoonColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                오후 ({afternoon}회, {getPercent(afternoon)})
              </StyledText>
            </StyledView>

            {/* 저녁 범례 */}
            <StyledView className="w-1/2 flex-row items-center">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: eveningColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                저녁 ({evening}회, {getPercent(evening)})
              </StyledText>
            </StyledView>

            {/* 밤 범례 */}
            <StyledView className="w-1/2 flex-row items-center">
              <StyledView
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: nightColor }}
              />
              <StyledText
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                밤 ({night}회, {getPercent(night)})
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledText
            className={`text-xs mt-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            오전: 05:00~11:59 | 오후: 12:00~16:59 | 저녁: 17:00~20:59 | 밤:
            21:00~04:59
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
