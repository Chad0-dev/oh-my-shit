import { ShitRecord } from "./recordService";
import { supabase } from "../supabase/client";

// 기간 유형 정의
export type PeriodType = "day" | "week" | "month" | "year";

// 통계 데이터 인터페이스
export interface StatisticsData {
  summary: {
    totalCount: number;
    successCount: number;
    failureCount: number;
    successRate: number;
  };
  timing: {
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    totalRecords: number;
  };
  timeDistribution: {
    morning: number; // 오전 (05:00 ~ 11:59)
    afternoon: number; // 오후 (12:00 ~ 16:59)
    evening: number; // 저녁 (17:00 ~ 20:59)
    night: number; // 밤 (21:00 ~ 04:59)
  };
}

// 날짜 범위 계산 (start, end 포함)
export const calculateDateRange = (
  periodType: PeriodType,
  targetDate: Date
): { startDate: Date; endDate: Date } => {
  const now = new Date(targetDate);
  let startDate = new Date(now);
  let endDate = new Date(now);

  switch (periodType) {
    case "day":
      // 하루 범위 (오늘)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "week":
      // 주간 범위 (일요일부터 토요일까지)
      const day = now.getDay(); // 0: 일요일, 6: 토요일
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "month":
      // 월간 범위 (이번달 1일부터 말일까지)
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(now.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "year":
      // 연간 범위 (1월 1일부터 12월 31일까지)
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  return { startDate, endDate };
};

// 이전/다음 기간 계산
export const calculateNextPeriod = (
  periodType: PeriodType,
  targetDate: Date
): Date => {
  const newDate = new Date(targetDate);

  switch (periodType) {
    case "day":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "week":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "month":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "year":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }

  return newDate;
};

export const calculatePrevPeriod = (
  periodType: PeriodType,
  targetDate: Date
): Date => {
  const newDate = new Date(targetDate);

  switch (periodType) {
    case "day":
      newDate.setDate(newDate.getDate() - 1);
      break;
    case "week":
      newDate.setDate(newDate.getDate() - 7);
      break;
    case "month":
      newDate.setMonth(newDate.getMonth() - 1);
      break;
    case "year":
      newDate.setFullYear(newDate.getFullYear() - 1);
      break;
  }

  return newDate;
};

// 기간 표시 텍스트 생성
export const formatPeriodText = (
  periodType: PeriodType,
  targetDate: Date
): string => {
  const { startDate, endDate } = calculateDateRange(periodType, targetDate);

  switch (periodType) {
    case "day":
      return `${startDate.getFullYear()}년 ${
        startDate.getMonth() + 1
      }월 ${startDate.getDate()}일`;
    case "week": {
      const weekStart = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
      const weekEnd = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
      return `${startDate.getFullYear()}년 ${weekStart} ~ ${weekEnd}`;
    }
    case "month":
      return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월`;
    case "year":
      return `${startDate.getFullYear()}년`;
  }
};

// 특정 기간의 통계 데이터를 가져오는 함수
export const getStatistics = async (
  userId: string,
  periodType: PeriodType,
  targetDate: Date
): Promise<{ data: StatisticsData | null; error: any }> => {
  try {
    // 기간 계산
    const { startDate, endDate } = calculateDateRange(periodType, targetDate);

    // 기록 가져오기
    const { data: records, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", startDate.toISOString())
      .lte("start_time", endDate.toISOString());

    if (error) throw error;

    if (!records || records.length === 0) {
      // 기록이 없는 경우 기본 통계 반환
      return {
        data: {
          summary: {
            totalCount: 0,
            successCount: 0,
            failureCount: 0,
            successRate: 0,
          },
          timing: {
            avgDuration: 0,
            minDuration: 0,
            maxDuration: 0,
            totalRecords: 0,
          },
          timeDistribution: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
        },
        error: null,
      };
    }

    // 요약 통계 계산
    const totalCount = records.length;
    const successCount = records.filter((record) => record.success).length;
    const failureCount = totalCount - successCount;
    const successRate = (successCount / totalCount) * 100;

    // 시간 통계 계산 (성공한 기록만 대상)
    const successRecords = records.filter(
      (record) => record.success && record.duration
    );

    let minDuration = 0;
    let maxDuration = 0;
    let avgDuration = 0;

    if (successRecords.length > 0) {
      const durations = successRecords.map((record) => record.duration || 0);
      minDuration = Math.min(...durations);
      maxDuration = Math.max(...durations);
      avgDuration =
        durations.reduce((sum, duration) => sum + duration, 0) /
        durations.length;
    }

    // 시간대별 분포 계산
    let morning = 0; // 05:00 ~ 11:59
    let afternoon = 0; // 12:00 ~ 16:59
    let evening = 0; // 17:00 ~ 20:59
    let night = 0; // 21:00 ~ 04:59

    records.forEach((record) => {
      const recordDate = new Date(record.start_time);
      const hour = recordDate.getHours();

      if (hour >= 5 && hour < 12) {
        morning++;
      } else if (hour >= 12 && hour < 17) {
        afternoon++;
      } else if (hour >= 17 && hour < 21) {
        evening++;
      } else {
        night++;
      }
    });

    return {
      data: {
        summary: {
          totalCount,
          successCount,
          failureCount,
          successRate,
        },
        timing: {
          avgDuration,
          minDuration,
          maxDuration,
          totalRecords: successRecords.length,
        },
        timeDistribution: {
          morning,
          afternoon,
          evening,
          night,
        },
      },
      error: null,
    };
  } catch (error: any) {
    console.error("통계 데이터 조회 실패:", error.message);
    return { data: null, error };
  }
};
