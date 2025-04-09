import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { format, subDays } from "date-fns";
import { StyledView, StyledText, StyledScrollView } from "../../utils/styled";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import {
  getShitStatistics,
  getHourlySuccessfulRecords,
} from "../../services/recordService";
import {
  StatsSummaryCard,
  StatsSummary,
} from "../../components/statistics/StatsSummaryCard";
import { StatsBarChart } from "../../components/statistics/StatsBarChart";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Polyline, Path } from "react-native-svg";

interface PeriodOption {
  label: string;
  days: number;
}

const periodOptions: PeriodOption[] = [
  { label: "Week", days: 7 },
  { label: "Month", days: 30 },
  { label: "Year", days: 365 },
];

// 타임데이터 인터페이스 정의
interface TimeDataPoint {
  hour: number;
  count: number;
}

export const StatisticsScreen = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(
    periodOptions[0]
  );
  const [summary, setSummary] = useState<StatsSummary>({
    totalCount: 0,
    successCount: 0,
    failureCount: 0,
    successRate: 0,
    averageDuration: 0,
    dailyAverage: 0,
    abnormalCount: 0,
  });
  const [timeData, setTimeData] = useState<TimeDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHourlyDataLoading, setIsHourlyDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hourlyError, setHourlyError] = useState<string | null>(null);

  // 시간대별 최적 시간 계산
  const bestTimeData = React.useMemo(() => {
    if (timeData.length === 0) return { hour: 0, count: 0 };

    const maxItem = timeData.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );

    return maxItem;
  }, [timeData]);

  const fetchStatistics = useCallback(async () => {
    // 사용자 정보가 없으면 에러 표시
    if (!user) {
      setError("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    // 사용자 ID 확인
    if (!user.id) {
      setError("사용자 ID를 불러올 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = subDays(endDate, selectedPeriod.days);

      // 날짜 형식
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const result = await getShitStatistics(user.id, startDateStr, endDateStr);

      if (!result.error) {
        setSummary({
          totalCount: result.totalCount || 0,
          successCount: result.successCount || 0,
          failureCount: result.failureCount || 0,
          successRate: result.successRate || 0,
          averageDuration: result.averageDuration || 0,
          dailyAverage: result.dailyAverage || 0,
          abnormalCount: result.abnormalCount || 0,
        });
      } else {
        setError("통계를 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("통계를 가져오는데 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedPeriod]);

  // 시간대별 성공 기록 데이터 가져오기
  const fetchHourlyData = useCallback(async () => {
    if (!user || !user.id) return;

    setIsHourlyDataLoading(true);
    setHourlyError(null);

    try {
      const endDate = new Date();
      const startDate = subDays(endDate, selectedPeriod.days);

      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const result = await getHourlySuccessfulRecords(
        user.id,
        startDateStr,
        endDateStr
      );

      if (!result.error && result.data) {
        setTimeData(result.data);
      } else {
        setHourlyError("시간대별 통계를 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setHourlyError("시간대별 통계를 가져오는데 오류가 발생했습니다.");
    } finally {
      setIsHourlyDataLoading(false);
    }
  }, [user, selectedPeriod]);

  useEffect(() => {
    fetchStatistics();
    fetchHourlyData();
  }, [fetchStatistics, fetchHourlyData]);

  const refreshStatistics = () => {
    fetchStatistics();
    fetchHourlyData();
  };

  // 그래프 넓이 계산
  const graphWidth = Dimensions.get("window").width - 80; // 양쪽 패딩 감안
  const graphHeight = 120; // 높이 줄임
  const maxCount = Math.max(...timeData.map((item) => item.count), 1); // 최소 1로 설정하여 0 나누기 방지

  // Y축 레이블 생성 및 배치 함수 - 숫자 없이 축만 표시
  const renderYAxisLabels = () => {
    return (
      <StyledView
        className="h-full w-px"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }}
      />
    );
  };

  // 곡선 그래프 경로 생성 함수
  const createSmoothPath = () => {
    if (timeData.length === 0) return "";

    // 데이터 포인트 준비
    const points = timeData.map((point, index) => {
      const x = (index / 23) * graphWidth;
      const y = graphHeight - (point.count / maxCount) * graphHeight;
      return { x, y };
    });

    // SVG 경로 시작
    let path = `M ${points[0].x},${points[0].y}`;

    // 베지어 곡선으로 각 포인트를 연결
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // 제어점 계산 (현재점과 다음점 사이의 부드러운 곡선을 위한 값)
      const controlX1 = current.x + (next.x - current.x) / 3;
      const controlY1 = current.y;
      const controlX2 = current.x + (2 * (next.x - current.x)) / 3;
      const controlY2 = next.y;

      // 베지어 곡선 추가
      path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
    }

    return path;
  };

  // 채워진 영역 경로 생성 함수
  const createFilledPath = () => {
    if (timeData.length === 0) return "";

    // 데이터 포인트 준비
    const points = timeData.map((point, index) => {
      const x = (index / 23) * graphWidth;
      const y = graphHeight - (point.count / maxCount) * graphHeight;
      return { x, y };
    });

    // SVG 경로 시작
    let path = `M ${points[0].x},${points[0].y}`;

    // 베지어 곡선으로 각 포인트를 연결
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // 제어점 계산 (현재점과 다음점 사이의 부드러운 곡선을 위한 값)
      const controlX1 = current.x + (next.x - current.x) / 3;
      const controlY1 = current.y;
      const controlX2 = current.x + (2 * (next.x - current.x)) / 3;
      const controlY2 = next.y;

      // 베지어 곡선 추가
      path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
    }

    // 영역을 닫기 위한 점 추가 (오른쪽 아래 → 왼쪽 아래)
    path += ` L ${points[points.length - 1].x},${graphHeight} L ${
      points[0].x
    },${graphHeight} Z`;

    return path;
  };

  // X축 레이블 생성
  const generateXAxisLabels = () => {
    const labels = [];
    for (let i = 0; i <= 24; i += 6) {
      labels.push(`${i}시`);
    }
    return labels;
  };

  return (
    <StyledScrollView
      className={`flex-1 p-4 ${
        isDark ? "bg-mossy-darkest" : "bg-mossy-lightest"
      }`}
    >
      {/* 기간 선택 옵션 */}
      <StyledView className="flex-row mb-4 items-center">
        <StyledView className="flex-row flex-1">
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.days}
              onPress={() => setSelectedPeriod(option)}
              style={[
                styles.periodButton,
                selectedPeriod.days === option.days &&
                  (isDark ? styles.selectedDark : styles.selectedLight),
              ]}
            >
              <StyledText
                className={`text-center ${
                  selectedPeriod.days === option.days
                    ? isDark
                      ? "text-mossy-darkest font-bold"
                      : "text-white font-bold"
                    : isDark
                    ? "text-gray-300"
                    : "text-mossy-dark"
                }`}
              >
                {option.label}
              </StyledText>
            </TouchableOpacity>
          ))}
        </StyledView>

        <TouchableOpacity
          onPress={refreshStatistics}
          className="ml-2 p-2 rounded-full"
          style={{
            backgroundColor: isDark
              ? "rgba(166, 191, 79, 0.2)"
              : "rgba(166, 191, 79, 0.1)",
          }}
        >
          <Ionicons
            name="refresh"
            size={22}
            color={isDark ? "#A6BF4F" : "#738C22"}
          />
        </TouchableOpacity>
      </StyledView>

      {/* 데이터 로딩 상태 처리 */}
      {isLoading ? (
        <StyledView className="items-center justify-center py-4">
          <ActivityIndicator
            size="large"
            color={isDark ? "#A6BF4F" : "#738C22"}
          />
        </StyledView>
      ) : error ? (
        <StyledView
          className={`p-4 rounded-lg mb-4 ${
            isDark ? "bg-red-900/30" : "bg-red-100"
          }`}
        >
          <StyledText
            className={`text-center ${
              isDark ? "text-red-300" : "text-red-600"
            }`}
          >
            {error}
          </StyledText>
          <TouchableOpacity className="mt-2" onPress={refreshStatistics}>
            <StyledText
              className={`text-center underline ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}
            >
              다시 시도
            </StyledText>
          </TouchableOpacity>
        </StyledView>
      ) : (
        <>
          {/* 요약 통계와 차트를 가로로 배치 */}
          <StyledView className="flex-row mb-4">
            {/* 요약 통계 */}
            <StyledView style={styles.cardContainer} className="flex-1 mr-2">
              <StatsSummaryCard summary={summary} />
            </StyledView>

            {/* 차트 */}
            <StyledView
              style={styles.cardContainer}
              className={`flex-1 ml-2 rounded-lg p-3 ${
                isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40"
              }`}
            >
              <StyledText
                className={`text-lg font-bold mb-3 ${
                  isDark ? "text-white" : "text-mossy-darkest"
                }`}
                style={{ fontFamily: "Pattaya" }}
              >
                {selectedPeriod.label} Records
              </StyledText>

              {summary.totalCount === 0 ? (
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
                <StyledView className="flex-1 justify-center">
                  {/* 바 차트 */}
                  <StyledView className="h-12 mb-3 bg-gray-200 rounded-lg overflow-hidden flex-row">
                    {/* 성공 바 */}
                    {summary.successCount > 0 && (
                      <StyledView
                        style={{
                          width: `${
                            (summary.successCount / summary.totalCount) * 100
                          }%`,
                          backgroundColor: isDark ? "#4CAF50" : "#81C784",
                        }}
                        className="justify-center px-2"
                      >
                        {summary.successCount >= summary.totalCount * 0.2 && (
                          <StyledText
                            className="text-white font-bold text-center"
                            numberOfLines={1}
                          >
                            {Math.round(
                              (summary.successCount / summary.totalCount) * 100
                            )}
                            %
                          </StyledText>
                        )}
                      </StyledView>
                    )}

                    {/* 실패 바 */}
                    {summary.failureCount > 0 && (
                      <StyledView
                        style={{
                          width: `${
                            (summary.failureCount / summary.totalCount) * 100
                          }%`,
                          backgroundColor: isDark ? "#F44336" : "#E57373",
                        }}
                        className="justify-center px-2"
                      >
                        {/* 실패 그래프 텍스트 삭제 */}
                      </StyledView>
                    )}
                  </StyledView>

                  {/* 범례 */}
                  <StyledView className="flex-row justify-around my-2">
                    {/* 성공 범례 */}
                    <StyledView className="flex-row items-center">
                      <StyledView
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: isDark ? "#4CAF50" : "#81C784",
                        }}
                      />
                      <StyledText
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-mossy-dark"
                        }`}
                      >
                        성공: {summary.successCount}회
                      </StyledText>
                    </StyledView>

                    {/* 실패 범례 */}
                    <StyledView className="flex-row items-center">
                      <StyledView
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: isDark ? "#F44336" : "#E57373",
                        }}
                      />
                      <StyledText
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-mossy-dark"
                        }`}
                      >
                        실패: {summary.failureCount}회
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
              )}
            </StyledView>
          </StyledView>

          {/* 시간대별 배변 패턴 차트 */}
          <StyledView
            className={`rounded-lg p-3 mb-4 ${
              isDark ? "bg-black/10" : "bg-white"
            } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
            style={styles.simplifiedChartContainer}
          >
            <StyledText
              className={`text-lg font-bold mb-3 ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
              style={{ fontFamily: "Pattaya" }}
            >
              My Best Sh!t Time
            </StyledText>

            <StyledView className="items-center mb-2">
              <StyledText
                className={`text-lg font-bold ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                {bestTimeData.hour < 12
                  ? `오전 ${bestTimeData.hour || 12}시`
                  : `오후 ${
                      bestTimeData.hour === 12 ? 12 : bestTimeData.hour - 12
                    }시`}
              </StyledText>
            </StyledView>

            {/* 선형 그래프 */}
            <StyledView
              style={{ height: graphHeight }}
              className="relative mb-2"
            >
              {/* Y축 - 단순히 선만 표시 */}
              <StyledView
                className="absolute left-0 h-full"
                style={{ width: 1 }}
              >
                {renderYAxisLabels()}
              </StyledView>

              {/* 그래프 영역 */}
              <StyledView className="ml-1 flex-1 h-full">
                <Svg width="100%" height="100%">
                  {/* 채워진 영역 그래프 */}
                  <Path
                    d={createFilledPath()}
                    fill={
                      isDark
                        ? "rgba(166, 191, 79, 0.15)"
                        : "rgba(115, 140, 34, 0.1)"
                    }
                    stroke="none"
                  />
                  {/* 부드러운 곡선 그래프 */}
                  <Path
                    d={createSmoothPath()}
                    fill="none"
                    stroke={isDark ? "#A6BF4F" : "#738C22"}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </Svg>
              </StyledView>
            </StyledView>

            {/* X축 (시간) */}
            <StyledView className="flex-row justify-between">
              {generateXAxisLabels().map((label, index) => (
                <StyledText
                  key={`x-label-${index}`}
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {label}
                </StyledText>
              ))}
            </StyledView>
          </StyledView>

          {/* AI 진단 섹션 */}
          <StyledView
            className={`rounded-lg p-4 mb-4 ${
              isDark ? "bg-mossy-dark/40" : "bg-mossy-light/40"
            }`}
          >
            <StyledText
              className={`text-lg font-bold mb-3 ${
                isDark ? "text-white" : "text-mossy-darkest"
              }`}
              style={{ fontFamily: "Pattaya" }}
            >
              AI Diagnosis
            </StyledText>
            <StyledView className="items-center justify-center py-6">
              <StyledText
                className={`text-base ${
                  isDark ? "text-gray-300" : "text-mossy-dark"
                }`}
              >
                준비중입니다.
              </StyledText>
            </StyledView>
          </StyledView>
        </>
      )}
    </StyledScrollView>
  );
};

const styles = StyleSheet.create({
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A6BF4F",
  },
  selectedLight: {
    backgroundColor: "#738C22",
    borderColor: "#738C22",
  },
  selectedDark: {
    backgroundColor: "#A6BF4F",
    borderColor: "#A6BF4F",
  },
  cardContainer: {
    height: 170,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  simplifiedChartContainer: {
    height: 220, // 전체 컨테이너 높이 감소
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
