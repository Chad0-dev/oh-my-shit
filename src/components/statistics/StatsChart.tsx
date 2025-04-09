import React, { useMemo } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledView, StyledText } from "../../utils/styled";
import { PieChart } from "react-native-chart-kit";
import { StatsSummary } from "./StatsSummaryCard";

interface StatsChartProps {
  summary: StatsSummary;
  chartTitle: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({
  summary,
  chartTitle,
}) => {
  const { isDark } = useThemeStore();
  const { successCount, failureCount } = summary;

  // 차트 데이터 생성
  const chartData = useMemo(
    () => [
      {
        name: "성공",
        count: successCount,
        color: "#4CAF50",
        legendFontColor: isDark ? "#FFFFFF" : "#333333",
        legendFontSize: 12,
      },
      {
        name: "실패",
        count: failureCount,
        color: "#F44336",
        legendFontColor: isDark ? "#FFFFFF" : "#333333",
        legendFontSize: 12,
      },
    ],
    [successCount, failureCount, isDark]
  );

  // 전체 0인 경우 처리
  const isEmpty = successCount === 0 && failureCount === 0;

  const chartConfig = {
    backgroundGradientFrom: isDark ? "#1E1E1E" : "#FFFFFF",
    backgroundGradientTo: isDark ? "#1E1E1E" : "#FFFFFF",
    color: (opacity = 1) =>
      isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const screenWidth = Dimensions.get("window").width - 32; // 패딩 고려

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
        <StyledView className="items-center justify-center py-10">
          <StyledText
            className={`text-center ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            표시할 데이터가 없습니다.
          </StyledText>
        </StyledView>
      ) : (
        <StyledView className="items-center">
          <PieChart
            data={chartData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
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
