import { useState, useCallback, useRef } from "react";
import { Platform, Alert } from "react-native";
import { CalendarDay, DisplayRecord } from "../types/calendar";
import { ShitRecord, AmountType } from "../services/recordService";

export const useCalendarState = () => {
  // 현재 날짜 정보
  const now = new Date();

  // 날짜 관련 상태
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(
    now.getDate()
  );
  const [days, setDays] = useState<CalendarDay[]>([]);

  // 요일 배열
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 기록 관련 상태
  const [selectedDayRecords, setSelectedDayRecords] = useState<DisplayRecord[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // 기록 입력 모달 상태
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [memo, setMemo] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<AmountType>("보통");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<string>("0");
  const [durationSeconds, setDurationSeconds] = useState<string>("0");

  // 이전 상태를 저장하는 참조
  const prevMonthRef = useRef<{ year: number; month: number }>({
    year: currentYear,
    month: currentMonth,
  });

  // 전월로 이동
  const goToPrevMonth = useCallback(() => {
    // 현재 상태 값 저장
    prevMonthRef.current = { year: currentYear, month: currentMonth };

    // 연도와 월 계산
    let newYear = currentYear;
    let newMonth = currentMonth;

    if (currentMonth === 1) {
      newYear = currentYear - 1;
      newMonth = 12;
    } else {
      newMonth = currentMonth - 1;
    }

    // 상태 업데이트
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);

    // 항상 1일로 설정 - 중요!
    setSelectedDate(1);
  }, [currentMonth, currentYear]);

  // 다음달로 이동
  const goToNextMonth = useCallback(() => {
    // 현재 상태 값 저장
    prevMonthRef.current = { year: currentYear, month: currentMonth };

    // 연도와 월 계산
    let newYear = currentYear;
    let newMonth = currentMonth;

    if (currentMonth === 12) {
      newYear = currentYear + 1;
      newMonth = 1;
    } else {
      newMonth = currentMonth + 1;
    }

    // 상태 업데이트
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);

    // 항상 1일로 설정 - 중요!
    setSelectedDate(1);
  }, [currentMonth, currentYear]);

  // 날짜 선택
  const handleSelectDate = useCallback((day: number) => {
    setSelectedDate(day);
  }, []);

  // 시간 선택 핸들러
  const handleTimeChange = useCallback(
    (event: any, selectedDate?: Date) => {
      const currentDate = selectedDate || selectedTime;
      setShowTimePicker(Platform.OS === "ios");
      setSelectedTime(currentDate);
    },
    [selectedTime]
  );

  // 소요시간 입력 핸들러 (분)
  const handleDurationMinutesChange = useCallback((text: string) => {
    // 숫자만 입력되도록 필터링
    const numericValue = text.replace(/[^0-9]/g, "");
    // 값이 너무 큰 경우 처리 (최대 99분으로 제한)
    const parsedValue = parseInt(numericValue);
    if (!isNaN(parsedValue) && parsedValue <= 99) {
      setDurationMinutes(numericValue);
    } else if (parsedValue > 99) {
      setDurationMinutes("99");
    } else {
      setDurationMinutes(numericValue);
    }
  }, []);

  // 소요시간 입력 핸들러 (초)
  const handleDurationSecondsChange = useCallback((text: string) => {
    // 숫자만 입력되도록 필터링
    const numericValue = text.replace(/[^0-9]/g, "");
    // 60초 미만으로 제한
    const parsedValue = parseInt(numericValue);
    if (!isNaN(parsedValue) && parsedValue < 60) {
      setDurationSeconds(numericValue);
    } else if (parsedValue >= 60) {
      setDurationSeconds("59");
    } else {
      setDurationSeconds(numericValue);
    }
  }, []);

  // 모달 열기
  const openAddModal = useCallback(() => {
    // 현재 시간으로 초기화
    const now = new Date();

    setMemo("");
    setSelectedAmount("보통");
    setIsSuccess(true);
    setSelectedTime(now);
    setDurationMinutes("0");
    setDurationSeconds("0");
    setIsAddModalVisible(true);
  }, []);

  // 기록 삭제 확인
  const confirmDeleteRecord = useCallback((id: string) => {
    Alert.alert(
      "기록 삭제",
      "이 기록을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => handleDeleteRecord(id),
        },
      ],
      { cancelable: true }
    );
  }, []);

  // 실제 기록 삭제 함수는 외부에서 주입받아야 함
  const handleDeleteRecord = useCallback((id: string) => {
    // 이 함수는 캘린더 스크린에서 오버라이딩됨
    console.log("Delete record:", id);
  }, []);

  return {
    currentYear,
    currentMonth,
    selectedDate,
    days,
    daysOfWeek,
    selectedDayRecords,
    isLoading,
    isDeleteLoading,
    isAddModalVisible,
    memo,
    selectedAmount,
    isSuccess,
    selectedTime,
    showTimePicker,
    durationMinutes,
    durationSeconds,
    setCurrentYear,
    setCurrentMonth,
    setSelectedDate,
    setDays,
    setSelectedDayRecords,
    setIsLoading,
    setIsDeleteLoading,
    setIsAddModalVisible,
    setMemo,
    setSelectedAmount,
    setIsSuccess,
    setSelectedTime,
    setShowTimePicker,
    setDurationMinutes,
    setDurationSeconds,
    goToPrevMonth,
    goToNextMonth,
    handleSelectDate,
    handleTimeChange,
    handleDurationMinutesChange,
    handleDurationSecondsChange,
    openAddModal,
    confirmDeleteRecord,
    handleDeleteRecord,
  };
};
