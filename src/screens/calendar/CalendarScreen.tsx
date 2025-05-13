import React, { useEffect, useCallback, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import { StyledView } from "../../utils/styled";

// 컴포넌트 import
import { CalendarHeader } from "../../components/calendar/CalendarHeader";
import { CalendarGrid } from "../../components/calendar/CalendarGrid";
import { DayRecordsList } from "../../components/calendar/DayRecordsList";
import { AddRecordModal } from "../../modals/AddRecordModal";

// 훅과 유틸리티 import
import { useCalendarState } from "../../hooks/useCalendarState";
import { useRecordActions } from "../../hooks/useRecordActions";
import { getStatusBackground } from "../../utils/calendarUtils";

export const CalendarScreen: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [didInitialLoad, setDidInitialLoad] = useState(false);
  const prevMonthRef = useRef({ year: 0, month: 0, day: 0 });

  // 상태 관리 훅
  const calendarState = useCalendarState();

  // 구조 분해 할당으로 필요한 값과 함수 추출
  const {
    currentYear,
    currentMonth,
    selectedDate,
    days,
    daysOfWeek,
    selectedDayRecords,
    isLoading,
    isAddModalVisible,
    memo,
    selectedAmount,
    isSuccess,
    selectedTime,
    showTimePicker,
    durationMinutes,
    durationSeconds,
    goToPrevMonth,
    goToNextMonth,
    handleSelectDate,
    handleTimeChange,
    handleDurationMinutesChange,
    handleDurationSecondsChange,
    openAddModal,
    confirmDeleteRecord,
    setIsSuccess,
    setSelectedAmount,
    setMemo,
    setIsAddModalVisible,
    setShowTimePicker,
    setSelectedDate,
  } = calendarState;

  // 기록 액션 훅
  const recordActions = useRecordActions({
    user,
    ...calendarState,
  });

  // 월 변경 감지
  const hasMonthChanged = useCallback(() => {
    const monthChanged =
      prevMonthRef.current.year !== currentYear ||
      prevMonthRef.current.month !== currentMonth;

    // 현재 상태를 저장
    prevMonthRef.current = {
      year: currentYear,
      month: currentMonth,
      day: selectedDate || 1,
    };

    return monthChanged;
  }, [currentYear, currentMonth, selectedDate]);

  // 월간 기록 로드 - 월 변경시
  useEffect(() => {
    if (user) {
      recordActions.fetchMonthlyRecords();
    }
  }, [currentYear, currentMonth, user, recordActions.fetchMonthlyRecords]);

  // 첫 렌더링 시 초기 로딩 완료 플래그 설정
  useEffect(() => {
    if (!didInitialLoad) {
      setDidInitialLoad(true);

      // 초기 상태 저장
      prevMonthRef.current = {
        year: currentYear,
        month: currentMonth,
        day: selectedDate || 1,
      };
    }
  }, [currentYear, currentMonth, selectedDate, didInitialLoad]);

  // 일간 기록 로드 - 날짜 변경 시 또는 월 변경 시
  useEffect(() => {
    if (user && selectedDate) {
      recordActions.fetchDailyRecords();
    }
  }, [
    selectedDate,
    currentYear,
    currentMonth,
    user,
    recordActions.fetchDailyRecords,
  ]);

  // TimePicker 모달 표시 핸들러
  const handleShowTimePicker = useCallback(() => {
    setShowTimePicker(true);
  }, [setShowTimePicker]);

  // AddRecordModal 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
  }, [setIsAddModalVisible]);

  // Status background 메모이제이션
  const getStatusBg = useCallback(
    (status: string) => getStatusBackground(status, isDark),
    [isDark]
  );

  return (
    <StyledView
      style={styles.container}
      className={isDark ? "bg-mossy-darkest" : "bg-white"}
    >
      {/* 달력 헤더 */}
      <CalendarHeader
        currentYear={currentYear}
        currentMonth={currentMonth}
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
      />

      {/* 달력 그리드 */}
      <CalendarGrid
        days={days}
        daysOfWeek={daysOfWeek}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        getStatusBackground={getStatusBg}
      />

      {/* 선택된 날짜의 기록 목록 */}
      <DayRecordsList
        selectedDate={selectedDate}
        currentYear={currentYear}
        currentMonth={currentMonth}
        selectedDayRecords={selectedDayRecords}
        isLoading={isLoading}
        onPressAdd={openAddModal}
        onPressDelete={recordActions.handleDeleteRecord}
      />

      {/* 기록 추가 모달 */}
      <AddRecordModal
        visible={isAddModalVisible}
        selectedDate={selectedDate}
        currentYear={currentYear}
        currentMonth={currentMonth}
        isSuccess={isSuccess}
        selectedAmount={selectedAmount}
        selectedTime={selectedTime}
        durationMinutes={durationMinutes}
        durationSeconds={durationSeconds}
        memo={memo}
        isLoading={isLoading}
        showTimePicker={showTimePicker}
        onTimeChange={handleTimeChange}
        onChangeSuccess={setIsSuccess}
        onChangeAmount={setSelectedAmount}
        onChangeMemo={setMemo}
        onChangeDurationMinutes={handleDurationMinutesChange}
        onChangeDurationSeconds={handleDurationSecondsChange}
        onPressTimePicker={handleShowTimePicker}
        onClose={handleCloseModal}
        onSubmit={recordActions.handleAddRecord}
      />
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 0,
  },
});
