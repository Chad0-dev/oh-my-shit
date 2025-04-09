import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../stores/authStore";
import {
  PeriodType,
  StatisticsData,
  calculateNextPeriod,
  calculatePrevPeriod,
  formatPeriodText,
  getStatistics,
} from "../services/statisticsService";

export const useStatistics = () => {
  const { user } = useAuthStore();

  // 기간 관련 상태
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [periodText, setPeriodText] = useState<string>("");

  // 통계 데이터 및 로딩 상태
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 기간 타입 변경 핸들러
  const handleChangePeriodType = useCallback((newPeriodType: PeriodType) => {
    setPeriodType(newPeriodType);
    // 기간 타입이 변경되면 현재 날짜로 리셋
    setTargetDate(new Date());
  }, []);

  // 이전 기간으로 이동
  const goToPrevPeriod = useCallback(() => {
    setTargetDate((prevDate) => calculatePrevPeriod(periodType, prevDate));
  }, [periodType]);

  // 다음 기간으로 이동
  const goToNextPeriod = useCallback(() => {
    setTargetDate((prevDate) => calculateNextPeriod(periodType, prevDate));
  }, [periodType]);

  // 통계 데이터 로드
  const loadStatistics = useCallback(async () => {
    if (!user) {
      Alert.alert("로그인 필요", "통계를 확인하려면 로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await getStatistics(
        user.id,
        periodType,
        targetDate
      );

      if (error) throw error;

      setStatisticsData(data);
    } catch (error: any) {
      console.error("통계 로드 실패:", error.message);
      Alert.alert("오류", "통계 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user, periodType, targetDate]);

  // 기간 텍스트 업데이트
  useEffect(() => {
    setPeriodText(formatPeriodText(periodType, targetDate));
  }, [periodType, targetDate]);

  // 기간이나 사용자가 변경되면 통계 다시 로드
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // 외부에서 수동으로 새로고침할 수 있는 함수 제공
  const refreshStatistics = useCallback(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    periodType,
    targetDate,
    periodText,
    statisticsData,
    isLoading,
    handleChangePeriodType,
    goToPrevPeriod,
    goToNextPeriod,
    refreshStatistics,
  };
};
