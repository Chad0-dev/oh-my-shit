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
    console.error("배변 기록 저장 실패:", error.message);
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
    console.error("배변 기록 조회 실패:", error.message);
    return { data: null, error };
  }
};

/**
 * 특정 기간의 배변 기록 통계를 조회하는 함수
 * @param userId 사용자 ID
 * @param startDate 조회 시작일 (ISO 문자열)
 * @param endDate 조회 종료일 (ISO 문자열)
 * @returns 기간 내 성공/실패 횟수와 비율
 */
export const getShitStatistics = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const { data, error } = await supabase
      .from("shit_records")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        successRate: 0,
        error: null,
      };
    }

    const totalCount = data.length;
    const successCount = data.filter((record) => record.success).length;
    const failureCount = totalCount - successCount;
    const successRate = (successCount / totalCount) * 100;

    return {
      totalCount,
      successCount,
      failureCount,
      successRate,
      error: null,
    };
  } catch (error: any) {
    console.error("배변 통계 조회 실패:", error.message);
    return {
      totalCount: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      error,
    };
  }
};
