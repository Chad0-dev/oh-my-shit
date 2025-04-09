import { supabase } from "../supabase/client";

// 배변 기록 데이터 타입 정의
export type AmountType = "많음" | "보통" | "적음" | "이상";

export interface ShitRecord {
  id?: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  success: boolean;
  amount?: AmountType;
  memo?: string;
}

/**
 * 배변 기록을 저장하는 함수
 * @param record 저장할 배변 기록 객체
 * @returns 저장된 기록 데이터 또는 에러
 */
export const saveShitRecord = async (record: ShitRecord) => {
  try {
    const { data, error } = await supabase
      .from("shit_records")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * 사용자의 배변 기록을 조회하는 함수
 * @param userId 사용자 ID
 * @param limit 조회할 기록 수 (기본값: 10)
 * @returns 사용자의 배변 기록 목록 또는 에러
 */
export const getUserShitRecords = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * 특정 기간의 배변 기록 통계를 조회하는 함수
 * @param userId 사용자 ID
 * @param startDate 조회 시작일 (ISO 문자열)
 * @param endDate 조회 종료일 (ISO 문자열)
 * @returns 기간 내 성공/실패 횟수와 비율, 평균 소요 시간, 주요 시간대
 */
export const getShitStatistics = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    // 날짜 범위로 레코드 조회
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", `${startDate}T00:00:00`)
      .lte("created_at", `${endDate}T23:59:59`)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        error: error.message,
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        successRate: 0,
      };
    }

    // 결과가 없는 경우 기본값 반환
    if (!data || data.length === 0) {
      return {
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        successRate: 0,
        dailyAverage: 0,
        averageDuration: 0,
        abnormalCount: 0,
      };
    }

    const totalCount = data.length;
    const successCount = data.filter((record) => record.success).length;
    const failureCount = totalCount - successCount;

    // 날짜 범위의 일 수 계산
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일 포함

    // 일 평균 계산
    const dailyAverage = parseFloat((totalCount / diffDays).toFixed(1));

    // 평균 소요 시간 계산 (초 단위)
    let totalDuration = 0;
    let durationCount = 0;

    data.forEach((record) => {
      if (record.duration) {
        totalDuration += record.duration;
        durationCount++;
      }
    });

    const averageDuration =
      durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

    // 이상 횟수 계산 (amount가 '이상'인 경우)
    const abnormalCount = data.filter(
      (record) => record.amount === "이상"
    ).length;

    // 성공률 계산
    const successRate =
      totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

    return {
      totalCount,
      successCount,
      failureCount,
      successRate,
      dailyAverage,
      averageDuration,
      abnormalCount,
    };
  } catch (err) {
    return {
      error: "통계 처리 중 오류가 발생했습니다.",
      totalCount: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
    };
  }
};

/**
 * 특정 월의 배변 기록을 조회하는 함수
 * @param userId 사용자 ID
 * @param year 년도
 * @param month 월 (1-12)
 * @returns 해당 월의 모든 배변 기록
 */
export const getMonthlyShitRecords = async (
  userId: string,
  year: number,
  month: number
) => {
  try {
    // 해당 월의 시작일과 마지막 날 계산
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(year, month - 1, lastDay);
    endDate.setHours(23, 59, 59, 999);

    // ISO 문자열로 변환
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // 기간 내 모든 기록 조회
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", startDateStr)
      .lte("start_time", endDateStr)
      .order("start_time", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * 특정 날짜의 배변 기록을 조회하는 함수
 * @param userId 사용자 ID
 * @param date 조회할 날짜
 * @returns 해당 날짜의 모든 배변 기록
 */
export const getDailyShitRecords = async (userId: string, date: Date) => {
  try {
    // 해당 날짜의 시작과 끝 계산
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // ISO 문자열로 변환
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // 해당 날짜의 모든 기록 조회
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", startDateStr)
      .lte("start_time", endDateStr)
      .order("start_time", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * 시간대별 성공한 배변 기록 통계를 조회하는 함수
 * @param userId 사용자 ID
 * @param startDate 조회 시작일 (ISO 문자열)
 * @param endDate 조회 종료일 (ISO 문자열)
 * @returns 시간대별 성공 기록 횟수
 */
export const getHourlySuccessfulRecords = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    // 시간대별 데이터를 저장할 배열 초기화
    const hourlyData = Array(24)
      .fill(0)
      .map((_, hour) => ({ hour, count: 0 }));

    // 날짜 범위로 성공한 레코드만 조회
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .eq("success", true)
      .gte("start_time", `${startDate}T00:00:00`)
      .lte("start_time", `${endDate}T23:59:59`);

    if (error) throw error;

    // 결과가 없는 경우 빈 시간대 데이터 반환
    if (!data || data.length === 0) {
      return { data: hourlyData, error: null };
    }

    // 각 기록의 시간대에 따라 count 증가
    data.forEach((record) => {
      const date = new Date(record.start_time);
      const hour = date.getHours();
      hourlyData[hour].count += 1;
    });

    return { data: hourlyData, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

/**
 * 배변 기록을 삭제하는 함수
 * @param recordId 삭제할 기록 ID
 * @returns 삭제 결과
 */
export const deleteShitRecord = async (recordId: string) => {
  try {
    const { error } = await supabase
      .from("shit_records")
      .delete()
      .eq("id", recordId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
};
