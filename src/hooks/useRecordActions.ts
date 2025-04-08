import { useCallback } from "react";
import { Alert } from "react-native";
import { supabase } from "../supabase/client";
import {
  getMonthlyShitRecords,
  getDailyShitRecords,
  ShitRecord,
  saveShitRecord,
} from "../services/recordService";
import {
  generateCalendarData,
  convertToDisplayRecord,
} from "../utils/calendarUtils";

interface UseRecordActionsProps {
  user: any;
  currentYear: number;
  currentMonth: number;
  selectedDate: number | null;
  isSuccess: boolean;
  selectedAmount: any;
  memo: string;
  selectedTime: Date;
  durationMinutes: string;
  durationSeconds: string;
  setDays: (days: any) => void;
  setSelectedDayRecords: (records: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsDeleteLoading: (isLoading: boolean) => void;
  setIsAddModalVisible: (visible: boolean) => void;
}

export const useRecordActions = ({
  user,
  currentYear,
  currentMonth,
  selectedDate,
  isSuccess,
  selectedAmount,
  memo,
  selectedTime,
  durationMinutes,
  durationSeconds,
  setDays,
  setSelectedDayRecords,
  setIsLoading,
  setIsDeleteLoading,
  setIsAddModalVisible,
}: UseRecordActionsProps) => {
  // 월별 기록 불러오기
  const fetchMonthlyRecords = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: records, error } = await getMonthlyShitRecords(
        user.id,
        currentYear,
        currentMonth
      );

      if (error) throw error;

      const days = generateCalendarData(
        records || [],
        currentYear,
        currentMonth
      );
      setDays(days);
    } catch (error) {
      console.error("월별 기록 조회 실패:", error);
      Alert.alert("오류", "기록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user, currentYear, currentMonth, setDays, setIsLoading]);

  // 일별 기록 불러오기
  const fetchDailyRecords = useCallback(async () => {
    if (!user || !selectedDate) return;

    setIsLoading(true);
    try {
      const date = new Date(currentYear, currentMonth - 1, selectedDate);
      const { data: records, error } = await getDailyShitRecords(user.id, date);

      if (error) throw error;

      // 기록을 표시용 데이터로 변환
      const displayRecords = (records || []).map(convertToDisplayRecord);
      setSelectedDayRecords(displayRecords);
    } catch (error) {
      console.error("일별 기록 조회 실패:", error);
      Alert.alert("오류", "기록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    currentYear,
    currentMonth,
    selectedDate,
    setSelectedDayRecords,
    setIsLoading,
  ]);

  // 기록 추가 함수
  const handleAddRecord = useCallback(async () => {
    if (!user) {
      Alert.alert("로그인 필요", "기록을 추가하려면 로그인이 필요합니다.");
      return;
    }

    if (!selectedDate) {
      Alert.alert("날짜 선택", "기록을 추가할 날짜를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 선택한 날짜와 입력한 시간으로 기록 생성
      const recordDate = new Date(
        currentYear,
        currentMonth - 1,
        selectedDate,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );

      // 분과 초를 합쳐서 총 소요시간(초) 계산
      const totalDurationSeconds =
        (parseInt(durationMinutes) || 0) * 60 +
        (parseInt(durationSeconds) || 0);

      const record: ShitRecord = {
        user_id: user.id,
        start_time: recordDate.toISOString(),
        end_time: recordDate.toISOString(),
        success: isSuccess,
        amount: isSuccess ? selectedAmount : undefined,
        memo: memo,
        duration: totalDurationSeconds, // 분과 초를 합친 총 소요시간(초)
      };

      const { error } = await saveShitRecord(record);

      if (error) throw error;

      // 기록 추가 후 모달 닫기
      setIsAddModalVisible(false);

      // 데이터 다시 불러오기
      await fetchDailyRecords();
      await fetchMonthlyRecords();

      Alert.alert("완료", "기록이 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("기록 추가 실패:", error);
      Alert.alert("오류", "기록 추가에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    currentYear,
    currentMonth,
    selectedDate,
    selectedTime,
    durationMinutes,
    durationSeconds,
    isSuccess,
    selectedAmount,
    memo,
    setIsLoading,
    setIsAddModalVisible,
    fetchDailyRecords,
    fetchMonthlyRecords,
  ]);

  // 기록 삭제 함수
  const handleDeleteRecord = useCallback(
    async (id: string) => {
      if (!user) return;

      setIsDeleteLoading(true);
      try {
        const { error } = await supabase
          .from("shit_records")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // 데이터 다시 불러오기
        await fetchDailyRecords();
        await fetchMonthlyRecords();

        Alert.alert("완료", "기록이 삭제되었습니다.");
      } catch (error) {
        console.error("기록 삭제 실패:", error);
        Alert.alert("오류", "기록 삭제에 실패했습니다.");
      } finally {
        setIsDeleteLoading(false);
      }
    },
    [user, setIsDeleteLoading, fetchDailyRecords, fetchMonthlyRecords]
  );

  return {
    fetchMonthlyRecords,
    fetchDailyRecords,
    handleAddRecord,
    handleDeleteRecord,
  };
};
