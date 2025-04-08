import React, { useMemo, useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../../stores/themeStore";
import { StyledText, StyledView } from "../../utils/styled";
import { CalendarDay } from "../../types/calendar";

interface CalendarGridProps {
  days: CalendarDay[];
  daysOfWeek: string[];
  selectedDate: number | null;
  onSelectDate: (day: number) => void;
  getStatusBackground: (status: string) => string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  daysOfWeek,
  selectedDate,
  onSelectDate,
  getStatusBackground,
}) => {
  const { isDark } = useThemeStore();

  // 요일 헤더 스타일 계산
  const getDayHeaderStyle = useCallback(
    (index: number) => {
      let bgClass = "";
      let textClass = "";

      // 배경색 계산
      if (isDark) {
        if (index === 0) bgClass = "bg-red-900/30";
        else if (index === 6) bgClass = "bg-blue-900/30";
        else bgClass = "bg-mossy-dark/30";
      } else {
        if (index === 0) bgClass = "bg-red-100";
        else if (index === 6) bgClass = "bg-blue-100";
        else bgClass = "bg-mossy-light/30";
      }

      // 텍스트 색상 계산
      if (index === 0) {
        textClass = isDark ? "text-red-400" : "text-red-500";
      } else if (index === 6) {
        textClass = isDark ? "text-blue-400" : "text-blue-500";
      } else {
        textClass = isDark ? "text-mossy-medium" : "text-mossy-darkest";
      }

      const borderClass = isDark ? "border-mossy-dark" : "border-mossy-light";

      return {
        bgClass: `${bgClass} ${borderClass}`,
        textClass: `text-center font-bold ${textClass}`,
      };
    },
    [isDark]
  );

  // 날짜 셀 스타일 계산
  const getDayCellStyle = useCallback(
    (day: CalendarDay) => {
      const isSelected = selectedDate === day.day;
      const hasStatus = day.status !== "none";

      // 셀 배경 스타일
      let cellBgClass = isDark
        ? "border-mossy-dark/30 bg-mossy-darkest/30"
        : "border-mossy-light/30 bg-white";

      if (isSelected) {
        cellBgClass += isDark ? " bg-mossy-dark/30" : " bg-mossy-light/30";
      }

      // 날짜 버튼 스타일
      const buttonClass = hasStatus
        ? `${getStatusBackground(day.status)} rounded-md`
        : "";

      // 텍스트 스타일
      let textClass = "";
      if (isSelected) {
        textClass = "text-xl font-bold";
      } else if (hasStatus) {
        textClass = "text-white";
      } else {
        textClass = isDark ? "text-white" : "text-mossy-darkest";
      }

      return {
        cellBgClass,
        buttonClass,
        textClass: `text-center ${textClass}`,
      };
    },
    [isDark, selectedDate, getStatusBackground]
  );

  // 날짜 선택 핸들러 - 함수 참조 안정화
  const handleSelectDate = useCallback(
    (day: number) => {
      onSelectDate(day);
    },
    [onSelectDate]
  );

  // 요일 헤더 렌더링
  const dayHeaders = useMemo(() => {
    return daysOfWeek.map((day, index) => {
      const { bgClass, textClass } = getDayHeaderStyle(index);
      return (
        <StyledView
          key={index}
          style={styles.dayCell}
          className={`py-2 items-center border-b ${bgClass}`}
        >
          <StyledText className={textClass}>{day}</StyledText>
        </StyledView>
      );
    });
  }, [daysOfWeek, getDayHeaderStyle]);

  // 날짜 그리드 렌더링
  const dayCells = useMemo(() => {
    return days.map((day, index) => {
      const { cellBgClass, buttonClass, textClass } = getDayCellStyle(day);
      return (
        <StyledView
          key={index}
          style={styles.dayCell}
          className={`p-1 border-b border-r ${cellBgClass}`}
        >
          {day.day ? (
            <TouchableOpacity
              onPress={() => handleSelectDate(day.day as number)}
              className={`h-12 items-center justify-center ${buttonClass}`}
            >
              <StyledText className={textClass}>{day.day}</StyledText>
            </TouchableOpacity>
          ) : (
            <StyledView className="h-12 bg-gray-100/30" />
          )}
        </StyledView>
      );
    });
  }, [days, getDayCellStyle, handleSelectDate]);

  return (
    <StyledView style={styles.container}>
      {/* 요일 헤더 */}
      <StyledView className="flex-row">{dayHeaders}</StyledView>

      {/* 날짜 그리드 */}
      <StyledView className="flex-row flex-wrap">{dayCells}</StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dayCell: {
    width: "14.28%",
  },
});
